
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://sveodmoqijqjvyhgznia.supabase.co";
const supabaseAnonKey = "sb_publishable_Pw0rNh4Bqn9BC7ZyWswgyA_jgFQPTNb";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugSignup() {
    const email = `test_debug_${Date.now()}@gmail.com`;
    const password = "Password123!";

    console.log(`Attempting signup for: ${email}`);

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        console.error("Signup Failed:");
        console.error("Status:", error.status);
        console.error("Message:", error.message);
        console.error("Full Error Object:", JSON.stringify(error, null, 2));
    } else {
        console.log("Signup potentially successful (check email):", data);
    }
}

debugSignup();
