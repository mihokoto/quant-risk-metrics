import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ slug: string }> }
) {
    const { slug } = await context.params;

    if (!slug) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    try {
        // 1. Fetch the target URL from Supabase
        const { data: affiliate, error } = await supabase
            .from("affiliates")
            .select("target_url, click_count")
            .eq("slug", slug)
            .single();

        if (error || !affiliate) {
            console.error(`Affiliate slug "${slug}" not found or error:`, error?.message);
            return NextResponse.redirect(new URL("/", request.url));
        }

        // 2. Increment click count (Background task)
        // We don't await this to keep the redirect fast
        supabase
            .from("affiliates")
            .update({ click_count: (affiliate.click_count || 0) + 1 })
            .eq("slug", slug)
            .then(({ error: updateError }) => {
                if (updateError) console.error("Failed to increment click count:", updateError.message);
            });

        // 3. Perform the 307 Temporary Redirect
        return NextResponse.redirect(affiliate.target_url, 307);
    } catch (err) {
        console.error("Critical error in redirect route:", err);
        return NextResponse.redirect(new URL("/", request.url));
    }
}
