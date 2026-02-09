import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/Sidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = cookies();
    const isAdmin = cookieStore.get("admin_session")?.value === "true";

    if (!isAdmin) {
        redirect("/admin/login");
    }

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <AdminSidebar />
            <main className="flex-1 p-8 overflow-y-auto h-screen">
                {children}
            </main>
        </div>
    );
}
