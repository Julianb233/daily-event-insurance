import type { Metadata } from "next"
import UnderwritingLandingContent from "./UnderwritingLandingContent"

export const metadata: Metadata = {
  title: "Underwriting Intelligence for Carriers | Daily Event Insurance",
  description: "Transform your underwriting with real-time activity signals, precise risk windows, behavioral data, and verified participation. Access data advantages traditional carriers can't match.",
  openGraph: {
    title: "Underwriting Intelligence for Carriers",
    description: "Real-time activity data, precise risk windows, and verified participation eliminate fraud and enable smarter pricing.",
    type: "website",
  },
}

export default function UnderwritingLandingPage() {
  return <UnderwritingLandingContent />
}
