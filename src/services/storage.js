import { supabase } from '../lib/supabaseClient';

let currentUserId = null;

export const setUserId = (id) => {
    currentUserId = id;
};

const getUserId = () => {
    if (!currentUserId) console.warn("storage.js: currentUserId is null. Did you forget to call setUserId?");
    return currentUserId;
};

export const storage = {
    // ============ MIGRATION ============
    migrateData: async (oldId, newId) => {
        if (!oldId || !newId || oldId === newId) return;
        console.log("Migrating local device data to authenticated account...");
        try {
            const { data: oldProfile } = await supabase.from('profiles').select('*').eq('id', oldId).single();
            if (oldProfile) {
                await supabase.from('profiles').upsert({ ...oldProfile, id: newId });
            } else {
                await supabase.from('profiles').upsert({ id: newId, name: 'Student' });
            }

            await Promise.all([
                supabase.from('subjects').update({ user_id: newId }).eq('user_id', oldId),
                supabase.from('attendance_logs').update({ user_id: newId }).eq('user_id', oldId),
                supabase.from('timetable').update({ user_id: newId }).eq('user_id', oldId),
                supabase.from('holidays').update({ user_id: newId }).eq('user_id', oldId)
            ]);

            if (oldProfile) {
                await supabase.from('profiles').delete().eq('id', oldId);
            }
            console.log("Migration complete!");
        } catch (e) {
            console.error("Migration failed:", e);
        }
    },

    // ============ INITIAL LOAD ============
    // Replaces `get: () => ...`
    loadAllData: async () => {
        const userId = getUserId();
        try {
            const [
                { data: profile },
                { data: subjects },
                { data: attendanceLog },
                { data: timetable },
                { data: holidays }
            ] = await Promise.all([
                supabase.from('profiles').select('*').eq('id', userId).single(),
                supabase.from('subjects').select('*').eq('user_id', userId),
                supabase.from('attendance_logs').select('*').eq('user_id', userId),
                supabase.from('timetable').select('*').eq('user_id', userId),
                supabase.from('holidays').select('*').eq('user_id', userId)
            ]);

            const formattedSubjects = (subjects || []).map(s => {
                const logs = (attendanceLog || []).filter(l => l.subject_id === s.id);
                return {
                    ...s,
                    target: s.target_percentage,
                    total: logs.length,
                    attended: logs.filter(l => l.status === 'present').length
                };
            });

            return {
                profile: profile || null,
                subjects: formattedSubjects,
                attendanceLog: attendanceLog || [],
                timetable: timetable || [],
                holidays: holidays || [],
                streak: profile ? {
                    current: profile.streak_current || 0,
                    longest: profile.streak_longest || 0,
                    lastActiveDate: profile.streak_last_active_date || null,
                    milestones: profile.milestones || []
                } : { current: 0, longest: 0, lastActiveDate: null, milestones: [] }
            };
        } catch (e) {
            console.error("Failed to load data from Supabase", e);
            return {
                profile: null,
                subjects: [],
                attendanceLog: [],
                timetable: [],
                holidays: [],
                streak: { current: 0, longest: 0, lastActiveDate: null, milestones: [] }
            };
        }
    },

    // ============ SUBJECT METHODS ============
    getSubjects: async () => {
        const userId = getUserId();
        const [{ data: subjects }, { data: logs }] = await Promise.all([
            supabase.from('subjects').select('*').eq('user_id', userId),
            supabase.from('attendance_logs').select('subject_id, status').eq('user_id', userId)
        ]);
        
        if (!subjects) return [];

        return subjects.map(s => {
            const subjectLogs = (logs || []).filter(l => l.subject_id === s.id);
            return {
                ...s,
                target: s.target_percentage,
                total: subjectLogs.length,
                attended: subjectLogs.filter(l => l.status === 'present').length
            };
        });
    },

    addSubject: async (name, target = 75) => {
        const { data, error } = await supabase
            .from('subjects')
            .insert([{ user_id: getUserId(), name, target_percentage: target }])
            .select()
            .single();
        
        if (error) console.error("Error adding subject", error);
        return data ? [{ ...data, target: data.target_percentage, total: 0, attended: 0 }] : []; 
    },

    updateSubject: async (updatedSubject) => {
        const target = updatedSubject.target !== undefined ? updatedSubject.target : updatedSubject.target_percentage;
        const { data, error } = await supabase
            .from('subjects')
            .update({ name: updatedSubject.name, target_percentage: target }) // Note: attended/total are derived from logs
            .eq('id', updatedSubject.id)
            .eq('user_id', getUserId())
            .select();
        if (error) console.error("Error updating subject", error);
        
        // Handle arbitrary total/attended updates from EditAttendance by adding/removing dummy logs
        const { data: logs } = await supabase.from('attendance_logs').select('id, status, date').eq('subject_id', updatedSubject.id);
        const currentAttended = (logs || []).filter(l => l.status === 'present').length;
        const currentTotal = (logs || []).length;
        
        if (updatedSubject.attended !== undefined && updatedSubject.total !== undefined) {
            const diffAttended = updatedSubject.attended - currentAttended;
            const diffAbsent = (updatedSubject.total - updatedSubject.attended) - (currentTotal - currentAttended);
            
            const existingDates = new Set((logs || []).map(l => l.date));
            let dummyDate = new Date('2000-01-01');
            
            const insertLogs = async (count, status) => {
                if (count <= 0) return;
                const newLogs = [];
                for (let i = 0; i < count; i++) {
                    let dateStr;
                    do {
                        dummyDate.setDate(dummyDate.getDate() + 1);
                        dateStr = dummyDate.toISOString().split('T')[0];
                    } while (existingDates.has(dateStr));
                    
                    newLogs.push({ user_id: getUserId(), subject_id: updatedSubject.id, date: dateStr, status });
                    existingDates.add(dateStr);
                }
                await supabase.from('attendance_logs').insert(newLogs);
            };

            const removeLogs = async (count, status) => {
                if (count <= 0) return;
                const logsToRemove = (logs || []).filter(l => l.status === status).slice(0, count);
                const idsToRemove = logsToRemove.map(l => l.id);
                if (idsToRemove.length > 0) {
                    await supabase.from('attendance_logs').delete().in('id', idsToRemove);
                }
            };
            
            // Adjust Presents
            if (diffAttended > 0) await insertLogs(diffAttended, 'present');
            else if (diffAttended < 0) await removeLogs(-diffAttended, 'present');
            
            // Adjust Absents
            if (diffAbsent > 0) await insertLogs(diffAbsent, 'absent');
            else if (diffAbsent < 0) await removeLogs(-diffAbsent, 'absent');
        }

        return data; 
    },

    deleteSubject: async (id) => {
         // Supabase cascade delete will handle timetable and logs
        const { error } = await supabase
            .from('subjects')
            .delete()
            .eq('id', id)
            .eq('user_id', getUserId());
        if (error) console.error("Error deleting subject", error);
    },

    // ============ PROFILE METHODS ============
    getProfile: async () => {
         const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', getUserId())
            .single();
        return data || null;
    },

    setProfile: async (name) => {
        const userId = getUserId();
        const { data, error } = await supabase
            .from('profiles')
            .upsert({ id: userId, name: name.trim() })
            .select()
            .single();
        if (error) console.error("Error setting profile", error);
        return data;
    },

     clearProfile: async () => {
        const { error } = await supabase
             .from('profiles')
             .delete()
             .eq('id', getUserId());
        if (error) console.error("Error clearing profile", error);
    },

    // ============ STREAK METHODS ============
    getStreak: async () => {
        const profile = await storage.getProfile();
        return profile ? {
            current: profile.streak_current || 0,
            longest: profile.streak_longest || 0,
            lastActiveDate: profile.streak_last_active_date || null,
            milestones: profile.milestones || []
        } : { current: 0, longest: 0, lastActiveDate: null, milestones: [] };
    },

    recordActivity: async () => {
        const userId = getUserId();
        const streak = await storage.getStreak();
        const today = new Date().toISOString().split('T')[0];

        if (streak.lastActiveDate === today) {
            return { streak, newMilestone: null };
        }

        // Check holidays
        const { data: holidays } = await supabase.from('holidays').select('date').eq('user_id', userId);
        const holidayDates = (holidays || []).map(h => h.date);

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        let newCurrent = 1;
        if (streak.lastActiveDate === yesterdayStr || holidayDates.includes(yesterdayStr)) {
            newCurrent = streak.current + 1;
        }

        const newLongest = Math.max(streak.longest, newCurrent);

        let newMilestone = null;
        const milestoneCheck = Math.floor(newCurrent / 10) * 10;
        if (milestoneCheck > 0 && !streak.milestones.includes(milestoneCheck)) {
            newMilestone = milestoneCheck;
            streak.milestones.push(milestoneCheck);
        }

        const newStreak = {
            streak_current: newCurrent,
            streak_longest: newLongest,
            streak_last_active_date: today,
            milestones: streak.milestones
        };

        await supabase.from('profiles').upsert({ id: userId, ...newStreak });

        return { 
            streak: { current: newCurrent, longest: newLongest, lastActiveDate: today, milestones: streak.milestones }, 
            newMilestone 
        };
    },

    // ============ ATTENDANCE LOG METHODS ============
    logAttendance: async (subjectId, status) => {
        const userId = getUserId();
        const date = new Date().toISOString().split('T')[0];

        const { data, error } = await supabase
            .from('attendance_logs')
            .upsert({ 
                user_id: userId, 
                subject_id: subjectId, 
                date, 
                status 
            }, { onConflict: 'subject_id, date' }) // Requires unique constraint
            .select();
        
        if (error) console.error("Error logging attendance", error);
        return data;
    },

    getAttendanceLog: async (subjectId = null, month = null, year = null) => {
        let query = supabase.from('attendance_logs').select('*').eq('user_id', getUserId());
        
        if (subjectId) {
            query = query.eq('subject_id', subjectId);
        }
        
        const { data, error } = await query;
        if (error) return [];

        let logs = data || [];
        if (month !== null && year !== null) {
            logs = logs.filter(a => {
                const d = new Date(a.date);
                return d.getMonth() === month && d.getFullYear() === year;
            });
        }
        return logs;
    },

    // ============ TIMETABLE METHODS ============
    getTimetable: async (subjectId = null) => {
        let query = supabase.from('timetable').select('*').eq('user_id', getUserId());
        if (subjectId) query = query.eq('subject_id', subjectId);
        
        const { data, error } = await query;
        return error ? [] : (data || []);
    },

    addTimetableEntry: async (subjectId, day, startTime, endTime) => {
        const { data, error } = await supabase
            .from('timetable')
            .insert([{ user_id: getUserId(), subject_id: subjectId, day_of_week: day, start_time: startTime, end_time: endTime }])
            .select();
        if (error) console.error("Error adding timetable entry", error);
        return data || [];
    },

    deleteTimetableEntry: async (id) => {
        const { error } = await supabase.from('timetable').delete().eq('id', id).eq('user_id', getUserId());
        if (error) console.error("Error deleting timetable entry", error);
    },

    getTodaySchedule: async () => {
         const userId = getUserId();
         const today = new Date().getDay();

         const [ { data: timetable }, { data: subjects } ] = await Promise.all([
             supabase.from('timetable').select('*').eq('user_id', userId).eq('day_of_week', today),
             supabase.from('subjects').select('*').eq('user_id', userId)
         ]);

         if (!timetable || !subjects) return [];

         return timetable.map(t => ({
             ...t,
             subject: subjects.find(s => s.id === t.subject_id)
         })).filter(t => t.subject).sort((a, b) => a.start_time.localeCompare(b.start_time));
    },

    // ============ HOLIDAY METHODS ============
    getHolidays: async () => {
        const { data, error } = await supabase.from('holidays').select('*').eq('user_id', getUserId());
        return error ? [] : (data || []);
    },

    addHoliday: async (date, name) => {
        const { data, error } = await supabase
            .from('holidays')
            .insert([{ user_id: getUserId(), date, name }])
            .select();
        if (error) console.error("Error adding holiday", error);
        return data || [];
    },

    deleteHoliday: async (id) => {
        const { error } = await supabase.from('holidays').delete().eq('id', id).eq('user_id', getUserId());
        if (error) console.error("Error deleting holiday", error);
    },

    isHoliday: async (date) => {
        const { data } = await supabase.from('holidays').select('id').eq('user_id', getUserId()).eq('date', date);
        return data && data.length > 0;
    }
};
