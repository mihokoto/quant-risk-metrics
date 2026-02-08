"use client";

import React, { useState, useEffect } from "react";

export function ReadingProgress() {
    const [completion, setCompletion] = useState(0);

    useEffect(() => {
        const updateScrollCompletion = () => {
            const currentProgress = window.scrollY;
            const scrollHeight = document.body.scrollHeight - window.innerHeight;
            if (scrollHeight) {
                setCompletion(
                    Number((currentProgress / scrollHeight).toFixed(2)) * 100
                );
            }
        };

        window.addEventListener("scroll", updateScrollCompletion);

        return () => {
            window.removeEventListener("scroll", updateScrollCompletion);
        };
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 h-1 z-[100] bg-slate-900 overflow-hidden">
            <div
                className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] transition-all duration-150 ease-out"
                style={{ width: `${completion}%` }}
            />
        </div>
    );
}
