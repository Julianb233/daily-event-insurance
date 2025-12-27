import { redirect } from "next/navigation"
import { PartnerSidebar } from "@/components/partner/PartnerSidebar"

// Development mode - bypass auth when Clerk isn't configured
const isDevMode = !process.env.CLERK_SECRET_KEY || !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

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
    // Only import and use Clerk when credentials are configured
    const { auth, currentUser } = await import("@clerk/nextjs/server")

    // Check authentication
    const { userId } = await auth()

    if (!userId) {
      redirect("/sign-in?redirect_url=/partner/dashboard")
    }

    // Check for partner role
    const user = await currentUser()
    const userRole = user?.publicMetadata?.role || user?.privateMetadata?.role

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
    </div>
  )
}
