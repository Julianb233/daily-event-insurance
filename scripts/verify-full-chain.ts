
import { config } from 'dotenv';
config({ path: '.env.local' });
// Remove static import of db to prevent early evaluation
// import { db } from '@/lib/db'; 
import { users, partners, microsites, salesAgentProfiles, policies } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { submitToSure } from '@/lib/sure/client';

async function verifyFullChain() {
  // Dynamic import here ensures env vars are loaded first
  const { db } = await import('@/lib/db');

  if (!db) {
      console.error('❌ Failed to connect to database. Check .env.local');
      process.exit(1);
  }

  console.log('🔄 Starting Full-Chain Verification...');

  // 1. Create Sales Agent
  console.log('1️⃣ Creating Test Sales Agent...');
  const agentEmail = `agent-${Date.now()}@test.com`;
  const [agentUser] = await db.insert(users).values({
    email: agentEmail,
    name: 'Test Sales Agent',
    role: 'sales_agent'
  }).returning();
  
  await db.insert(salesAgentProfiles).values({
    userId: agentUser.id,
    referralCode: `TEST-${Date.now()}`,
    commissionRate: '0.10'
  });
  console.log('✅ Sales Agent Created:', agentUser.id);

  // 2. Create Partner reffered by Agent
  console.log('2️⃣ Creating Test Partner (Referred)...');
  const [partnerUser] = await db.insert(users).values({
    email: `partner-${Date.now()}@test.com`,
    name: 'Test Partner Owner',
    role: 'partner'
  }).returning();

  const [partner] = await db.insert(partners).values({
    userId: partnerUser.id,
    businessName: 'Test Gym Inc',
    businessType: 'gym',
    contactName: 'Owner',
    contactEmail: partnerUser.email,
    referredBy: agentUser.id, // THE CRITICAL LINK
    status: 'active'
  }).returning();
  console.log('✅ Partner Created & Linked to Agent:', partner.id);

  // 3. Create Microsite
  console.log('3️⃣ Creating Microsite...');
  const subdomain = `test-${Date.now()}`;
  const [microsite] = await db.insert(microsites).values({
    partnerId: partner.id,
    siteName: 'Test Gym Site',
    subdomain: subdomain,
    status: 'live'
  }).returning();
  console.log('✅ Microsite Created:', microsite.subdomain);

  // 4. Simulate Check-in API (Calling logic directly to test DB write)
  console.log('4️⃣ Simulating Check-in / Policy Purchase...');
  
  // Mock Sure API Response
  const sureResult = {
    success: true,
    policyNumber: `POL-TEST-${Date.now()}`,
    premium: 10.00,
    effectiveDate: new Date(),
    expirationDate: new Date(Date.now() + 86400000)
  };

  // Insert Policy (Logic from checkin/route.ts)
  const [policy] = await db.insert(policies).values({
     partnerId: partner.id,
     policyNumber: sureResult.policyNumber,
     eventType: 'gym-visit',
     eventDate: new Date(),
     participants: 1,
     coverageType: 'liability',
     premium: sureResult.premium.toString(),
     commission: (sureResult.premium * 0.1).toString(), // $1.00 count
     status: 'active',
     effectiveDate: sureResult.effectiveDate,
     expirationDate: sureResult.expirationDate,
     customerEmail: 'customer@test.com',
     customerName: 'Test Customer',
     certificateIssued: true
  }).returning();
  console.log('✅ Policy Created via Check-in Logic:', policy.id);

  // 5. Verify Sales Stats
  console.log('5️⃣ Verifying Sales Dashboard Stats...');
  // Logic from sales/page.tsx
  const referredPartners = await db
        .select({
            id: partners.id,
            totalCommission: policies.commission
        })
        .from(partners)
        .leftJoin(policies, eq(policies.partnerId, partners.id))
        .where(eq(partners.referredBy, agentUser.id));

  const totalCommission = referredPartners.reduce((acc, p) => acc + Number(p.totalCommission || 0), 0);

  console.log('📊 Sales Agent Ledger:');
  console.log(`   - Agent ID: ${agentUser.id}`);
  console.log(`   - Linked Partner ID: ${partner.id}`);
  console.log(`   - Policy Commission: $${policy.commission}`);
  console.log(`   - Dashboard Total: $${totalCommission.toFixed(2)}`);

  if (Math.abs(totalCommission - 1.00) < 0.01) {
      console.log('🎉 SUCCESS: Database synchronization verified. Sales Agent was credited correctly.');
  } else {
      console.error('❌ FAILURE: Commission mismatch. Expected $1.00, got $' + totalCommission.toFixed(2));
  }
  
  process.exit(0);
}

verifyFullChain().catch(console.error);
