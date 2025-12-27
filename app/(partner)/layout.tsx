import { ClerkProvider } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { auth, currentUser } from "@clerk/nextjs/server"
import { PartnerSidebar } from "@/components/partner/PartnerSidebar"

export const metadata = {
  title: "Partner Portal | Daily Event Insurance",
  description: "Manage your partnership, track earnings, and access materials.",
}

export default async function PartnerLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
