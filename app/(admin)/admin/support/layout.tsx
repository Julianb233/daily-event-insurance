import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Support Dashboard | Admin",
  description: "Manage partner support conversations and escalations",
}

export default function AdminSupportLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
