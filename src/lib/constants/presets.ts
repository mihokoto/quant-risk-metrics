import { FirmRules } from "@/types/supabase";

export const FIRM_PRESETS: Record<string, FirmRules> = {
    "apex_50k": {
        drawdownType: 'TRAILING_UNREALIZED',
        breachType: 'HARD_BREACH',
        profitTarget: 3000,
        drawdownLimit: 2500,
        dailyLossLimit: 0,
        enablePALock: true,
        enableBalanceLock: false,
        tradesPerDay: 4,
        consistencyThreshold: 0.3, // Apex Strict: 30%
        minTradingDays: 7
    },
    "ftmo_100k": {
        drawdownType: 'STATIC_FIXED',
        breachType: 'HARD_BREACH',
        profitTarget: 10000,
        drawdownLimit: 10000,
        dailyLossLimit: 5000,
        enablePALock: false,
        enableBalanceLock: false,
        tradesPerDay: 4,
        consistencyThreshold: 1.0, // No consistency rule
        minTradingDays: 10
    },
    "topstep_50k": {
        drawdownType: 'TRAILING_EOD',
        breachType: 'HARD_BREACH',
        profitTarget: 3000,
        drawdownLimit: 2000,
        dailyLossLimit: 1000,
        enablePALock: false,
        enableBalanceLock: true,
        tradesPerDay: 4,
        consistencyThreshold: 0.5, // Topstep Relaxed: 50%
        minTradingDays: 5
    },
    "custom_standard": {
        drawdownType: 'STATIC_FIXED',
        breachType: 'HARD_BREACH',
        profitTarget: 2000,
        drawdownLimit: 1000,
        dailyLossLimit: 0,
        enablePALock: false,
        enableBalanceLock: false,
        tradesPerDay: 4,
        consistencyThreshold: 0.4,
        minTradingDays: 5
    }
};

export const PRESET_METADATA: Record<string, { title: string, balance: number }> = {
    "apex_50k": { title: "Apex 50k Evaluation", balance: 50000 },
    "ftmo_100k": { title: "FTMO 100k Challenge", balance: 100000 },
    "topstep_50k": { title: "Topstep 50k Combine", balance: 50000 },
    "custom_standard": { title: "Custom Standard Model", balance: 10000 }
};
