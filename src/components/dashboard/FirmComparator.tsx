"use client";

import React, { useState, useEffect } from "react";
import { useFirms } from "@/services/firmService";
import { useRiskStore } from "@/store/riskStore";
import { MonteCarloSimulator, SimulationStats } from "@/lib/quant/engine";
import { Button } from "@/components/ui/button";
import { Scale, Loader2, ArrowRight } from "lucide-react";
import { FirmRules } from "@/types/supabase";

export function FirmComparator() {
    const { params, activeFirmName } = useRiskStore();
    const { data: firms } = useFirms();
    const [isOpen, setIsOpen] = useState(false);
    const [targetFirmId, setTargetFirmId] = useState<string>("");
    const [statsA, setStatsA] = useState<SimulationStats | null>(null);
    const [statsB, setStatsB] = useState<SimulationStats | null>(null);
    const [computing, setComputing] = useState(false);

    const activeFirm = firms?.find(f => f.name === activeFirmName);
    const targetFirm = firms?.find(f => f.id === targetFirmId);

    // Helper to run small sim
    const runSim = (rules: FirmRules) => {
        // Create fresh params
        const simParams = {
            ...params,
            rules: rules,
            iterations: 1000 // Fast comparison
        };
        const sim = new MonteCarloSimulator(simParams);
        return sim.runBatch();
    };

    useEffect(() => {
        if (isOpen && activeFirm && targetFirm) {
            setComputing(true);
            // Small timeout to allow UI to render modal first
            setTimeout(() => {
                const resA = runSim(activeFirm.rules);
                const resB = runSim(targetFirm.rules);
                setStatsA(resA);
                setStatsB(resB);
                setComputing(false);
            }, 100);
        }
    }, [isOpen, targetFirmId, activeFirm, params]);

    // Initial target selection default
    useEffect(() => {
        if (isOpen && !targetFirmId && firms && firms.length > 1) {
            const other = firms.find(f => f.name !== activeFirmName);
            if (other) setTargetFirmId(other.id);
        }
    }, [isOpen, firms, activeFirmName]);


    if (!firms) return null;

    return (
        <>
            <Button variant="outline" onClick={() => setIsOpen(true)} className="gap-2 border-slate-700 text-slate-300">
                <Scale className="w-4 h-4" />
                Compare Firms
            </Button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden">
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Scale className="w-5 h-5 text-indigo-500" />
                                Firm Arbitrage
                            </h2>
                            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                        </div>

                        <div className="p-6 space-y-8">
                            {/* Selectors */}
                            <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
                                <div className="p-3 rounded bg-slate-800/50 border border-slate-700 text-center">
                                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Current Strategy</div>
                                    <div className="font-bold text-lg text-white">{activeFirmName}</div>
                                </div>

                                <div className="flex flex-col items-center">
                                    <div className="text-xs text-slate-500 mb-1">VS</div>
                                    <ArrowRight className="w-4 h-4 text-slate-600" />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <select
                                        className="w-full bg-slate-800 border-slate-700 text-white rounded p-3 focus:ring-indigo-500 max-w-xs mx-auto text-center font-bold"
                                        value={targetFirmId}
                                        onChange={(e) => setTargetFirmId(e.target.value)}
                                    >
                                        {firms.filter(f => f.name !== activeFirmName).map(f => (
                                            <option key={f.id} value={f.id}>{f.name}</option>
                                        ))}
                                    </select>
                                    <div className="text-xs text-slate-500 uppercase tracking-wider text-center">Opponent</div>
                                </div>
                            </div>

                            {/* Results */}
                            {computing ? (
                                <div className="py-12 flex flex-col items-center gap-4">
                                    <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                                    <span className="text-slate-400">Running head-to-head Monte Carlo...</span>
                                </div>
                            ) : statsA && statsB && activeFirm && targetFirm ? (
                                <div className="space-y-6">
                                    {/* Metric 1: Success Probability */}
                                    <ComparisonRow
                                        label="Success Probability"
                                        valA={statsA.distribution.successProbability}
                                        valB={statsB.distribution.successProbability}
                                        format={(v: number) => `${v.toFixed(1)}%`}
                                        better="higher"
                                    />

                                    {/* Metric 2: Ruin Probability */}
                                    <ComparisonRow
                                        label="Ruin Probability"
                                        valA={statsA.distribution.ruinProbability}
                                        valB={statsB.distribution.ruinProbability}
                                        format={(v: number) => `${v.toFixed(1)}%`}
                                        better="lower"
                                    />

                                    {/* Metric 3: Profit Strength (Efficiency) */}
                                    {/* Efficiency = (Target / DD) * SuccessProb */}
                                    <ComparisonRow
                                        label="Risk Efficiency Score"
                                        valA={(activeFirm.rules.profitTarget / activeFirm.rules.drawdownLimit) * statsA.distribution.successProbability}
                                        valB={(targetFirm!.rules.profitTarget / targetFirm!.rules.drawdownLimit) * statsB.distribution.successProbability}
                                        format={(v: number) => v.toFixed(1)}
                                        better="higher"
                                        tooltip="Calculated as (Profit Target / Drawdown Limit) * Success Rate."
                                    />
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

interface ComparisonRowProps {
    label: string;
    valA: number;
    valB: number;
    format: (val: number) => string;
    better: "higher" | "lower";
    tooltip?: string;
}

function ComparisonRow({ label, valA, valB, format, better, tooltip }: ComparisonRowProps) {
    const isAWin = better === "higher" ? valA > valB : valA < valB;
    const isBWin = better === "higher" ? valB > valA : valB < valA;
    const maxVal = Math.max(valA, valB, 0.01);

    return (
        <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
                <span>{label}</span>
                {tooltip && <span className="opacity-50 text-[10px]">{tooltip}</span>}
            </div>
            <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
                {/* Bar A (Right aligned) */}
                <div className="flex items-center justify-end gap-2">
                    <span className={`font-mono text-sm ${isAWin ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
                        {format(valA)}
                    </span>
                    <div className="h-2 bg-slate-800 w-24 rounded-full overflow-hidden flex justify-end">
                        <div
                            className={`h-full ${isAWin ? 'bg-emerald-500' : 'bg-slate-600'}`}
                            style={{ width: `${Math.min(100, (valA / maxVal) * 100)}%` }}
                        />
                    </div>
                </div>

                {/* Divider */}
                <div className="w-px h-4 bg-slate-800"></div>

                {/* Bar B (Left aligned) */}
                <div className="flex items-center justify-start gap-2">
                    <div className="h-2 bg-slate-800 w-24 rounded-full overflow-hidden">
                        <div
                            className={`h-full ${isBWin ? 'bg-indigo-500' : 'bg-slate-600'}`}
                            style={{ width: `${Math.min(100, (valB / maxVal) * 100)}%` }}
                        />
                    </div>
                    <span className={`font-mono text-sm ${isBWin ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}>
                        {format(valB)}
                    </span>
                </div>
            </div>
        </div>
    );
}
