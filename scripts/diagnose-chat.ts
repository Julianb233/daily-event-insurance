
import { config } from "dotenv";
import { resolve } from "path";
import { AccessToken } from "livekit-server-sdk";
import OpenAI from "openai";

// Load .env.local
config({ path: resolve(process.cwd(), ".env.local") });

async function diagnose() {
    console.log("🔍 Starting Chat System Diagnosis...\n");

    const results: Record<string, boolean> = {};

    // 1. Check Environment Variables
    console.log("1️⃣  Environment Variables:");
    const requiredVars = [
        "OPENAI_API_KEY",
        "LIVEKIT_API_KEY",
        "LIVEKIT_API_SECRET",
        "NEXT_PUBLIC_LIVEKIT_URL",
        "DATABASE_URL"
    ];

    for (const v of requiredVars) {
        const exists = !!process.env[v];
        console.log(`   ${exists ? "✅" : "❌"} ${v}`);
        results[v] = exists;
    }

    // Check Deepgram optionally (for voice agent)
    const deepgram = !!process.env.DEEPGRAM_API_KEY;
    console.log(`   ${deepgram ? "✅" : "⚠️"} DEEPGRAM_API_KEY (Required for Voice Agent STT)`);

    console.log("\n");

    // 2. Check Database Connection
    console.log("2️⃣  Database Connection:");
    try {
        // Dynamic import to ensure env vars are loaded first
        // @ts-ignore
        const { db } = await import("../lib/db");

        if (db) {
            // Just run a simple query to check connection
            // @ts-ignore
            await db.execute('SELECT 1');
            console.log("   ✅ Database connected successfully");
        } else {
            console.log("   ❌ Database client not initialized");
        }
    } catch (error) {
        console.log("   ❌ Database connection failed:", error);
    }
    console.log("\n");

    // 3. Check OpenAI Connection
    console.log("3️⃣  OpenAI API:");
    if (results["OPENAI_API_KEY"]) {
        try {
            const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
            await openai.models.list();
            console.log("   ✅ OpenAI API accessible");
        } catch (error: any) {
            console.log("   ❌ OpenAI API failed:", error.message);
        }
    } else {
        console.log("   ⏭️  Skipping OpenAI check (missing key)");
    }
    console.log("\n");

    // 4. Check LiveKit Token Generation
    console.log("4️⃣  LiveKit Configuration:");
    if (results["LIVEKIT_API_KEY"] && results["LIVEKIT_API_SECRET"]) {
        try {
            const at = new AccessToken(
                process.env.LIVEKIT_API_KEY,
                process.env.LIVEKIT_API_SECRET,
                { identity: "diagnosis-test" }
            );
            at.addGrant({ roomJoin: true, room: "test-room" });
            const token = await at.toJwt();
            console.log("   ✅ LiveKit Token generated successfully");
        } catch (error: any) {
            console.log("   ❌ LiveKit Token generation failed:", error.message);
        }
    } else {
        console.log("   ⏭️  Skipping LiveKit check (missing keys)");
    }

    console.log("\n🏁 Diagnosis Complete.");
}

diagnose().catch(console.error);
