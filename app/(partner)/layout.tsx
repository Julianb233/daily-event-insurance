import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { PartnerSidebar } from "@/components/partner/PartnerSidebar"

// Development mode check - SECURITY: Use NODE_ENV, not AUTH_SECRET absence
// This ensures production ALWAYS requires auth even if AUTH_SECRET is misconfigured
const isDevMode = process.env.NODE_ENV === 'development'

export const metadata = {
  title: "Partner Portal | Daily Event Insurance",
  description: "Manage your partnership, track earnings, and access materials.",
}

export default async function PartnerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Dev mode bypass - skip all auth checks
  if (!isDevMode) {
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
    console.log("[DEV MODE] Partner layout - auth checks bypassed (NODE_ENV=development)")
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
