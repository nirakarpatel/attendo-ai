import { useState } from "react";
import { Flame, Trophy, Gift, X, Copy, Check, Sparkles } from "lucide-react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { STREAK_BADGES, BRAND_REWARDS } from "../config/rewards";

export function RewardsModal({ isOpen, onClose, streak }) {
    const [activeTab, setActiveTab] = useState("rewards"); // "rewards" or "badges"
    const [copiedCode, setCopiedCode] = useState(null);

    if (!isOpen) return null;

    const earnedMilestones = streak?.milestones || [];
    const currentStreak = streak?.current || 0;

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <Card className="w-full max-w-lg bg-card border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-amber-500/20">
                            <Trophy className="w-5 h-5 text-amber-400" />
                        </div>
                        <h2 className="text-xl font-bold">Rewards Center</h2>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Current Streak Display */}
                <div className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-2xl p-4 mb-4 text-center border border-orange-500/20">
                    <div className="flex items-center justify-center gap-2">
                        <Flame className="w-6 h-6 text-orange-400" />
                        <span className="text-4xl font-bold text-orange-400">{currentStreak}</span>
                        <span className="text-sm text-muted-foreground">day streak</span>
                    </div>
                </div>

                {/* Tab Buttons */}
                <div className="flex gap-2 mb-4">
                    <button
                        onClick={() => setActiveTab("rewards")}
                        className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${activeTab === "rewards"
                                ? "bg-primary text-white"
                                : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                            }`}
                    >
                        <Gift className="w-4 h-4" />
                        Brand Rewards
                    </button>
                    <button
                        onClick={() => setActiveTab("badges")}
                        className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${activeTab === "badges"
                                ? "bg-primary text-white"
                                : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                            }`}
                    >
                        <Sparkles className="w-4 h-4" />
                        Badges
                    </button>
                </div>

                {/* Content */}
                <div className="max-h-[350px] overflow-y-auto pr-2">
                    {activeTab === "rewards" ? (
                        <div className="space-y-3">
                            {BRAND_REWARDS.map((reward) => {
                                const isUnlocked = currentStreak >= reward.requiredDays || earnedMilestones.includes(reward.requiredDays);
                                return (
                                    <div
                                        key={reward.id}
                                        className={`p-4 rounded-xl border transition-all ${isUnlocked
                                                ? `bg-gradient-to-r ${reward.color} ${reward.borderColor}`
                                                : "bg-secondary/20 border-white/5 opacity-50"
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`text-3xl ${isUnlocked ? "" : "grayscale"}`}>
                                                {reward.logo}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs text-muted-foreground">{reward.brand}</p>
                                                <p className={`font-semibold ${isUnlocked ? "text-foreground" : "text-muted-foreground"}`}>
                                                    {reward.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground">{reward.description}</p>
                                            </div>
                                            {isUnlocked ? (
                                                <div className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full">
                                                    ✓
                                                </div>
                                            ) : (
                                                <div className="text-right">
                                                    <div className="text-xs text-muted-foreground">Unlock at</div>
                                                    <div className="text-sm font-bold text-primary">{reward.requiredDays} days</div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Coupon Code - Only for unlocked */}
                                        {isUnlocked && (
                                            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                                                <code className="px-3 py-1.5 bg-black/30 text-primary font-mono text-sm rounded-lg flex-1">
                                                    {reward.coupon}
                                                </code>
                                                <button
                                                    onClick={() => copyToClipboard(reward.coupon)}
                                                    className="px-3 py-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 transition-colors flex items-center gap-2"
                                                >
                                                    {copiedCode === reward.coupon ? (
                                                        <>
                                                            <Check className="w-4 h-4 text-emerald-400" />
                                                            <span className="text-xs text-emerald-400">Copied!</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy className="w-4 h-4 text-primary" />
                                                            <span className="text-xs text-primary">Copy</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {STREAK_BADGES.map((badge) => {
                                const isEarned = earnedMilestones.includes(badge.days);
                                return (
                                    <div
                                        key={badge.days}
                                        className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${isEarned
                                                ? "bg-amber-500/10 border-amber-500/30"
                                                : "bg-secondary/20 border-white/5 opacity-50"
                                            }`}
                                    >
                                        <div className={`text-2xl ${isEarned ? "" : "grayscale"}`}>
                                            {badge.icon}
                                        </div>
                                        <div className="flex-1">
                                            <p className={`font-semibold ${isEarned ? "text-amber-300" : "text-muted-foreground"}`}>
                                                {badge.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground">{badge.days} day streak</p>
                                        </div>
                                        {isEarned ? (
                                            <div className="px-3 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full">
                                                Earned ✓
                                            </div>
                                        ) : (
                                            <div className="px-3 py-1 bg-secondary text-muted-foreground text-xs rounded-full">
                                                {badge.days - currentStreak} days left
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 text-center">
                    <p className="text-xs text-muted-foreground">
                        🔥 Keep your streak going to unlock more rewards!
                    </p>
                </div>
            </Card>
        </div>
    );
}
