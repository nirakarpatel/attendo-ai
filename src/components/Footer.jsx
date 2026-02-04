import { GraduationCap } from "lucide-react";

export function Footer() {
    return (
        <footer className="fixed bottom-0 left-0 right-0 border-t border-white/5 bg-background/90 backdrop-blur-md py-3">
            <div className="container mx-auto px-4 text-center">
                <p className="text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground/60">Attendo.AI</span>
                    <span className="mx-2 text-white/20">|</span>
                    Product of <span className="text-primary/80 font-medium">IDEAZIN GROUP OF TECHNOLOGIES</span>
                </p>
                <p className="text-[10px] text-muted-foreground/60 mt-1">
                    © 2026-27 All Rights Reserved
                </p>
            </div>
        </footer>
    );
}
