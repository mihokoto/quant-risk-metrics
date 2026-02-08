"use client";

import React from "react";
import { useRiskStore } from "@/store/riskStore";
import { useSimulation } from "@/hooks/useSimulation";
import { SimulationChart } from "@/components/dashboard/SimulationChart";
import { MetricsSummary } from "@/components/dashboard/MetricsSummary";
import { RiskHeatmap } from "@/components/dashboard/RiskHeatmap";
import { RiskAuditReport } from "@/components/dashboard/RiskAuditReport";
import { FirmComparator } from "@/components/dashboard/FirmComparator";
import { OutcomeDistribution } from "@/components/dashboard/OutcomeDistribution"; // New
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Zap, RefreshCw, BarChart3 } from "lucide-react";

export default function Dashboard() {
  // 1. Get State from Store
  const { params, activeFirmName } = useRiskStore();
  const { rules } = params;

  // 2. Run Simulation via Worker Hook
  const { result, isCalculating, error } = useSimulation({ params });

  return (
    <div className="space-y-6 pb-20 animate-in-fade">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="animate-in-slide-up" style={{ animationDelay: '0.1s' }}>
            <h1 className="text-4xl font-outfit font-bold tracking-tight text-white flex items-center gap-3 text-glow">
              {activeFirmName} Analysis
              {isCalculating && <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />}
            </h1>
            <p className="text-slate-400 mt-1">
              Institutional Risk Modeling for Prop Firm Traders.
            </p>
          </div>

          <div className="flex items-center gap-4 animate-in-slide-up" style={{ animationDelay: '0.2s' }}>
            <FirmComparator />

            <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full glass border-white/5">
              <Zap className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500/20" />
              <span className="text-xs font-mono font-bold text-slate-300 tracking-wider">
                {params.iterations} ITERATIONS
              </span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
          Simulation Error: {error}
        </div>
      )}

      {/* 3. High-Density Metrics Display */}
      <MetricsSummary result={result} isCalculating={isCalculating} />

      {/* 4. Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monte Carlo Chart */}
        <Card className="lg:col-span-2 glass glass-hover animate-in-slide-up" style={{ animationDelay: '0.3s' }}>
          <CardHeader>
            <CardTitle className="font-outfit text-xl">Possible Growth Paths</CardTitle>
            <CardDescription>
              <span className="text-emerald-500">Green</span> = Target Hit. <span className="text-red-500">Red</span> = Drawdown Breach.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[450px] pt-4">
            {result ? (
              <SimulationChart paths={result.paths} initialBalance={params.initialBalance} />
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 animate-pulse">
                Initializing Prop Firm Engine...
              </div>
            )}
          </CardContent>
        </Card>

        {/* Parametric Analysis & Outcome Distribution */}
        <div className="space-y-6">
          <Card className="glass glass-hover animate-in-slide-up" style={{ animationDelay: '0.4s' }}>
            <CardHeader>
              <CardTitle className="font-outfit text-xl">Strategy Breakdown</CardTitle>
              <CardDescription>Outcome distribution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {result && (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Median Outcome</span>
                      <span className="font-mono text-white text-glow">${result.distribution.medianFinalBalance.toLocaleString()}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                        style={{ width: `${Math.min(((result.distribution.medianFinalBalance / params.initialBalance) * 50), 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Profit Factor (Theor.)</span>
                      <span className="font-mono text-emerald-400 font-bold">{result.metrics.profitFactor.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Average Trades Until Failure</span>
                      <span className={result.metrics.medianRuinStep > 0 ? "font-mono text-rose-400 font-bold" : "font-mono text-emerald-400 font-bold"}>
                        {result.metrics.medianRuinStep > 0 ? result.metrics.medianRuinStep : "Safe"}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-3">Firm Constraints</h4>
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                      <dt className="text-slate-400">Account Size</dt>
                      <dd className="font-mono text-right text-slate-200">${params.initialBalance.toLocaleString()}</dd>

                      <dt className="text-slate-400">Drawdown Limit</dt>
                      <dd className="font-mono text-right text-rose-400">${params.rules.drawdownLimit.toLocaleString()}</dd>

                      {(params.rules.dailyLossLimit ?? 0) > 0 && (
                        <>
                          <dt className="text-slate-400">Daily Limit</dt>
                          <dd className="font-mono text-right text-rose-400">${params.rules.dailyLossLimit.toLocaleString()}</dd>
                        </>
                      )}

                      <dt className="text-slate-400">Profit Target</dt>
                      <dd className="font-mono text-right text-emerald-400">${params.rules.profitTarget.toLocaleString()}</dd>
                    </dl>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <OutcomeDistribution stats={result} initialBalance={params.initialBalance} />
        </div>

        {/* NEW: Risk Heatmap (Full Width Row) */}
        <div className="lg:col-span-3 glass-hover animate-in-slide-up" style={{ animationDelay: '0.5s' }}>
          <RiskHeatmap params={params} />
        </div>
      </div>

      {/* NEW: Comprehensive Institutional Audit */}
      <RiskAuditReport stats={result} params={params} />
    </div>
  );
}
