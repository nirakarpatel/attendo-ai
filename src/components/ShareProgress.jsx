import { useState, useRef } from "react";
import { Share2, X, Download, Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";

export function ShareProgress({ isOpen, onClose, profile, subjects, streak }) {
    const [isGenerating, setIsGenerating] = useState(false);
    const reportRef = useRef(null);

    if (!isOpen) return null;

    const overallPercentage = subjects.length > 0
        ? Math.round(subjects.reduce((acc, sub) =>
            acc + (sub.total === 0 ? 100 : (sub.attended / sub.total) * 100), 0) / subjects.length)
        : 0;

    const handleDownload = async () => {
        if (!reportRef.current) return;

        setIsGenerating(true);
        try {
            const canvas = await html2canvas(reportRef.current, {
                backgroundColor: '#0f0f14',
                scale: 2,
            });

            const link = document.createElement('a');
            link.download = `attendo-report-${new Date().toISOString().split('T')[0]}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('Failed to generate image:', error);
        }
        setIsGenerating(false);
    };

    const handleShare = async () => {
        if (!reportRef.current) return;

        setIsGenerating(true);
        try {
            const canvas = await html2canvas(reportRef.current, {
                backgroundColor: '#0f0f14',
                scale: 2,
            });

            canvas.toBlob(async (blob) => {
                if (blob && navigator.share) {
                    const file = new File([blob], 'attendo-report.png', { type: 'image/png' });
                    await navigator.share({
                        title: 'My Attendance Report',
                        text: 'Check out my attendance progress on Attendo.AI!',
                        files: [file]
                    });
                } else {
                    // Fallback to download
                    handleDownload();
                }
                setIsGenerating(false);
            });
        } catch (error) {
            console.error('Failed to share:', error);
            setIsGenerating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <Card className="w-full max-w-md bg-card border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-blue-500/20">
                            <Share2 className="w-5 h-5 text-blue-400" />
                        </div>
                        <h2 className="text-xl font-bold">Share Progress</h2>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Report Card Preview */}
                <div
                    ref={reportRef}
                    className="p-6 rounded-2xl bg-gradient-to-br from-[#1a1a24] to-[#0f0f14] border border-white/10"
                >
                    {/* Header */}
                    <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold text-white mb-1">
                            📚 Attendo.AI
                        </h3>
                        <p className="text-sm text-gray-400">Attendance Report</p>
                    </div>

                    {/* User Info */}
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 mx-auto rounded-full bg-purple-500/20 flex items-center justify-center mb-2">
                            <span className="text-2xl font-bold text-purple-400">
                                {profile?.name?.charAt(0).toUpperCase() || '?'}
                            </span>
                        </div>
                        <p className="font-semibold text-white">{profile?.name || 'Student'}</p>
                        <p className="text-sm text-orange-400">🔥 {streak?.current || 0} day streak</p>
                    </div>

                    {/* Overall Stats */}
                    <div className="text-center mb-6 p-4 rounded-xl bg-white/5">
                        <p className="text-sm text-gray-400 mb-1">Overall Attendance</p>
                        <p className="text-4xl font-bold text-purple-400">{overallPercentage}%</p>
                    </div>

                    {/* Subject Breakdown */}
                    <div className="space-y-2">
                        {subjects.slice(0, 5).map(sub => {
                            const pct = sub.total === 0 ? 100 : Math.round((sub.attended / sub.total) * 100);
                            const isGood = pct >= sub.target;
                            return (
                                <div key={sub.id} className="flex items-center justify-between py-2 border-b border-white/5">
                                    <span className="text-sm text-gray-300 truncate max-w-[150px]">{sub.name}</span>
                                    <span className={`text-sm font-medium ${isGood ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {pct}%
                                    </span>
                                </div>
                            );
                        })}
                        {subjects.length > 5 && (
                            <p className="text-xs text-gray-500 text-center">+{subjects.length - 5} more subjects</p>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="mt-6 pt-4 border-t border-white/10 text-center">
                        <p className="text-xs text-gray-500">
                            Generated by Attendo.AI • {new Date().toLocaleDateString()}
                        </p>
                        <p className="text-[10px] text-gray-600 mt-1">
                            IDEAZIN GROUP OF TECHNOLOGIES
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-4">
                    <Button
                        onClick={handleDownload}
                        className="flex-1 bg-secondary"
                        disabled={isGenerating}
                    >
                        {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                        Download
                    </Button>
                    <Button
                        onClick={handleShare}
                        className="flex-1 bg-blue-500 hover:bg-blue-600"
                        disabled={isGenerating}
                    >
                        {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4 mr-2" />}
                        Share
                    </Button>
                </div>
            </Card>
        </div>
    );
}
