import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ExternalLink } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-slate-900/50 border-t border-white/5 py-12 px-6 mt-20">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand & Mission */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-white font-outfit font-bold tracking-tight text-xl">
                            <span className="text-blue-500">Σ</span> QuantRiskMetrics
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed font-serif italic">
                            QuantRiskMetrics is a research-first platform dedicated to providing traders with mathematical clarity and survival-focused risk intelligence.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Platform</h4>
                        <nav className="flex flex-col gap-2">
                            <Link href="/" className="text-xs text-slate-500 hover:text-white transition-colors">Risk Simulator</Link>
                            <Link href="/blog" className="text-xs text-slate-500 hover:text-white transition-colors">Editorial & Math</Link>
                            <Link href="/guide" className="text-xs text-slate-500 hover:text-white transition-colors">User Guide</Link>
                            <Link href="/about" className="text-xs text-slate-500 hover:text-white transition-colors">Our Mission</Link>
                        </nav>
                    </div>

                    {/* Legal Links */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Legal</h4>
                        <nav className="flex flex-col gap-2">
                            <Link href="/terms" className="text-xs text-slate-500 hover:text-white transition-colors">Terms of Service</Link>
                            <Link href="/privacy" className="text-xs text-slate-500 hover:text-white transition-colors">Privacy Policy</Link>
                        </nav>
                    </div>

                    {/* Affiliate Disclosure */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <ShieldCheck className="w-3 h-3 text-blue-500" />
                            Transparency
                        </h4>
                        <p className="text-[10px] text-slate-500 leading-relaxed">
                            QuantRiskMetrics is a research-first platform. We may receive compensation from the firms mentioned on this site through our affiliate links.
                        </p>
                    </div>
                </div>

                {/* Risk Disclosure */}
                <div className="pt-8 border-t border-white/5">
                    <div className="bg-slate-950/50 rounded-xl p-6 border border-white/5">
                        <h4 className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mb-3">High Risk Disclosure</h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed uppercase tracking-wide">
                            Trading futures, forex, and equities involves substantial risk and is not for every investor. An investor could potentially lose all or more than the initial investment. Risk capital is money that can be lost without jeopardizing ones’ financial security or life style. Only risk capital should be used for trading and only those with sufficient risk capital should consider trading. Past performance is not necessarily indicative of future results.
                        </p>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/5 pt-8">
                    <div className="text-[10px] text-slate-600 font-mono uppercase">
                        © 2026 QuantRiskMetrics Intelligence Unit. All rights reserved.
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            System Operational
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
