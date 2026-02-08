"use client";

import React from "react";
import { TopNav } from "./TopNav";
import { Sidebar, SidebarTrigger } from "./Sidebar";
import { Footer } from "./Footer";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { useRiskStore } from "@/store/riskStore";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface ShellProps {
    children: React.ReactNode;
}

export function Shell({ children }: ShellProps) {
    const { isSidebarOpen } = useRiskStore();
    const { showAuthModal, authModalMode, closeAuthModal, triggerAuthModal, user, isAuthProContext } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const isBlogRoute = pathname.startsWith('/blog');

    // Handle password setup redirect logic
    useEffect(() => {
        const setup = searchParams?.get('setup');
        if (setup === 'true' && user) {
            // Give the session a moment to stabilize
            const timer = setTimeout(() => {
                triggerAuthModal('update-password');
                // Clean up the URL
                const url = new URL(window.location.href);
                url.searchParams.delete('setup');
                router.replace(url.pathname + url.search);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [searchParams, user, triggerAuthModal, router]);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30">
            <TopNav />
            <Sidebar />
            {!isBlogRoute && <SidebarTrigger />}

            {/* Global Modals */}
            {showAuthModal && (
                <AuthModal
                    onClose={closeAuthModal}
                    defaultMode={authModalMode}
                    isProContext={isAuthProContext}
                />
            )}

            <main
                className={cn(
                    "pt-[3.5rem] transition-all duration-300 ease-in-out min-h-screen",
                    (isSidebarOpen && !isBlogRoute) ? "pl-80" : "pl-0"
                )}
            >
                <div className={cn(
                    "p-6 md:p-8 mx-auto animate-fade-in",
                    isBlogRoute ? "max-w-[1400px]" : "max-w-[1600px]"
                )}>
                    {children}
                </div>
                <Footer />
            </main>
        </div>
    );
}
