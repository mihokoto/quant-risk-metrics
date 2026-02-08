"use client";

import React, { useState, useEffect } from "react";
import { MonteCarloSimulator, SimulationParams } from "@/lib/quant/engine";
import { FIRM_PRESETS, PRESET_METADATA } from "@/lib/constants/presets";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

// Inline Icons to avoid MDX/Lucide import conflicts
const IconLoader = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
);
const IconPlay = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" /></svg>
);
const IconAlert = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" x2="12" y1="9" y2="13" /><line x1="12" x2="12.01" y1="17" y2="17" /></svg>
);
const IconCheck = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>
);


interface RiskSimulatorEmbedProps {
    preset: string; // e.g. "apex_50k"
    defaultWinRate?: number;
    defaultRisk?: number;
}

export function RiskSimulatorEmbed({
    preset,
    defaultWinRate = 0.40,
    defaultRisk = 0.01
}: RiskSimulatorEmbedProps) {

    const rules = FIRM_PRESETS[preset] || FIRM_PRESETS["apex_50k"];
    const meta = PRESET_METADATA[preset] || PRESET_METADATA["apex_50k"];

    // Local State
    const [winRate, setWinRate] = useState(defaultWinRate);
    const [riskPerTrade, setRiskPerTrade] = useState(defaultRisk);
    const [stats, setStats] = useState<{ ruin: number, success: number } | null>(null);
    const [loading, setLoading] = useState(false);

    // Run Sim
    const runSim = async () => {
        setLoading(true);

        // Allow UI update
        await new Promise(r => setTimeout(r, 100));

        const params: SimulationParams = {
            initialBalance: meta.balance,
            winRate: winRate,
            rewardToRisk: 2.0, // Fixed for simplicity in blog
            riskPerTrade: riskPerTrade,
            numberOfTrades: 100,
            iterations: 1000,
            rules: rules,
            winStdDev: 0,
            enableDefensive: false
        };

        const engine = new MonteCarloSimulator(params);
        const res = engine.runBatch();

        setStats({
            ruin: res.distribution.ruinProbability,
            success: res.distribution.successProbability
        });
        setLoading(false);
    };

    // Initial Run
    useEffect(() => {
        runSim();
    }, []);

    return (
        <Card className="my-8 border-indigo-500/30 bg-slate-900 shadow-xl overflow-hidden not-prose">
            <CardHeader className="bg-slate-900 border-b border-slate-800 pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-white text-lg flex items-center gap-2">
                            {meta.title} Simulator
                            <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                Interactive
                            </span>
                        </CardTitle>
                        <CardDescription>
                            Capital: ${meta.balance.toLocaleString()} • Profit Target: ${rules.profitTarget}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
                {/* Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Win Rate</span>
                            <span className="text-white font-mono">{(winRate * 100).toFixed(0)}%</span>
                        </div>
                        <Slider
                            value={[winRate * 100]}
                            min={20} max={80} step={1}
                            onValueChange={(v) => setWinRate(v[0] / 100)}
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Risk Per Trade</span>
                            <span className="text-white font-mono">{(riskPerTrade * 100).toFixed(1)}%</span>
                        </div>
                        <Slider
                            value={[riskPerTrade * 100]}
                            min={0.25} max={3.0} step={0.25}
                            onValueChange={(v) => setRiskPerTrade(v[0] / 100)}
                        />
                    </div>
                </div>

                {/* Action */}
                <Button
                    onClick={runSim}
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                    {loading ? <IconLoader className="w-4 h-4 animate-spin mr-2" /> : <IconPlay className="w-4 h-4 mr-2" />}
                    {loading ? "Simulating..." : "Run Simulation"}
                </Button>

                {/* Results */}
                {stats && (
                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="p-4 rounded bg-slate-800 border border-slate-700 flex flex-col items-center">
                            <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
                                <IconAlert className={`w-4 h-4 ${stats.ruin > 5 ? 'text-rose-500' : 'text-emerald-500'}`} />
                                Ruin Probability
                            </div>
                            <span className={`text-2xl font-mono font-bold ${stats.ruin > 5 ? 'text-rose-500' : 'text-emerald-400'}`}>
                                {stats.ruin.toFixed(1)}%
                            </span>
                        </div>
                        <div className="p-4 rounded bg-slate-800 border border-slate-700 flex flex-col items-center">
                            <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
                                <IconCheck className="w-4 h-4 text-emerald-500" />
                                Success Rate
                            </div>
                            <span className="text-2xl font-mono font-bold text-emerald-400">
                                {stats.success.toFixed(1)}%
                            </span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
