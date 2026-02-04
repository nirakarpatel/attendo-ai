import { useState } from "react";
import { User, X } from "lucide-react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";

export function ProfileModal({ isOpen, onClose, onSave, currentName }) {
    const [name, setName] = useState(currentName || "");

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onSave(name.trim());
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <Card className="w-full max-w-md bg-card border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary/20">
                            <User className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="text-xl font-bold">
                            {currentName ? "Edit Profile" : "Welcome! 👋"}
                        </h2>
                    </div>
                    {currentName && (
                        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                            <X className="w-5 h-5" />
                        </Button>
                    )}
                </div>

                {!currentName && (
                    <p className="text-muted-foreground mb-6">
                        Let's personalize your experience. What should we call you?
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Your Name</label>
                        <input
                            autoFocus
                            type="text"
                            placeholder="e.g. Rahul"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-secondary/50 border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground/50 transition-all text-lg"
                        />
                    </div>

                    <div className="pt-4">
                        <Button type="submit" className="w-full bg-primary text-white" disabled={!name.trim()}>
                            {currentName ? "Save Changes" : "Get Started"}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
