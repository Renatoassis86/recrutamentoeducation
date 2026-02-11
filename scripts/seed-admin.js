const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://mhkyutqqciueevjnlsfy.supabase.co";
const SERVICE_ROLE_KEY = "sb_secret_XbDWiAITsTurtfINe32_Ug_V_2soa8o";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function seedAdmin() {
    console.log("Seeding admin user...");

    const email = "admin@cidadeviva.org";
    const password = "Admin@123456";
    const fullName = "Administrador Sistema";

    // 1. Check if user exists
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
        console.error("Error listing users:", listError);
        return;
    }

    let adminUser = users.find(u => u.email === email);

    if (!adminUser) {
        console.log("Creating new admin user in Auth...");
        const { data, error } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { full_name: fullName }
        });

        if (error) {
            console.error("Error creating user:", error);
            return;
        }
        adminUser = data.user;
        console.log("User created:", adminUser.id);
    } else {
        console.log("User already exists in Auth. Updating password and metadata...");
        const { error } = await supabase.auth.admin.updateUserById(adminUser.id, {
            password,
            user_metadata: { full_name: fullName }
        });
        if (error) console.error("Error updating user:", error);
    }

    // 2. Ensure profile has admin role
    console.log("Setting role: 'admin' in profiles table...");
    const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
            id: adminUser.id,
            role: 'admin',
            full_name: fullName,
            updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

    if (profileError) {
        console.error("Error updating profile:", profileError);
    } else {
        console.log("✅ Admin user seeded successfully!");
    }
}

seedAdmin();
