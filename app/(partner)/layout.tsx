import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { PartnerSidebar } from "@/components/partner/PartnerSidebar"
import { PartnerChatWidget } from "@/components/partner/PartnerChatWidget"

// Development mode - bypass auth when NextAuth isn't configured
const isDevMode = !process.env.AUTH_SECRET

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

    if (!(session as any)?.user?.id) {
      redirect("/sign-in?callbackUrl=/partner/dashboard")
    }

    // Check for partner role
    const userRole = (session as any).user.role

    // Allow partner or admin roles
    if (userRole !== "partner" && userRole !== "admin") {
      // If not a partner yet, redirect to onboarding
      redirect("/onboarding")
    }
  } else {
    console.log("[DEV MODE] Partner layout - auth checks bypassed")
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
      {/* Integration support chat widget - available on all partner pages */}
      <PartnerChatWidget />
    </div>
  )
}
