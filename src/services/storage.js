const STORAGE_KEY = 'attendance_app_data';

// Initial Data (empty by default)
const initialData = {
    profile: null, // { name, createdAt }
    subjects: [], // No default subjects
    log: [], // Legacy log
    streak: {
        current: 0,
        longest: 0,
        lastActiveDate: null,
        milestones: []
    },
    // NEW: Detailed attendance log per subject
    attendanceLog: [], // { id, subjectId, date, status: 'present'|'absent' }
    // NEW: Timetable for each subject
    timetable: [], // { id, subjectId, day: 0-6, startTime: 'HH:MM', endTime: 'HH:MM' }
    // NEW: Holidays list
    holidays: [] // { id, date: 'YYYY-MM-DD', name: string }
};

export const storage = {
    get: () => {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            const parsed = data ? JSON.parse(data) : initialData;
            // Ensure new fields exist for backward compatibility
            return {
                ...initialData,
                ...parsed,
                attendanceLog: parsed.attendanceLog || [],
                timetable: parsed.timetable || [],
                holidays: parsed.holidays || []
            };
        } catch (e) {
            console.error("Storage Error", e);
            return initialData;
        }
    },

    save: (data) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error("Storage Save Error", e);
        }
    },

    updateSubject: (updatedSubject) => {
        const data = storage.get();
        const newSubjects = data.subjects.map(s => s.id === updatedSubject.id ? updatedSubject : s);
        storage.save({ ...data, subjects: newSubjects });
        return newSubjects;
    },

    addSubject: (name, target = 75) => {
        const data = storage.get();
        const newSubject = {
            id: Date.now().toString(),
            name,
            total: 0,
            attended: 0,
            target
        };
        const newSubjects = [...data.subjects, newSubject];
        storage.save({ ...data, subjects: newSubjects });
        return newSubjects;
    },

    deleteSubject: (id) => {
        const data = storage.get();
        const newSubjects = data.subjects.filter(s => s.id !== id);
        // Also delete related timetable entries
        const newTimetable = data.timetable.filter(t => t.subjectId !== id);
        // Also delete related attendance logs
        const newAttendanceLog = data.attendanceLog.filter(a => a.subjectId !== id);
        storage.save({ ...data, subjects: newSubjects, timetable: newTimetable, attendanceLog: newAttendanceLog });
        return newSubjects;
    },

    // Profile methods
    getProfile: () => {
        const data = storage.get();
        return data.profile || null;
    },

    setProfile: (name) => {
        const data = storage.get();
        const profile = {
            name: name.trim(),
            createdAt: new Date().toISOString()
        };
        storage.save({ ...data, profile });
        return profile;
    },

    clearProfile: () => {
        const data = storage.get();
        storage.save({ ...data, profile: null });
    },

    // Export/Import
    exportData: () => {
        const data = storage.get();
        return JSON.stringify(data, null, 2);
    },

    importData: (jsonString) => {
        try {
            const data = JSON.parse(jsonString);
            if (data && typeof data === 'object') {
                storage.save(data);
                return { success: true, data };
            }
            return { success: false, error: "Invalid data format" };
        } catch (e) {
            return { success: false, error: "Invalid JSON file" };
        }
    },

    clearAll: () => {
        localStorage.removeItem(STORAGE_KEY);
    },

    // ============ STREAK METHODS ============
    getStreak: () => {
        const data = storage.get();
        return data.streak || { current: 0, longest: 0, lastActiveDate: null, milestones: [] };
    },

    recordActivity: () => {
        const data = storage.get();
        const streak = data.streak || { current: 0, longest: 0, lastActiveDate: null, milestones: [] };
        const today = new Date().toISOString().split('T')[0];

        if (streak.lastActiveDate === today) {
            return { streak, newMilestone: null };
        }

        // Check holidays - if yesterday was holiday, consider streak continued
        const holidays = data.holidays || [];
        const holidayDates = holidays.map(h => h.date);

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
            current: newCurrent,
            longest: newLongest,
            lastActiveDate: today,
            milestones: streak.milestones
        };

        storage.save({ ...data, streak: newStreak });
        return { streak: newStreak, newMilestone };
    },

    // ============ ATTENDANCE LOG METHODS ============
    logAttendance: (subjectId, status) => {
        const data = storage.get();
        const today = new Date().toISOString().split('T')[0];

        // Check if already logged today for this subject
        const existing = data.attendanceLog.find(
            a => a.subjectId === subjectId && a.date === today
        );

        if (existing) {
            // Update existing entry
            existing.status = status;
            storage.save(data);
        } else {
            // Add new entry
            const newEntry = {
                id: Date.now().toString(),
                subjectId,
                date: today,
                status
            };
            data.attendanceLog.push(newEntry);
            storage.save(data);
        }
        return data.attendanceLog;
    },

    getAttendanceLog: (subjectId = null, month = null, year = null) => {
        const data = storage.get();
        let logs = data.attendanceLog || [];

        if (subjectId) {
            logs = logs.filter(a => a.subjectId === subjectId);
        }

        if (month !== null && year !== null) {
            logs = logs.filter(a => {
                const d = new Date(a.date);
                return d.getMonth() === month && d.getFullYear() === year;
            });
        }

        return logs;
    },

    // ============ TIMETABLE METHODS ============
    getTimetable: (subjectId = null) => {
        const data = storage.get();
        const timetable = data.timetable || [];
        if (subjectId) {
            return timetable.filter(t => t.subjectId === subjectId);
        }
        return timetable;
    },

    addTimetableEntry: (subjectId, day, startTime, endTime) => {
        const data = storage.get();
        const newEntry = {
            id: Date.now().toString(),
            subjectId,
            day, // 0 = Sunday, 1 = Monday, ...
            startTime,
            endTime
        };
        data.timetable.push(newEntry);
        storage.save(data);
        return data.timetable;
    },

    deleteTimetableEntry: (id) => {
        const data = storage.get();
        data.timetable = data.timetable.filter(t => t.id !== id);
        storage.save(data);
        return data.timetable;
    },

    getTodaySchedule: () => {
        const data = storage.get();
        const today = new Date().getDay(); // 0-6
        const timetable = data.timetable || [];
        const subjects = data.subjects || [];

        const todayClasses = timetable
            .filter(t => t.day === today)
            .map(t => ({
                ...t,
                subject: subjects.find(s => s.id === t.subjectId)
            }))
            .filter(t => t.subject)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));

        return todayClasses;
    },

    // ============ HOLIDAY METHODS ============
    getHolidays: () => {
        const data = storage.get();
        return data.holidays || [];
    },

    addHoliday: (date, name) => {
        const data = storage.get();
        const newHoliday = {
            id: Date.now().toString(),
            date,
            name
        };
        data.holidays.push(newHoliday);
        storage.save(data);
        return data.holidays;
    },

    deleteHoliday: (id) => {
        const data = storage.get();
        data.holidays = data.holidays.filter(h => h.id !== id);
        storage.save(data);
        return data.holidays;
    },

    isHoliday: (date) => {
        const data = storage.get();
        const holidays = data.holidays || [];
        return holidays.some(h => h.date === date);
    }
};
