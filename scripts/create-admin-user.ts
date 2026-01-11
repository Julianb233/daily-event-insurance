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
    console.error('Missing required environment variables:');
    if (!supabaseUrl) console.error('  - NEXT_PUBLIC_SUPABASE_URL');
    if (!supabaseServiceKey) console.error('  - SUPABASE_SERVICE_ROLE_KEY');
    if (!databaseUrl) console.error('  - DATABASE_URL');
    process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
const sql = postgres(databaseUrl, { ssl: 'require' });

// Admin user configuration
const ADMIN_EMAIL = 'julian@aiacrobatics.com';
const ADMIN_NAME = 'Julian Bradley';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ChangeMe123!'; // Set via env or use default

async function createAdminUser() {
    console.log(`\n🔐 Creating admin user: ${ADMIN_EMAIL}\n`);

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
    const userExists = existingUser?.users?.find(u => u.email === ADMIN_EMAIL);

    if (userExists) {
        console.log('⚠️  User already exists in Supabase Auth. Updating to admin role...');

        // Update existing user to admin
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            userExists.id,
            {
                user_metadata: {
                    name: ADMIN_NAME,
                    role: 'admin'
                }
            }
        );

        if (updateError) {
            console.error('❌ Failed to update user:', updateError);
            process.exit(1);
        }

        // Update public.users table
        try {
            await sql`
                INSERT INTO users (id, email, name, role, email_verified, created_at, updated_at)
                VALUES (${userExists.id}, ${ADMIN_EMAIL}, ${ADMIN_NAME}, 'admin', NOW(), NOW(), NOW())
                ON CONFLICT (id) DO UPDATE SET
                    role = 'admin',
                    name = ${ADMIN_NAME},
                    updated_at = NOW()
            `;
            console.log('✅ User updated to admin in public.users table');
        } catch (dbError) {
            console.error('⚠️  Could not update public.users:', dbError);
        }

        console.log('\n✅ Admin user updated successfully!');
        console.log(`   Email: ${ADMIN_EMAIL}`);
        console.log('   Role: admin');
    } else {
        // Create new admin user
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
            email_confirm: true,
            user_metadata: {
                name: ADMIN_NAME,
                role: 'admin'
            }
        });

        if (createError) {
            console.error('❌ Failed to create auth user:', createError);
            process.exit(1);
        }

        console.log('✅ Created user in Supabase Auth');

        // Insert into public.users
        try {
            await sql`
                INSERT INTO users (id, email, name, role, email_verified, created_at, updated_at)
                VALUES (${newUser.user.id}, ${ADMIN_EMAIL}, ${ADMIN_NAME}, 'admin', NOW(), NOW(), NOW())
                ON CONFLICT (id) DO NOTHING
            `;
            console.log('✅ User inserted into public.users table');
        } catch (dbError) {
            console.error('⚠️  Could not insert into public.users:', dbError);
        }

        console.log('\n========================================');
        console.log('✅ Admin user created successfully!');
        console.log('========================================');
        console.log(`   Email: ${ADMIN_EMAIL}`);
        console.log(`   Password: ${ADMIN_PASSWORD}`);
        console.log('   Role: admin');
        console.log('========================================');
        console.log('\n⚠️  IMPORTANT: Change the password after first login!');
    }

    await sql.end();
}

createAdminUser().catch(err => {
    console.error('Script failed:', err);
    process.exit(1);
});
