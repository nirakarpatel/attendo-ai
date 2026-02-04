import { Clock, BookOpen } from "lucide-react";
import { storage } from "../services/storage";

export function TodaySchedule() {
    const schedule = storage.getTodaySchedule();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = days[new Date().getDay()];

    if (schedule.length === 0) {
        return null; // Don't show if no classes today
    }

    // Check which classes are done
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    return (
        <div className="glass rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Today's Schedule</span>
                <span className="text-xs text-muted-foreground">({today})</span>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
                {schedule.map((item) => {
                    const isPast = item.endTime < currentTime;
                    const isOngoing = item.startTime <= currentTime && item.endTime >= currentTime;

                    return (
                        <div
                            key={item.id}
                            className={`flex-shrink-0 px-3 py-2 rounded-xl border ${isOngoing
                                    ? 'bg-primary/20 border-primary/30'
                                    : isPast
                                        ? 'bg-secondary/30 border-white/5 opacity-50'
                                        : 'bg-secondary/50 border-white/10'
                                }`}
                        >
                            <p className="text-sm font-medium truncate max-w-[120px]">
                                {item.subject?.name}
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                                <Clock className="w-3 h-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                    {item.startTime} - {item.endTime}
                                </span>
                            </div>
                            {isOngoing && (
                                <span className="text-xs text-primary font-medium">Now</span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
