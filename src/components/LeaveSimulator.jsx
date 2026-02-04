import { useState } from "react";
import { Calendar, TrendingDown, TrendingUp, X } from "lucide-react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { simulateLeave } from "../lib/attendance-logic";
import { cn } from "../lib/utils";

export function LeaveSimulator({ subject, isOpen, onClose }) {
    const [leaveDays, setLeaveDays] = useState(1);

    if (!isOpen) return null;

    const simulation = simulateLeave(
        subject.total,
        subject.attended,
        subject.target,
        leaveDays
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <Card className="w-full max-w-lg bg-card border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary/20">
                            <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Leave Simulator</h2>
                            <p className="text-sm text-muted-foreground">{subject.name}</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Leave Days Selector */}
                <div className="mb-6">
                    <label className="text-sm font-medium text-muted-foreground mb-3 block">
                        How many days of leave are you planning?
                    </label>
                    <div className="flex items-center gap-4">
                        <input
                            type="range"
                            min="1"
                            max="15"
                            value={leaveDays}
                            onChange={(e) => setLeaveDays(Number(e.target.value))}
                            className="flex-1 accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="bg-secondary px-4 py-2 rounded-xl min-w-[80px] text-center">
                            <span className="text-2xl font-bold text-primary">{leaveDays}</span>
                            <span className="text-sm text-muted-foreground ml-1">day{leaveDays > 1 ? 's' : ''}</span>
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="space-y-4">
                    {/* Attendance Comparison */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-secondary/50 rounded-xl p-4 text-center">
                            <p className="text-xs text-muted-foreground mb-1">Current</p>
                            <p className="text-3xl font-bold text-foreground">{simulation.currentPercentage}%</p>
                        </div>
                        <div className={cn(
                            "rounded-xl p-4 text-center border",
                            simulation.isSafe
                                ? "bg-emerald-500/10 border-emerald-500/20"
                                : "bg-rose-500/10 border-rose-500/20"
                        )}>
                            <p className="text-xs text-muted-foreground mb-1">After Leave</p>
                            <div className="flex items-center justify-center gap-2">
                                {simulation.isSafe
                                    ? <TrendingUp className="w-5 h-5 text-emerald-400" />
                                    : <TrendingDown className="w-5 h-5 text-rose-400" />
                                }
                                <p className={cn(
                                    "text-3xl font-bold",
                                    simulation.isSafe ? "text-emerald-400" : "text-rose-400"
                                )}>
                                    {simulation.futurePercentage}%
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Message */}
                    <div className={cn(
                        "rounded-xl p-4 border",
                        simulation.isSafe
                            ? "bg-emerald-500/5 border-emerald-500/20"
                            : "bg-rose-500/5 border-rose-500/20"
                    )}>
                        <p className={cn(
                            "text-sm font-medium",
                            simulation.isSafe ? "text-emerald-300" : "text-rose-300"
                        )}>
                            {simulation.message}
                        </p>
                    </div>

                    {/* Recovery Plan (if not safe) */}
                    {!simulation.isSafe && (
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                            <h4 className="font-semibold text-amber-300 mb-2">📋 Recovery Plan</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• After your {leaveDays}-day break, attend <strong className="text-foreground">{simulation.recoveryClasses} consecutive classes</strong></li>
                                <li>• Don't miss any classes during recovery</li>
                                <li>• Target: Get back to {subject.target}%</li>
                            </ul>
                        </div>
                    )}
                </div>

                <div className="mt-6">
                    <Button variant="secondary" className="w-full" onClick={onClose}>
                        Close Simulator
                    </Button>
                </div>
            </Card>
        </div>
    );
}
