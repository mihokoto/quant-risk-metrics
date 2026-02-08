"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// Simple custom tooltip implementation to avoid full Radix dependency overhead for now
export interface TooltipProps {
    content: string;
    children: React.ReactNode;
    side?: "top" | "bottom" | "left" | "right";
}

export function Tooltip({ content, children, side = "top" }: TooltipProps) {
    const [isVisible, setIsVisible] = React.useState(false);

    return (
        <div
            className="relative flex items-center"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            {isVisible && (
                <div className={cn(
                    "absolute z-50 px-3 py-1.5 text-xs text-slate-200 bg-slate-900 border border-slate-700 rounded shadow-xl whitespace-nowrap animate-in fade-in zoom-in-95 duration-200",
                    side === "top" && "bottom-full mb-2 left-1/2 -translate-x-1/2",
                    side === "bottom" && "top-full mt-2 left-1/2 -translate-x-1/2",
                    side === "left" && "right-full mr-2 top-1/2 -translate-y-1/2",
                    side === "right" && "left-full ml-2 top-1/2 -translate-y-1/2",
                )}>
                    {content}
                    {/* Arrow */}
                    <div className={cn(
                        "absolute w-2 h-2 bg-slate-900 border-slate-700 transform rotate-45",
                        side === "top" && "bottom-[-5px] left-1/2 -translate-x-1/2 border-b border-r",
                        side === "bottom" && "top-[-5px] left-1/2 -translate-x-1/2 border-t border-l",
                    )} />
                </div>
            )}
        </div>
    );
}

// Wrapper for consistent Usage if we upgrade to Radix later
export const TooltipProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;
