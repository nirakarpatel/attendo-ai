import { useState, useRef } from "react";
import { Download, Upload, Shield, X, CheckCircle, AlertCircle } from "lucide-react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { storage } from "../services/storage";

export function DataBackup({ isOpen, onClose, onDataImported }) {
    const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: string }
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const handleExport = () => {
        const data = storage.exportData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `attendo-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setStatus({ type: 'success', message: 'Backup downloaded successfully!' });
    };

    const handleImport = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const result = storage.importData(e.target?.result);
            if (result.success) {
                setStatus({ type: 'success', message: 'Data restored successfully! Refreshing...' });
                setTimeout(() => {
                    onDataImported();
                    onClose();
                }, 1500);
            } else {
                setStatus({ type: 'error', message: result.error });
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <Card className="w-full max-w-md bg-card border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-emerald-500/20">
                            <Shield className="w-5 h-5 text-emerald-400" />
                        </div>
                        <h2 className="text-xl font-bold">Data Backup</h2>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <p className="text-muted-foreground mb-6 text-sm">
                    Your data is automatically saved in your browser. For extra safety, you can export a backup file.
                </p>

                {/* Status Message */}
                {status && (
                    <div className={`flex items-center gap-2 p-3 rounded-xl mb-4 ${status.type === 'success'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                        {status.type === 'success'
                            ? <CheckCircle className="w-4 h-4" />
                            : <AlertCircle className="w-4 h-4" />
                        }
                        <span className="text-sm">{status.message}</span>
                    </div>
                )}

                <div className="space-y-3">
                    {/* Export Button */}
                    <Button
                        onClick={handleExport}
                        className="w-full bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20"
                        variant="ghost"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Export Backup
                    </Button>

                    {/* Import Button */}
                    <Button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20"
                        variant="ghost"
                    >
                        <Upload className="w-4 h-4 mr-2" />
                        Import from Backup
                    </Button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        onChange={handleImport}
                        className="hidden"
                    />
                </div>

                <div className="mt-6 pt-4 border-t border-white/5">
                    <p className="text-xs text-muted-foreground text-center">
                        💡 Tip: Export a backup before clearing browser data
                    </p>
                </div>
            </Card>
        </div>
    );
}
