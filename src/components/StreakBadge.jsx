import { Flame, Zap, Star, Crown, Trophy } from "lucide-react";

// Streak levels configuration
const STREAK_LEVELS = [
    { min: 0, max: 4, name: "Beginner", icon: Flame, color: "text-blue-400", bg: "from-blue-500/10 to-indigo-500/10", border: "border-blue-500/20" },
    { min: 5, max: 9, name: "Warming Up", icon: Flame, color: "text-orange-400", bg: "from-orange-500/10 to-amber-500/10", border: "border-orange-500/20" },
    { min: 10, max: 19, name: "On Fire", icon: Zap, color: "text-yellow-400", bg: "from-yellow-500/10 to-orange-500/10", border: "border-yellow-500/20" },
    { min: 20, max: 29, name: "Blazing", icon: Star, color: "text-amber-400", bg: "from-amber-500/10 to-yellow-500/10", border: "border-amber-500/20" },
    { min: 30, max: 49, name: "Unstoppable", icon: Crown, color: "text-purple-400", bg: "from-purple-500/10 to-pink-500/10", border: "border-purple-500/20" },
    { min: 50, max: 99, name: "Legend", icon: Crown, color: "text-pink-400", bg: "from-pink-500/10 to-rose-500/10", border: "border-pink-500/20" },
    { min: 100, max: Infinity, name: "Immortal", icon: Trophy, color: "text-cyan-400", bg: "from-cyan-500/10 to-blue-500/10", border: "border-cyan-500/20" },
];

function getStreakLevel(days) {
    return STREAK_LEVELS.find(level => days >= level.min && days <= level.max) || STREAK_LEVELS[0];
}

export function StreakBadge({ streak }) {
    const current = streak?.current || 0;
    const level = getStreakLevel(current);
    const Icon = level.icon;

    // Calculate progress to next level
    const currentLevelIndex = STREAK_LEVELS.indexOf(level);
    const nextLevel = STREAK_LEVELS[currentLevelIndex + 1];
    const daysToNext = nextLevel ? nextLevel.min - current : 0;

    return (
        <div
            className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r ${level.bg} border ${level.border} group relative`}
            title={`${level.name} • Longest: ${streak?.longest || 0} days${nextLevel ? ` • ${daysToNext} days to ${nextLevel.name}` : ''}`}
        >
            <Icon className={`w-4 h-4 ${level.color} group-hover:scale-110 transition-transform`} />
            <div className="flex flex-col">
                <div className="flex items-center gap-1">
                    <span className={`text-sm font-bold ${level.color}`}>{current}</span>
                    <span className="text-xs text-muted-foreground hidden sm:block">days</span>
                </div>
                <span className={`text-[10px] ${level.color} opacity-80 hidden sm:block`}>{level.name}</span>
            </div>
        </div>
    );
}
