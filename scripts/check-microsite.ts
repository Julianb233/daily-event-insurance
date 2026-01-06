
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkMicrosite() {
    const email = 'manual.test.1767666614089@gmail.com';
    console.log(`Checking microsite for ${email}...`);

    // 1. Get User ID
    const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();

    // Manual filtering because listUsers doesn't support eq on email easily in all versions or purely client side
    const user = users?.find(u => u.email === email);

    if (!user) {
        console.log('User not found!');
        return;
    }
    console.log('User ID:', user.id);

    // 2. Get Partners (without .single())
    const { data: partners, error: partnerError } = await supabase
        .from('partners')
        .select('*')
        .eq('user_id', user.id);

    if (partnerError) {
        console.log('Error fetching partners:', partnerError.message);
        return;
    }

    console.log(`Found ${partners.length} partner records.`);

    if (partners.length === 0) {
        console.log('No partner record found. Onboarding submission likely failed.');
        return;
    }

    const partner = partners[0];
    console.log('Partner ID:', partner.id);
    console.log('Business Name:', partner.business_name);

    // 3. Get Microsite
    const { data: microsites, error: micrositeError } = await supabase
        .from('microsites')
        .select('*')
        .eq('partner_id', partner.id);

    if (micrositeError) {
        console.log('Error fetching microsites:', micrositeError.message);
        return;
    }

    console.log(`Found ${microsites.length} microsite records.`);

    if (microsites.length > 0) {
        const microsite = microsites[0];
        console.log('\n--- MICROSITE FOUND ---');
        console.log('ID:', microsite.id);
        console.log('Subdomain:', microsite.subdomain);
        console.log('Status:', microsite.status);
        console.log('QR Code URL:', microsite.qr_code_url ? '(Present)' : '(Missing)');
        console.log('-----------------------');
    } else {
        console.log('No microsite found.');
    }
}

checkMicrosite();
