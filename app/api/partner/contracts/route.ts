import { NextRequest } from "next/server"
import { requirePartner, withAuth } from "@/lib/api-auth"
import { db, isDbConfigured, contractTemplates, partnerContractSignatures, partners } from "@/lib/db"
import { eq, and, asc } from "drizzle-orm"
import { isDevMode } from "@/lib/mock-data"
import {
  successResponse,
  serverError,
  badRequest,
  conflictError,
} from "@/lib/api-responses"

// Mock contracts for partner onboarding
const mockActiveContracts = [
  {
    id: "ct1",
    name: "partnership_agreement",
    displayName: "Partnership Agreement",
    description: "Main partnership terms and conditions",
    content: `# Partnership Agreement

This Partnership Agreement ("Agreement") is entered into by and between Daily Event Insurance ("Company") and the Partner ("Partner").

## 1. Services

The Partner agrees to promote and distribute insurance products through the Company's platform.

## 2. Obligations

- Partner shall maintain accurate records
- Partner shall comply with all applicable laws
- Partner shall not misrepresent coverage terms

## 3. Term

This Agreement shall remain in effect until terminated by either party with 30 days written notice.

## 4. Confidentiality

Partner agrees to maintain the confidentiality of all proprietary information.`,
    version: 3,
    isRequired: true,
    sortOrder: 1,
    signed: false,
  },
  {
    id: "ct2",
    name: "revenue_share",
    displayName: "Revenue Share Agreement",
    description: "Commission and payout terms",
    content: `# Revenue Share Agreement

## Commission Structure

Partners earn commission based on the tier system:
- Bronze: 20% of premium
- Silver: 25% of premium
- Gold: 30% of premium

## Payment Terms

Commissions are paid monthly, within 15 business days of month end.`,
    version: 2,
    isRequired: true,
    sortOrder: 2,
    signed: false,
  },
  {
    id: "ct3",
    name: "data_processing",
    displayName: "Data Processing Agreement",
    description: "GDPR/privacy compliance terms",
    content: `# Data Processing Agreement

## Purpose

This agreement outlines how partner data is collected, processed, and protected.

## Data Protection

We comply with GDPR and applicable privacy laws.`,
    version: 1,
    isRequired: true,
    sortOrder: 3,
    signed: false,
  },
]

/**
 * GET /api/partner/contracts
 * Get active contracts partner needs to sign during onboarding
 */
export async function GET(request: NextRequest) {
  return withAuth(async () => {
    try {
      const { userId, user } = await requirePartner()

      // Dev mode
      if (isDevMode || !isDbConfigured()) {
        // Simulate some contracts already signed
        const contracts = mockActiveContracts.map((c, i) => ({
          ...c,
          signed: i === 0, // First one is signed
          signedAt: i === 0 ? "2024-12-01T00:00:00Z" : null,
        }))

        const unsignedRequired = contracts.filter(c => c.isRequired && !c.signed)

        return successResponse({
          contracts,
          allRequiredSigned: unsignedRequired.length === 0,
          pendingCount: unsignedRequired.length,
        })
      }

      // Get partner ID from user
      const [partner] = await db!
        .select()
        .from(partners)
        .where(eq(partners.userId, userId))
        .limit(1)

      if (!partner) {
        return successResponse({
          contracts: [],
          allRequiredSigned: true,
          pendingCount: 0,
        })
      }

      // Get all active contracts
      const activeContracts = await db!
        .select()
        .from(contractTemplates)
        .where(eq(contractTemplates.isActive, true))
        .orderBy(asc(contractTemplates.sortOrder))

      // Get partner's signatures
      const signatures = await db!
        .select()
        .from(partnerContractSignatures)
        .where(eq(partnerContractSignatures.partnerId, partner.id))

      // Create a map of signed contracts
      const signedMap = new Map(
        signatures.map(s => [s.contractTemplateId, s])
      )

      // Combine contracts with signature status
      const contracts = activeContracts.map(contract => ({
        id: contract.id,
        name: contract.name,
        displayName: contract.displayName,
        description: contract.description,
        content: contract.content,
        version: contract.version,
        isRequired: contract.isRequired,
        sortOrder: contract.sortOrder,
        signed: signedMap.has(contract.id),
        signedAt: signedMap.get(contract.id)?.signedAt || null,
        signedVersion: signedMap.get(contract.id)?.contractVersion || null,
      }))

      const unsignedRequired = contracts.filter(c => c.isRequired && !c.signed)

      return successResponse({
        contracts,
        allRequiredSigned: unsignedRequired.length === 0,
        pendingCount: unsignedRequired.length,
      })
    } catch (error: any) {
      console.error("[Partner Contracts] GET Error:", error)
      return serverError(error.message || "Failed to fetch contracts")
    }
  })
}

/**
 * POST /api/partner/contracts
 * Sign a contract
 */
export async function POST(request: NextRequest) {
  return withAuth(async () => {
    try {
      const { userId } = await requirePartner()

      const body = await request.json()
      const { contractId, acceptedTerms } = body

      if (!contractId) {
        return badRequest("Contract ID is required")
      }

      if (!acceptedTerms) {
        return badRequest("You must accept the terms to sign the contract")
      }

      // Get IP and user agent for audit trail
      const ipAddress = request.headers.get("x-forwarded-for")?.split(",")[0] ||
                       request.headers.get("x-real-ip") ||
                       "unknown"
      const userAgent = request.headers.get("user-agent") || "unknown"

      // Dev mode
      if (isDevMode || !isDbConfigured()) {
        const signature = {
          id: `sig_${Date.now()}`,
          partnerId: "dev_partner",
          contractTemplateId: contractId,
          contractVersion: 1,
          signedAt: new Date().toISOString(),
          ipAddress,
          userAgent: userAgent.substring(0, 255),
        }

        return successResponse(signature, "Contract signed successfully", 201)
      }

      // Get partner
      const [partner] = await db!
        .select()
        .from(partners)
        .where(eq(partners.userId, userId))
        .limit(1)

      if (!partner) {
        return badRequest("Partner profile not found")
      }

      // Get contract
      const [contract] = await db!
        .select()
        .from(contractTemplates)
        .where(eq(contractTemplates.id, contractId))
        .limit(1)

      if (!contract) {
        return badRequest("Contract not found")
      }

      if (!contract.isActive) {
        return badRequest("This contract is no longer active")
      }

      // Check if already signed
      const [existingSignature] = await db!
        .select()
        .from(partnerContractSignatures)
        .where(
          and(
            eq(partnerContractSignatures.partnerId, partner.id),
            eq(partnerContractSignatures.contractTemplateId, contractId)
          )
        )
        .limit(1)

      if (existingSignature) {
        return conflictError("You have already signed this contract")
      }

      // Create signature
      const [signature] = await db!
        .insert(partnerContractSignatures)
        .values({
          partnerId: partner.id,
          contractTemplateId: contractId,
          contractVersion: contract.version,
          contractContentSnapshot: contract.content,
          ipAddress,
          userAgent: userAgent.substring(0, 255),
        })
        .returning()

      return successResponse(signature, "Contract signed successfully", 201)
    } catch (error: any) {
      console.error("[Partner Contracts] POST Error:", error)
      return serverError(error.message || "Failed to sign contract")
    }
  })
}
