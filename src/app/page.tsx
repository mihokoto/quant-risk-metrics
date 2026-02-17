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
import { PartnerBanner } from "@/components/ui/PartnerBanner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Zap, RefreshCw, BarChart3, ArrowRight } from "lucide-react";
import Link from "next/link";

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

        <div className="lg:col-span-3 glass-hover animate-in-slide-up" style={{ animationDelay: '0.5s' }}>
          <RiskHeatmap params={params} />
        </div>

        {/* Global Partner Display */}
        <div className="lg:col-span-3 flex justify-center py-8 animate-in-fade" style={{ animationDelay: '0.6s' }}>
          <PartnerBanner firmKey="ftmo" type="leaderboard" className="max-w-[728px] shadow-[0_0_50px_rgba(59,130,246,0.1)] border-white/10" />
        </div>
      </div>

      {/* NEW: Comprehensive Institutional Audit */}
      <RiskAuditReport stats={result} params={params} />

      {/* NEW: Recent Research (Bot-Friendly Internal Linking) */}
      <section className="mt-20 pt-12 border-t border-white/5 animate-in-slide-up" style={{ animationDelay: '0.6s' }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-outfit font-bold text-white tracking-tight">Recent Quantitative Research</h3>
            <p className="text-sm text-slate-500 mt-1">Foundational insights on prop firm survival and risk modeling.</p>
          </div>
          <Link href="/blog" className="group/btn inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400 hover:bg-blue-500 hover:text-white transition-all duration-300 uppercase tracking-widest">
            View Editorial <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Apex Trailing Drawdown Guide",
              slug: "optimizing-apex-drawdown",
              excerpt: "How to mathematically survive the Apex Trailing Drawdown using high-fidelity simulations.",
              category: "Firm Analysis"
            },
            {
              title: "The FTMO Masterclass",
              slug: "ftmo-static-drawdown-strategy",
              excerpt: "Leveraging the Static Drawdown barrier for institutional-grade account longevity.",
              category: "Strategy"
            },
            {
              title: "Mastering Topstep Daily Limits",
              slug: "mastering-topstep-daily-limit",
              excerpt: "Quantitative boundary analysis for Topstep consistency and drawdown preservation.",
              category: "Risk Control"
            }
          ].map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group p-6 rounded-2xl bg-slate-900/40 border border-white/5 hover:border-blue-500/50 hover:bg-slate-900 transition-all duration-300"
            >
              <div className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-widest mb-3 opacity-70">
                {post.category}
              </div>
              <h4 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors mb-2 font-outfit">
                {post.title}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed font-serif group-hover:text-slate-300 transition-colors">
                {post.excerpt}
              </p>
              <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all">
                Read Analysis <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
