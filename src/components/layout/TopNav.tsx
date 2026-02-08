"use client";

import Link from "next/link";
import { Activity, Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/auth/UserMenu";

export function TopNav() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 h-[3.5rem] border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
            <div className="flex h-full items-center px-4 justify-between">
                {/* Left: Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="flex items-center justify-center w-8 h-8 rounded bg-blue-600 shadow-glow group-hover:bg-blue-500 transition-colors">
                        <Activity className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-lg tracking-tight text-white hidden sm:block">
                        Quant<span className="text-blue-500">Risk</span>Metrics
                    </span>
                </Link>

                {/* Center: Main Links (Visible on desktop) */}
                <nav className="hidden lg:flex items-center gap-8">
                    <Link href="/" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
                        Dashboard
                    </Link>
                    <Link href="/guide" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
                        User Guide
                    </Link>
                    <Link href="/blog" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
                        Blog
                    </Link>
                </nav>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    {/* Placeholder for future status indicators */}
                    <div className="hidden md:flex items-center gap-4 mr-4 text-xs font-mono text-slate-500">
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            SYSTEM OPTIMAL
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                            DATA LIVE
                        </span>
                    </div>

                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                        <Bell className="w-5 h-5" />
                    </Button>

                    <UserMenu />
                </div>
            </div>
        </header>
    );
}
