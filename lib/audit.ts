import { db } from "@/lib/db"
import { auditLogs } from "@/lib/db/schema"

export type AuditAction = 
  | 'login_attempt' 
  | 'login_success' 
  | 'login_failed' 
  | 'logout'
  | 'create_resource'
  | 'update_resource'
  | 'delete_resource'
  | 'view_sensitive_data'
  | 'system_error'
  | 'rate_limit_exceeded'

export interface AuditEvent {
  action: AuditAction | string
  resource: string
  actorId?: string
  actorType?: 'user' | 'system' | 'partner' | 'admin'
  ipAddress?: string
  userAgent?: string
  metadata?: Record<string, any>
  changes?: Record<string, any>
}

/**
 * Log a security, compliance, or critical system event to the immutable audit log.
 * This function is fire-and-forget to avoid blocking the main request flow,
 * but it ensures errors are logged to console.
 */
export async function logAudit(event: AuditEvent) {
  try {
    if (!db) {
      console.warn('[AUDIT] Database not configured, falling back to console log', event)
      return
    }

    // Use setImmediate or similar if we wanted to be truly non-blocking, 
    // but usually calling it without 'await' is enough in Node. 
    // However, in serverless/edge, we must await it or use `waitUntil`.
    // Since we are in Next.js Server Components/Actions mostly, we should await or use context.
    
    await db.insert(auditLogs).values({
      action: event.action,
      resource: event.resource,
      actorId: event.actorId,
      actorType: event.actorType || 'system',
      ipAddress: event.ipAddress,
      userAgent: event.userAgent,
      metadata: event.metadata,
      changes: event.changes
    })
    
  } catch (error) {
    // CRITICAL: Audit logging failed. We must log this to stderr.
    console.error('[AUDIT FAILURE] Failed to write audit log:', JSON.stringify(event), error)
  }
}
