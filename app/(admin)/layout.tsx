import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { AdminSidebar } from "@/components/admin/AdminSidebar"

// Development mode - bypass auth when NextAuth isn't configured
const isDevMode = !process.env.AUTH_SECRET

export const metadata = {
  title: "Admin Dashboard | Daily Event Insurance",
  description: "Manage partners, commissions, and system settings.",
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Dev mode bypass - skip all auth checks
  if (!isDevMode) {
    const session = await auth()

    if (!session?.user?.id) {
      redirect("/sign-in?callbackUrl=/admin/dashboard")
    }

    // Check for admin role
    const userRole = session.user.role

    if (userRole !== "admin") {
      // Not an admin, redirect to partner portal or home
      redirect("/partner/dashboard")
    }
  } else {
    console.log("[DEV MODE] Admin layout - auth checks bypassed")
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
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
