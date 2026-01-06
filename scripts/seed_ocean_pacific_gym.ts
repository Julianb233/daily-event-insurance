import { config } from 'dotenv';
config({ path: '.env.local' });

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users, partners, microsites } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('❌ DATABASE_URL not set');
  process.exit(1);
}
const client = postgres(dbUrl);
const db = drizzle(client);

async function seed() {
  console.log('🔧 Seeding Ocean Pacific Gym...');
  const adminEmail = 'antigravity_admin@test.com';
  const adminRes = await db.select().from(users).where(eq(users.email, adminEmail)).limit(1);
  if (!adminRes.length) {
    console.error('❌ Admin user not found – run the admin demo script first.');
    process.exit(1);
  }
  const admin = adminRes[0];

  const businessName = 'Ocean Pacific Gym';
  const existingPartner = await db.select().from(partners).where(eq(partners.businessName, businessName)).limit(1);
  let partnerId: string;
  if (existingPartner.length) {
    partnerId = existingPartner[0].id;
    await db.update(partners).set({
      userId: admin.id,
      status: 'active',
      businessType: 'gym',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Ocean_Pacific_Gym_logo.png/320px-Ocean_Pacific_Gym_logo.png',
      primaryColor: '#14B8A6',
      websiteUrl: 'https://oceanpacificgym.com',
      agreementSigned: true,
    }).where(eq(partners.id, partnerId));
    console.log('✅ Updated existing partner');
  } else {
    const [newPartner] = await db.insert(partners).values({
      userId: admin.id,
      businessName,
      businessType: 'gym',
      contactName: 'Gym Owner',
      contactEmail: 'owner@oceanpacificgym.com',
      websiteUrl: 'https://oceanpacificgym.com',
      status: 'active',
      primaryColor: '#14B8A6',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Ocean_Pacific_Gym_logo.png/320px-Ocean_Pacific_Gym_logo.png',
      agreementSigned: true,
    }).returning();
    partnerId = newPartner.id;
    console.log('✅ Created new partner');
  }

  const subdomain = 'ocean-pacific-gym';
  const existingSite = await db.select().from(microsites).where(eq(microsites.partnerId, partnerId)).limit(1);
  if (existingSite.length) {
    await db.update(microsites).set({
      subdomain,
      domain: `${subdomain}.dailyeventinsurance.com`,
      status: 'live',
      siteName: businessName,
      primaryColor: '#14B8A6',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Ocean_Pacific_Gym_logo.png/320px-Ocean_Pacific_Gym_logo.png',
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://dailyeventinsurance.com/${subdomain}`,
    }).where(eq(microsites.id, existingSite[0].id));
    console.log('✅ Updated existing microsite');
  } else {
    await db.insert(microsites).values({
      partnerId,
      subdomain,
      domain: `${subdomain}.dailyeventinsurance.com`,
      status: 'live',
      siteName: businessName,
      primaryColor: '#14B8A6',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Ocean_Pacific_Gym_logo.png/320px-Ocean_Pacific_Gym_logo.png',
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://dailyeventinsurance.com/${subdomain}`,
    });
    console.log('✅ Created new microsite');
  }

  await client.end();
  console.log('🎉 Done!');
}

seed().catch((e) => {
  console.error('❌ Error:', e);
  process.exit(1);
});
