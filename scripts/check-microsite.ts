
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
    // 2. Get Partners (All)
    const { data: partners, error: partnerError } = await supabase
        .from('partners')
        .select('*')
        .limit(10);

    if (partnerError) {
        console.log('Error fetching partners:', partnerError.message);
        return;
    }

    console.log(`Found ${partners.length} partner records.\n`);

    for (const partner of partners) {
        console.log(`Partner: ${partner.business_name} (${partner.id})`);
        
        // 3. Get Microsite
        const { data: microsites, error: micrositeError } = await supabase
            .from('microsites')
            .select('*')
            .eq('partner_id', partner.id);

        if (micrositeError) {
            console.log(`  Error fetching microsite: ${micrositeError.message}`);
            continue;
        }

        if (microsites && microsites.length > 0) {
            const microsite = microsites[0];
            console.log(`  - Microsite: ${microsite.subdomain} (Status: ${microsite.status})`);
            console.log(`  - URL: https://${microsite.subdomain}.dailyeventinsurance.com`);
        } else {
            console.log('  - No microsite found.');
        }
        console.log('');
    }
}

checkMicrosite();
