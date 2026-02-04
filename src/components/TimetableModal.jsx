import { useState, useEffect } from "react";
import { Clock, X, Plus, Trash2 } from "lucide-react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { storage } from "../services/storage";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function TimetableModal({ isOpen, onClose, subject }) {
    const [entries, setEntries] = useState([]);
    const [newDay, setNewDay] = useState(1); // Monday default
    const [newStartTime, setNewStartTime] = useState("09:00");
    const [newEndTime, setNewEndTime] = useState("10:00");

    useEffect(() => {
        if (isOpen && subject) {
            setEntries(storage.getTimetable(subject.id));
        }
    }, [isOpen, subject]);

    if (!isOpen || !subject) return null;

    const handleAdd = (e) => {
        e.preventDefault();
        const updated = storage.addTimetableEntry(subject.id, newDay, newStartTime, newEndTime);
        setEntries(updated.filter(t => t.subjectId === subject.id));
    };

    const handleDelete = (id) => {
        const updated = storage.deleteTimetableEntry(id);
        setEntries(updated.filter(t => t.subjectId === subject.id));
    };

    // Sort by day then time
    const sortedEntries = [...entries].sort((a, b) => {
        if (a.day !== b.day) return a.day - b.day;
        return a.startTime.localeCompare(b.startTime);
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <Card className="w-full max-w-md bg-card border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-blue-500/20">
                            <Clock className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">Class Schedule</h2>
                            <p className="text-xs text-muted-foreground">{subject.name}</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Add Entry Form */}
                <form onSubmit={handleAdd} className="space-y-3 mb-4 p-3 bg-secondary/30 rounded-xl">
                    <div className="grid grid-cols-3 gap-2">
                        <select
                            value={newDay}
                            onChange={(e) => setNewDay(Number(e.target.value))}
                            className="bg-secondary/50 border border-white/10 rounded-lg px-2 py-2 text-sm"
                        >
                            {DAYS.map((day, i) => (
                                <option key={i} value={i}>{day.slice(0, 3)}</option>
                            ))}
                        </select>
                        <input
                            type="time"
                            value={newStartTime}
                            onChange={(e) => setNewStartTime(e.target.value)}
                            className="bg-secondary/50 border border-white/10 rounded-lg px-2 py-2 text-sm"
                        />
                        <input
                            type="time"
                            value={newEndTime}
                            onChange={(e) => setNewEndTime(e.target.value)}
                            className="bg-secondary/50 border border-white/10 rounded-lg px-2 py-2 text-sm"
                        />
                    </div>
                    <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Class Time
                    </Button>
                </form>

                {/* Schedule List */}
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {sortedEntries.length === 0 ? (
                        <p className="text-center text-muted-foreground text-sm py-4">
                            No classes scheduled
                        </p>
                    ) : (
                        sortedEntries.map((entry) => (
                            <div
                                key={entry.id}
                                className="flex items-center justify-between p-3 rounded-xl bg-blue-500/10 border border-blue-500/20"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-blue-400 w-12">
                                        {DAYS[entry.day].slice(0, 3)}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        {entry.startTime} - {entry.endTime}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleDelete(entry.id)}
                                    className="p-2 text-muted-foreground hover:text-rose-400 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </Card>
        </div>
    );
}
