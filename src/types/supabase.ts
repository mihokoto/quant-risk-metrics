import { z } from "zod";

// --- Enums based on User Requirements ---
export const DrawdownTypeSchema = z.enum([
    "TRAILING_UNREALIZED", // Apex style (Tick-by-tick)
    "TRAILING_EOD",       // Topstep style (End of Day)
    "STATIC_FIXED",       // Generic / FTMO static max loss
]);

export const BreachTypeSchema = z.enum([
    "HARD_BREACH",        // Instant failure if touched
    "SOFT_BREACH",        // Warning / EOD close (less common in sim, but good for completeness)
]);

// --- The 'Rules' JSONB Schema ---
// This guarantees that any firm fetched from DB has these fields
export const FirmRulesSchema = z.object({
    drawdownType: DrawdownTypeSchema,
    breachType: BreachTypeSchema,

    // Numeric Constraints
    profitTarget: z.number(),
    drawdownLimit: z.number(),
    dailyLossLimit: z.number().default(0), // 0 means no daily limit

    // Logic Switches
    enablePALock: z.boolean().default(false), // Logic: Lock drawdown at Initial + 100
    enableBalanceLock: z.boolean().default(false), // Logic: Lock drawdown at Initial
    tradesPerDay: z.number().default(5), // chunk size for EOD calculations

    // Consistency & Advanced (Optimization Round)
    consistencyThreshold: z.number().default(0.4), // 0.4 = 40% Max profit per day
    minTradingDays: z.number().default(5),
});

export type FirmRules = z.infer<typeof FirmRulesSchema>;

// --- Database Table Types ---

export interface FirmProfile {
    id: string;
    name: string;
    description: string | null;
    slug: string;
    is_active: boolean;
    // stored in Supabase as JSONB, parsed by Zod in app
    rules: FirmRules;
    created_at: string;
}

// Result of a query including the raw JSON
export interface FirmProfileRaw {
    id: string;
    name: string;
    description: string | null;
    slug: string;
    is_active: boolean;
    rules: any; // Raw JSON from DB
    created_at: string;
}

// User Report / Saved Sim Type
export interface UserReport {
    id: string;
    user_id: string;
    simulation_config: any; // Full SimulationParams
    simulation_result: any; // Condensed Result
    created_at: string;
}
