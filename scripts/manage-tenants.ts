
import descopeSdk from '@descope/node-sdk';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const projectId = process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID;
const managementKey = process.env.DESCOPE_MANAGEMENT_KEY;

if (!projectId || !managementKey) {
    console.error("❌ Missing configuration. Please ensure NEXT_PUBLIC_DESCOPE_PROJECT_ID and DESCOPE_MANAGEMENT_KEY are set in .env.local");
    process.exit(1);
}

const descopeClient = descopeSdk({ projectId, managementKey });

const TENANTS_TO_CREATE = [
    { name: "Daily Event Insurance", selfProvisioningDomains: ["dailyeventinsurance.com"] },
    { name: "Sure", selfProvisioningDomains: ["sure.com"] } // Assuming 'Sure' might have a domain, can be updated later
];

async function manageTenants() {
    console.log(`🔐 Connecting to Descope Project: ${projectId}`);

    try {
        // 1. List existing tenants to avoid duplicates
        const response = await descopeClient.management.tenant.searchAll();

        let existingTenants: any[] = [];

        if (Array.isArray(response)) {
            existingTenants = response;
        } else if ((response as any).ok === false || (response as any).error) {
            throw new Error(`Failed to list tenants: ${(response as any).error?.errorDescription || (response as any).message}`);
        } else {
            // Sometimes it returns an object with { tenants: [] } or similar, handled here if needed
            // But for now let's assume if it's not an array and not an error, we might verify structure
            console.log("Unexpected response format, checking keys:", Object.keys(response));
            if ((response as any).tenants && Array.isArray((response as any).tenants)) {
                existingTenants = (response as any).tenants;
            }
        }

        const existingNames = new Set(existingTenants.map((t: any) => t.name));

        console.log(`📋 Found ${existingTenants.length} existing tenants.`);

        for (const tenant of TENANTS_TO_CREATE) {
            if (existingNames.has(tenant.name)) {
                console.log(`⚠️ Tenant '${tenant.name}' already exists. Skipping.`);
            } else {
                console.log(`✨ Creating tenant '${tenant.name}'...`);
                try {
                    // Generate a simple ID from the name (e.g., "Daily Event Insurance" -> "daily-event-insurance")
                    const id = tenant.name.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');

                    await descopeClient.management.tenant.create(
                        id,
                        tenant.name,
                        tenant.selfProvisioningDomains
                    );
                    console.log(`✅ Successfully created tenant: ${tenant.name} (ID: ${id})`);
                } catch (err: any) {
                    console.error(`❌ Failed to create tenant '${tenant.name}':`, err.message || err);
                }
            }
        }

        console.log("\n✅ Tenant management check complete.");

    } catch (error: any) {
        console.error("❌ Error managing tenants:", error.message);
    }
}

manageTenants();
