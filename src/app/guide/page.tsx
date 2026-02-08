import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import {
    ChevronRight,
    Target,
    Building2,
    Activity,
    Zap,
    TrendingUp,
    ShieldCheck,
    MonitorCheck,
    ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
    title: "Mastering Prop Firm Risk: The Step-by-Step Guide to QuantRiskMetrics",
    description: "Learn how to use institutional-grade Monte Carlo simulations to verify your trading strategy's survival across major prop firms.",
};

export default function GuidePage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "Mastering Prop Firm Risk with QuantRiskMetrics",
        "description": "A 5-step institutional guide to verifying your trading strategy's survival.",
        "step": [
            {
                "@type": "HowToStep",
                "name": "Choose Your Prop Firm",
                "text": "Select your firm (Apex, FTMO, Topstep) to load specific drawdown logic."
            },
            {
                "@type": "HowToStep",
                "name": "Define Your Stats",
                "text": "Input your historical Win Rate and Reward-to-Risk ratio."
            },
            {
                "@type": "HowToStep",
                "name": "Set Your Risk",
                "text": "Adjust your Risk Per Trade to optimize for account survival."
            },
            {
                "@type": "HowToStep",
                "name": "Interpret the Heatmap",
                "text": "Identify the 'Death Zone' and move your parameters into the safe Emerald Zone."
            },
            {
                "@type": "HowToStep",
                "name": "Export & Execute",
                "text": "Download your Account Health Report and follow the parameters in your live terminal."
            }
        ],
        "totalTime": "PT5M",
        "supply": [
            {
                "@type": "HowToSupply",
                "name": "Trading Strategy Stats"
            }
        ],
        "tool": [
            {
                "@type": "HowToTool",
                "name": "QuantRiskMetrics Simulation Engine"
            }
        ]
    };

    const softwareSchema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "QuantRiskMetrics",
        "operatingSystem": "Web",
        "applicationCategory": "FinanceApplication",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 py-12 md:py-20 px-6">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
            />
            <div className="max-w-3xl mx-auto space-y-16">

                {/* Header Section */}
                <header className="text-center space-y-6 animate-in-fade">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                        <MonitorCheck className="w-4 h-4 text-blue-500" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400">Institutional Guide</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight font-outfit">
                        Quant<span className="text-blue-500">Risk</span> Academy
                    </h1>
                    <p className="text-xl text-slate-400 font-serif italic max-w-2xl mx-auto leading-relaxed">
                        "QuantRiskMetrics is designed to show you the mathematical truth behind your strategy. Follow these steps to verify your survival."
                    </p>
                </header>

                {/* Steps Section */}
                <div className="space-y-12">

                    {/* Step 1 */}
                    <section className="relative group animate-in-slide-up" style={{ animationDelay: '0.1s' }}>
                        <div className="flex gap-6">
                            <StepBadge number={1} />
                            <div className="space-y-4 pt-1">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <Building2 className="w-6 h-6 text-blue-500" />
                                    Choose Your Prop Firm
                                </h2>
                                <div className="text-slate-400 leading-relaxed space-y-4">
                                    <p>
                                        Every prop firm uses a different mathematical filter to find winners. Whether you trade with
                                        <span className="text-white font-semibold"> Apex</span>,
                                        <span className="text-white font-semibold"> FTMO</span>, or
                                        <span className="text-white font-semibold"> Topstep</span>, the rules of the game change.
                                    </p>
                                    <p className="p-4 rounded-xl bg-slate-900/50 border border-white/5 text-sm italic">
                                        <span className="text-blue-400 font-bold not-italic">Note:</span> Firms like Apex often use "Trailing Drawdown" which is significantly more difficult to survive than the "Static Drawdown" models used by others. Our engine accounts for these specific logic paths automatically.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Step 2 */}
                    <section className="relative group animate-in-slide-up" style={{ animationDelay: '0.2s' }}>
                        <div className="flex gap-6">
                            <StepBadge number={2} />
                            <div className="space-y-4 pt-1">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <Activity className="w-6 h-6 text-emerald-500" />
                                    Define Your Stats
                                </h2>
                                <p className="text-slate-400 leading-relaxed">
                                    Input your <span className="text-white font-semibold">Win Rate</span> and
                                    <span className="text-white font-semibold"> Reward-to-Risk (RR)</span> ratio. These define your
                                    "Edge." The simulator will run thousands of random sequences of these trades to see how
                                    volatile your equity will actually be.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Step 3 */}
                    <section className="relative group animate-in-slide-up" style={{ animationDelay: '0.3s' }}>
                        <div className="flex gap-6">
                            <StepBadge number={3} />
                            <div className="space-y-4 pt-1">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <ShieldCheck className="w-6 h-6 text-amber-500" />
                                    Set Your Risk
                                </h2>
                                <p className="text-slate-400 leading-relaxed">
                                    This is the most critical step. <span className="text-white font-semibold italic">Risk Per Trade</span> is the only knob you can turn to stop an account from failing. If your risk is too high, even a 60% win-rate strategy will fail due to a simple string of losses.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Step 4 */}
                    <section className="relative group animate-in-slide-up" style={{ animationDelay: '0.4s' }}>
                        <div className="flex gap-6">
                            <StepBadge number={4} />
                            <div className="space-y-4 pt-1">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <TrendingUp className="w-6 h-6 text-rose-500" />
                                    Interpret the Heatmap
                                </h2>
                                <p className="text-slate-400 leading-relaxed">
                                    Look at the <span className="text-white font-semibold uppercase tracking-wider">Death Zone</span>.
                                    The Red zones on the heatmap represent the settings where your strategy is mathematically guaranteed
                                    to fail over time. Your goal is to move your parameters into the <span className="text-emerald-500 font-bold uppercase">Emerald Zone</span>.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Step 5 */}
                    <section className="relative group animate-in-slide-up" style={{ animationDelay: '0.5s' }}>
                        <div className="flex gap-6">
                            <StepBadge number={5} />
                            <div className="space-y-4 pt-1">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <Zap className="w-6 h-6 text-yellow-500" />
                                    Export & Execute
                                </h2>
                                <p className="text-slate-400 leading-relaxed">
                                    Once your Account Health Report shows a "PASS" grade, you can export your simulation result
                                    as a PDF and strictly follow those risk parameters in your live terminal.
                                </p>
                            </div>
                        </div>
                    </section>

                </div>

                {/* Footer CTA */}
                <div className="pt-12 border-t border-white/5 animate-in-slide-up" style={{ animationDelay: '0.6s' }}>
                    <Card className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border-white/10 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Activity className="w-32 h-32 text-blue-500" />
                        </div>
                        <CardContent className="p-8 text-center space-y-6 relative z-10">
                            <h3 className="text-2xl font-bold text-white font-outfit uppercase tracking-tight">Ready to verify your edge?</h3>
                            <p className="text-slate-400 max-w-md mx-auto">
                                Launch the simulation engine now and see if your current risk management survives the prop firm test.
                            </p>
                            <Link href="/">
                                <Button className="h-14 px-8 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase italic tracking-tighter text-lg group">
                                    Launch Simulation Engine
                                    <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}

function StepBadge({ number }: { number: number }) {
    return (
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center font-black text-sm text-blue-500 shadow-glow transition-all group-hover:scale-110 group-hover:border-blue-500/50">
            {number}
        </div>
    );
}
