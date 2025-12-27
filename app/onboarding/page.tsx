import OnboardingForm from "./onboarding-form"

// Force dynamic rendering to avoid prerendering issues with Clerk's useUser hook
export const dynamic = 'force-dynamic'

export default function OnboardingPage() {
  return <OnboardingForm />
}
