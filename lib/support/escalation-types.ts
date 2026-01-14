// Type definitions for Escalation Queue functionality

export type EscalationPriority = "low" | "normal" | "high" | "urgent"

export type EscalationReason =
  | "technical_issue"
  | "billing_dispute"
  | "account_problem"
  | "integration_failure"
  | "security_concern"
  | "compliance_issue"
  | "custom"

export const ESCALATION_REASONS: { value: EscalationReason; label: string }[] = [
  { value: "technical_issue", label: "Technical Issue" },
  { value: "billing_dispute", label: "Billing Dispute" },
  { value: "account_problem", label: "Account Problem" },
  { value: "integration_failure", label: "Integration Failure" },
  { value: "security_concern", label: "Security Concern" },
  { value: "compliance_issue", label: "Compliance Issue" },
  { value: "custom", label: "Other" },
]

export const PRIORITY_CONFIG: Record<EscalationPriority, {
  label: string
  color: string
  bgColor: string
  sortOrder: number
}> = {
  urgent: {
    label: "Urgent",
    color: "text-red-700",
    bgColor: "bg-red-100",
    sortOrder: 0
  },
  high: {
    label: "High",
    color: "text-orange-700",
    bgColor: "bg-orange-100",
    sortOrder: 1
  },
  normal: {
    label: "Normal",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
    sortOrder: 2
  },
  low: {
    label: "Low",
    color: "text-slate-700",
    bgColor: "bg-slate-100",
    sortOrder: 3
  },
}

export interface EscalatedConversation {
  id: string
  partnerId: string | null
  partnerEmail: string | null
  partnerName: string | null
  sessionId: string
  pageUrl: string | null
  onboardingStep: number | null
  topic: string | null
  techStack: string | null
  integrationContext: string | null
  status: string
  priority: EscalationPriority
  escalatedAt: string
  escalatedTo: string | null
  escalatedToName?: string | null
  escalationReason: string | null
  resolution: string | null
  resolvedAt: string | null
  helpfulRating: number | null
  feedback: string | null
  createdAt: string
  updatedAt: string
  messageCount?: number
  lastMessageAt?: string
}

export interface TeamMember {
  id: string
  name: string
  email: string
  role: string
}

export interface EscalateConversationRequest {
  reason: EscalationReason
  priority: EscalationPriority
  notes?: string
  assignTo?: string
}

export interface AssignEscalationRequest {
  assignTo: string
}

export interface EscalationSummary {
  total: number
  byPriority: Record<EscalationPriority, number>
  unassigned: number
  avgTimeToAssign: number | null
}
