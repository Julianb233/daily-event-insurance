/**
 * Claims Types
 * Type definitions for the claims tracking and management system
 */

// Claim status progression
export type ClaimStatus =
  | 'submitted'
  | 'under_review'
  | 'additional_info_needed'
  | 'approved'
  | 'denied'
  | 'paid';

// Claim types based on insurance coverage
export type ClaimType =
  | 'property_damage'
  | 'bodily_injury'
  | 'equipment_loss'
  | 'event_cancellation'
  | 'liability'
  | 'weather_related'
  | 'other';

// Document types that can be uploaded
export type DocumentType =
  | 'photo'
  | 'receipt'
  | 'police_report'
  | 'medical_record'
  | 'invoice'
  | 'statement'
  | 'other';

// Timeline step for claim progression
export interface ClaimTimelineStep {
  id: string;
  status: ClaimStatus;
  title: string;
  description: string;
  timestamp: Date | null;
  isCompleted: boolean;
  isCurrent: boolean;
}

// Document attached to a claim
export interface ClaimDocument {
  id: string;
  claimId: string;
  name: string;
  type: DocumentType;
  url: string;
  size: number; // in bytes
  mimeType: string;
  uploadedAt: Date;
  uploadedBy: string;
}

// Message in claim communication thread
export interface ClaimMessage {
  id: string;
  claimId: string;
  content: string;
  senderId: string;
  senderName: string;
  senderRole: 'customer' | 'adjuster' | 'system';
  timestamp: Date;
  isRead: boolean;
  attachments?: ClaimDocument[];
}

// Claims adjuster information
export interface ClaimsAdjuster {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  availability: 'available' | 'busy' | 'unavailable';
}

// Estimated resolution time
export interface ResolutionEstimate {
  averageDays: number;
  minDays: number;
  maxDays: number;
  estimatedCompletionDate: Date;
  basedOn: string; // e.g., "similar claims in the last 90 days"
}

// Main Claim interface
export interface Claim {
  id: string;
  claimNumber: string;
  policyId: string;
  policyNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;

  // Claim details
  type: ClaimType;
  status: ClaimStatus;
  title: string;
  description: string;
  incidentDate: Date;
  reportedDate: Date;

  // Financial
  claimedAmount: number;
  approvedAmount: number | null;
  paidAmount: number | null;
  deductible: number;

  // Assignment
  adjuster: ClaimsAdjuster | null;

  // Timeline
  timeline: ClaimTimelineStep[];

  // Documents and messages
  documents: ClaimDocument[];
  messages: ClaimMessage[];

  // Resolution
  resolutionEstimate: ResolutionEstimate | null;
  resolvedAt: Date | null;
  resolution: string | null;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

// Create claim request payload
export interface CreateClaimRequest {
  policyId: string;
  type: ClaimType;
  title: string;
  description: string;
  incidentDate: Date;
  claimedAmount: number;
  documents?: File[];
}

// Claim list filters
export interface ClaimFilters {
  status?: ClaimStatus[];
  type?: ClaimType[];
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

// Claim list response with pagination
export interface ClaimsListResponse {
  claims: Claim[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// Upload document request
export interface UploadDocumentRequest {
  claimId: string;
  file: File;
  type: DocumentType;
}

// Send message request
export interface SendMessageRequest {
  claimId: string;
  content: string;
  attachments?: File[];
}

// Claim statistics for dashboard
export interface ClaimStatistics {
  total: number;
  byStatus: Record<ClaimStatus, number>;
  byType: Record<ClaimType, number>;
  averageResolutionDays: number;
  totalClaimedAmount: number;
  totalPaidAmount: number;
}
