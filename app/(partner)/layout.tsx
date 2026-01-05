import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { PartnerSidebar } from "@/components/partner/PartnerSidebar"

// Partner portal requires request-time auth; do not prerender at build time.
export const dynamic = "force-dynamic"

// SECURITY: Dev mode auth bypass requires explicit opt-in
// Bypass ONLY if ALL conditions are met:
// 1. NODE_ENV === 'development'
// 2. DEV_AUTH_BYPASS === 'true' (explicit opt-in)
// 3. AUTH_SECRET is NOT set (prevents bypass in prod-like environments)
const shouldBypassAuth =
  process.env.NODE_ENV === 'development' &&
  process.env.DEV_AUTH_BYPASS === 'true' &&
  !process.env.AUTH_SECRET

export const metadata = {
  title: "Partner Portal | Daily Event Insurance",
  description: "Manage your partnership, track earnings, and access materials.",
}

export default async function PartnerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // SECURITY: Bypass requires explicit DEV_AUTH_BYPASS=true
  if (!shouldBypassAuth) {
    const session = await auth()

    if (!session?.user?.id) {
      redirect("/sign-in?callbackUrl=/partner/dashboard")
    }

    // Check for partner role
    const userRole = session.user.role

    // Allow partner or admin roles
    if (userRole !== "partner" && userRole !== "admin") {
      // If not a partner yet, redirect to onboarding
      redirect("/onboarding")
    }
  } else {
    console.warn("[DEV MODE] Partner layout - auth checks bypassed (DEV_AUTH_BYPASS=true)")
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <PartnerSidebar />
      {/* Main content area */}
      <main className="lg:pl-72">
        {/* Mobile header spacer */}
        <div className="lg:hidden h-14" />
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  )
}
