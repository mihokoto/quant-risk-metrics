"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Heading {
    text: string;
    level: number;
    id: string;
}

interface TOCProps {
    headings: Heading[];
}

export function TableOfContents({ headings }: TOCProps) {
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: "-80px 0% -80% 0%" }
        );

        headings.forEach((heading) => {
            const element = document.getElementById(heading.id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [headings]);

    return (
        <nav className="hidden lg:block sticky top-32 h-fit max-w-[240px] animate-in-fade">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-6 px-4">
                Table of Contents
            </div>
            <ul className="space-y-1">
                {headings.map((heading) => (
                    <li key={heading.id}>
                        <a
                            href={`#${heading.id}`}
                            className={cn(
                                "block py-2 px-4 text-sm transition-all duration-200 border-l-2",
                                activeId === heading.id
                                    ? "text-blue-400 border-blue-400 bg-blue-500/5 font-medium"
                                    : "text-slate-500 border-transparent hover:text-slate-300 hover:border-slate-700"
                            )}
                            style={{
                                paddingLeft: `${heading.level === 3 ? "1.5rem" : "1rem"}`
                            }}
                        >
                            {heading.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
