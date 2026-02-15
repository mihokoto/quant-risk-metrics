"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { MonteCarloSimulator, SimulationParams } from "@/lib/quant/engine";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, AlertTriangle, RefreshCw, Lock, Crown } from "lucide-react";
import { useRiskStore } from "@/store/riskStore";
import { Tooltip } from "@/components/ui/custom-tooltip";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type HeatmapCell = {
    winRate: number;
    riskPct: number;
    ruinProb: number;
};

// Fixed Grid Definition
const GRID_WIN_RATES = [0.30, 0.35, 0.40, 0.45, 0.50, 0.55, 0.60, 0.65, 0.70, 0.75];
const GRID_RISK_LIST = [0.0025, 0.005, 0.0075, 0.01, 0.0125, 0.015, 0.0175, 0.02, 0.0225, 0.025];

interface RiskHeatmapProps {
    params: SimulationParams;
}

export function RiskHeatmap({ params }: RiskHeatmapProps) {
    const [data, setData] = useState<HeatmapCell[]>([]);

    const [loading, setLoading] = useState(false);
    const [calcError, setCalcError] = useState<string | null>(null);

    const { setParams } = useRiskStore();

    // Fast Map for Rendering
    const dataMap = useMemo(() => {
        const map = new Map<string, number>();
        data.forEach(cell => {
            const key = `${cell.winRate.toFixed(4)}-${cell.riskPct.toFixed(4)}`;
            map.set(key, cell.ruinProb);
        });
        return map;
    }, [data]);

    const calculateHeatmap = useCallback(async () => {
        if (!params || !params.rules) return;

        setLoading(true);
        setCalcError(null);
        setData([]); // Visual reset

        console.log("Heatmap: Starting calculation sequence...");

        const CELL_ITERATIONS = 200;

        try {
            for (const w of GRID_WIN_RATES) {
                const row: HeatmapCell[] = [];
                // Yield to main thread
                await new Promise(resolve => setTimeout(resolve, 0));

                for (const r of GRID_RISK_LIST) {
                    try {
                        const cellParams: SimulationParams = {
                            ...params,
                            winRate: w,
                            riskPerTrade: r,
                            iterations: CELL_ITERATIONS,
                            enableDefensive: false,
                            winStdDev: 0
                        };
                        const sim = new MonteCarloSimulator(cellParams);
                        const stats = sim.runBatch();
                        row.push({ winRate: w, riskPct: r, ruinProb: stats.distribution.ruinProbability });
                    } catch (e) {
                        console.error("Cell failure:", e);
                    }
                }
                setData(prev => [...prev, ...row]);
            }
        } catch (err: any) {
            setCalcError(err.message || "Calculation failed");
            console.error("Heatmap Master Error:", err);
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => {
        const timer = setTimeout(() => {
            calculateHeatmap();
        }, 300);
        return () => clearTimeout(timer);
    }, [
        params.rules?.drawdownLimit,
        params.rules?.profitTarget,
        params.initialBalance,
        calculateHeatmap
    ]);

    const getCellColor = (ruinProb: number | undefined) => {
        if (ruinProb === undefined) return "bg-slate-800/40";
        if (ruinProb < 5) return "bg-emerald-600 hover:bg-emerald-500 hover:scale-105 transition-transform";
        if (ruinProb < 20) return "bg-amber-500 hover:bg-amber-400 hover:scale-105 transition-transform";
        return "bg-rose-900 hover:bg-rose-800 hover:scale-105 transition-transform";
    };

    return (
        <Card className="glass animate-in-slide-up relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <CardTitle className="text-xl font-outfit font-bold tracking-tight text-white flex items-center gap-2">
                        Risk Heatmap (The Death Zone)
                        <Tooltip content="See where your strategy breaks based on your risk levels.">
                            <AlertTriangle className="w-4 h-4 text-rose-500 cursor-help" />
                        </Tooltip>
                    </CardTitle>
                    <CardDescription className="font-sans">
                        Institutional Risk Matrix | <span className="text-emerald-500 font-mono font-bold">{data.length} / 100 Cells</span>
                    </CardDescription>
                </div>
                <button
                    onClick={() => calculateHeatmap()}
                    disabled={loading}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
                    title="Force Recalculate"
                >
                    <RefreshCw className={`w-4 h-4 text-slate-400 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </CardHeader>
            <CardContent className="relative">
                {/* LOCKED HEATMAP PROMPT */}


                {calcError && (
                    <div className="mb-4 p-2 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded">
                        Error: {calcError}
                    </div>
                )}

                <div className="relative overflow-x-auto">
                    <div className="min-w-[500px] grid grid-cols-[60px_repeat(10,1fr)] gap-1">

                        {/* Legend Spacer */}
                        <div className="h-8"></div>
                        {GRID_RISK_LIST.map(r => (
                            <div key={r} className="h-8 flex items-end justify-center text-[10px] text-slate-500 font-mono">
                                {(r * 100).toFixed(2)}%
                            </div>
                        ))}

                        {/* Rows */}
                        {GRID_WIN_RATES.map(w => (
                            <React.Fragment key={w}>
                                <div className="flex items-center justify-end pr-2 text-[10px] text-slate-500 font-mono">
                                    {(w * 100).toFixed(0)}%
                                </div>
                                {GRID_RISK_LIST.map(r => {
                                    const key = `${w.toFixed(4)}-${r.toFixed(4)}`;
                                    const ruinProb = dataMap.get(key);
                                    const isActive = Math.abs(params.winRate - w) < 0.01 && Math.abs(params.riskPerTrade - r) < 0.001;

                                    return (
                                        <div
                                            key={key}
                                            onClick={() => setParams({ winRate: w, riskPerTrade: r })}
                                            className={`
                                                h-8 rounded-[3px] cursor-pointer relative transition-all duration-300
                                                ${getCellColor(ruinProb)}
                                                ${isActive ? 'ring-2 ring-white z-10 scale-105 shadow-[0_0_15px_rgba(255,255,255,0.4)]' : 'hover:scale-110 hover:z-20 hover:shadow-lg'}
                                                ${ruinProb === undefined ? 'animate-pulse' : ''}
                                            `}
                                        >
                                            {isActive && <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                            </div>}
                                        </div>
                                    );
                                })}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Axis Labels */}
                    <div className="absolute -left-2 top-0 bottom-0 flex items-center">
                        <div className="-rotate-90 text-[9px] font-bold text-slate-600 uppercase tracking-tighter w-4">WinRate</div>
                    </div>
                    <div className="text-center text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-2">Risk Per Trade</div>
                </div>

                {/* Status Indicator */}
                <div className="mt-4 flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-widest border-t border-slate-800/50 pt-2">
                    <div className="flex gap-4">
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-emerald-600 rounded-sm" /> Safe</div>
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-amber-500 rounded-sm" /> Warning</div>
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-rose-900 rounded-sm" /> Dead</div>
                    </div>
                    <div>{loading ? 'Calculated via Main Thread' : 'Complete'}</div>
                </div>
            </CardContent>
        </Card>
    );
}
