"use client";

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FirmCTAProps {
    firmKey: string;
    dealText: string;
    features: string[];
    className?: string;
}

export function FirmCTA({ firmKey, dealText, features, className }: FirmCTAProps) {
    return (
        <div className={cn(
            "my-12 relative group rounded-2xl overflow-hidden border border-white/5 bg-slate-900/50 backdrop-blur-sm animate-in-fade",
            className
        )}>
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] -mr-32 -mt-32 rounded-full" />

            <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1">
                    {/* Badge */}
                    <div className="flex items-center gap-2 mb-6">
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                            <ShieldCheck className="w-3 h-3" />
                            Verified Partner
                        </div>
                    </div>

                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight font-outfit">
                        Exclusive <span className="text-blue-500 relative">
                            Quant Edge
                            <span className="absolute -bottom-1 left-0 w-full h-px bg-blue-500/30 blur-[2px]" />
                        </span>
                    </h3>

                    {/* Deal Text with Glow */}
                    <div className="inline-block mb-8">
                        <div className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                            {dealText}
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2.5 text-slate-400 text-sm">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500/70" />
                                <span className="font-serif italic">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-full md:w-auto flex flex-col items-center gap-4">
                    <Link
                        href={`/go/${firmKey}`}
                        onClick={() => {
                            // Non-blocking tracking (Server-side also handles this, but ensuring client-side trigger as requested)
                            import('@/lib/supabase').then(({ supabase }) => {
                                supabase.rpc('increment_affiliate_click', { slug_val: firmKey })
                                    .then(({ error }) => {
                                        if (error) {
                                            // Fallback to simple update if RPC doesn't exist
                                            supabase.from('affiliates').select('click_count').eq('slug', firmKey).single()
                                                .then(({ data }) => {
                                                    if (data) {
                                                        supabase.from('affiliates')
                                                            .update({ click_count: (data.click_count || 0) + 1 })
                                                            .eq('slug', firmKey)
                                                            .then();
                                                    }
                                                });
                                        }
                                    });
                            });
                        }}
                        className="w-full md:w-64 h-16 inline-flex items-center justify-center gap-3 rounded-xl bg-blue-600 font-bold text-white hover:bg-blue-500 hover:shadow-glow-blue transition-all duration-300 group/btn"
                    >
                        Secure Special Terms
                        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest text-center">
                        Redirects to Official Verification
                    </p>
                </div>
            </div>

            {/* Bottom Accent Line */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        </div>
    );
}
