import postgres from 'postgres';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function applyTrigger() {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        console.error('❌ DATABASE_URL not set');
        process.exit(1);
    }

    const sql = postgres(dbUrl, { ssl: 'require' });

    console.log('🔌 Connecting to database...');

    try {
        console.log('🛠 Creating handle_new_user function...');
        await sql`
      CREATE OR REPLACE FUNCTION public.handle_new_user()
      RETURNS TRIGGER AS $$
      BEGIN
        INSERT INTO public.users (id, email, name, role)
        VALUES (
          new.id,
          new.email,
          COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
          'user'
        );
        RETURN new;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `;
        console.log('✅ Function created.');

        console.log('🛠 Creating trigger on_auth_user_created...');
        // We need to execute raw SQL because postgres.js might have trouble with DROP TRIGGER syntax if not carefully parameterized, 
        // but here we are sending a simple string.
        // Note: TRIGGER creation on auth schema requires permissions.

        await sql.unsafe(`
      DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
      CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    `);

        console.log('✅ Trigger created.');

    } catch (err: any) {
        console.error('❌ Failed to apply trigger:', err.message);
        process.exit(1);
    } finally {
        await sql.end();
    }
}

applyTrigger();
