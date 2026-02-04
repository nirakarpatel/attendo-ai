import { useState, useEffect } from "react";
import { Pencil, X, Plus, Minus } from "lucide-react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";

export function EditAttendance({ subject, isOpen, onClose, onSave }) {
    const [attended, setAttended] = useState(subject.attended);
    const [total, setTotal] = useState(subject.total);

    // Reset values when modal opens or subject changes
    useEffect(() => {
        if (isOpen) {
            setAttended(subject.attended);
            setTotal(subject.total);
        }
    }, [isOpen, subject.attended, subject.total]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave({ ...subject, attended, total });
        onClose();
    };

    // Increase attended - also increases total automatically
    const increaseAttended = () => {
        setAttended(prev => prev + 1);
        setTotal(prev => Math.max(prev, attended + 1)); // Total must be >= new attended
    };

    // Decrease attended - but can't go below 0
    const decreaseAttended = () => {
        if (attended > 0) {
            setAttended(prev => prev - 1);
        }
    };

    // Increase total
    const increaseTotal = () => {
        setTotal(prev => prev + 1);
    };

    // Decrease total - but can't go below attended
    const decreaseTotal = () => {
        if (total > attended) {
            setTotal(prev => prev - 1);
        }
    };

    const percentage = total === 0 ? 100 : Math.round((attended / total) * 100);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <Card className="w-full max-w-sm bg-card border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-amber-500/20">
                            <Pencil className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">Edit Attendance</h2>
                            <p className="text-xs text-muted-foreground">{subject.name}</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <div className="space-y-6">
                    {/* Classes Attended */}
                    <div className="bg-secondary/30 rounded-xl p-4">
                        <label className="text-sm font-medium text-muted-foreground mb-3 block">
                            Classes Attended <span className="text-xs text-emerald-400">(+1 also adds to total)</span>
                        </label>
                        <div className="flex items-center justify-between gap-4">
                            <button
                                onClick={decreaseAttended}
                                className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 flex items-center justify-center transition-colors disabled:opacity-30"
                                disabled={attended <= 0}
                            >
                                <Minus className="w-5 h-5" />
                            </button>
                            <span className="text-4xl font-bold text-emerald-400">{attended}</span>
                            <button
                                onClick={increaseAttended}
                                className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 flex items-center justify-center transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Total Classes */}
                    <div className="bg-secondary/30 rounded-xl p-4">
                        <label className="text-sm font-medium text-muted-foreground mb-3 block">
                            Total Classes <span className="text-xs text-blue-400">(add missed classes only)</span>
                        </label>
                        <div className="flex items-center justify-between gap-4">
                            <button
                                onClick={decreaseTotal}
                                className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 flex items-center justify-center transition-colors disabled:opacity-30"
                                disabled={total <= attended}
                            >
                                <Minus className="w-5 h-5" />
                            </button>
                            <span className="text-4xl font-bold text-foreground">{total}</span>
                            <button
                                onClick={increaseTotal}
                                className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 flex items-center justify-center transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="text-center py-3 bg-primary/5 rounded-xl border border-primary/10">
                        <p className="text-sm text-muted-foreground">New Attendance</p>
                        <p className="text-3xl font-bold text-primary">{percentage}%</p>
                    </div>
                </div>

                <div className="mt-6 flex gap-3">
                    <Button variant="ghost" className="flex-1" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button className="flex-1 bg-primary" onClick={handleSave}>
                        Save Changes
                    </Button>
                </div>
            </Card>
        </div>
    );
}
