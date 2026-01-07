export interface SureSubmissionData {
  firstName: string;
  lastName: string; // Split from full name
  email: string;
  phone?: string;
  activity: string;
  micrositeUrl: string;
  partnerId: string;
}

export interface SurePolicyResponse {
  success: boolean;
  policyId?: string;
  policyNumber?: string;
  premium?: number;
  status?: string;
  effectiveDate?: Date;
  expirationDate?: Date;
  error?: string;
}

/**
 * Placeholder client for Sure API integration.
 * Docs: https://docs.sureapp.com/ (Reference only, actual integration TBD)
 */
export async function submitToSure(data: SureSubmissionData): Promise<SurePolicyResponse> {
  console.log('[Sure API] Submitting lead to Sure:', JSON.stringify(data, null, 2));

  // TODO: Replace with actual API call
  // const response = await fetch('https://api.sureapp.com/v1/policies', { ... })

  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 800));

  // Simulate success
  return {
    success: true,
    policyId: `sure_${Math.random().toString(36).substring(7)}`,
    policyNumber: `POL-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${Math.floor(Math.random() * 10000)}`,
    premium: 4.99,
    status: 'active',
    effectiveDate: new Date(),
    expirationDate: new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 day later
  };
}
