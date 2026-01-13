
import { config } from "dotenv"
config({ path: ".env.local" })

import { sql } from "drizzle-orm"

async function main() {
    const { db } = await import("@/lib/db");
    console.log("Applying missing tables...");

    // Microsites
    await db!.execute(sql`
    CREATE TABLE IF NOT EXISTS "microsites" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "partner_id" uuid NOT NULL,
        "slug" text NOT NULL,
        "custom_domain" text,
        "is_active" boolean DEFAULT true,
        "logo_url" text,
        "primary_color" text DEFAULT '#14B8A6',
        "business_name" text,
        "setup_fee" numeric(10, 2) DEFAULT '550.00',
        "fee_collected" boolean DEFAULT false,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "microsites_slug_unique" UNIQUE("slug")
    );
  `);
    console.log("Checked/Created microsites");

    // Admin Earnings
    await db!.execute(sql`
    CREATE TABLE IF NOT EXISTS "admin_earnings" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "earning_type" text NOT NULL,
        "lead_id" uuid,
        "microsite_id" uuid,
        "partner_id" uuid,
        "base_amount" numeric(10, 2) NOT NULL,
        "commission_rate" numeric(5, 4) DEFAULT '0.25',
        "earned_amount" numeric(10, 2) NOT NULL,
        "status" text DEFAULT 'pending',
        "paid_at" timestamp,
        "created_at" timestamp DEFAULT now() NOT NULL
    );
  `);
    console.log("Checked/Created admin_earnings");

    // Contract Templates
    await db!.execute(sql`
    CREATE TABLE IF NOT EXISTS "contract_templates" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "name" text NOT NULL,
        "display_name" text NOT NULL,
        "description" text,
        "content" text NOT NULL,
        "version" integer DEFAULT 1 NOT NULL,
        "is_active" boolean DEFAULT true,
        "is_required" boolean DEFAULT true,
        "sort_order" integer DEFAULT 0,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL,
        "published_at" timestamp
    );
  `);
    console.log("Checked/Created contract_templates");

    // Partner Contract Signatures
    await db!.execute(sql`
    CREATE TABLE IF NOT EXISTS "partner_contract_signatures" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "partner_id" uuid NOT NULL,
        "contract_template_id" uuid NOT NULL,
        "signed_at" timestamp DEFAULT now() NOT NULL,
        "signature_data" text,
        "ip_address" text,
        "user_agent" text,
        "contract_version" integer NOT NULL,
        "contract_content_snapshot" text NOT NULL
    );
  `);
    console.log("Checked/Created partner_contract_signatures");

    process.exit(0);
}

main().catch(console.error);
