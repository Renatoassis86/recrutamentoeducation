import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const supabase = await createClient();

    // Check if a user's logged in
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Force signout
    await supabase.auth.signOut();

    // Clear cookies manually if needed (Supabase helper usually does this, but being explicit helps)
    // In a Route Handler with Supabase SSR, signOut() should handle the response headers.

    revalidatePath("/", "layout");

    // Redirect to login to confirm logout
    return NextResponse.redirect(new URL("/login", req.url), {
        status: 302,
    });
}
