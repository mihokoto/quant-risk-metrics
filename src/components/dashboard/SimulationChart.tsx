"use client";

import React, { useMemo } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from "recharts";
import { SimulationPath } from "@/lib/quant/engine";

interface SimulationChartProps {
    paths: SimulationPath[];
    initialBalance: number;
}

export function SimulationChart({ paths, initialBalance }: SimulationChartProps) {

    const chartData = useMemo(() => {
        if (!paths.length) return [];

        // Find max length
        const maxLength = Math.max(...paths.map(p => p.equityCurve.length));

        const data = [];
        for (let i = 0; i < maxLength; i++) {
            const point: any = { step: i };
            paths.forEach((path) => {
                if (i < path.equityCurve.length) {
                    point[`path_${path.id}`] = path.equityCurve[i];
                }
            });
            data.push(point);
        }
        return data;
    }, [paths]);

    if (!paths.length) return null;

    return (
        <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis
                        dataKey="step"
                        stroke="#64748b"
                        fontSize={12}
                        tickFormatter={(val) => val % 20 === 0 ? val : ''}
                    />
                    <YAxis
                        stroke="#64748b"
                        fontSize={12}
                        domain={['auto', 'auto']}
                        tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }}
                        itemStyle={{ fontSize: '12px' }}
                        labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                        formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Equity']}
                        labelFormatter={(label) => `Trade #${label}`}
                    />
                    <ReferenceLine y={initialBalance} stroke="#64748b" strokeDasharray="3 3" />

                    {paths.map((path) => (
                        <Line
                            key={path.id}
                            type="monotone"
                            dataKey={`path_${path.id}`}
                            stroke={
                                path.isSuccess ? "#22c55e" : // Green for target hit
                                    path.isRuined ? "#ef4444" :   // Red for ruin
                                        "#94a3b8"                     // Gray for survivor
                            }
                            strokeOpacity={
                                path.isSuccess ? 0.6 :
                                    path.isRuined ? 0.4 :
                                        0.2
                            }
                            strokeWidth={path.isSuccess ? 2 : 1.5}
                            dot={false}
                            activeDot={false}
                            isAnimationActive={false} // Performance optimization
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
