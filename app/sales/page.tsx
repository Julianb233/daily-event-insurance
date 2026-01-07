import {
    TrendingUp,
    Users,
    DollarSign,
    Copy,
    CheckCircle2,
    Building2,
    ExternalLink
} from "lucide-react"
import { db, partners, policies, salesAgentProfiles } from "@/lib/db"
import { eq, sql } from "drizzle-orm"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import SalesDashboardForClient from "./_components/SalesDashboardForClient"

// Force dynamic rendering
export const dynamic = "force-dynamic"

// Helper to get current user (Mock auth for now since we don't have full session context in this context)
// In production, this would use `await auth()` or `supabase.auth.getUser()`
async function getSalesAgent() {
    // TODO: Replace with actual session logic
    // For demo/dev purposes, we'll fetch the first sales agent or creating a placeholder
    // In a real app: const session = await auth(); if (!session) redirect('/login');

    // We'll mock returning a specific sales agent ID or user ID for demonstration if auth is missing
    return { id: "mock-user-id", email: "sales@example.com", name: "Sales Agent" }
}

export default async function SalesPortalPage() {
    const user = await getSalesAgent()
    if (!user) redirect("/auth/signin")

    // Fetch Sales Agent Profile
    const agentProfile = await db!.query.salesAgentProfiles.findFirst({
        where: eq(salesAgentProfiles.userId, user.id)
    })

    // Fetch Referred Partners
    const referredPartners = await db!
        .select({
            id: partners.id,
            businessName: partners.businessName,
            status: partners.status,
            integrationType: partners.integrationType,
            totalPolicies: sql<number>`count(${policies.id})`,
            totalCommission: sql<number>`sum(${policies.commission})`
        })
        .from(partners)
        .leftJoin(policies, eq(policies.partnerId, partners.id))
        .where(eq(partners.referredBy, user.id))
        .groupBy(partners.id)

    // Calculate Aggregate Stats
    const totalReferrals = referredPartners.length
    const totalPolicies = referredPartners.reduce((acc, p) => acc + Number(p.totalPolicies), 0)
    const lifetimeCommission = referredPartners.reduce((acc, p) => acc + Number(p.totalCommission || 0), 0)

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <SalesDashboardForClient
                    stats={{
                        totalReferrals,
                        totalPolicies,
                        lifetimeCommission
                    }}
                    partners={referredPartners.map(p => ({
                        name: p.businessName,
                        type: p.integrationType || 'Unknown',
                        policies: Number(p.totalPolicies),
                        status: p.status || 'Pending',
                        comm: `$${Number(p.totalCommission || 0).toFixed(2)}`
                    }))}
                    referralCode={agentProfile?.referralCode || "GETSTARTED"}
                />
            </div>
        </div>
    )
}
