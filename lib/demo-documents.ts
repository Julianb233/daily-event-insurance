// Demo document templates for partner onboarding
// These can be edited by admins at /admin/documents

export const DOCUMENT_TYPES = {
  PARTNER_AGREEMENT: "partner_agreement",
  W9: "w9",
  DIRECT_DEPOSIT: "direct_deposit",
} as const

export type DocumentType = (typeof DOCUMENT_TYPES)[keyof typeof DOCUMENT_TYPES]

export interface DocumentTemplate {
  type: DocumentType
  title: string
  content: string
  version: string
}

export const demoDocuments: DocumentTemplate[] = [
  {
    type: DOCUMENT_TYPES.PARTNER_AGREEMENT,
    title: "Partner Agreement",
    version: "1.0",
    content: `
# Daily Event Insurance Partner Agreement

**Effective Date:** Upon Digital Signature

This Partner Agreement ("Agreement") is entered into between Daily Event Insurance ("Company") and the undersigned partner ("Partner").

## 1. Purpose

This Agreement establishes the terms under which Partner will refer customers to Company for daily event insurance products.

## 2. Partner Responsibilities

Partner agrees to:

- **Promote Products**: Integrate Company's insurance offerings into their booking or check-in process
- **Accurate Information**: Provide accurate information about coverage options to customers
- **Customer Service**: Assist customers with basic questions about coverage
- **Compliance**: Comply with all applicable laws and regulations regarding insurance referrals
- **Branding Guidelines**: Use Company-approved marketing materials and branding

## 3. Commission Structure

Partner will receive commissions as follows:

| Monthly Volume | Commission Rate |
|---------------|-----------------|
| 1-50 policies | 40% of premium |
| 51-150 policies | 45% of premium |
| 151-300 policies | 50% of premium |
| 301+ policies | 55% of premium |

Commissions are calculated monthly and paid within 15 business days of month-end via the payment method specified in the Direct Deposit Authorization.

## 4. Term and Termination

- **Term**: This Agreement is effective for 12 months and auto-renews annually
- **Termination**: Either party may terminate with 30 days written notice
- **Effect of Termination**: Partner will receive commissions for policies sold prior to termination

## 5. Intellectual Property

Partner is granted a limited, non-exclusive license to use Company trademarks and marketing materials solely for promoting Company products.

## 6. Confidentiality

Partner agrees to maintain confidentiality of all non-public information shared by Company, including commission rates, customer data, and business strategies.

## 7. Limitation of Liability

Company's liability under this Agreement is limited to unpaid commissions. Neither party shall be liable for indirect, incidental, or consequential damages.

## 8. Governing Law

This Agreement is governed by the laws of the State of California.

---

By signing below, Partner acknowledges reading, understanding, and agreeing to all terms of this Agreement.
`,
  },
  {
    type: DOCUMENT_TYPES.W9,
    title: "W-9 Tax Information",
    version: "1.0",
    content: `
# W-9 Request for Taxpayer Identification Number

**Purpose:** To provide your tax identification information for commission payments.

> **Important:** This is a simplified collection form. For complete IRS W-9, visit [irs.gov](https://www.irs.gov/forms-pubs/about-form-w-9).

---

## Part I: Identification

Please provide the following information for tax reporting purposes:

### Business Information
- **Legal Business Name:** (as shown on your tax return)
- **Business Name/DBA:** (if different from above)
- **Federal Tax Classification:**
  - [ ] Individual/Sole Proprietor
  - [ ] C Corporation
  - [ ] S Corporation
  - [ ] Partnership
  - [ ] LLC (specify classification)
  - [ ] Other

### Tax Identification
- **Taxpayer Identification Number (TIN):**
  - Social Security Number (SSN): XXX-XX-XXXX
  - OR Employer Identification Number (EIN): XX-XXXXXXX

### Address
- **Street Address:**
- **City, State, ZIP:**

---

## Part II: Certification

Under penalties of perjury, I certify that:

1. The number shown on this form is my correct taxpayer identification number
2. I am not subject to backup withholding
3. I am a U.S. citizen or other U.S. person
4. The FATCA code(s) entered on this form (if any) is correct

---

**The IRS does not require your consent to any provision of this document other than the certifications required to avoid backup withholding.**

By signing below, you certify that the information provided is accurate and complete.
`,
  },
  {
    type: DOCUMENT_TYPES.DIRECT_DEPOSIT,
    title: "Direct Deposit Authorization",
    version: "1.0",
    content: `
# Direct Deposit Authorization Form

**Purpose:** To authorize Daily Event Insurance to deposit commission payments directly to your bank account.

---

## Authorization

I hereby authorize Daily Event Insurance to initiate credit entries (deposits) to my account at the financial institution named below. I also authorize the financial institution to credit the same to such account.

## Bank Account Information

### Account Holder
- **Name on Account:**
- **Account Type:**
  - [ ] Checking
  - [ ] Savings

### Bank Details
- **Bank Name:**
- **Routing Number:** (9 digits)
- **Account Number:**

### Verification
Please attach a voided check or bank statement showing your account and routing numbers.

---

## Terms and Conditions

1. **Effective Date**: This authorization will remain in effect until I notify Daily Event Insurance in writing to cancel it.

2. **Processing Time**: Please allow up to 15 business days for initial setup. Standard commission payments are processed within 15 business days of month-end.

3. **Changes**: To change bank information, I must submit a new authorization form at least 10 business days before the next payment date.

4. **Errors**: If an erroneous deposit is made, I authorize Daily Event Insurance to debit my account to correct the error.

5. **Account Closure**: I will notify Daily Event Insurance immediately if I close the designated account.

---

## Signature

By signing below, I authorize Direct Deposit payments and confirm that:
- I am the account holder or authorized signer
- The bank information provided is accurate
- I understand and agree to the terms above
`,
  },
]

// Helper to get document by type
export function getDocumentByType(type: DocumentType): DocumentTemplate | undefined {
  return demoDocuments.find((doc) => doc.type === type)
}

// Helper to get all document types with their titles
export function getDocumentTypesWithTitles(): { type: DocumentType; title: string }[] {
  return demoDocuments.map((doc) => ({
    type: doc.type,
    title: doc.title,
  }))
}
