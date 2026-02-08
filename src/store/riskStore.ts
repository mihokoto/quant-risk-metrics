import { create } from "zustand";
import { SimulationParams } from "@/lib/quant/engine"; // This has changed!
import { FirmRules } from "@/types/supabase";

// Extended State for UI
interface RiskState {
    params: SimulationParams;

    // UI helper to know which preset is active (if any)
    activeFirmName: string;

    isSidebarOpen: boolean;

    // Actions
    setParams: (updates: Partial<SimulationParams>) => void;
    updateRules: (ruleUpdates: Partial<FirmRules>) => void;
    toggleSidebar: () => void;
    resetDefaults: () => void;

    // Load a full firm profile
    loadFirmProfile: (name: string, rules: FirmRules) => void;
}

// Default Rules (Apex 50k Style)
const DEFAULT_RULES: FirmRules = {
    drawdownType: 'TRAILING_UNREALIZED',
    breachType: 'HARD_BREACH',
    profitTarget: 3000,
    drawdownLimit: 2500,
    dailyLossLimit: 0,
    enablePALock: true,
    enableBalanceLock: false,
    tradesPerDay: 5,
    consistencyThreshold: 0.4,
    minTradingDays: 5
};

const DEFAULT_PARAMS: SimulationParams = {
    initialBalance: 50000,
    winRate: 0.50,
    rewardToRisk: 2.0,
    numberOfTrades: 100,
    riskPerTrade: 0.02,
    iterations: 5000,
    rules: DEFAULT_RULES,

    // Phase 4 Defaults
    winStdDev: 0,
    enableDefensive: false
};

export const useRiskStore = create<RiskState>((set) => ({
    params: DEFAULT_PARAMS,
    activeFirmName: "Apex 50k", // Default
    isSidebarOpen: true,

    setParams: (updates) =>
        set((state) => ({
            params: { ...state.params, ...updates },
        })),

    // helper to update nested rules
    updateRules: (ruleUpdates) =>
        set((state) => ({
            params: {
                ...state.params,
                rules: { ...state.params.rules, ...ruleUpdates }
            }
        })),

    toggleSidebar: () =>
        set((state) => ({
            isSidebarOpen: !state.isSidebarOpen,
        })),

    resetDefaults: () =>
        set({
            params: DEFAULT_PARAMS,
            activeFirmName: "Apex 50k"
        }),

    loadFirmProfile: (name, rules) =>
        set((state) => ({
            activeFirmName: name,
            params: {
                ...state.params,
                rules: rules
            }
        }))
}));
