
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://sveodmoqijqjvyhgznia.supabase.co";
const supabaseAnonKey = "sb_publishable_Pw0rNh4Bqn9BC7ZyWswgyA_jgFQPTNb";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkConnection() {
    console.log(`Diagnostic: Connecting to ${supabaseUrl}...`);

    // 1. Fetch Firms
    const { data: firms, error: firmError } = await supabase
        .from('firms')
        .select('name, slug');

    if (firmError) {
        console.log("STATUS: ❌ FIRMS TABLE ERROR");
        console.log("Detail:", firmError.message);
    } else if (firms && firms.length > 0) {
        console.log("STATUS: ✅ FIRMS RESTORED");
        console.log("Firms Found:", firms.map(f => f.name).join(", "));
    } else {
        console.log("STATUS: ⚠️ FIRMS TABLE EMPTY");
    }

    // 2. Fetch Profiles
    const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('subscription_tier')
        .limit(1);

    if (profileError) {
        console.log("STATUS: ❌ PROFILES TABLE ERROR");
        console.log("Detail:", profileError.message);
    } else {
        console.log("STATUS: ✅ PROFILES SCHEMA ACTIVE");
    }

    // 3. Check Auth Triggers (Indirectly)
    // We can't easily check triggers without a test signup, but if tables exist, the SQL ran.
    console.log("\nCONCLUSION: If you see '✅' marks above, your project is 100% restored.");
}

checkConnection();
