import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function getAllDocuments() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // Admin check
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "admin") return [];

    const { data, error } = await supabase
        .from("documents")
        .select(`
            *,
            applications (
                full_name,
                email
            )
        `)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching documents:", error);
        return [];
    }
    return data;
}

export async function getAdminStats() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    // Check if admin
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (!profile || profile.role !== "admin") {
        // In a real app, you might want to show a 403 page or redirect to dashboard
        // redirect("/dashboard");
        // For now, let's return null to handle it in UI
        return null;
    }

    // Fetch stats (count by status)
    // We can use .count() with filters or rpc if complex.
    // Grouping is not directly supported in simple client SDK without rpc usually for counts, 
    // but we can fetch all or just use separate count queries.
    // Separate count queries is safer for small scale.

    const { count: received } = await supabase.from("applications").select("*", { count: 'exact', head: true }).eq('status', 'received');
    const { count: under_review } = await supabase.from("applications").select("*", { count: 'exact', head: true }).eq('status', 'under_review');
    const { count: interview } = await supabase.from("applications").select("*", { count: 'exact', head: true }).eq('status', 'interview_invited');
    const { count: closed } = await supabase.from("applications").select("*", { count: 'exact', head: true }).eq('status', 'closed');
    const { count: total } = await supabase.from("applications").select("*", { count: 'exact', head: true });

    return {
        total: total || 0,
        received: received || 0,
        under_review: under_review || 0,
        interview: interview || 0,
        closed: closed || 0
    };
}

export async function getApplications(statusFilter?: string) {
    const supabase = await createClient();

    // Auth check implicitly handled by RLS if properly set, but good to check role for redirection
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    let query = supabase
        .from("applications")
        .select("id, full_name, email, profile_type, status, created_at, city, state")
        .order("created_at", { ascending: false });

    if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Error fetching applications:", error);
        return [];
    }

    return data;
}

export async function updateApplicationStatus(id: string, newStatus: string) {
    const supabase = await createClient();
    // Role check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "admin") return { error: "Forbidden" };

    const { error } = await supabase
        .from("applications")
        .update({ status: newStatus as any })
        .eq("id", id);

    if (error) return { error: error.message };

    if (error) return { error: error.message };

    revalidatePath("/admin");
    return { success: true };
}
