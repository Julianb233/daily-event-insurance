/**
 * Email Module Index
 * Exports all email functionality
 */

// Core email sending
export {
  sendEmail,
  verifyDomain,
  getEmailStatus,
  getResendClient,
  type EmailOptions,
  type SendEmailResult,
} from './resend'

// Email sequences
export {
  startSequence,
  pauseSequence,
  resumeSequence,
  completeSequence,
  getSequenceStatus,
  type SequenceType,
  type SequenceStep,
  type SequenceData,
} from './sequences'

// Email scheduling
export {
  scheduleEmail,
  processScheduledEmails,
  cancelScheduledEmail,
  getScheduledEmailStatus,
  retryFailedEmail,
  getSchedulerStats,
  type ScheduleEmailOptions,
} from './scheduler'

// Outbound campaigns (Hormozi-style)
export {
  startOutboundSequence,
  stopOutboundSequence,
  getOutboundSequenceStatus,
  type OutboundSequenceType,
} from './sequences-outbound'

export {
  getEmailTemplate,
  sequenceTiming,
  gymEmails,
  wellnessEmails,
  skiResortEmails,
  fitnessEmails,
  type EmailTemplateData,
} from './templates/outbound'
