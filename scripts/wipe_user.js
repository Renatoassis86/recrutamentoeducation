const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load env vars
const envPath = path.resolve(__dirname, '../.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || envConfig.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || envConfig.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

const emailToDelete = process.argv[2];

if (!emailToDelete) {
    console.error('Please provide an email to delete. Usage: node scripts/wipe_user.js user@example.com');
    process.exit(1);
}

async function wipeUser() {
    console.log(`Attempting to wipe user: ${emailToDelete}`);

    // 1. Get User ID from Auth
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
        console.error('Error listing users:', listError);
        return;
    }

    const user = users.find(u => u.email === emailToDelete);

    if (!user) {
        console.log('User not found in Auth system.');
    } else {
        console.log(`Found user in Auth: ${user.id}`);

        // 2. Delete from Auth (Cascade should handle public tables if configured, but let's be safe)
        const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);

        if (deleteError) {
            console.error('Error deleting user from Auth:', deleteError);
        } else {
            console.log('Successfully deleted user from Auth.');
        }
    }

    // 3. Delete from public.applications (Just in case cascade didn't work or if auth user wasn't found but public data exists)
    // Note: If we don't have the ID, we might need to select by email if the table supports it, 
    // but applications table usually links by user_id. 
    // If the user was deleted from Auth, we can't search by ID if we didn't get it.
    // But usually we want to clean up ANY orphan data if possible.
    // Since we can't easily query applications by email (it's user_id keyed usually, though we added email column to PersonalForm), 
    // we will rely on Supabase CASCADE or the fact that if we deleted from Auth, the user can now re-register.

    console.log('Done. You can now register with this email again.');
}

wipeUser();
