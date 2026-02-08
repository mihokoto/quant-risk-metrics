"use client";

import React, { useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    Cell
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SimulationStats } from "@/lib/quant/engine";

interface OutcomeDistributionProps {
    stats: SimulationStats | null;
    initialBalance: number;
}

export function OutcomeDistribution({ stats, initialBalance }: OutcomeDistributionProps) {
    const chartData = useMemo(() => {
        if (!stats || !stats.paths) return [];

        // 1. Get Final Balances
        const finalBalances = stats.paths.map(p => p.equityCurve[p.equityCurve.length - 1]);

        // 2. Define Bins
        // We calculate PnL relative to initial balance
        const pnl = finalBalances.map(b => b - initialBalance);
        const minPnL = Math.min(...pnl);
        const maxPnL = Math.max(...pnl);

        const binCount = 15;
        const binWidth = (maxPnL - minPnL) / binCount;

        const bins = Array.from({ length: binCount }, (_, i) => {
            const rangeStart = minPnL + i * binWidth;
            const rangeEnd = rangeStart + binWidth;
            return {
                rangeStart,
                rangeEnd,
                count: 0,
                label: `${rangeStart > 0 ? "+" : ""}${(rangeStart / 1000).toFixed(1)}k`
            };
        });

        // 3. Fill Bins
        pnl.forEach(val => {
            const binIdx = Math.min(Math.floor((val - minPnL) / binWidth), binCount - 1);
            if (binIdx >= 0) bins[binIdx].count++;
        });

        return bins;
    }, [stats, initialBalance]);

    if (!stats) return null;

    return (
        <Card className="glass animate-in-slide-up">
            <CardHeader>
                <CardTitle className="text-lg font-outfit">Outcome Distribution</CardTitle>
                <CardDescription>
                    Probability density of final equity (Expectancy Visualization)
                </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis
                            dataKey="label"
                            stroke="#64748b"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#64748b"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                        />
                        <RechartsTooltip
                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                            itemStyle={{ color: '#f8fafc' }}
                            labelStyle={{ color: '#64748b', fontSize: '10px' }}
                            labelFormatter={(value, name) => `PnL Bucket: ${value}`}
                        />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.rangeStart >= 0 ? "#10b981" : "#ef4444"}
                                    fillOpacity={0.6}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
