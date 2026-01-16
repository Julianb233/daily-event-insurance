
import descopeSdk from '@descope/node-sdk';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const projectId = process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID;
const managementKey = process.env.DESCOPE_MANAGEMENT_KEY;

if (!projectId || !managementKey) {
    console.error("❌ Missing configuration.");
    process.exit(1);
}

const descopeClient = descopeSdk({ projectId, managementKey });

async function debugTenants() {
    console.log(`🔐 Connecting to Descope Project: ${projectId}`);

    try {
        const response = await descopeClient.management.tenant.searchAll();
        console.log("Response type:", typeof response);
        console.log("Is array?", Array.isArray(response));
        console.log("Response keys:", Object.keys(response));
        console.log("Full response:", JSON.stringify(response, null, 2));

    } catch (error: any) {
        console.error("❌ Error:", error.message);
    }
}

debugTenants();
