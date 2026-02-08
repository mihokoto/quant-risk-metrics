"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock, Chrome, Loader2, AlertCircle, Activity, X, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuthModalProps {
    onClose: () => void;
    defaultMode?: 'signin' | 'signup' | 'update-password';
    isProContext?: boolean;
}

export function AuthModal({ onClose, defaultMode = 'signin', isProContext = false }: AuthModalProps) {
    const [view, setView] = useState<'selection' | 'signin' | 'signup' | 'update-password'>(
        defaultMode === 'update-password' ? 'update-password' :
            isProContext ? 'signup' : 'selection'
    );
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(false);


    const { signIn, signUp, signInWithGoogle, updatePassword } = useAuth();

    // Trigger the camera focus animation
    useEffect(() => {
        // Add scroll lock
        document.body.style.overflow = 'hidden';

        // Animate modal in
        setTimeout(() => setIsVisible(true), 10);

        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for fade out animation
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (view === 'signup' && password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const { error, data } = view === 'signin'
                ? await signIn(email, password)
                : view === 'signup'
                    ? await signUp(email, password)
                    : await updatePassword(password);

            if (error) {
                setError(error.message);
            } else {
                // If in Pro context, create the request automatically
                if (isProContext && (view === 'signup' || view === 'signin')) {
                    try {
                        await supabase
                            .from('pro_requests')
                            .insert([
                                {
                                    email: email,
                                    user_id: data?.user?.id || null,
                                    status: 'PENDING'
                                }
                            ]);
                    } catch (dbErr) {
                        console.error("Pro request insertion failed:", dbErr);
                    }
                }

                // Task 2: Seamless Session Hydration
                // The AuthProvider's onAuthStateChange will fetch the profile.
                // We trigger the event to notify the UI.
                window.dispatchEvent(new Event('authChange'));
                handleClose();
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleAuth = async () => {
        setError(null);
        setLoading(true);
        const { error } = await signInWithGoogle();
        if (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    return (
        <>
            <style jsx global>{`

                .animate-gradient-flow {
                    animation: gradient-flow 3s ease infinite;
                }

                @keyframes float {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    33% { transform: translate(30px, -30px) rotate(5deg); }
                    66% { transform: translate(-20px, 20px) rotate(-5deg); }
                }

                @keyframes modalZoom {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                @keyframes overlayFade {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes gradient-flow {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
            `}</style>

            <div
                className={cn(
                    "fixed inset-0 z-[9999] flex items-start justify-center p-4 sm:p-8 overflow-y-auto transition-opacity duration-300",
                    isVisible ? "opacity-100" : "opacity-0"
                )}
                style={{
                    background: isProContext
                        ? 'radial-gradient(circle at 50% 50%, rgba(251, 191, 36, 0.1) 0%, rgba(0, 0, 0, 0.95) 100%)'
                        : 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.15) 0%, rgba(0, 0, 0, 0.95) 100%)',
                    backdropFilter: 'blur(12px)',
                    animation: isVisible ? 'overlayFade 0.4s ease-out' : 'none'
                }}
            >
                {/* Animated Background Orbs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div
                        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
                        style={{
                            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)',
                            animation: 'float 8s ease-in-out infinite'
                        }}
                    />
                    <div
                        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
                        style={{
                            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)',
                            animation: 'float 10s ease-in-out infinite reverse'
                        }}
                    />
                </div>

                {/* Backdrop Click to Close */}
                <div className="absolute inset-0" onClick={handleClose} />

                <Card
                    className="w-full max-w-md glass border-white/20 shadow-2xl relative z-10 flex flex-col max-h-[90vh] overflow-y-auto"
                    style={{
                        animation: isVisible ? 'modalZoom 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none'
                    }}
                >
                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors group z-20"
                    >
                        <X className="w-5 h-5 text-slate-400 group-hover:text-white" />
                    </button>

                    <CardHeader className="text-center space-y-4 pt-8 pb-4 flex-shrink-0">

                        <div className="space-y-1">
                            <CardTitle className="text-2xl font-outfit font-black text-center tracking-tight text-white uppercase italic">
                                {view === 'selection' ? 'Quant Auth' :
                                    view === 'signin' ? 'Terminal Access' :
                                        view === 'signup' ? 'Create Profile' : 'Secure Account'}
                            </CardTitle>
                            <CardDescription className="text-center text-slate-400 text-sm">
                                {view === 'selection' ? 'Choose your entry method' :
                                    view === 'signin' ? 'Sign in to access your institutional analytics' :
                                        view === 'signup' ? 'Start your journey to smarter prop trading' :
                                            'Set a password to enable email & password login'}
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6 px-8 relative">

                        <>
                            {error && (
                                <div className={cn(
                                    "flex items-start gap-3 p-4 rounded-xl text-sm border bg-rose-500/10 border-rose-500/30 text-rose-300 animate-in-slide-up"
                                )}>
                                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <span className="leading-relaxed">{error}</span>
                                </div>
                            )}

                            {view === 'selection' ? (
                                <div className="space-y-4 py-4 animate-in-fade">
                                    <Button
                                        onClick={() => setView('signup')}
                                        className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white font-black text-lg uppercase italic tracking-tighter"
                                    >
                                        Create New Account
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setView('signin')}
                                        className="w-full h-16 border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-widest text-sm"
                                    >
                                        Sign In
                                    </Button>
                                    <div className="pt-4">
                                        <div className="relative">
                                            <div className="absolute inset-0 flex items-center">
                                                <span className="w-full border-t border-white/10" />
                                            </div>
                                            <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em]">
                                                <span className="bg-[#020617] px-4 text-slate-500 font-bold">Or social entry</span>
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full h-14 mt-4 border-white/10 bg-white/5 hover:bg-white/10 transition-all text-white font-semibold flex items-center justify-center gap-3"
                                            onClick={handleGoogleAuth}
                                            disabled={loading}
                                        >
                                            <Chrome className="w-5 h-5" />
                                            Google Account
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleEmailAuth} className="space-y-5 animate-in-slide-up">
                                    {view !== 'update-password' && (
                                        <div className="space-y-2.5">
                                            <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                                Email Address
                                            </Label>
                                            <div className="relative group">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors pointer-events-none z-10" />
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="trader@quantrisk.io"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="pl-12 h-14 bg-slate-900/50 border-white/10 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all text-white placeholder:text-slate-600 text-base"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-2.5">
                                        <div className="flex justify-between items-end">
                                            <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                                {view === 'update-password' ? 'New Password' : 'Password'}
                                            </Label>
                                            {view === 'signin' && (
                                                <button type="button" className="text-[10px] text-blue-400 hover:underline font-bold uppercase tracking-widest">
                                                    Forgot?
                                                </button>
                                            )}
                                        </div>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors pointer-events-none z-10" />
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="••••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="pl-12 h-14 bg-slate-900/50 border-white/10 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all text-white text-base"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {view === 'signup' && (
                                        <div className="space-y-2.5 animate-in-fade">
                                            <Label htmlFor="confirmPassword" className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                                Confirm Password
                                            </Label>
                                            <div className="relative group">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors pointer-events-none z-10" />
                                                <Input
                                                    id="confirmPassword"
                                                    type="password"
                                                    placeholder="••••••••••"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className="pl-12 h-14 bg-slate-900/50 border-white/10 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all text-white text-base"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        className={cn(
                                            "w-full h-14 font-bold text-sm uppercase tracking-widest shadow-lg transition-all active:scale-[0.98]",
                                            (isProContext || view === 'update-password')
                                                ? "bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 shadow-amber-500/30"
                                                : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-blue-500/30"
                                        )}
                                        disabled={loading}
                                    >
                                        {loading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                                        {view === 'signin' ? 'Login' :
                                            view === 'signup' ? 'Create Account' :
                                                view === 'update-password' ? 'Save Password' : 'Continue'}
                                    </Button>

                                    <button
                                        type="button"
                                        onClick={() => setView('selection')}
                                        className="w-full text-center text-[10px] text-slate-500 uppercase font-bold tracking-[0.2em] hover:text-slate-300"
                                    >
                                        Back to selection
                                    </button>
                                </form>
                            )}
                        </>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4 px-8 pb-8">
                        {!error && (
                            <>
                                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="text-[10px] text-slate-600 hover:text-slate-300 transition-colors uppercase tracking-[0.3em] font-bold"
                                >
                                    Continue as Guest
                                </button>
                            </>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}
