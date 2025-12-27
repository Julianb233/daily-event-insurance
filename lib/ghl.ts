/**
 * GoHighLevel (GHL) Integration Service
 *
 * Handles all interactions with the GHL API including:
 * - Contact management
 * - Document/contract signing
 * - Workflow triggers
 * - Pipeline management
 */

// GHL API Configuration
const GHL_API_BASE = 'https://rest.gohighlevel.com/v1';
const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

// Document Template IDs (configure in .env)
export const GHL_DOCUMENTS = {
  PARTNER_AGREEMENT: process.env.GHL_DOC_PARTNER_AGREEMENT_ID,
  W9_FORM: process.env.GHL_DOC_W9_ID,
  DIRECT_DEPOSIT: process.env.GHL_DOC_DIRECT_DEPOSIT_ID,
};

// Workflow IDs (configure in .env)
export const GHL_WORKFLOWS = {
  NEW_PARTNER_WELCOME: process.env.GHL_WORKFLOW_WELCOME_ID,
  DOCUMENTS_SENT: process.env.GHL_WORKFLOW_DOCS_SENT_ID,
  DOCUMENTS_COMPLETED: process.env.GHL_WORKFLOW_DOCS_COMPLETE_ID,
  PARTNER_APPROVED: process.env.GHL_WORKFLOW_APPROVED_ID,
};

// Pipeline and Stage IDs (configure in .env)
export const GHL_PIPELINE = {
  PARTNER_ONBOARDING: process.env.GHL_PIPELINE_ONBOARDING_ID,
  STAGES: {
    NEW_LEAD: process.env.GHL_STAGE_NEW_LEAD_ID,
    DOCUMENTS_SENT: process.env.GHL_STAGE_DOCS_SENT_ID,
    DOCUMENTS_PENDING: process.env.GHL_STAGE_DOCS_PENDING_ID,
    REVIEW: process.env.GHL_STAGE_REVIEW_ID,
    ACTIVE: process.env.GHL_STAGE_ACTIVE_ID,
    DECLINED: process.env.GHL_STAGE_DECLINED_ID,
  },
};

/**
 * Check if GHL is configured
 */
export function isGHLConfigured(): boolean {
  return !!(GHL_API_KEY && GHL_LOCATION_ID);
}

/**
 * Make authenticated request to GHL API
 */
async function ghlRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  if (!isGHLConfigured()) {
    throw new Error('GHL API not configured. Set GHL_API_KEY and GHL_LOCATION_ID.');
  }

  const url = `${GHL_API_BASE}${endpoint}`;
  const headers = {
    'Authorization': `Bearer ${GHL_API_KEY}`,
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`GHL API Error: ${response.status} - ${error}`);
  }

  return response.json();
}

// ============================================
// CONTACT MANAGEMENT
// ============================================

export interface GHLContact {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  tags?: string[];
  customField?: Record<string, string | boolean>;
}

export interface CreateContactParams {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  tags?: string[];
  customFields?: {
    partner_id?: string;
    business_name?: string;
    business_type?: string;
    integration_type?: string;
    partner_status?: string;
    signup_date?: string;
  };
}

/**
 * Create a new contact in GHL
 */
export async function createContact(params: CreateContactParams): Promise<GHLContact> {
  const body = {
    email: params.email,
    firstName: params.firstName,
    lastName: params.lastName,
    phone: params.phone,
    tags: params.tags || ['new-partner'],
    locationId: GHL_LOCATION_ID,
    customField: params.customFields,
  };

  return ghlRequest<GHLContact>('/contacts/', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/**
 * Update an existing contact in GHL
 */
export async function updateContact(
  contactId: string,
  params: Partial<CreateContactParams>
): Promise<GHLContact> {
  const body: Record<string, unknown> = {};

  if (params.email) body.email = params.email;
  if (params.firstName) body.firstName = params.firstName;
  if (params.lastName) body.lastName = params.lastName;
  if (params.phone) body.phone = params.phone;
  if (params.tags) body.tags = params.tags;
  if (params.customFields) body.customField = params.customFields;

  return ghlRequest<GHLContact>(`/contacts/${contactId}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

/**
 * Find a contact by email
 */
export async function findContactByEmail(email: string): Promise<GHLContact | null> {
  try {
    const response = await ghlRequest<{ contacts: GHLContact[] }>(
      `/contacts/lookup?email=${encodeURIComponent(email)}`
    );
    return response.contacts?.[0] || null;
  } catch {
    return null;
  }
}

/**
 * Add tags to a contact
 */
export async function addContactTags(contactId: string, tags: string[]): Promise<void> {
  await ghlRequest(`/contacts/${contactId}/tags`, {
    method: 'POST',
    body: JSON.stringify({ tags }),
  });
}

/**
 * Remove tags from a contact
 */
export async function removeContactTags(contactId: string, tags: string[]): Promise<void> {
  await ghlRequest(`/contacts/${contactId}/tags`, {
    method: 'DELETE',
    body: JSON.stringify({ tags }),
  });
}

// ============================================
// PIPELINE MANAGEMENT
// ============================================

export interface GHLOpportunity {
  id: string;
  name: string;
  pipelineId: string;
  pipelineStageId: string;
  status: string;
  contactId: string;
}

/**
 * Create an opportunity (pipeline card) for a contact
 */
export async function createOpportunity(
  contactId: string,
  name: string,
  pipelineId?: string,
  stageId?: string
): Promise<GHLOpportunity> {
  const body = {
    contactId,
    name,
    pipelineId: pipelineId || GHL_PIPELINE.PARTNER_ONBOARDING,
    pipelineStageId: stageId || GHL_PIPELINE.STAGES.NEW_LEAD,
    status: 'open',
    locationId: GHL_LOCATION_ID,
  };

  return ghlRequest<GHLOpportunity>('/opportunities/', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/**
 * Move an opportunity to a different stage
 */
export async function updateOpportunityStage(
  opportunityId: string,
  stageId: string
): Promise<GHLOpportunity> {
  return ghlRequest<GHLOpportunity>(`/opportunities/${opportunityId}`, {
    method: 'PUT',
    body: JSON.stringify({ pipelineStageId: stageId }),
  });
}

// ============================================
// WORKFLOW TRIGGERS
// ============================================

/**
 * Trigger a workflow for a contact
 */
export async function triggerWorkflow(
  contactId: string,
  workflowId: string
): Promise<void> {
  await ghlRequest(`/contacts/${contactId}/workflow/${workflowId}`, {
    method: 'POST',
  });
}

/**
 * Trigger the new partner welcome workflow
 */
export async function triggerWelcomeWorkflow(contactId: string): Promise<void> {
  if (GHL_WORKFLOWS.NEW_PARTNER_WELCOME) {
    await triggerWorkflow(contactId, GHL_WORKFLOWS.NEW_PARTNER_WELCOME);
  }
}

/**
 * Trigger the documents sent workflow
 */
export async function triggerDocumentsSentWorkflow(contactId: string): Promise<void> {
  if (GHL_WORKFLOWS.DOCUMENTS_SENT) {
    await triggerWorkflow(contactId, GHL_WORKFLOWS.DOCUMENTS_SENT);
  }
}

/**
 * Trigger the documents completed workflow
 */
export async function triggerDocumentsCompletedWorkflow(contactId: string): Promise<void> {
  if (GHL_WORKFLOWS.DOCUMENTS_COMPLETED) {
    await triggerWorkflow(contactId, GHL_WORKFLOWS.DOCUMENTS_COMPLETED);
  }
}

/**
 * Trigger the partner approved workflow
 */
export async function triggerApprovedWorkflow(contactId: string): Promise<void> {
  if (GHL_WORKFLOWS.PARTNER_APPROVED) {
    await triggerWorkflow(contactId, GHL_WORKFLOWS.PARTNER_APPROVED);
  }
}

// ============================================
// DOCUMENT MANAGEMENT
// ============================================

export interface GHLDocument {
  id: string;
  name: string;
  status: 'draft' | 'sent' | 'viewed' | 'signed' | 'declined' | 'expired';
  signedAt?: string;
  sentAt?: string;
}

/**
 * Send a document for signing to a contact
 */
export async function sendDocument(
  contactId: string,
  documentTemplateId: string,
  documentName: string
): Promise<GHLDocument> {
  const body = {
    contactId,
    templateId: documentTemplateId,
    name: documentName,
    locationId: GHL_LOCATION_ID,
  };

  return ghlRequest<GHLDocument>('/documents/', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/**
 * Send all partner onboarding documents
 */
export async function sendPartnerDocuments(
  contactId: string,
  businessName: string
): Promise<{
  partnerAgreement?: GHLDocument;
  w9Form?: GHLDocument;
  directDeposit?: GHLDocument;
}> {
  const results: {
    partnerAgreement?: GHLDocument;
    w9Form?: GHLDocument;
    directDeposit?: GHLDocument;
  } = {};

  if (GHL_DOCUMENTS.PARTNER_AGREEMENT) {
    results.partnerAgreement = await sendDocument(
      contactId,
      GHL_DOCUMENTS.PARTNER_AGREEMENT,
      `Partner Agreement - ${businessName}`
    );
  }

  if (GHL_DOCUMENTS.W9_FORM) {
    results.w9Form = await sendDocument(
      contactId,
      GHL_DOCUMENTS.W9_FORM,
      `W-9 Form - ${businessName}`
    );
  }

  if (GHL_DOCUMENTS.DIRECT_DEPOSIT) {
    results.directDeposit = await sendDocument(
      contactId,
      GHL_DOCUMENTS.DIRECT_DEPOSIT,
      `Direct Deposit Authorization - ${businessName}`
    );
  }

  return results;
}

/**
 * Get document status
 */
export async function getDocumentStatus(documentId: string): Promise<GHLDocument> {
  return ghlRequest<GHLDocument>(`/documents/${documentId}`);
}

// ============================================
// PARTNER ONBOARDING FLOW
// ============================================

export interface PartnerOnboardingResult {
  contact: GHLContact;
  opportunity?: GHLOpportunity;
  documents?: {
    partnerAgreement?: GHLDocument;
    w9Form?: GHLDocument;
    directDeposit?: GHLDocument;
  };
}

/**
 * Complete partner onboarding flow in GHL:
 * 1. Create or update contact
 * 2. Create opportunity in pipeline
 * 3. Send documents for signing
 * 4. Trigger welcome workflow
 */
export async function initiatePartnerOnboarding(params: {
  partnerId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  businessName: string;
  businessType: string;
  integrationType: string;
}): Promise<PartnerOnboardingResult> {
  // 1. Create or update contact
  let contact = await findContactByEmail(params.email);

  if (contact) {
    // Update existing contact
    contact = await updateContact(contact.id, {
      firstName: params.firstName,
      lastName: params.lastName,
      phone: params.phone,
      tags: ['new-partner'],
      customFields: {
        partner_id: params.partnerId,
        business_name: params.businessName,
        business_type: params.businessType,
        integration_type: params.integrationType,
        partner_status: 'pending',
        signup_date: new Date().toISOString().split('T')[0],
      },
    });
  } else {
    // Create new contact
    contact = await createContact({
      email: params.email,
      firstName: params.firstName,
      lastName: params.lastName,
      phone: params.phone,
      tags: ['new-partner'],
      customFields: {
        partner_id: params.partnerId,
        business_name: params.businessName,
        business_type: params.businessType,
        integration_type: params.integrationType,
        partner_status: 'pending',
        signup_date: new Date().toISOString().split('T')[0],
      },
    });
  }

  const result: PartnerOnboardingResult = { contact };

  // 2. Create opportunity in pipeline
  if (GHL_PIPELINE.PARTNER_ONBOARDING) {
    try {
      result.opportunity = await createOpportunity(
        contact.id,
        `Partner: ${params.businessName}`,
        GHL_PIPELINE.PARTNER_ONBOARDING,
        GHL_PIPELINE.STAGES.NEW_LEAD
      );
    } catch (error) {
      console.error('Failed to create opportunity:', error);
    }
  }

  // 3. Send documents for signing
  try {
    result.documents = await sendPartnerDocuments(contact.id, params.businessName);

    // Update contact status to documents_sent
    await updateContact(contact.id, {
      customFields: {
        partner_status: 'documents_sent',
      },
    });

    // Move opportunity to documents sent stage
    if (result.opportunity && GHL_PIPELINE.STAGES.DOCUMENTS_SENT) {
      await updateOpportunityStage(
        result.opportunity.id,
        GHL_PIPELINE.STAGES.DOCUMENTS_SENT
      );
    }
  } catch (error) {
    console.error('Failed to send documents:', error);
  }

  // 4. Trigger welcome workflow
  try {
    await triggerWelcomeWorkflow(contact.id);
  } catch (error) {
    console.error('Failed to trigger welcome workflow:', error);
  }

  return result;
}

/**
 * Update partner status when all documents are signed
 */
export async function handleDocumentsCompleted(
  contactId: string,
  opportunityId?: string
): Promise<void> {
  // Update contact status
  await updateContact(contactId, {
    customFields: {
      partner_status: 'documents_complete',
    },
  });

  // Add completed tag
  await addContactTags(contactId, ['documents-complete']);

  // Move to review stage
  if (opportunityId && GHL_PIPELINE.STAGES.REVIEW) {
    await updateOpportunityStage(opportunityId, GHL_PIPELINE.STAGES.REVIEW);
  }

  // Trigger documents completed workflow
  await triggerDocumentsCompletedWorkflow(contactId);
}

/**
 * Activate a partner after approval
 */
export async function activatePartner(
  contactId: string,
  opportunityId?: string
): Promise<void> {
  // Update contact status
  await updateContact(contactId, {
    customFields: {
      partner_status: 'active',
    },
  });

  // Update tags
  await removeContactTags(contactId, ['new-partner']);
  await addContactTags(contactId, ['active-partner']);

  // Move to active stage
  if (opportunityId && GHL_PIPELINE.STAGES.ACTIVE) {
    await updateOpportunityStage(opportunityId, GHL_PIPELINE.STAGES.ACTIVE);
  }

  // Trigger approved workflow
  await triggerApprovedWorkflow(contactId);
}

// ============================================
// WEBHOOK SIGNATURE VERIFICATION
// ============================================

/**
 * Verify GHL webhook signature (if applicable)
 * GHL uses a simple API key approach, but you can add additional verification here
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  // Implement HMAC verification if GHL provides signatures
  // For now, return true as GHL doesn't require signature verification
  return true;
}

// ============================================
// DEV MODE MOCKS
// ============================================

/**
 * Mock GHL operations for development
 */
export const mockGHL = {
  createContact: async (params: CreateContactParams): Promise<GHLContact> => ({
    id: `mock-contact-${Date.now()}`,
    email: params.email,
    firstName: params.firstName,
    lastName: params.lastName,
  }),

  initiatePartnerOnboarding: async (params: {
    partnerId: string;
    email: string;
    firstName: string;
    lastName: string;
    businessName: string;
    businessType: string;
    integrationType: string;
  }): Promise<PartnerOnboardingResult> => ({
    contact: {
      id: `mock-contact-${Date.now()}`,
      email: params.email,
      firstName: params.firstName,
      lastName: params.lastName,
    },
    opportunity: {
      id: `mock-opp-${Date.now()}`,
      name: `Partner: ${params.businessName}`,
      pipelineId: 'mock-pipeline',
      pipelineStageId: 'mock-stage',
      status: 'open',
      contactId: `mock-contact-${Date.now()}`,
    },
    documents: {
      partnerAgreement: {
        id: `mock-doc-agreement-${Date.now()}`,
        name: `Partner Agreement - ${params.businessName}`,
        status: 'sent',
        sentAt: new Date().toISOString(),
      },
      w9Form: {
        id: `mock-doc-w9-${Date.now()}`,
        name: `W-9 Form - ${params.businessName}`,
        status: 'sent',
        sentAt: new Date().toISOString(),
      },
      directDeposit: {
        id: `mock-doc-dd-${Date.now()}`,
        name: `Direct Deposit Authorization - ${params.businessName}`,
        status: 'sent',
        sentAt: new Date().toISOString(),
      },
    },
  }),
};

/**
 * Get the appropriate GHL functions based on configuration
 */
export function getGHLClient() {
  if (isGHLConfigured()) {
    return {
      createContact,
      updateContact,
      findContactByEmail,
      addContactTags,
      removeContactTags,
      createOpportunity,
      updateOpportunityStage,
      triggerWorkflow,
      sendDocument,
      sendPartnerDocuments,
      getDocumentStatus,
      initiatePartnerOnboarding,
      handleDocumentsCompleted,
      activatePartner,
    };
  }

  // Return mock functions for development
  console.log('[DEV MODE] Using mock GHL client');
  return {
    createContact: mockGHL.createContact,
    updateContact: async () => ({ id: 'mock', email: '' }),
    findContactByEmail: async () => null,
    addContactTags: async () => {},
    removeContactTags: async () => {},
    createOpportunity: async () => ({ id: 'mock', name: '', pipelineId: '', pipelineStageId: '', status: 'open', contactId: '' }),
    updateOpportunityStage: async () => ({ id: 'mock', name: '', pipelineId: '', pipelineStageId: '', status: 'open', contactId: '' }),
    triggerWorkflow: async () => {},
    sendDocument: async () => ({ id: 'mock', name: '', status: 'sent' as const }),
    sendPartnerDocuments: async () => ({}),
    getDocumentStatus: async () => ({ id: 'mock', name: '', status: 'sent' as const }),
    initiatePartnerOnboarding: mockGHL.initiatePartnerOnboarding,
    handleDocumentsCompleted: async () => {},
    activatePartner: async () => {},
  };
}
