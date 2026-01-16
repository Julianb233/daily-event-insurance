
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import DescopeClient from '@descope/node-sdk';

// Load .env.local
const envLocalPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
    dotenv.config({ path: envLocalPath });
}

const projectId = process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID;
const managementKey = process.env.DESCOPE_MANAGEMENT_KEY;

if (!projectId || !managementKey) {
    console.error("❌ Missing Descope Project ID or Management Key in env");
    process.exit(1);
}

console.log(`🔍 Checking Descope Config for Project: ${projectId}`);

async function main() {
    try {
        const descopeClient = DescopeClient({ projectId: projectId, managementKey: managementKey });

        // Fetch all auth providers
        // Note: SDK structure might vary, trying strict approach
        // @ts-ignore
        const client = descopeClient.management ? descopeClient.management : descopeClient;

        console.log("Attempting to load provider settings...");
        // @ts-ignore
        const providers = await client.authProvider.loadSettings();

        // Find Google
        // @ts-ignore
        const google = providers.find((p: any) => p.name === 'google' || p.provider === 'google');

        if (!google) {
            console.error("❌ Google provider NOT FOUND in Descope configuration.");
        } else {
            console.log("\n✅ Google Provider Found:");
            console.log(`   - Enabled: ${google.enabled}`);

            // Check for Client ID (might be obscured or just presence check)
            // The object usually has 'clientId' or 'redirectUrl'
            console.log(`   - Client ID Present: ${!!google.clientId ? 'YES' : 'NO'}`);
            if (google.clientId) {
                console.log(`   - Client ID: ${google.clientId}`);
            } else {
                console.log(`   - Client ID: <MISSING>`);
            }

            console.log(`   - Client Secret Present: ${!!google.clientSecret ? 'YES' : 'NO'}`);

            if (!google.enabled) {
                console.log("\n⚠️ WARNING: Google provider is configured but DISABLED.");
            }
        }

    } catch (error: any) {
        console.error("❌ Error querying Descope API:");
        console.error(error);
        if (error.message && error.message.includes("module not found")) {
            console.log("NOTE: '@descope/node-sdk' might not be directly importable. Attempting fallback import name...");
        }
    }
}

main();
