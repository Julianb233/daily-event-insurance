import { createClient } from '@supabase/supabase-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function verifyUserSync() {
    console.log('🚀 Starting end-to-end Supabase connection verification...');

    // 1. Validate Environment
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const dbUrl = process.env.DATABASE_URL;

    if (!supabaseUrl || !serviceRoleKey || !dbUrl) {
        console.error('❌ Missing environment variables.');
        console.log('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
        console.log('SUPABASE_SERVICE_ROLE_KEY:', !!serviceRoleKey);
        console.log('DATABASE_URL:', !!dbUrl);
        process.exit(1);
    }

    // 2. Setup Clients
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });

    const sql = postgres(dbUrl, { ssl: 'require' });

    // 3. Create Test User in Auth
    const testEmail = `test.sync.${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';
    console.log(`\n👤 Creating test user in Auth: ${testEmail}`);

    let userId: string | null = null;

    try {
        const { data: { user }, error } = await supabase.auth.admin.createUser({
            email: testEmail,
            password: testPassword,
            email_confirm: true,
            user_metadata: {
                full_name: 'Test Sync User',
                name: 'Test Sync User'
            }
        });

        if (error) {
            throw new Error(`Failed to create auth user: ${error.message}`);
        }

        if (!user) {
            throw new Error('User creation returned no data');
        }

        userId = user.id;
        console.log(`✅ Auth user created. ID: ${userId}`);

        // 4. Wait for Trigger
        console.log('⏳ Waiting for trigger to sync to public.users (2s)...');
        await new Promise(r => setTimeout(r, 2000));

        // 5. Verify in Public Table
        console.log('🔍 Checking public.users table...');
        const result = await sql`SELECT * FROM public.users WHERE id = ${userId}`;

        if (result.length > 0) {
            console.log('✅ User found in public.users!');
            console.log('   - Name:', result[0].name);
            console.log('   - Email:', result[0].email);
            console.log('   - Role:', result[0].role);
        } else {
            console.error('❌ User NOT found in public.users. Sync failed.');
            throw new Error('Sync verification failed');
        }

    } catch (err: any) {
        console.error(`\n❌ Error: ${err.message}`);
        process.exit(1);
    } finally {
        // 6. Cleanup
        if (userId) {
            console.log(`\n🧹 Cleaning up user: ${userId}`);
            try {
                // Delete from Auth (should cascade or at least we try to clean both)
                await supabase.auth.admin.deleteUser(userId);
                console.log('✅ Auth user deleted');

                // Ensure deleted from public (if cascade isn't set up, we might need manual delete)
                const check = await sql`SELECT count(*) as count FROM public.users WHERE id = ${userId}`;
                if (check[0].count > 0) {
                    console.log('   Legacy cleanup: Deleting from public.users manually...');
                    await sql`DELETE FROM public.users WHERE id = ${userId}`;
                }
            } catch (cleanupErr: any) {
                console.warn(`⚠️ Cleanup failed: ${cleanupErr.message}`);
            }
        }

        await sql.end();
    }

    console.log('\n🎉 Verification Successful! Supabase is connected correctly end-to-end.');
}

verifyUserSync();
