import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimulationStats } from "@/lib/quant/engine";
import { AlertOctagon, TrendingUp, ShieldCheck, Target, Info, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/custom-tooltip";

interface MetricsSummaryProps {
    result: SimulationStats | null;
    isCalculating: boolean;
}

export function MetricsSummary({ result, isCalculating }: MetricsSummaryProps) {
    if (!result) return null;

    const { distribution, metrics } = result;

    // Ruin Formatting
    const isSafe = distribution.ruinProbability < 5;
    const isRisky = distribution.ruinProbability > 50;

    const ruinColor = isSafe ? "text-emerald-500" : isRisky ? "text-rose-500" : "text-amber-500";

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 font-outfit">
                {/* Ruin Probability */}
                <Card className="bg-slate-900/50 border-white/5 backdrop-blur-sm shadow-xl hover:border-blue-500/30 transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 text-slate-400">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest font-mono">Account Failure Risk</span>
                            <Tooltip content="Probability of hitting the Drawdown Limit before the Profit Target." side="top">
                                <Info className="w-3 h-3 text-slate-600 cursor-help" />
                            </Tooltip>
                        </div>
                        <AlertOctagon className={cn("w-4 h-4", ruinColor)} />
                    </CardHeader>
                    <CardContent>
                        <div className={cn("text-3xl font-bold font-mono tracking-tight", ruinColor)}>
                            {distribution.ruinProbability.toFixed(1)}%
                        </div>
                        <div className="w-full h-1 bg-slate-800 rounded-full mt-3 overflow-hidden">
                            <div
                                className={cn("h-full transition-all duration-1000 bg-current", ruinColor)}
                                style={{ width: `${distribution.ruinProbability}%` }}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Success Probability */}
                <Card className="bg-slate-900/50 border-white/5 backdrop-blur-sm shadow-xl hover:border-emerald-500/30 transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 text-slate-400">
                        <span className="text-[10px] font-bold uppercase tracking-widest font-mono">Success Rate</span>
                        <Target className="w-4 h-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold font-mono text-emerald-500 tracking-tight">
                            {distribution.successProbability.toFixed(1)}%
                        </div>
                        <div className="w-full h-1 bg-slate-800 rounded-full mt-3 overflow-hidden">
                            <div
                                className="h-full bg-emerald-500 transition-all duration-1000"
                                style={{ width: `${distribution.successProbability}%` }}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Expectancy */}
                <Card className="bg-slate-900/50 border-white/5 backdrop-blur-sm shadow-xl hover:border-blue-500/30 transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 text-slate-400">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest font-mono">Average Profit (per trade)</span>
                        </div>
                        <TrendingUp className="w-4 h-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold font-mono text-blue-500 tracking-tight">
                            {metrics.expectancy.toFixed(2)}R
                        </div>
                        <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-widest">
                            Net EDGE per Trade
                        </p>
                    </CardContent>
                </Card>

                {/* 5-Day VaR (95%) */}
                <Card className="bg-slate-900/50 border-white/5 backdrop-blur-sm shadow-xl hover:border-amber-500/30 transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 text-slate-400">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest font-mono">VaR 95% (Risk)</span>
                        </div>
                        <Activity className="w-4 h-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold font-mono text-amber-500 tracking-tight">
                            ${Math.round(metrics.var95).toLocaleString()}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-widest">
                            Probable Loss Floor
                        </p>
                    </CardContent>
                </Card>

                {/* Recommended Risk */}
                <Card className="bg-slate-900/50 border-white/5 backdrop-blur-sm shadow-xl hover:border-indigo-500/30 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                        <ShieldCheck className="w-12 h-12 text-indigo-500" />
                    </div>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 text-slate-400">
                        <span className="text-[10px] font-bold uppercase tracking-widest font-mono">Optimal Risk</span>
                        <ShieldCheck className="w-4 h-4 text-indigo-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold font-mono text-indigo-500 tracking-tight">
                            {(metrics.propSafeKelly * 100).toFixed(2)}%
                        </div>
                        <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-widest">
                            Survial Adjusted
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Elite Optimization Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-outfit">
                {/* Consistency Score */}
                <Card className="bg-slate-950/50 border-white/5 border-dashed hover:border-blue-500/30 transition-all duration-300">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Consistency Score</span>
                            <div className={cn(
                                "w-2 h-2 rounded-full",
                                result.violations.consistencyBreach ? "bg-rose-500 animate-pulse" : "bg-emerald-500 shadow-glow-emerald"
                            )} />
                        </div>
                        <div className="text-4xl font-bold text-white font-mono">
                            {metrics.consistencyScore.toFixed(1)}
                        </div>
                        <p className="text-[10px] text-slate-600 mt-4 leading-relaxed uppercase tracking-widest">
                            {result.violations.consistencyBreach
                                ? "Consistency Breach Detected"
                                : "Institutional Adherence"}
                        </p>
                    </CardContent>
                </Card>

                {/* Sharpe Ratio */}
                <Card className="bg-slate-950/50 border-white/5 border-dashed hover:border-blue-500/30 transition-all duration-300">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Sharpe Ratio</span>
                            <Activity className="w-3 h-3 text-blue-500" />
                        </div>
                        <div className="text-4xl font-bold text-blue-400 font-mono">
                            {metrics.sharpeRatio.toFixed(2)}
                        </div>
                        <p className="text-[10px] text-slate-600 mt-4 leading-relaxed uppercase tracking-widest">
                            Risk-Adjusted Efficiency
                        </p>
                    </CardContent>
                </Card>

                {/* Ulcer Index */}
                <Card className="bg-slate-950/50 border-white/5 border-dashed hover:border-blue-500/30 transition-all duration-300">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Ulcer Index</span>
                            <ShieldCheck className="w-3 h-3 text-emerald-500" />
                        </div>
                        <div className="text-4xl font-bold text-emerald-500 font-mono">
                            {metrics.ulcerIndex.toFixed(2)}
                        </div>
                        <p className="text-[10px] text-slate-600 mt-4 leading-relaxed uppercase tracking-widest">
                            Drawdown Stress Impact
                        </p>
                    </CardContent>
                </Card>

                {/* Compliance Status */}
                <Card className={cn(
                    "border-none shadow-2xl transition-all duration-500",
                    (result.violations.consistencyBreach || result.violations.minDaysBreach)
                        ? "bg-rose-500/10"
                        : "bg-emerald-500/10"
                )}>
                    <CardContent className="pt-6 h-full flex flex-col justify-center items-center text-center gap-2">
                        <div className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center mb-2 shadow-lg",
                            (result.violations.consistencyBreach || result.violations.minDaysBreach)
                                ? "bg-rose-600 text-white"
                                : "bg-emerald-600 text-white"
                        )}>
                            {(result.violations.consistencyBreach || result.violations.minDaysBreach)
                                ? <AlertOctagon className="w-6 h-6" />
                                : <ShieldCheck className="w-6 h-6" />
                            }
                        </div>
                        <div className={cn(
                            "text-xs font-bold uppercase tracking-widest",
                            (result.violations.consistencyBreach || result.violations.minDaysBreach)
                                ? "text-rose-500"
                                : "text-emerald-500"
                        )}>
                            {(result.violations.consistencyBreach || result.violations.minDaysBreach)
                                ? "FAIL: Compliance Breach"
                                : "PASS: Prop Compliant"}
                        </div>
                        <p className="text-[10px] text-slate-500 uppercase opacity-60">
                            Firm Guideline Audit
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
