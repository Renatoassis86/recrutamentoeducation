const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SERVICE_ROLE_KEY';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function deleteUser(email) {
    console.log(`Attempting to delete user: ${email}`);

    // 1. Get user ID
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
        console.error('Error listing users:', listError);
        return;
    }

    const user = users.find(u => u.email === email);

    if (!user) {
        console.log('User not found.');
        return;
    }

    console.log(`Found user ID: ${user.id}`);

    // 2. Delete user
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);

    if (deleteError) {
        console.error('Error deleting user:', deleteError);
    } else {
        console.log('User deleted successfully.');
    }
}

deleteUser('renato086@gmail.com');
