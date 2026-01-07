import { config } from "dotenv"
config({ path: ".env.local" })
import { sql } from "drizzle-orm"

async function run() {
  console.log("Running chat tables migration...")

  const { db } = await import("@/lib/db")

  if (!db) {
    console.error("Database connection failed.")
    process.exit(1)
  }

  try {
    // Create chat_conversations
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS chat_conversations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id),
        visitor_id TEXT,
        agent_type TEXT DEFAULT 'support',
        status TEXT DEFAULT 'active',
        created_at TIMESTAMP DEFAULT now() NOT NULL,
        updated_at TIMESTAMP DEFAULT now() NOT NULL
      );
    `)

    // Create chat_messages
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        conversation_id UUID REFERENCES chat_conversations(id) ON DELETE CASCADE NOT NULL,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT now() NOT NULL
      );
    `)

    // Create Indexes
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_chat_conversations_user_id ON chat_conversations(user_id);`)
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_chat_conversations_visitor_id ON chat_conversations(visitor_id);`)
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON chat_messages(conversation_id);`)
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);`)

    console.log("Migration successful: Created chat tables.")
  } catch (error) {
    console.error("Migration failed:", error)
  }
  process.exit(0)
}

run()
