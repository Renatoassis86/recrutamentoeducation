import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
    const supabase = await createClient();

    // 1. Supabase SignOut
    await supabase.auth.signOut();

    // 2. Prepare Redirect
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    const response = NextResponse.redirect(url);

    // 3. Force Clear Cookies
    // We iterate over all cookies and explicitly set them to expire
    const cookieStore = cookies();
    const allCookies = cookieStore.getAll();

    allCookies.forEach(cookie => {
        // Clear Supabase cookies and any other auth related ones
        if (cookie.name.includes('sb-') || cookie.name.startsWith('sb:')) {
            response.cookies.set(cookie.name, '', { maxAge: 0, path: '/' });
        }
    });

    // Also force clear the specific project cookie if known, finding dynamic names is safer though.

    revalidatePath("/", "layout");
    return response;
}
