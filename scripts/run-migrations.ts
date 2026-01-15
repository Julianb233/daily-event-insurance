#!/usr/bin/env npx tsx
/**
 * Comprehensive Database Migration Script
 *
 * Features:
 * - Reads and applies Drizzle migration files from ./drizzle directory
 * - Tracks applied migrations in _drizzle_migrations table
 * - Supports dry-run mode, status checking, and rollback tracking
 * - Transaction-wrapped migrations with verification
 *
 * Usage:
 *   npx tsx scripts/run-migrations.ts [options]
 *
 * Options:
 *   --status     Show migration status without applying
 *   --dry-run    Preview changes without applying
 *   --force      Skip confirmation prompts
 *   --rollback   Show rollback information
 *   --verbose    Show detailed output
 */

import postgres, { Sql } from "postgres"
import { config } from "dotenv"
import fs from "fs"
import path from "path"
import readline from "readline"

// Load environment variables
config({ path: ".env.local" })

// ANSI color codes for terminal output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
}

// Logging utilities
const log = {
  info: (msg: string) => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
  success: (msg: string) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  warn: (msg: string) => console.log(`${colors.yellow}[WARN]${colors.reset} ${msg}`),
  error: (msg: string) => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`),
  step: (msg: string) => console.log(`${colors.cyan}>>>${colors.reset} ${msg}`),
  dim: (msg: string) => console.log(`${colors.dim}${msg}${colors.reset}`),
  header: (msg: string) => console.log(`\n${colors.bright}${colors.magenta}=== ${msg} ===${colors.reset}\n`),
}

// Parse command line arguments
interface CLIArgs {
  status: boolean
  dryRun: boolean
  force: boolean
  rollback: boolean
  verbose: boolean
  help: boolean
}

function parseArgs(): CLIArgs {
  const args = process.argv.slice(2)
  return {
    status: args.includes("--status"),
    dryRun: args.includes("--dry-run"),
    force: args.includes("--force"),
    rollback: args.includes("--rollback"),
    verbose: args.includes("--verbose"),
    help: args.includes("--help") || args.includes("-h"),
  }
}

// Migration file interface
interface MigrationFile {
  filename: string
  filepath: string
  tag: string
  idx: number
  timestamp: number
  sql: string
  statements: string[]
}

// Migration record from database
interface MigrationRecord {
  id: number
  tag: string
  hash: string
  applied_at: Date
  execution_time_ms: number
  statements_count: number
}

// Drizzle journal entry
interface JournalEntry {
  idx: number
  version: string
  when: number
  tag: string
  breakpoints: boolean
}

interface Journal {
  version: string
  dialect: string
  entries: JournalEntry[]
}

// Simple hash function for migration content
function hashMigration(content: string): string {
  let hash = 0
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, "0")
}

// Parse SQL file into statements (respecting Drizzle breakpoints)
function parseSqlStatements(sql: string): string[] {
  // Drizzle uses "--> statement-breakpoint" to separate statements
  const breakpointDelimiter = "--> statement-breakpoint"

  if (sql.includes(breakpointDelimiter)) {
    return sql
      .split(breakpointDelimiter)
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith("--"))
  }

  // Fallback: split by semicolons (being careful with quoted strings)
  const statements: string[] = []
  let current = ""
  let inString = false
  let stringChar = ""

  for (let i = 0; i < sql.length; i++) {
    const char = sql[i]
    const nextChar = sql[i + 1]

    if (!inString && (char === "'" || char === '"')) {
      inString = true
      stringChar = char
    } else if (inString && char === stringChar && nextChar !== stringChar) {
      inString = false
    }

    current += char

    if (!inString && char === ";") {
      const trimmed = current.trim()
      if (trimmed.length > 1 && !trimmed.startsWith("--")) {
        statements.push(trimmed)
      }
      current = ""
    }
  }

  // Handle any remaining content
  const remaining = current.trim()
  if (remaining.length > 0 && !remaining.startsWith("--")) {
    statements.push(remaining)
  }

  return statements
}

// Load migrations from drizzle directory
function loadMigrations(drizzleDir: string): MigrationFile[] {
  const journalPath = path.join(drizzleDir, "meta", "_journal.json")

  if (!fs.existsSync(journalPath)) {
    throw new Error(`Drizzle journal not found at ${journalPath}`)
  }

  const journal: Journal = JSON.parse(fs.readFileSync(journalPath, "utf-8"))
  const migrations: MigrationFile[] = []

  for (const entry of journal.entries) {
    const filename = `${entry.tag}.sql`
    const filepath = path.join(drizzleDir, filename)

    if (!fs.existsSync(filepath)) {
      log.warn(`Migration file not found: ${filename}`)
      continue
    }

    const sql = fs.readFileSync(filepath, "utf-8")
    const statements = parseSqlStatements(sql)

    migrations.push({
      filename,
      filepath,
      tag: entry.tag,
      idx: entry.idx,
      timestamp: entry.when,
      sql,
      statements,
    })
  }

  // Sort by index to ensure correct order
  return migrations.sort((a, b) => a.idx - b.idx)
}

// Load additional custom migrations from migrations subdirectory
function loadCustomMigrations(drizzleDir: string): MigrationFile[] {
  const migrationsDir = path.join(drizzleDir, "migrations")
  const migrations: MigrationFile[] = []

  if (!fs.existsSync(migrationsDir)) {
    return migrations
  }

  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith(".sql"))
    .sort()

  for (let i = 0; i < files.length; i++) {
    const filename = files[i]
    const filepath = path.join(migrationsDir, filename)
    const sql = fs.readFileSync(filepath, "utf-8")
    const statements = parseSqlStatements(sql)
    const tag = `custom_${filename.replace(".sql", "")}`

    migrations.push({
      filename,
      filepath,
      tag,
      idx: 1000 + i, // Custom migrations have higher indices
      timestamp: fs.statSync(filepath).mtimeMs,
      sql,
      statements,
    })
  }

  return migrations
}

// Ensure migrations tracking table exists
async function ensureMigrationsTable(sql: Sql): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS _drizzle_migrations (
      id SERIAL PRIMARY KEY,
      tag TEXT NOT NULL UNIQUE,
      hash TEXT NOT NULL,
      applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
      execution_time_ms INTEGER NOT NULL DEFAULT 0,
      statements_count INTEGER NOT NULL DEFAULT 0,
      rollback_order INTEGER,
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    )
  `

  // Add index for efficient lookups
  await sql`
    CREATE INDEX IF NOT EXISTS idx_drizzle_migrations_tag
    ON _drizzle_migrations(tag)
  `
}

// Get applied migrations from database
async function getAppliedMigrations(sql: Sql): Promise<MigrationRecord[]> {
  const result = await sql<MigrationRecord[]>`
    SELECT id, tag, hash, applied_at, execution_time_ms, statements_count
    FROM _drizzle_migrations
    ORDER BY id ASC
  `
  return result
}

// Check if migration was already applied
function isMigrationApplied(migration: MigrationFile, applied: MigrationRecord[]): boolean {
  return applied.some(a => a.tag === migration.tag)
}

// Get pending migrations
function getPendingMigrations(all: MigrationFile[], applied: MigrationRecord[]): MigrationFile[] {
  return all.filter(m => !isMigrationApplied(m, applied))
}

// Verify migration was applied correctly
async function verifyMigration(sql: Sql, migration: MigrationFile): Promise<boolean> {
  try {
    // For CREATE TABLE statements, verify the table exists
    const tableMatches = migration.sql.match(/CREATE TABLE(?:\s+IF NOT EXISTS)?\s+["']?(\w+)["']?/gi)
    if (tableMatches) {
      for (const match of tableMatches) {
        const tableName = match.replace(/CREATE TABLE(?:\s+IF NOT EXISTS)?\s+["']?/i, "").replace(/["']$/, "")
        const result = await sql`
          SELECT EXISTS (
            SELECT FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_name = ${tableName.toLowerCase()}
          ) as exists
        `
        if (!result[0]?.exists) {
          log.warn(`Verification: Table ${tableName} was not created`)
          return false
        }
      }
    }

    // For CREATE INDEX statements, verify the index exists
    const indexMatches = migration.sql.match(/CREATE(?:\s+UNIQUE)?\s+INDEX(?:\s+IF NOT EXISTS)?\s+["']?(\w+)["']?/gi)
    if (indexMatches) {
      for (const match of indexMatches) {
        const indexName = match.replace(/CREATE(?:\s+UNIQUE)?\s+INDEX(?:\s+IF NOT EXISTS)?\s+["']?/i, "").replace(/["']$/, "")
        const result = await sql`
          SELECT EXISTS (
            SELECT FROM pg_indexes
            WHERE schemaname = 'public'
            AND indexname = ${indexName.toLowerCase()}
          ) as exists
        `
        if (!result[0]?.exists) {
          log.warn(`Verification: Index ${indexName} was not created`)
          return false
        }
      }
    }

    return true
  } catch (error) {
    log.error(`Verification failed: ${error}`)
    return false
  }
}

// Apply a single migration with transaction
async function applyMigration(
  sql: Sql,
  migration: MigrationFile,
  dryRun: boolean,
  verbose: boolean
): Promise<{ success: boolean; executionTime: number }> {
  const startTime = Date.now()
  const hash = hashMigration(migration.sql)

  if (dryRun) {
    log.step(`[DRY-RUN] Would apply: ${migration.tag}`)
    if (verbose) {
      log.dim(`  Statements: ${migration.statements.length}`)
      migration.statements.forEach((stmt, i) => {
        const preview = stmt.substring(0, 100).replace(/\n/g, " ")
        log.dim(`  ${i + 1}. ${preview}${stmt.length > 100 ? "..." : ""}`)
      })
    }
    return { success: true, executionTime: 0 }
  }

  log.step(`Applying: ${migration.tag} (${migration.statements.length} statements)`)

  try {
    // Execute all statements in a transaction
    await sql.begin(async (tx) => {
      for (let i = 0; i < migration.statements.length; i++) {
        const statement = migration.statements[i]
        if (verbose) {
          const preview = statement.substring(0, 80).replace(/\n/g, " ")
          log.dim(`  Executing ${i + 1}/${migration.statements.length}: ${preview}...`)
        }

        try {
          await tx.unsafe(statement)
        } catch (stmtError: any) {
          // Handle "already exists" errors gracefully
          if (stmtError.message?.includes("already exists")) {
            if (verbose) {
              log.dim(`  Skipped (already exists): ${statement.substring(0, 50)}...`)
            }
          } else {
            throw stmtError
          }
        }
      }

      // Record the migration
      const rollbackOrder = await tx<{ max: number }[]>`
        SELECT COALESCE(MAX(rollback_order), 0) + 1 as max FROM _drizzle_migrations
      `

      await tx`
        INSERT INTO _drizzle_migrations (tag, hash, execution_time_ms, statements_count, rollback_order)
        VALUES (
          ${migration.tag},
          ${hash},
          ${Date.now() - startTime},
          ${migration.statements.length},
          ${rollbackOrder[0]?.max ?? 1}
        )
      `
    })

    // Verify the migration
    const verified = await verifyMigration(sql, migration)
    if (!verified) {
      log.warn(`Migration ${migration.tag} applied but verification had warnings`)
    }

    const executionTime = Date.now() - startTime
    log.success(`Applied ${migration.tag} in ${executionTime}ms`)

    return { success: true, executionTime }
  } catch (error: any) {
    const executionTime = Date.now() - startTime
    log.error(`Failed to apply ${migration.tag}: ${error.message}`)

    if (verbose) {
      console.error(error)
    }

    return { success: false, executionTime }
  }
}

// Show migration status
async function showStatus(sql: Sql, allMigrations: MigrationFile[]): Promise<void> {
  log.header("Migration Status")

  const applied = await getAppliedMigrations(sql)
  const pending = getPendingMigrations(allMigrations, applied)

  console.log(`${colors.bright}Applied Migrations:${colors.reset}`)
  if (applied.length === 0) {
    log.dim("  No migrations have been applied yet")
  } else {
    for (const migration of applied) {
      const date = new Date(migration.applied_at).toISOString().split("T")[0]
      console.log(`  ${colors.green}[APPLIED]${colors.reset} ${migration.tag}`)
      log.dim(`           Applied: ${date} | Time: ${migration.execution_time_ms}ms | Statements: ${migration.statements_count}`)
    }
  }

  console.log(`\n${colors.bright}Pending Migrations:${colors.reset}`)
  if (pending.length === 0) {
    log.dim("  All migrations are up to date")
  } else {
    for (const migration of pending) {
      const date = new Date(migration.timestamp).toISOString().split("T")[0]
      console.log(`  ${colors.yellow}[PENDING]${colors.reset} ${migration.tag}`)
      log.dim(`           Created: ${date} | Statements: ${migration.statements.length}`)
    }
  }

  console.log(`\n${colors.bright}Summary:${colors.reset}`)
  console.log(`  Total: ${allMigrations.length} | Applied: ${applied.length} | Pending: ${pending.length}`)
}

// Show rollback information
async function showRollbackInfo(sql: Sql): Promise<void> {
  log.header("Rollback Information")

  const applied = await sql<MigrationRecord[]>`
    SELECT id, tag, hash, applied_at, rollback_order
    FROM _drizzle_migrations
    ORDER BY rollback_order DESC
    LIMIT 10
  `

  if (applied.length === 0) {
    log.info("No migrations to rollback")
    return
  }

  console.log(`${colors.bright}Migrations (in rollback order):${colors.reset}`)
  for (const migration of applied) {
    const date = new Date(migration.applied_at).toISOString()
    console.log(`  ${colors.cyan}[${migration.id}]${colors.reset} ${migration.tag}`)
    log.dim(`      Applied: ${date}`)
  }

  log.warn("\nNote: Automatic rollback is not supported.")
  log.warn("To rollback, you must manually create a new migration with the reverse operations.")
  log.warn("Example: If migration created a table, the rollback migration would DROP that table.")
}

// Prompt for confirmation
async function confirm(message: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    rl.question(`${colors.yellow}${message} (y/N): ${colors.reset}`, (answer) => {
      rl.close()
      resolve(answer.toLowerCase() === "y" || answer.toLowerCase() === "yes")
    })
  })
}

// Show help
function showHelp(): void {
  console.log(`
${colors.bright}Database Migration Script${colors.reset}

${colors.cyan}Usage:${colors.reset}
  npx tsx scripts/run-migrations.ts [options]

${colors.cyan}Options:${colors.reset}
  --status     Show migration status without applying changes
  --dry-run    Preview changes without applying them to the database
  --force      Skip confirmation prompts
  --rollback   Show rollback information for applied migrations
  --verbose    Show detailed output including SQL statements
  --help, -h   Show this help message

${colors.cyan}Examples:${colors.reset}
  # Check migration status
  npx tsx scripts/run-migrations.ts --status

  # Preview pending migrations
  npx tsx scripts/run-migrations.ts --dry-run --verbose

  # Apply all pending migrations (with confirmation)
  npx tsx scripts/run-migrations.ts

  # Apply migrations without confirmation
  npx tsx scripts/run-migrations.ts --force

${colors.cyan}Migration Files:${colors.reset}
  Migrations are read from ./drizzle directory
  Custom migrations are read from ./drizzle/migrations directory
  Migration metadata is tracked in _drizzle_migrations table
`)
}

// Main function
async function main() {
  const args = parseArgs()

  if (args.help) {
    showHelp()
    process.exit(0)
  }

  // Check for DATABASE_URL
  if (!process.env.DATABASE_URL) {
    log.error("DATABASE_URL environment variable is not set")
    log.dim("Make sure you have a .env.local file with DATABASE_URL defined")
    process.exit(1)
  }

  log.header("Database Migration Tool")

  // Connect to database
  const sql = postgres(process.env.DATABASE_URL, {
    max: 1, // Single connection for migrations
    idle_timeout: 20,
    connect_timeout: 10,
  })

  try {
    // Test connection
    log.step("Connecting to database...")
    await sql`SELECT 1`
    log.success("Connected to database")

    // Ensure migrations table exists
    await ensureMigrationsTable(sql)

    // Get project root (one level up from scripts directory)
    const projectRoot = path.resolve(__dirname, "..")
    const drizzleDir = path.join(projectRoot, "drizzle")

    if (!fs.existsSync(drizzleDir)) {
      log.error(`Drizzle directory not found at ${drizzleDir}`)
      process.exit(1)
    }

    // Load all migrations
    log.step("Loading migrations...")
    const drizzleMigrations = loadMigrations(drizzleDir)
    const customMigrations = loadCustomMigrations(drizzleDir)
    const allMigrations = [...drizzleMigrations, ...customMigrations]

    log.info(`Found ${drizzleMigrations.length} Drizzle migrations and ${customMigrations.length} custom migrations`)

    // Handle status command
    if (args.status) {
      await showStatus(sql, allMigrations)
      await sql.end()
      process.exit(0)
    }

    // Handle rollback command
    if (args.rollback) {
      await showRollbackInfo(sql)
      await sql.end()
      process.exit(0)
    }

    // Get pending migrations
    const applied = await getAppliedMigrations(sql)
    const pending = getPendingMigrations(allMigrations, applied)

    if (pending.length === 0) {
      log.success("All migrations are up to date!")
      await sql.end()
      process.exit(0)
    }

    // Show pending migrations
    log.header("Pending Migrations")
    for (const migration of pending) {
      console.log(`  ${colors.yellow}*${colors.reset} ${migration.tag} (${migration.statements.length} statements)`)
    }

    // Backup reminder
    if (!args.dryRun) {
      console.log()
      log.warn("IMPORTANT: Ensure you have a database backup before proceeding!")
      log.dim("You can create a backup with: pg_dump -Fc $DATABASE_URL > backup.dump")
      console.log()
    }

    // Confirmation prompt (unless --force or --dry-run)
    if (!args.force && !args.dryRun) {
      const confirmed = await confirm(`Apply ${pending.length} pending migration(s)?`)
      if (!confirmed) {
        log.info("Migration cancelled")
        await sql.end()
        process.exit(0)
      }
    }

    // Apply migrations
    log.header(args.dryRun ? "Dry Run - Preview Only" : "Applying Migrations")

    let successCount = 0
    let failCount = 0
    let totalTime = 0

    for (const migration of pending) {
      const result = await applyMigration(sql, migration, args.dryRun, args.verbose)

      if (result.success) {
        successCount++
        totalTime += result.executionTime
      } else {
        failCount++
        if (!args.dryRun) {
          log.error("Migration failed. Stopping execution.")
          log.warn("The database is in a partially migrated state.")
          log.warn("Please check the error above and fix the issue before retrying.")
          break
        }
      }
    }

    // Summary
    log.header("Summary")
    if (args.dryRun) {
      console.log(`  ${colors.cyan}Mode:${colors.reset} Dry Run (no changes applied)`)
    }
    console.log(`  ${colors.green}Success:${colors.reset} ${successCount}`)
    if (failCount > 0) {
      console.log(`  ${colors.red}Failed:${colors.reset} ${failCount}`)
    }
    if (!args.dryRun && totalTime > 0) {
      console.log(`  ${colors.blue}Total Time:${colors.reset} ${totalTime}ms`)
    }

    await sql.end()
    process.exit(failCount > 0 ? 1 : 0)

  } catch (error: any) {
    log.error(`Migration failed: ${error.message}`)
    if (args.verbose) {
      console.error(error)
    }
    await sql.end()
    process.exit(1)
  }
}

// Run
main().catch((error) => {
  log.error(`Unexpected error: ${error.message}`)
  console.error(error)
  process.exit(1)
})
