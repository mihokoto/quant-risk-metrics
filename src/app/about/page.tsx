import React from 'react';
import { Target, BrainCircuit, ShieldAlert, Cpu } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-slate-950 py-20 px-6">
            <div className="max-w-4xl mx-auto space-y-24">

                {/* Header / Logo Section */}
                <div className="text-center space-y-8 animate-in-fade">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-blue-600/10 border border-blue-500/20 text-blue-500 mb-6">
                        <span className="text-6xl font-bold tracking-tighter">Σ</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight font-outfit">
                        QuantRisk<span className="text-blue-500">Metrics</span>
                    </h1>
                    <div className="h-px w-24 bg-blue-500/50 mx-auto" />
                    <p className="text-xl md:text-2xl text-slate-400 font-serif italic max-w-2xl mx-auto leading-relaxed">
                        "The goal of the professional trader is not to make money, but to stay in the game long enough for the money to find them."
                    </p>
                </div>

                {/* Mission Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start border-l border-white/5 pl-12 relative animate-in-slide-right">
                    <div className="absolute left-0 top-0 w-1 h-24 bg-blue-500/50 -ml-0.5" />
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 text-blue-500 text-sm font-bold uppercase tracking-widest">
                            <Target className="w-5 h-5" />
                            Our Mission
                        </div>
                        <h2 className="text-3xl font-bold text-white font-outfit">Mathematical Clarity.</h2>
                        <p className="text-lg text-slate-400 font-serif leading-relaxed italic">
                            We believe that most traders fail not because of bad strategy, but because they do not understand the probability of ruin. Our mission is to strip away the noise and provide institutional-grade clarity to retail participants.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-3 text-blue-500 text-sm font-bold uppercase tracking-widest">
                            <Cpu className="w-5 h-5" />
                            The Technology
                        </div>
                        <h2 className="text-3xl font-bold text-white font-outfit">Proprietary Modeling.</h2>
                        <p className="text-lg text-slate-400 font-serif leading-relaxed italic">
                            Our platform uses advanced Monte Carlo simulations and stochastic modeling to stress-test trading strategies against specific proprietary firm rules. We analyze billions of data points to model the &quot;Ruin Zone&quot; with extreme precision.
                        </p>
                    </div>
                </div>

                {/* Values / Principles */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            title: "Stochastic Rigor",
                            desc: "We don't deal in 'feelings' or 'projections.' Every metric on our dashboard is the result of thousands of synthetic path simulations.",
                            icon: BrainCircuit
                        },
                        {
                            title: "Risk First",
                            desc: "The professional desk begins with the stop loss, not the target. We mirror that philosophy in every tool we build.",
                            icon: ShieldAlert
                        },
                        {
                            title: "Sigma Standard",
                            desc: "Representing the summation of all variables, our Sigma-tier analytics account for slippage, commission, and dealer execution lag.",
                            icon: () => <span className="text-xl font-bold">Σ</span>
                        }
                    ].map((item, idx) => (
                        <div key={idx} className="p-8 rounded-2xl bg-slate-900/40 border border-white/5 group hover:border-blue-500/30 transition-all duration-500">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                                <item.icon className="w-5 h-5" />
                            </div>
                            <h4 className="text-lg font-bold text-white mb-3 font-outfit">{item.title}</h4>
                            <p className="text-sm text-slate-500 leading-relaxed font-serif">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="pt-20 text-center">
                    <div className="inline-block p-[1px] rounded-2xl bg-gradient-to-r from-transparent via-blue-500/50 to-transparent">
                        <div className="bg-slate-950 rounded-2xl px-12 py-8 space-y-6">
                            <h3 className="text-2xl font-bold text-white font-outfit">Ready to Stress Test?</h3>
                            <a href="/" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-bold tracking-widest uppercase text-xs transition-colors group">
                                Open Quant Terminal
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
