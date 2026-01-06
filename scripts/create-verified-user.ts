
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import postgres from 'postgres';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const databaseUrl = process.env.DATABASE_URL;

if (!supabaseUrl || !supabaseServiceKey || !databaseUrl) {
    console.error('Missing required environment variables');
    process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
const sql = postgres(databaseUrl, { ssl: 'require' });

async function createVerifiedUser() {
    const timestamp = Date.now();
    const email = `manual.test.${timestamp}@gmail.com`;
    const password = 'Password123!';

    console.log(`Creating verified user: ${email}`);

    // 1. Create in Supabase Auth
    const { data: user, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
        user_metadata: {
            name: 'Manual Test User',
            role: 'user'
        }
    });

    if (createError) {
        console.error('Failed to create auth user:', createError);
        process.exit(1);
    }

    // 2. Insert into public.users
    try {
        await sql`
            INSERT INTO users (id, email, name, role, email_verified, created_at, updated_at)
            VALUES (${user.user.id}, ${email}, 'Manual Test User', 'user', NOW(), NOW(), NOW())
            ON CONFLICT (id) DO NOTHING
        `;
        console.log('User inserted into public.users table.');
    } catch (dbError) {
        console.error('Failed to insert into public db:', dbError);
        process.exit(1);
    } finally {
        await sql.end();
    }

    console.log('\n--- CREDENTIALS ---');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log('-------------------');
}

createVerifiedUser();
