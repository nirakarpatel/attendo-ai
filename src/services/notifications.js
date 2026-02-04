// Notification Service for Attendo.AI

const NOTIFICATION_KEY = 'attendo_notifications';

export const notifications = {
    // Check if browser notifications are supported
    isSupported: () => 'Notification' in window,

    // Get current permission status
    getPermission: () => {
        if (!notifications.isSupported()) return 'unsupported';
        return Notification.permission;
    },

    // Request notification permission
    requestPermission: async () => {
        if (!notifications.isSupported()) return 'unsupported';

        try {
            const permission = await Notification.requestPermission();
            return permission;
        } catch (error) {
            console.error('Notification permission error:', error);
            return 'denied';
        }
    },

    // Send browser notification
    send: (title, options = {}) => {
        if (!notifications.isSupported()) return;
        if (Notification.permission !== 'granted') return;

        const notification = new Notification(title, {
            icon: '/icon-192.png',
            badge: '/icon-192.png',
            ...options
        });

        notification.onclick = () => {
            window.focus();
            notification.close();
        };

        return notification;
    },

    // Get notification settings
    getSettings: () => {
        try {
            const data = localStorage.getItem(NOTIFICATION_KEY);
            return data ? JSON.parse(data) : {
                dailyReminder: true,
                lowAttendanceAlert: true,
                streakProtection: true,
                lastReminderDate: null
            };
        } catch {
            return {
                dailyReminder: true,
                lowAttendanceAlert: true,
                streakProtection: true,
                lastReminderDate: null
            };
        }
    },

    // Save notification settings
    saveSettings: (settings) => {
        localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(settings));
    },

    // Check if should show daily reminder
    shouldShowDailyReminder: () => {
        const settings = notifications.getSettings();
        if (!settings.dailyReminder) return false;

        const today = new Date().toISOString().split('T')[0];
        return settings.lastReminderDate !== today;
    },

    // Mark daily reminder as shown
    markDailyReminderShown: () => {
        const settings = notifications.getSettings();
        settings.lastReminderDate = new Date().toISOString().split('T')[0];
        notifications.saveSettings(settings);
    },

    // Check for low attendance subjects
    getLowAttendanceSubjects: (subjects) => {
        return subjects.filter(sub => {
            if (sub.total === 0) return false;
            const percentage = (sub.attended / sub.total) * 100;
            return percentage < sub.target;
        });
    },

    // Check if streak is at risk (not logged today and yesterday was active)
    isStreakAtRisk: (streak) => {
        if (!streak || streak.current === 0) return false;

        const today = new Date().toISOString().split('T')[0];
        if (streak.lastActiveDate === today) return false; // Already logged today

        return true; // Has active streak but hasn't logged today
    }
};
