"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';
import { Send, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const EmailSchema = z.string().email("Please enter a valid institutional email.");

export function NewsletterSignup() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setMessage("");

        try {
            // Validation
            EmailSchema.parse(email);

            // Supabase Submission
            const { error } = await supabase
                .from('subscribers')
                .insert([{ email, created_at: new Date().toISOString() }]);

            if (error) {
                if (error.code === '23505') { // Unique violation
                    setStatus('success');
                    setMessage("You are already on the list of top-tier quants.");
                    return;
                }
                throw error;
            }

            setStatus('success');
            setMessage("Welcome to the Unit. High-alpha risk reports coming to your inbox.");
            setEmail("");
        } catch (err: any) {
            setStatus('error');
            setMessage(err instanceof z.ZodError ? err.issues[0].message : "Connection failed. Please check your network or database RLS.");
        }
    };

    return (
        <section className="mt-20 py-16 border-t border-white/5">
            <div className="max-w-3xl mx-auto px-6">
                <div className="relative group p-10 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-sm overflow-hidden text-center">
                    {/* Background Glow */}
                    <div className={cn(
                        "absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 blur-[80px] -mt-32 rounded-full transition-colors duration-1000",
                        status === 'success' ? "bg-emerald-500/20" : "bg-indigo-500/10"
                    )} />

                    <div className="relative z-10 space-y-8">
                        <div className="flex flex-col items-center">
                            <div className={cn(
                                "w-12 h-12 rounded-xl border flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-500",
                                status === 'success'
                                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                    : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
                            )}>
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-bold text-white tracking-tight font-outfit">
                                Join the <span className={cn(
                                    "transition-colors duration-500",
                                    status === 'success' ? "text-emerald-500" : "text-indigo-500"
                                )}>Quant Report</span>
                            </h2>
                            <p className="mt-4 text-slate-400 font-serif italic max-w-lg mx-auto leading-relaxed">
                                {status === 'success'
                                    ? "Your terminal access is confirmed. Prepare for quantitative insights."
                                    : "Get monthly deep-dives into proprietary firm logic changes, volatility modeling, and the mathematics of fund survival."
                                }
                            </p>
                        </div>

                        {status === 'success' ? (
                            <div className="animate-in-slide-up flex flex-col items-center gap-4 py-4">
                                <CheckCircle2 className="w-16 h-16 text-emerald-500 animate-pulse" />
                                <div className="px-6 py-2 rounded-full bg-emerald-500 text-white font-bold uppercase tracking-[0.2em] text-[10px] shadow-glow-emerald">
                                    Welcome to the Unit
                                </div>
                                <p className="text-slate-300 font-serif italic text-sm">{message}</p>
                                <button
                                    onClick={() => setStatus('idle')}
                                    className="mt-4 text-xs font-mono text-slate-500 hover:text-white transition-colors underline underline-offset-4"
                                >
                                    Add another institutional address
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto relative">
                                <div className="flex-1 relative">
                                    <input
                                        type="email"
                                        placeholder="institutional@pro-desk.com"
                                        className={cn(
                                            "w-full h-14 bg-slate-950 border border-white/10 rounded-xl px-6 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none text-sm",
                                            status === 'error' && "border-rose-500/50 focus:ring-rose-500/30"
                                        )}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={status === 'loading'}
                                    />
                                    {status === 'error' && (
                                        <p className="absolute -bottom-6 left-1 text-[10px] font-bold text-rose-500 uppercase tracking-widest">
                                            {message}
                                        </p>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="h-14 px-8 rounded-xl bg-indigo-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-indigo-500 hover:shadow-glow-indigo transition-all duration-300 flex items-center justify-center gap-2 group/btn disabled:opacity-50"
                                >
                                    {status === 'loading' ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>
                                            Join Unit
                                            <Send className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}

                        <div className="pt-4 text-[10px] text-slate-600 uppercase tracking-widest">
                            Institutional quality research. Zero spam. Unsubscribe anytime.
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
