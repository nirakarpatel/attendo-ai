import { cn } from "../../lib/utils";

export function Card({ className, children, ...props }) {
    return (
        <div
            className={cn(
                "glass-card rounded-2xl p-6 transition-all duration-300 hover:bg-card/80",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
