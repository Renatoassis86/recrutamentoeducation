import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { createMockClient } from "./mock";

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mhkyutqqciueevjnlsfy.supabase.co";
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oa3l1dHFxY2l1ZWV2am5sc2Z5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0OTIxODgsImV4cCI6MjA4NjA2ODE4OH0.kT-4EkfupW-WLXk6pdwvLVTMI_RhwkpHsIEDlDTHKPg";

    if (!supabaseUrl || !supabaseKey) {
        return response;
    }

    const supabase = createServerClient(
        supabaseUrl,
        supabaseKey,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    );
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (
        !user &&
        !request.nextUrl.pathname.startsWith("/login") &&
        !request.nextUrl.pathname.startsWith("/auth") &&
        request.nextUrl.pathname !== "/"
    ) {
        // no user, potentially redirect to login if trying to access protected routes
        // For now, we allow access to landing page ('/') and login/auth routes.
        // We might want to protect other routes later.
        // For this specific app, let's say /dashboard matches protectd routes
        if (request.nextUrl.pathname.startsWith("/dashboard") || request.nextUrl.pathname.startsWith("/application")) {
            const url = request.nextUrl.clone();
            url.pathname = "/login";
            return NextResponse.redirect(url);
        }
    }

    return response;
}
