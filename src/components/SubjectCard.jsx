import { useState } from "react";
import { Plus, Minus, Trash2, Calendar, Pencil } from "lucide-react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { LeaveSimulator } from "./LeaveSimulator";
import { EditAttendance } from "./EditAttendance";
import { calculateStatus } from "../lib/attendance-logic";
import { cn } from "../lib/utils";

export function SubjectCard({ subject, onUpdate, onDelete }) {
    const [showSimulator, setShowSimulator] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const percentage = subject.total === 0 ? 100 : Math.round((subject.attended / subject.total) * 100);
    const status = calculateStatus(subject.total, subject.attended, subject.target);

    const handleAdd = (present) => {
        const updated = {
            ...subject,
            total: subject.total + 1,
            attended: subject.attended + (present ? 1 : 0)
        };
        onUpdate(updated);
    };

    const handleEditSave = (updatedSubject) => {
        onUpdate(updatedSubject);
    };

    return (
        <>
            <Card className="relative overflow-hidden group">
                {/* Background Gradient for flair */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-bold tracking-tight">{subject.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Target: {subject.target}%
                        </p>
                    </div>
                    <div className={cn("px-3 py-1 rounded-full text-xs font-medium border border-white/5", status.bg, status.color)}>
                        {percentage}%
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-3 w-full bg-secondary rounded-full overflow-hidden mb-4">
                    <div
                        className={cn("h-full transition-all duration-500 ease-out",
                            percentage >= subject.target ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"
                        )}
                        style={{ width: `${percentage}%` }}
                    />
                </div>

                {/* Stats with Edit Button */}
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-foreground/80 mb-1">
                            {subject.attended} / {subject.total} Classes
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {status.message}
                        </p>
                    </div>
                    <button
                        onClick={() => setShowEdit(true)}
                        className="p-2 rounded-lg hover:bg-amber-500/10 text-muted-foreground hover:text-amber-400 transition-colors"
                        title="Edit Attendance"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mb-3">
                    <Button
                        className="flex-1 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 hover:text-emerald-400 border border-emerald-500/20"
                        variant="ghost"
                        onClick={() => handleAdd(true)}
                    >
                        <Plus className="w-4 h-4 mr-2" /> Present
                    </Button>
                    <Button
                        className="flex-1 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 hover:text-rose-400 border border-rose-500/20"
                        variant="ghost"
                        onClick={() => handleAdd(false)}
                    >
                        <Minus className="w-4 h-4 mr-2" /> Absent
                    </Button>
                </div>

                {/* Leave Simulator Button */}
                <Button
                    variant="outline"
                    className="w-full text-xs bg-primary/5 border-primary/20 hover:bg-primary/10 text-primary"
                    onClick={() => setShowSimulator(true)}
                >
                    <Calendar className="w-3 h-3 mr-2" />
                    Plan a Leave
                </Button>

                {/* Delete Subject Button - Always visible */}
                <button
                    onClick={() => onDelete(subject.id)}
                    className="w-full mt-3 py-2 text-xs text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors flex items-center justify-center gap-2 border border-transparent hover:border-rose-500/20"
                    title="Delete Subject"
                >
                    <Trash2 className="w-3 h-3" />
                    Delete Subject
                </button>
            </Card>

            {/* Leave Simulator Modal */}
            <LeaveSimulator
                subject={subject}
                isOpen={showSimulator}
                onClose={() => setShowSimulator(false)}
            />

            {/* Edit Attendance Modal */}
            <EditAttendance
                subject={subject}
                isOpen={showEdit}
                onClose={() => setShowEdit(false)}
                onSave={handleEditSave}
            />
        </>
    );
}
