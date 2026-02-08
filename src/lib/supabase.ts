import { createClient } from "@supabase/supabase-js";

// Environment variables for Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    if (process.env.NODE_ENV === 'production') {
        throw new Error("Missing Supabase environment variables. Build cannot proceed.");
    } else {
        console.warn("Supabase environment variables are missing. Some features may not work.");
    }
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
    },
});

// Database types placeholder - will be generated using Supabase CLI
// Run: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/database.types.ts
export type Database = {
    public: {
        Tables: {
            // Define your table types here
        };
        Views: {
            // Define your view types here
        };
        Functions: {
            // Define your function types here
        };
    };
};

// Typed client for better TypeScript support
export const typedSupabase = createClient<Database>(
    supabaseUrl || '',
    supabaseAnonKey || ''
);
