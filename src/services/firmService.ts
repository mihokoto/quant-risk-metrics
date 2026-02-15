import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { FirmProfile, FirmRulesSchema } from "@/types/supabase";

export const FIRMS_QUERY_KEY = ["firms"];

// MOCK DATA for local dev/testing without Supabase usage
const MOCK_FIRMS: FirmProfile[] = [
    {
        id: "1",
        name: "Apex 50k",
        slug: "apex_50k",
        description: "Trailing threshold based on unrealized high water mark.",
        is_active: true,
        created_at: new Date().toISOString(),
        rules: {
            drawdownType: "TRAILING_UNREALIZED",
            breachType: "HARD_BREACH",
            profitTarget: 3000,
            drawdownLimit: 2500,
            dailyLossLimit: 0,
            enablePALock: true,
            enableBalanceLock: false,
            tradesPerDay: 10,
            consistencyThreshold: 0.4,
            minTradingDays: 5
        }
    },
    {
        id: "2",
        name: "Topstep 50k",
        slug: "topstep_50k",
        description: "EOD Trailing.",
        is_active: true,
        created_at: new Date().toISOString(),
        rules: {
            drawdownType: "TRAILING_EOD",
            breachType: "HARD_BREACH",
            profitTarget: 3000,
            drawdownLimit: 2000,
            dailyLossLimit: 1000,
            enablePALock: false,
            enableBalanceLock: true,
            tradesPerDay: 5,
            consistencyThreshold: 0.4,
            minTradingDays: 5
        }
    },
    {
        id: "3",
        name: "FTMO 100k",
        slug: "ftmo_100k",
        description: "Static max loss.",
        is_active: true,
        created_at: new Date().toISOString(),
        rules: {
            drawdownType: "STATIC_FIXED",
            breachType: "HARD_BREACH",
            profitTarget: 10000,
            drawdownLimit: 10000,
            dailyLossLimit: 5000,
            enablePALock: false,
            enableBalanceLock: false,
            tradesPerDay: 5,
            consistencyThreshold: 0.4,
            minTradingDays: 5
        }
    }
];

// Fetcher Function
const fetchFirms = async (): Promise<FirmProfile[]> => {
    try {
        const { data, error } = await supabase
            .from("firms")
            .select("*")
            .eq("is_active", true)
            .order("name");

        if (error || !data || data.length === 0) {
            console.warn("Supabase fetch failed or empty, using MOCK data:", error?.message);
            return MOCK_FIRMS;
        }

        // Runtime Validation with Zod
        const validFirms = data.map((firm: any) => {
            try {
                const parsedRules = FirmRulesSchema.parse(firm.rules);
                return {
                    ...firm,
                    rules: parsedRules,
                } as FirmProfile;
            } catch (e) {
                console.error(`Firm ${firm.name} has invalid rules schema:`, e);
                return null;
            }
        }).filter(Boolean) as FirmProfile[];

        return validFirms.length > 0 ? validFirms : MOCK_FIRMS;
    } catch (err) {
        console.warn("Network error, using MOCK data");
        return MOCK_FIRMS;
    }
};

// React Query Hook
export const useFirms = () => {
    return useQuery({
        queryKey: FIRMS_QUERY_KEY,
        queryFn: fetchFirms,
        staleTime: 1000 * 60 * 60, // 1 hour (firms don't change often)
    });
};
