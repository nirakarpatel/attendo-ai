import { useState, useEffect } from "react";
import { AlertTriangle, Flame, Bell, X, ChevronRight } from "lucide-react";
import { notifications } from "../services/notifications";
import { storage } from "../services/storage";

export function AlertBanner({ subjects, streak, onNavigate }) {
    const [alerts, setAlerts] = useState([]);
    const [dismissed, setDismissed] = useState([]);

    useEffect(() => {
        const newAlerts = [];
        const settings = notifications.getSettings();

        // Daily reminder check
        if (settings.dailyReminder && notifications.shouldShowDailyReminder()) {
            // Check time - only show reminder after 10 AM
            const hour = new Date().getHours();
            if (hour >= 10) {
                newAlerts.push({
                    id: 'daily',
                    type: 'info',
                    icon: Bell,
                    title: "Don't forget!",
                    message: "Log your attendance for today",
                    color: 'blue'
                });
            }
        }

        // Streak protection
        if (settings.streakProtection && notifications.isStreakAtRisk(streak)) {
            newAlerts.push({
                id: 'streak',
                type: 'warning',
                icon: Flame,
                title: `Protect your ${streak.current} day streak!`,
                message: "Mark attendance today to keep it going",
                color: 'orange'
            });
        }

        // Low attendance alert
        if (settings.lowAttendanceAlert) {
            const lowSubjects = notifications.getLowAttendanceSubjects(subjects);
            if (lowSubjects.length > 0) {
                const names = lowSubjects.slice(0, 2).map(s => s.name).join(', ');
                const extra = lowSubjects.length > 2 ? ` +${lowSubjects.length - 2} more` : '';
                newAlerts.push({
                    id: 'low',
                    type: 'danger',
                    icon: AlertTriangle,
                    title: "Low Attendance Alert",
                    message: `${names}${extra} below target`,
                    color: 'rose'
                });
            }
        }

        // Filter out dismissed alerts
        setAlerts(newAlerts.filter(a => !dismissed.includes(a.id)));
    }, [subjects, streak, dismissed]);

    // Request notification permission on mount
    useEffect(() => {
        if (notifications.getPermission() === 'default') {
            // Don't auto-request, wait for user action
        }
    }, []);

    const handleDismiss = (id) => {
        setDismissed(prev => [...prev, id]);
        if (id === 'daily') {
            notifications.markDailyReminderShown();
        }
    };

    const colorClasses = {
        blue: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
        orange: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
        rose: 'bg-rose-500/10 border-rose-500/30 text-rose-400'
    };

    if (alerts.length === 0) return null;

    return (
        <div className="space-y-2 mb-6">
            {alerts.map(alert => {
                const Icon = alert.icon;
                return (
                    <div
                        key={alert.id}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${colorClasses[alert.color]} animate-in slide-in-from-top-2`}
                    >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{alert.title}</p>
                            <p className="text-xs opacity-80 truncate">{alert.message}</p>
                        </div>
                        <button
                            onClick={() => handleDismiss(alert.id)}
                            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
