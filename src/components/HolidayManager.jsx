import { useState } from "react";
import { Calendar, X, Plus, Trash2 } from "lucide-react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { storage } from "../services/storage";

export function HolidayManager({ isOpen, onClose, onUpdate }) {
    const [holidays, setHolidays] = useState(storage.getHolidays());
    const [newDate, setNewDate] = useState("");
    const [newName, setNewName] = useState("");

    if (!isOpen) return null;

    const handleAdd = (e) => {
        e.preventDefault();
        if (newDate && newName.trim()) {
            const updated = storage.addHoliday(newDate, newName.trim());
            setHolidays(updated);
            setNewDate("");
            setNewName("");
            onUpdate?.();
        }
    };

    const handleDelete = (id) => {
        const updated = storage.deleteHoliday(id);
        setHolidays(updated);
        onUpdate?.();
    };

    // Sort holidays by date
    const sortedHolidays = [...holidays].sort((a, b) =>
        new Date(a.date) - new Date(b.date)
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <Card className="w-full max-w-md bg-card border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-purple-500/20">
                            <Calendar className="w-5 h-5 text-purple-400" />
                        </div>
                        <h2 className="text-xl font-bold">Holidays</h2>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                    Holidays protect your streak! Your streak won't break on marked holiday days.
                </p>

                {/* Add Holiday Form */}
                <form onSubmit={handleAdd} className="flex gap-2 mb-4">
                    <input
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="flex-1 bg-secondary/50 border border-white/10 rounded-xl px-3 py-2 text-sm"
                        required
                    />
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Holiday name"
                        className="flex-1 bg-secondary/50 border border-white/10 rounded-xl px-3 py-2 text-sm"
                        required
                    />
                    <Button type="submit" size="icon" className="bg-purple-500 hover:bg-purple-600">
                        <Plus className="w-4 h-4" />
                    </Button>
                </form>

                {/* Holiday List */}
                <div className="space-y-2 max-h-[250px] overflow-y-auto">
                    {sortedHolidays.length === 0 ? (
                        <p className="text-center text-muted-foreground text-sm py-4">
                            No holidays added yet
                        </p>
                    ) : (
                        sortedHolidays.map((holiday) => {
                            const date = new Date(holiday.date);
                            const isPast = date < new Date().setHours(0, 0, 0, 0);

                            return (
                                <div
                                    key={holiday.id}
                                    className={`flex items-center justify-between p-3 rounded-xl border ${isPast ? 'bg-secondary/20 border-white/5 opacity-50' : 'bg-purple-500/10 border-purple-500/20'
                                        }`}
                                >
                                    <div>
                                        <p className="font-medium text-sm">{holiday.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {date.toLocaleDateString('en-US', {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(holiday.id)}
                                        className="p-2 text-muted-foreground hover:text-rose-400 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            </Card>
        </div>
    );
}
