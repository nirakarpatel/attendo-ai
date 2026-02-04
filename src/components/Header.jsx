import { GraduationCap, User, Shield, CalendarDays, Umbrella, Share2, Bell } from "lucide-react";

export function Header({ profile, onEditProfile, onOpenBackup, onOpenCalendar, onOpenHolidays, onOpenShare, onOpenNotifications }) {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-xl">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="bg-primary/20 p-2 rounded-xl">
                        <GraduationCap className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-lg font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                        Attendo<span className="text-primary">.AI</span>
                    </span>
                </div>

                <div className="flex items-center gap-1">
                    {/* Notifications Button */}
                    <button
                        onClick={onOpenNotifications}
                        className="p-2 rounded-xl hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-amber-400"
                        title="Notification Settings"
                    >
                        <Bell className="w-5 h-5" />
                    </button>

                    {/* Share Button */}
                    <button
                        onClick={onOpenShare}
                        className="p-2 rounded-xl hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-blue-400"
                        title="Share Progress"
                    >
                        <Share2 className="w-5 h-5" />
                    </button>

                    {/* Calendar Button */}
                    <button
                        onClick={onOpenCalendar}
                        className="p-2 rounded-xl hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-primary"
                        title="Attendance Calendar"
                    >
                        <CalendarDays className="w-5 h-5" />
                    </button>

                    {/* Holidays Button */}
                    <button
                        onClick={onOpenHolidays}
                        className="p-2 rounded-xl hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-purple-400"
                        title="Holidays"
                    >
                        <Umbrella className="w-5 h-5" />
                    </button>

                    {/* Backup Button */}
                    <button
                        onClick={onOpenBackup}
                        className="p-2 rounded-xl hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-emerald-400"
                        title="Backup & Restore"
                    >
                        <Shield className="w-5 h-5" />
                    </button>

                    {/* Profile Button */}
                    <button
                        onClick={onEditProfile}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-secondary/50 transition-colors group"
                    >
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            {profile?.name ? (
                                <span className="text-sm font-bold text-primary">
                                    {profile.name.charAt(0).toUpperCase()}
                                </span>
                            ) : (
                                <User className="w-4 h-4 text-primary" />
                            )}
                        </div>
                        {profile?.name && (
                            <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground hidden sm:block">
                                {profile.name}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
}
