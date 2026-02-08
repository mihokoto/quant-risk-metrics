"use client";

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, User as UserIcon, Crown, Lock, Shield, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { AuthModal } from '@/components/auth/AuthModal';
import Link from 'next/link';

export function UserMenu() {
    const { user, profile, signOut, loading, isPro, triggerAuthModal, authMethod, hasEmailPassword } = useAuth();

    if (loading) {
        return (
            <div className="w-8 h-8 rounded-full bg-slate-800 animate-pulse" />
        );
    }

    if (!user) {
        return (
            <div className="flex items-center gap-2">
                <Link href="/pricing" className="hidden sm:block">
                    <Button
                        variant="default"
                        size="sm"
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase tracking-wider text-[10px] h-8 px-4"
                    >
                        <Crown className="w-3.5 h-3.5 mr-1" />
                        Go Pro
                    </Button>
                </Link>
                <Button
                    onClick={() => triggerAuthModal('signin')}
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-slate-400 hover:text-white hover:bg-white/5 h-8"
                >
                    <LogIn className="w-4 h-4" />
                    <span className="hidden md:inline">Sign In</span>
                </Button>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3">
            {/* Pro Badge */}
            {isPro && (
                <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30">
                    <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Pro</span>
                </div>
            )}

            {/* User Dropdown */}
            <div className="relative group">
                <button className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all",
                    "bg-slate-800/50 hover:bg-slate-700/50 border border-white/5"
                )}>
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                        <UserIcon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="hidden md:inline text-sm font-medium text-slate-300">
                        {user.email?.split('@')[0]}
                    </span>
                </button>

                {/* Dropdown Menu */}
                <div className={cn(
                    "absolute right-0 top-full mt-2 w-48 rounded-lg overflow-hidden",
                    "bg-slate-900 border border-white/10 shadow-2xl",
                    "opacity-0 invisible group-hover:opacity-100 group-hover:visible",
                    "transition-all duration-200 z-50"
                )}>
                    <div className="p-3 border-b border-white/5">
                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Account</div>
                        <div className="text-sm font-medium text-white truncate">{user.email}</div>
                        <div className="text-xs text-slate-400 mt-1">
                            {isPro ? 'Pro Tier' : 'Basic Tier'}
                        </div>
                    </div>

                    {!isPro && (
                        <Link href="/pricing">
                            <button className="w-full px-3 py-2 text-left text-sm text-amber-400 hover:bg-white/5 transition-colors flex items-center gap-2">
                                <Crown className="w-4 h-4" />
                                Upgrade to Pro
                            </button>
                        </Link>
                    )}

                    {/* Conditional Security/Settings Menu */}
                    {!hasEmailPassword ? (
                        <button
                            onClick={() => triggerAuthModal('update-password')}
                            className="w-full px-3 py-2 text-left text-sm text-blue-400 hover:bg-white/5 transition-colors flex items-center gap-2"
                        >
                            <Lock className="w-4 h-4" />
                            Secure with Password
                        </button>
                    ) : (
                        <button
                            className="w-full px-3 py-2 text-left text-sm text-slate-300 hover:bg-white/5 transition-colors flex items-center gap-2"
                        >
                            <Settings className="w-4 h-4" />
                            Account Settings
                        </button>
                    )}

                    {profile?.is_admin && (
                        <Link href="/quant-admin">
                            <button className="w-full px-3 py-2 text-left text-sm text-emerald-400 hover:bg-white/5 transition-colors flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                Admin Console
                            </button>
                        </Link>
                    )}

                    <button
                        onClick={signOut}
                        className="w-full px-3 py-2 text-left text-sm text-slate-300 hover:bg-white/5 transition-colors flex items-center gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
}
