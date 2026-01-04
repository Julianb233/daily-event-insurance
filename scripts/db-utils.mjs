#!/usr/bin/env node
/**
 * Shared database utilities for scripts
 * Uses postgres-js driver (not Neon)
 */

import postgres from 'postgres'
import { config } from 'dotenv'

// Load environment variables from .env.local
config({ path: '.env.local' })

let _sql = null

export function getDb() {
  if (_sql) return _sql

  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL

  if (!connectionString) {
    throw new Error('DATABASE_URL or POSTGRES_PRISMA_URL environment variable is required')
  }

  _sql = postgres(connectionString, { ssl: 'require' })
  return _sql
}

export async function closeDb() {
  if (_sql) {
    await _sql.end()
    _sql = null
  }
}
