"use client"

import { useSession, useUser } from "@descope/react-sdk"
import { usePathname } from "next/navigation"
import { IntegrationChatWidget } from "@/components/support/IntegrationChatWidget"
import type { ConversationTopic } from "@/lib/support/types"

/**
 * Partner portal chat widget wrapper
 * Provides the IntegrationChatWidget with partner context from the session
 * and current page URL for contextual support.
 *
 * Topics are determined based on the current page:
 * - /settings -> api_integration (API keys, webhooks)
 * - /quotes -> widget_install (embedding quotes widget)
 * - /policies -> api_integration (policy management API)
 * - /materials -> widget_install (marketing materials, widget assets)
 * - /earnings -> onboarding (understanding earnings)
 * - /dashboard -> onboarding (getting started)
 * - /profile -> onboarding (account setup)
 */
export function PartnerChatWidget() {
  const { isAuthenticated } = useSession()
  const { user } = useUser()
  const pathname = usePathname()

  // Build the full page URL for context
  const pageUrl = typeof window !== "undefined"
    ? window.location.href
    : `https://dailyeventinsurance.com${pathname}`

  // Determine the topic based on the current partner portal page
  const getTopic = (): ConversationTopic => {
    if (pathname?.includes("/settings")) {
      return "api_integration"
    }
    if (pathname?.includes("/quotes")) {
      return "widget_install"
    }
    if (pathname?.includes("/policies")) {
      return "api_integration"
    }
    if (pathname?.includes("/materials")) {
      return "widget_install"
    }
    // Default for dashboard, earnings, profile, and other pages
    return "onboarding"
  }

  return (
    <IntegrationChatWidget
      partnerId={isAuthenticated ? user?.userId : undefined}
      partnerEmail={isAuthenticated ? user?.email : undefined}
      partnerName={isAuthenticated ? user?.name : undefined}
      pageUrl={pageUrl}
      topic={getTopic()}
      position="bottom-right"
      primaryColor="#14B8A6"
    />
  )
}
