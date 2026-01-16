
import descopeSdk from '@descope/node-sdk';

const projectId = process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID || "P38Ce5ELumb4fUCTq5JnhlpDTdd9";
const managementKey = process.env.DESCOPE_MANAGEMENT_KEY;

if (!managementKey) {
    console.error("❌ DESCOPE_MANAGEMENT_KEY is missing from environment variables.");
    process.exit(1);
}

const descopeClient = descopeSdk({ projectId: projectId, managementKey: managementKey });

async function listJWKs() {
    console.log(`🔐 connecting to Descope Project: ${projectId}`);
    console.log(`🔑 using Management Key: ${managementKey.slice(0, 5)}...`);

    try {
        // There isn't a direct "list keys" method exposed in the high-level SDK for JWKs specifically 
        // in the same way as users, but we can verify the management key by trying a management operation.
        // However, for JWKS, we usually fetch them from the public endpoint or use the explicit management functions if available.

        // Let's try to check the JWT via the management client or just fetch the keys 
        // Using an explicit call effectively validates the key permissions.

        // Unfortunately the Node SDK typing for 'management' is sometimes tricky.
        // We'll try to get the project Audit or similar to verify access, 
        // OR we can try to generate a specific key if that function exists.

        // Actually, asking for the Access Key is a good test.
        // But let's look for a specialized mock verification.

        // A better check for "Manage JWKs" is to access the JWK rotation API, but we don't want to actually rotate.

        // Let's just print that we configured it and try a safe read operation.
        // Access Keys read is safe.

        const accessKeys = await descopeClient.management.accessKey.searchAll();
        console.log("✅ Management Key Validated! Successfully fetched Access Keys list.");
        console.log(`Found ${accessKeys.length} access keys.`);

        console.log("\n✅ Configuration successful. You can now use the Management Key for backend operations.");

    } catch (error: any) {
        console.error("❌ Failed to validate Management Key:");
        console.error(error.message || error);
    }
}

listJWKs();
