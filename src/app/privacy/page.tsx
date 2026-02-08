import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Eye } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-slate-950 py-24 px-6 flex flex-col items-center">
            <div className="w-full max-w-[600px] space-y-12 animate-in-fade">

                {/* Back to Home */}
                <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-colors mb-8">
                    <ArrowLeft className="w-3 h-3" />
                    Back to Terminal
                </Link>

                <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                        <Eye className="w-6 h-6" />
                    </div>
                    <h1 className="text-4xl font-bold text-white tracking-tight font-outfit">Privacy Policy</h1>
                    <div className="h-px w-24 bg-blue-500/50" />
                </div>

                <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-8 md:p-10 shadow-2xl space-y-8 font-serif italic text-lg leading-relaxed text-slate-400">
                    <p>
                        We value trader anonymity.
                    </p>
                    <p>
                        We do not sell your data. We only collect emails for our **Quant Research** newsletter to provide our community with the latest risk modeling updates and firm analysis.
                    </p>
                    <p>
                        Your simulation data is processed locally where possible and is only stored if you explicitly choose to save a report to our database.
                    </p>
                </div>

                <div className="text-center pt-8">
                    <p className="text-[10px] text-slate-600 uppercase tracking-[0.3em]">
                        Effective Date: February 2, 2026
                    </p>
                </div>
            </div>
        </div>
    );
}
