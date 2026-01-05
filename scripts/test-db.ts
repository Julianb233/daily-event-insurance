import postgres from 'postgres'
import * as dotenv from 'dotenv'

// Load env
dotenv.config({ path: '.env.local' })

async function testDatabase() {
  const dbUrl = process.env.DATABASE_URL

  console.log('🔍 Checking database configuration...')
  console.log('DATABASE_URL exists:', !!dbUrl)

  if (!dbUrl) {
    console.error('❌ DATABASE_URL not set in .env.local')
    process.exit(1)
  }

  console.log('DATABASE_URL prefix:', dbUrl.substring(0, 40) + '...')

  try {
    const sql = postgres(dbUrl, { ssl: 'require', connect_timeout: 10 })

    // Test connection
    const timeResult = await sql`SELECT NOW() as time`
    console.log('✅ Database connected:', timeResult[0].time)

    // Check tables
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `
    console.log('\n📋 Tables in database:')
    tables.forEach(t => console.log('  -', t.table_name))

    // Check users table
    try {
      const users = await sql`SELECT COUNT(*) as count FROM users`
      console.log('\n👥 Users count:', users[0].count)

      // Sample users (email only for privacy)
      const sampleUsers = await sql`SELECT id, email, role, name FROM users LIMIT 5`
      if (sampleUsers.length > 0) {
        console.log('\n📧 Sample users:')
        sampleUsers.forEach(u => {
          console.log(`  - ${u.email} (${u.role || 'no role'}) - ${u.name || 'no name'}`)
        })
      } else {
        console.log('\n⚠️ No users found in database!')
        console.log('   You need to register a user first.')
      }

      // Check if passwords are set
      const usersWithPassword = await sql`
        SELECT COUNT(*) as count FROM users WHERE password_hash IS NOT NULL
      `
      console.log('\n🔐 Users with password set:', usersWithPassword[0].count)

    } catch (err: any) {
      console.error('\n❌ Users table error:', err.message)
      console.log('   The users table may not exist. Run: npm run db:push')
    }

    await sql.end()
    console.log('\n✅ Database test complete!')

  } catch (err: any) {
    console.error('\n❌ Database connection failed:', err.message)
    process.exit(1)
  }
}

testDatabase()
