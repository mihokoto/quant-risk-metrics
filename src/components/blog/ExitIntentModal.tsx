"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';
import { X, Sparkles, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const EmailSchema = z.string().email("Please enter a valid institutional email.");

export function ExitIntentModal() {
    const [isVisible, setIsVisible] = useState(false);
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState("");
    const [hasShown, setHasShown] = useState(false);

    useEffect(() => {
        // Only show if not previously shown in this session
        const shown = sessionStorage.getItem('exit_modal_shown');
        if (shown) {
            setHasShown(true);
            return;
        }

        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0 && !hasShown) {
                setIsVisible(true);
                setHasShown(true);
                sessionStorage.setItem('exit_modal_shown', 'true');
            }
        };

        document.addEventListener('mouseleave', handleMouseLeave);
        return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }, [hasShown]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setMessage("");

        try {
            EmailSchema.parse(email);

            const { error } = await supabase
                .from('subscribers')
                .insert([{
                    email,
                    created_at: new Date().toISOString(),
                    source: 'exit_intent'
                }]);

            if (error) {
                if (error.code === '23505') {
                    setStatus('success');
                    setMessage("You're already on the list of priority quants.");
                    return;
                }
                throw error;
            }

            setStatus('success');
            setMessage("Cheat Sheet linked. High-alpha reports incoming.");
            setEmail("");
            // Automatically close after 3 seconds on success
            setTimeout(() => setIsVisible(false), 3000);
        } catch (err: any) {
            setStatus('error');
            setMessage(err instanceof z.ZodError ? err.issues[0].message : "Connection failed.");
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-md bg-slate-950/40 animate-in-fade duration-300">
            <div className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 sm:p-12 shadow-[0_0_100px_rgba(59,130,246,0.15)] overflow-hidden">
                {/* Background Accents */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 blur-[60px] rounded-full translate-y-1/2 -translate-x-1/2" />

                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="relative z-10 text-center space-y-8">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 shadow-glow-blue animate-pulse">
                            <Sparkles className="w-8 h-8 text-blue-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tight font-outfit mb-4">
                            Wait! Don't blow your <span className="text-blue-500 text-glow">next challenge.</span>
                        </h2>
                        <p className="text-slate-400 font-serif italic leading-relaxed text-sm max-w-sm">
                            Get our "Prop Survival Cheat Sheet" (PDF) and monthly risk reports designed for institutional survival.
                        </p>
                    </div>

                    {status === 'success' ? (
                        <div className="animate-in-slide-up space-y-4 py-4 flex flex-col items-center">
                            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                            <div className="px-4 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                                Verification Success
                            </div>
                            <p className="text-slate-300 font-serif text-sm">{message}</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="institutional@pro-desk.com"
                                    className={cn(
                                        "w-full h-14 bg-slate-950 border border-white/10 rounded-2xl px-6 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none text-sm",
                                        status === 'error' && "border-rose-500/50"
                                    )}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={status === 'loading'}
                                />
                                {status === 'error' && (
                                    <p className="absolute -bottom-5 left-2 text-[10px] font-bold text-rose-500 uppercase tracking-widest">
                                        {message}
                                    </p>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full h-14 rounded-2xl bg-blue-600 text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-blue-500 hover:shadow-glow-blue transition-all duration-300 flex items-center justify-center gap-2 group/btn disabled:opacity-50"
                            >
                                {status === 'loading' ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        Get Survival PDF
                                        <Send className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    <div className="text-[10px] text-slate-600 uppercase tracking-widest leading-relaxed">
                        Quant Intelligence Unit • Institutional Access Only
                    </div>
                </div>
            </div>
        </div>
    );
}
