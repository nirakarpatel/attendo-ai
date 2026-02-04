import { useState, useEffect } from "react";
import { Bell, BellOff, X } from "lucide-react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { notifications } from "../services/notifications";

export function NotificationSettings({ isOpen, onClose }) {
    const [settings, setSettings] = useState(notifications.getSettings());
    const [permission, setPermission] = useState(notifications.getPermission());

    useEffect(() => {
        if (isOpen) {
            setSettings(notifications.getSettings());
            setPermission(notifications.getPermission());
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleToggle = (key) => {
        const newSettings = { ...settings, [key]: !settings[key] };
        setSettings(newSettings);
        notifications.saveSettings(newSettings);
    };

    const handleRequestPermission = async () => {
        const result = await notifications.requestPermission();
        setPermission(result);

        if (result === 'granted') {
            notifications.send('Notifications Enabled! 🎉', {
                body: 'You will now receive attendance reminders.'
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <Card className="w-full max-w-sm bg-card border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-blue-500/20">
                            <Bell className="w-5 h-5 text-blue-400" />
                        </div>
                        <h2 className="text-lg font-bold">Notifications</h2>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Browser Permission */}
                {permission !== 'granted' && (
                    <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                        <p className="text-sm text-amber-400 mb-2">
                            Enable browser notifications for reminders
                        </p>
                        <Button
                            onClick={handleRequestPermission}
                            className="w-full bg-amber-500 hover:bg-amber-600 text-black"
                            size="sm"
                        >
                            <Bell className="w-4 h-4 mr-2" />
                            Enable Notifications
                        </Button>
                    </div>
                )}

                {/* Settings Toggles */}
                <div className="space-y-3">
                    <ToggleItem
                        label="Daily Reminder"
                        description="Remind to log attendance"
                        enabled={settings.dailyReminder}
                        onToggle={() => handleToggle('dailyReminder')}
                    />
                    <ToggleItem
                        label="Low Attendance Alert"
                        description="Warn when below target"
                        enabled={settings.lowAttendanceAlert}
                        onToggle={() => handleToggle('lowAttendanceAlert')}
                    />
                    <ToggleItem
                        label="Streak Protection"
                        description="Remind before losing streak"
                        enabled={settings.streakProtection}
                        onToggle={() => handleToggle('streakProtection')}
                    />
                </div>

                {permission === 'granted' && (
                    <p className="text-xs text-emerald-400 mt-4 text-center">
                        ✓ Browser notifications enabled
                    </p>
                )}
            </Card>
        </div>
    );
}

function ToggleItem({ label, description, enabled, onToggle }) {
    return (
        <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
            <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
            </div>
            <button
                onClick={onToggle}
                className={`w-12 h-7 rounded-full transition-colors relative ${enabled ? 'bg-primary' : 'bg-secondary'
                    }`}
            >
                <div
                    className={`w-5 h-5 rounded-full bg-white absolute top-1 transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                />
            </button>
        </div>
    );
}
