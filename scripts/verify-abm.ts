
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables immediately
const result = config({ path: resolve(process.cwd(), '.env.local') });

if (result.error) {
    console.error('Error loading .env.local:', result.error);
}

console.log('Environment loaded. DATABASE_URL present:', !!process.env.DATABASE_URL);

async function main() {
    // Import service dynamically to enforce execution AFTER env is loaded
    const { abmService } = await import('../lib/g3/abm-service');

    console.log('Starting ABM Service Verification...');

    const clientId = 'verify-test-client';

    try {
        // 1. Create Account
        console.log('Creating Test Account...');
        // Note: abmService.createAccount takes Partial<Account> which uses snake_case, 
        // and maps it to abmAccountService.create which uses camelCase for Drizzle
        const account = await abmService.createAccount({
            client_id: clientId,
            company_name: 'Test Corp ' + Date.now(),
            industry: 'Technology',
            score: 50,
            stage: 'awareness'
        });

        if (!account) {
            throw new Error('Failed to create account');
        }
        console.log('✅ Account created:', account.id);

        // 2. Create Contact
        console.log('Creating Test Contact...');
        const contact = await abmService.createContact({
            account_id: account.id,
            name: 'Test User',
            email: `test-${Date.now()}@example.com`,
            role: 'decision_maker'
        });

        if (!contact) {
            throw new Error('Failed to create contact');
        }
        console.log('✅ Contact created:', contact.id);

        // 3. Create Activity
        console.log('Creating Test Activity...');
        const activity = await abmService.createActivity({
            account_id: account.id,
            contact_id: contact.id,
            type: 'website_visit',
            title: 'Visited Pricing Page',
            description: 'User checked enterprise pricing'
        });

        if (!activity) {
            throw new Error('Failed to create activity');
        }
        console.log('✅ Activity created:', activity.id);

        // 4. Verify Retrieval
        console.log('Verifying Data Retrieval...');
        const accounts = await abmService.getAccounts(clientId);
        console.log(`Found ${accounts.length} accounts for client`);

        // Check if our account is in the list
        const found = accounts.find(a => a.id === account.id);
        if (found) {
            console.log('✅ Created account found in list');
        } else {
            console.error('❌ Created account NOT found in list');
        }

        const accountActivities = await abmService.getActivities(account.id);
        console.log(`Found ${accountActivities.length} activities for account`);

        // 5. Cleanup
        console.log('Cleaning up...');
        await abmService.deleteAccount(account.id);
        console.log('✅ Test data deleted');

        console.log('🎉 ABM Service Verification Successful!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Verification Failed:', error);
        process.exit(1);
    }
}

main();
