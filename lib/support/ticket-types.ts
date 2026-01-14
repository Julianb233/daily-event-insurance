// Support Ticket Types and Interfaces

/**
 * Ticket status enum
 * Represents the lifecycle of a support ticket
 */
export enum TicketStatus {
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  WAITING_CUSTOMER = "waiting_customer",
  RESOLVED = "resolved",
  CLOSED = "closed",
}

/**
 * Ticket priority enum
 * Determines urgency and SLA response times
 */
export enum TicketPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

/**
 * Ticket category enum
 * Categorizes tickets for routing and reporting
 */
export enum TicketCategory {
  BILLING = "billing",
  TECHNICAL = "technical",
  INTEGRATION = "integration",
  GENERAL = "general",
}

/**
 * Support Ticket interface
 * Core ticket data structure
 */
export interface Ticket {
  id: string
  ticketNumber: string // Format: #DEI-XXXXX
  subject: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  category: TicketCategory

  // Contact information
  contactName: string
  contactEmail: string

  // Relationships
  userId?: string | null
  partnerId?: string | null
  assignedTo?: string | null

  // Timestamps
  createdAt: Date
  updatedAt: Date
  resolvedAt?: Date | null
  closedAt?: Date | null

  // Metadata
  metadata?: Record<string, any> | null
}

/**
 * New Ticket creation interface
 * Fields required to create a new ticket
 */
export interface NewTicket {
  subject: string
  description: string
  priority?: TicketPriority
  category?: TicketCategory
  contactName: string
  contactEmail: string
  userId?: string | null
  partnerId?: string | null
  metadata?: Record<string, any> | null
}

/**
 * Ticket update interface
 * Fields that can be updated on an existing ticket
 */
export interface TicketUpdate {
  subject?: string
  description?: string
  status?: TicketStatus
  priority?: TicketPriority
  category?: TicketCategory
  assignedTo?: string | null
  resolvedAt?: Date | null
  closedAt?: Date | null
  metadata?: Record<string, any> | null
}

/**
 * Ticket reply interface
 * For adding responses to tickets
 */
export interface TicketReply {
  id: string
  ticketId: string
  content: string
  isInternal: boolean // Internal notes vs customer-visible replies
  authorId: string
  authorName: string
  authorRole: "customer" | "support" | "admin"
  createdAt: Date
  attachments?: TicketAttachment[]
}

/**
 * Ticket attachment interface
 */
export interface TicketAttachment {
  id: string
  fileName: string
  fileUrl: string
  fileSize: number
  mimeType: string
  uploadedAt: Date
}

/**
 * Ticket filter options for listing
 */
export interface TicketFilterOptions {
  status?: TicketStatus | TicketStatus[]
  priority?: TicketPriority | TicketPriority[]
  category?: TicketCategory | TicketCategory[]
  userId?: string
  partnerId?: string
  assignedTo?: string
  searchQuery?: string
  startDate?: Date
  endDate?: Date
}

/**
 * Status display configuration
 */
export const STATUS_CONFIG: Record<TicketStatus, { label: string; color: string; bgColor: string }> = {
  [TicketStatus.OPEN]: {
    label: "Open",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
  },
  [TicketStatus.IN_PROGRESS]: {
    label: "In Progress",
    color: "text-yellow-700",
    bgColor: "bg-yellow-100",
  },
  [TicketStatus.WAITING_CUSTOMER]: {
    label: "Awaiting Reply",
    color: "text-purple-700",
    bgColor: "bg-purple-100",
  },
  [TicketStatus.RESOLVED]: {
    label: "Resolved",
    color: "text-green-700",
    bgColor: "bg-green-100",
  },
  [TicketStatus.CLOSED]: {
    label: "Closed",
    color: "text-slate-700",
    bgColor: "bg-slate-100",
  },
}

/**
 * Priority display configuration
 */
export const PRIORITY_CONFIG: Record<TicketPriority, { label: string; color: string; bgColor: string }> = {
  [TicketPriority.LOW]: {
    label: "Low",
    color: "text-slate-600",
    bgColor: "bg-slate-100",
  },
  [TicketPriority.MEDIUM]: {
    label: "Medium",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  [TicketPriority.HIGH]: {
    label: "High",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  [TicketPriority.URGENT]: {
    label: "Urgent",
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
}

/**
 * Category display configuration
 */
export const CATEGORY_CONFIG: Record<TicketCategory, { label: string; icon: string }> = {
  [TicketCategory.BILLING]: {
    label: "Billing",
    icon: "CreditCard",
  },
  [TicketCategory.TECHNICAL]: {
    label: "Technical",
    icon: "Wrench",
  },
  [TicketCategory.INTEGRATION]: {
    label: "Integration",
    icon: "Plug",
  },
  [TicketCategory.GENERAL]: {
    label: "General",
    icon: "MessageCircle",
  },
}

/**
 * Generate a unique ticket number
 * Format: #DEI-XXXXX (5 random alphanumeric characters)
 */
export function generateTicketNumber(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return `#DEI-${result}`
}

/**
 * Calculate SLA response time based on priority
 * Returns hours
 */
export function getSLAResponseTime(priority: TicketPriority): number {
  switch (priority) {
    case TicketPriority.URGENT:
      return 1 // 1 hour
    case TicketPriority.HIGH:
      return 4 // 4 hours
    case TicketPriority.MEDIUM:
      return 8 // 8 hours (1 business day)
    case TicketPriority.LOW:
      return 24 // 24 hours
    default:
      return 8
  }
}

/**
 * Check if a ticket is overdue based on SLA
 */
export function isTicketOverdue(ticket: Ticket): boolean {
  if (ticket.status === TicketStatus.RESOLVED || ticket.status === TicketStatus.CLOSED) {
    return false
  }

  const slaHours = getSLAResponseTime(ticket.priority)
  const createdAt = new Date(ticket.createdAt).getTime()
  const now = Date.now()
  const elapsedHours = (now - createdAt) / (1000 * 60 * 60)

  return elapsedHours > slaHours
}
