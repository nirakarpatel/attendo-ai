import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { storage } from "../services/storage";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

export function AttendanceCalendar({ isOpen, onClose, subjects }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedSubject, setSelectedSubject] = useState("all");

    if (!isOpen) return null;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Get attendance log for this month
    const attendanceLog = storage.getAttendanceLog(
        selectedSubject === "all" ? null : selectedSubject,
        month,
        year
    );

    // Get holidays
    const holidays = storage.getHolidays();
    const holidayDates = holidays.map(h => h.date);

    // Build calendar grid
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const getDayStatus = (day) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        // Check if holiday
        if (holidayDates.includes(dateStr)) {
            return 'holiday';
        }

        // Check attendance
        const dayLogs = attendanceLog.filter(a => a.date === dateStr);
        if (dayLogs.length === 0) return null;

        const presentCount = dayLogs.filter(a => a.status === 'present').length;
        const absentCount = dayLogs.filter(a => a.status === 'absent').length;

        if (absentCount > 0 && presentCount === 0) return 'absent';
        if (presentCount > 0 && absentCount === 0) return 'present';
        if (presentCount > 0 && absentCount > 0) return 'mixed';
        return null;
    };

    const statusColors = {
        present: 'bg-emerald-500 text-white',
        absent: 'bg-rose-500 text-white',
        mixed: 'bg-amber-500 text-white',
        holiday: 'bg-purple-500 text-white'
    };

    const goToPrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <Card className="w-full max-w-md bg-card border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Attendance Calendar</h2>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Subject Filter */}
                <div className="mb-4">
                    <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="w-full bg-secondary/50 border border-white/10 rounded-xl px-3 py-2 text-sm"
                    >
                        <option value="all">All Subjects</option>
                        {subjects.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                </div>

                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-4">
                    <button onClick={goToPrevMonth} className="p-2 hover:bg-secondary rounded-lg">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="font-semibold">{MONTHS[month]} {year}</span>
                    <button onClick={goToNextMonth} className="p-2 hover:bg-secondary rounded-lg">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 mb-4">
                    {/* Day headers */}
                    {DAYS.map(day => (
                        <div key={day} className="text-center text-xs text-muted-foreground py-2">
                            {day}
                        </div>
                    ))}

                    {/* Empty cells for days before month starts */}
                    {Array.from({ length: firstDay }).map((_, i) => (
                        <div key={`empty-${i}`} className="aspect-square" />
                    ))}

                    {/* Day cells */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const status = getDayStatus(day);
                        const isToday =
                            day === new Date().getDate() &&
                            month === new Date().getMonth() &&
                            year === new Date().getFullYear();

                        return (
                            <div
                                key={day}
                                className={`aspect-square flex items-center justify-center text-sm rounded-lg 
                                    ${status ? statusColors[status] : 'bg-secondary/30'}
                                    ${isToday ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
                                `}
                            >
                                {day}
                            </div>
                        );
                    })}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-3 text-xs">
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-emerald-500" />
                        <span className="text-muted-foreground">Present</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-rose-500" />
                        <span className="text-muted-foreground">Absent</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-amber-500" />
                        <span className="text-muted-foreground">Mixed</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-purple-500" />
                        <span className="text-muted-foreground">Holiday</span>
                    </div>
                </div>
            </Card>
        </div>
    );
}
