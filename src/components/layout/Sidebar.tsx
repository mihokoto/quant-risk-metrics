"use client";

import Link from "next/link";
import { useRiskStore } from "@/store/riskStore";
import { cn } from "@/lib/utils";
import {
    Settings2,
    RefreshCcw,
    Wallet,
    Percent,
    Target,
    MonitorCheck,
    ChevronLeft,
    Building2,
    Loader2,
    BrainCircuit,
    Info,
    Hash,
    Layers,
    FunctionSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useFirms } from "@/services/firmService";
import { Switch } from "@/components/ui/switch";
import { Tooltip } from "@/components/ui/custom-tooltip";
import { usePathname } from "next/navigation";

import { useAuth } from "@/contexts/AuthContext";
import { Crown } from "lucide-react";

export function Sidebar() {
    const { params, activeFirmName, setParams, updateRules, isSidebarOpen, resetDefaults, loadFirmProfile } = useRiskStore();
    const { isPro } = useAuth();
    const pathname = usePathname();
    const isBlogRoute = pathname.startsWith('/blog');
    const { rules } = params;

    // Fetch Firms from Supabase via React Query
    const { data: firms, isLoading } = useFirms();

    return (
        <aside
            className={cn(
                "fixed left-0 top-14 bottom-0 z-40 w-80 glass border-r border-white/5 transition-all duration-300 ease-in-out overflow-y-auto overflow-x-hidden animate-in-fade",
                (!isSidebarOpen && !isBlogRoute) && "-translate-x-full",
                isBlogRoute && "w-64 bg-slate-900/50 backdrop-blur-xl"
            )}
        >
            {isBlogRoute ? (
                /* Blog Topic Filter Sidebar */
                <div className="p-6 space-y-8 animate-in-slide-right">
                    <div className="flex items-center gap-2 text-white font-outfit font-bold tracking-tight">
                        <Layers className="w-5 h-5 text-indigo-500" />
                        <span>Topic Filter</span>
                    </div>

                    <nav className="space-y-1">
                        {[
                            { name: 'All Articles', icon: Hash, count: 5 },
                            { name: 'Prop Firms', icon: Building2, count: 3 },
                            { name: 'Math & Risk', icon: FunctionSquare, count: 2 },
                        ].map((topic) => (
                            <button
                                key={topic.name}
                                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors text-slate-400 hover:text-white hover:bg-white/5 group"
                            >
                                <div className="flex items-center gap-3">
                                    <topic.icon className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
                                    <span>{topic.name}</span>
                                </div>
                                <span className="text-[10px] font-mono text-slate-600 bg-slate-800/50 px-1.5 py-0.5 rounded">
                                    {topic.count}
                                </span>
                            </button>
                        ))}
                    </nav>

                    <div className="pt-8 border-t border-white/5">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">
                            Resources
                        </div>
                        <Link href="/" className="flex items-center gap-3 text-sm text-slate-400 hover:text-white group">
                            <Target className="w-4 h-4 text-slate-600 group-hover:text-blue-400" />
                            Live Simulator
                        </Link>
                        <Link href="/guide" className="flex items-center gap-3 text-sm text-slate-400 hover:text-white group">
                            <MonitorCheck className="w-4 h-4 text-slate-600 group-hover:text-amber-400" />
                            User Guide
                        </Link>
                    </div>
                </div>
            ) : (
                /* Simulation Settings Sidebar */
                <div className="p-6 space-y-8">
                    {/* Header */}
                    <div className="flex items-center justify-between animate-in-slide-up" style={{ animationDelay: '0.1s' }}>
                        <div className="flex items-center gap-2 text-white font-outfit font-bold tracking-tight">
                            <Settings2 className="w-5 h-5 text-blue-500" />
                            <span>Simulation Settings</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={resetDefaults}
                            title="Reset to Defaults"
                            className="text-slate-400 hover:text-white"
                        >
                            <RefreshCcw className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Firm Presets (Dynamic from DB) */}
                    <div className="space-y-4 animate-in-slide-up" style={{ animationDelay: '0.2s' }}>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                            <Building2 className="w-3.5 h-3.5 text-blue-500/50" />
                            <span>Choose Your Prop Firm</span>
                            {isLoading && <Loader2 className="w-3 h-3 animate-spin ml-2" />}
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            {firms && firms.length > 0 ? (
                                firms.map((firm) => (
                                    <Button
                                        key={firm.id}
                                        variant={activeFirmName === firm.name ? 'default' : 'outline'}
                                        size="sm"
                                        className="text-xs truncate"
                                        title={firm.name}
                                        onClick={() => loadFirmProfile(firm.name, firm.rules)}
                                    >
                                        {firm.slug}
                                    </Button>
                                ))
                            ) : (
                                // Fallback if no DB connection / empty
                                <div className="col-span-2 text-xs text-slate-500 italic text-center py-2 border border-dashed border-slate-800 rounded">
                                    {!isLoading ? "Loading Firms..." : "Loading..."}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Form Group 1: Capital */}
                    <div className="space-y-4 animate-in-slide-up" style={{ animationDelay: '0.3s' }}>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                            <Wallet className="w-3.5 h-3.5 text-blue-500/50" />
                            <span>Capital</span>
                        </div>

                        <div className="space-y-3">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] text-slate-500 uppercase tracking-[0.1em]">
                                    Initial Balance
                                </Label>
                                <Input
                                    type="number"
                                    value={params.initialBalance}
                                    onChange={(e) => setParams({ initialBalance: Number(e.target.value) })}
                                    className="font-mono bg-slate-950/50 border-white/5 focus:border-blue-500 transition-colors"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <Label className="text-xs text-slate-500 uppercase tracking-widest">
                                        Max Drawdown ($)
                                    </Label>
                                    <Input
                                        type="number"
                                        value={rules.drawdownLimit}
                                        onChange={(e) => updateRules({ drawdownLimit: Number(e.target.value) })}
                                        className="font-mono bg-slate-950 text-rose-400 border-rose-900/30 focus-visible:ring-rose-500"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-slate-500 uppercase tracking-widest">
                                        Profit Target ($)
                                    </Label>
                                    <Input
                                        type="number"
                                        value={rules.profitTarget}
                                        onChange={(e) => updateRules({ profitTarget: Number(e.target.value) })}
                                        className="font-mono bg-slate-950 text-emerald-400 border-emerald-900/30 focus-visible:ring-emerald-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Group 2: Win Rate & RR */}
                    <div className="space-y-4 animate-in-slide-up" style={{ animationDelay: '0.4s' }}>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                            <Percent className="w-3.5 h-3.5 text-blue-500/50" />
                            <span>Performance</span>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-500 uppercase tracking-widest">Win Rate</span>
                                    <span className="font-mono text-blue-400">{(params.winRate * 100).toFixed(0)}%</span>
                                </div>
                                <Slider
                                    value={[params.winRate * 100]}
                                    min={1}
                                    max={99}
                                    step={1}
                                    onValueChange={(val) => setParams({ winRate: val[0] / 100 })}
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-500 uppercase tracking-widest">Reward to Risk</span>
                                    <span className="font-mono text-emerald-400">1:{params.rewardToRisk}</span>
                                </div>
                                <Slider
                                    value={[params.rewardToRisk]}
                                    min={0.1}
                                    max={10}
                                    step={0.1}
                                    onValueChange={(val) => setParams({ rewardToRisk: val[0] })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Form Group 3: Risk Management */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                            <Target className="w-4 h-4 text-rose-500" />
                            <span>Risk Management</span>
                        </div>

                        <div className="space-y-3">
                            <div className="space-y-1">
                                <Label className="text-xs text-slate-500 uppercase tracking-widest">
                                    Risk Per Trade (%)
                                </Label>
                                <div className="flex items-center gap-4">
                                    <Slider
                                        value={[params.riskPerTrade * 100]}
                                        min={0.1}
                                        max={5}
                                        step={0.1}
                                        onValueChange={(val) => setParams({ riskPerTrade: val[0] / 100 })}
                                        className="flex-1"
                                    />
                                    <div className="w-16 font-mono text-sm text-right">
                                        {(params.riskPerTrade * 100).toFixed(1)}%
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-xs text-slate-500 uppercase tracking-widest">
                                    Trades to Sim
                                </Label>
                                <Input
                                    type="number"
                                    value={params.numberOfTrades}
                                    onChange={(e) => setParams({ numberOfTrades: Number(e.target.value) })}
                                    className="font-mono bg-slate-950"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Form Group 4: Advanced */}
                    <div className="space-y-4 pb-12">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                            <BrainCircuit className="w-4 h-4 text-amber-500" />
                            <span>Advanced Simulation</span>
                        </div>

                        <div className="space-y-4">
                            {/* Iterations */}
                            <div className="space-y-3">
                                <div className="flex justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-500 uppercase tracking-widest">Iterations</span>
                                        <Tooltip content="High-precision paths enabled" side="right">
                                            <div className="flex items-center gap-2">
                                                <Info className="w-3 h-3 text-slate-600 cursor-help" />
                                            </div>
                                        </Tooltip>
                                    </div>
                                    <span className={cn("font-mono", isPro ? "text-blue-400" : "text-slate-400")}>
                                        {params.iterations.toLocaleString()}
                                    </span>
                                </div>
                                <Slider
                                    value={[params.iterations]}
                                    min={1000}
                                    max={isPro ? 50000 : 5000}
                                    step={1000}
                                    onValueChange={(val) => setParams({ iterations: val[0] })}
                                />
                            </div>

                            {/* Win StdDev */}
                            <div className="space-y-3">
                                <div className="flex justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-500 uppercase tracking-widest">Win Volatility</span>
                                        <Tooltip content="Standard Deviation of R-Multiple. Higher values mean wins vary in size (e.g. sometimes 1R, sometimes 3R)." side="right">
                                            <Info className="w-3 h-3 text-slate-600 cursor-help" />
                                        </Tooltip>
                                    </div>
                                    <span className="font-mono text-amber-400">
                                        {(!params.winStdDev || params.winStdDev === 0) ? "Fixed" : `±${params.winStdDev.toFixed(1)}R`}
                                    </span>
                                </div>
                                <Slider
                                    value={[params.winStdDev ?? 0]} // Default 0
                                    min={0}
                                    max={2.0}
                                    step={0.1}
                                    onValueChange={(val) => setParams({ winStdDev: val[0] })}
                                />
                            </div>

                            {/* Defensive Scale */}
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <Label className="text-xs text-slate-500 uppercase tracking-widest">Defensive Scaling</Label>
                                        <Tooltip content="Automatically cut risk by 50% if path drawdown exceeds 50% of the limit." side="right">
                                            <Info className="w-3 h-3 text-slate-600 cursor-help" />
                                        </Tooltip>
                                    </div>
                                </div>
                                <Switch
                                    checked={params.enableDefensive ?? false}
                                    onCheckedChange={(c) => setParams({ enableDefensive: c })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Navigation (Mobile Friendly) */}
                    <div className="pt-8 border-t border-white/5 pb-20">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">
                            Platform Navigation
                        </div>
                        <div className="space-y-3">
                            <Link href="/guide" className="flex items-center gap-3 text-sm text-slate-400 hover:text-white group">
                                <MonitorCheck className="w-4 h-4 text-slate-600 group-hover:text-amber-400" />
                                User Guide
                            </Link>
                            <Link href="/blog" className="flex items-center gap-3 text-sm text-slate-400 hover:text-white group">
                                <Layers className="w-4 h-4 text-slate-600 group-hover:text-indigo-400" />
                                Quant Intelligence (Blog)
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer / Collapse Trigger */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800 bg-slate-900/90">
                <div className="text-xs text-slate-500 text-center">
                    QuantRiskMetrics v0.4.0
                </div>
            </div>
        </aside>
    );
}

export function SidebarTrigger() {
    const { isSidebarOpen, toggleSidebar } = useRiskStore();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className={cn(
                "fixed left-4 bottom-4 z-50 rounded-full shadow-glow transition-all duration-300 bg-slate-900 border border-slate-700 hover:bg-slate-800",
                isSidebarOpen && "left-[20rem] rotate-180"
            )}
        >
            <ChevronLeft className="w-4 h-4" />
        </Button>
    );
}
