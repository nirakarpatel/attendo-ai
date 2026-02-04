import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";

export function AddSubjectModal({ isOpen, onClose, onAdd }) {
    const [name, setName] = useState("");
    const [target, setTarget] = useState(75);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onAdd(name, Number(target));
            setName("");
            setTarget(75);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <Card className="w-full max-w-md bg-card border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Add New Subject</h2>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Subject Name</label>
                        <input
                            autoFocus
                            type="text"
                            placeholder="e.g. Data Structures"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-secondary/50 border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground/50 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Target Attendance (%)</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="50"
                                max="100"
                                step="5"
                                value={target}
                                onChange={(e) => setTarget(e.target.value)}
                                className="flex-1 accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="text-lg font-bold w-12 text-right">{target}%</span>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1 bg-primary text-white">
                            Create Subject
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
