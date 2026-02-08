"use client";

import React from "react";
import { AlertTriangle, Info, Lightbulb, Quote as QuoteIcon, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalloutProps {
    type?: "warning" | "info" | "tip";
    children: React.ReactNode;
}

export function Callout({ type = "info", children }: CalloutProps) {
    const styles = {
        warning: {
            bg: "bg-rose-500/10 border-rose-500/20",
            text: "text-rose-200",
            icon: <AlertTriangle className="w-5 h-5 text-rose-500" />,
            label: "Risk Warning"
        },
        info: {
            bg: "bg-blue-500/10 border-blue-500/20",
            text: "text-blue-200",
            icon: <Info className="w-5 h-5 text-blue-500" />,
            label: "Technical Note"
        },
        tip: {
            bg: "bg-emerald-500/10 border-emerald-500/20",
            text: "text-emerald-200",
            icon: <Lightbulb className="w-5 h-5 text-emerald-500" />,
            label: "Quant Tip"
        }
    };

    const current = styles[type];

    return (
        <div className={cn("my-8 p-6 rounded-xl border flex gap-4 animate-in-fade", current.bg)}>
            <div className="mt-1 flex-shrink-0">{current.icon}</div>
            <div>
                <div className={cn("text-xs font-bold uppercase tracking-widest mb-2 opacity-60", current.text)}>
                    {current.label}
                </div>
                <div className={cn("text-sm md:text-base leading-relaxed", current.text)}>
                    {children}
                </div>
            </div>
        </div>
    );
}

export function QuantBadge() {
    return (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 animate-in-slide-up">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            Verified Statistical Audit
        </div>
    );
}

interface QuoteProps {
    children: React.ReactNode;
    author?: string;
}

export function Quote({ children, author }: QuoteProps) {
    return (
        <div className="my-12 relative py-4 px-8 border-l-4 border-blue-600 bg-slate-900/40 rounded-r-xl">
            <QuoteIcon className="absolute -top-4 -left-4 w-10 h-10 text-blue-600/20 rotate-180" />
            <div className="text-xl md:text-2xl font-serif italic text-slate-200 leading-relaxed mb-4">
                {children}
            </div>
            {author && (
                <div className="text-sm font-bold text-blue-400 uppercase tracking-[0.2em]">
                    — {author}
                </div>
            )}
        </div>
    );
}
