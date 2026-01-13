"use client"

import { useEffect } from 'react'
import { useVoiceAgent, type ScreenType, type JourneyStage, type VoiceContextData } from '@/lib/voice/voice-context'

interface VoiceContextSetterProps {
  screenType: ScreenType
  screenName: string
  journeyStage: JourneyStage
  userName?: string
  userEmail?: string
  businessName?: string
  businessType?: string
  onboardingStep?: number
  onboardingTotalSteps?: number
  currentStepName?: string
  completedSteps?: string[]
  selectedProducts?: string[]
  partnerId?: string
  partnerTier?: string
  totalEarnings?: number
  customContext?: string
  suggestedTopics?: string[]
}

/**
 * Component to set voice agent context for a page
 * Include this component in any page to provide context to the voice agent
 *
 * @example
 * // In an onboarding page:
 * <VoiceContextSetter
 *   screenType="onboarding-business"
 *   screenName="Business Information"
 *   journeyStage="onboarding"
 *   onboardingStep={1}
 *   onboardingTotalSteps={5}
 *   currentStepName="Business Details"
 * />
 */
export function VoiceContextSetter({
  screenType,
  screenName,
  journeyStage,
  userName,
  userEmail,
  businessName,
  businessType,
  onboardingStep,
  onboardingTotalSteps,
  currentStepName,
  completedSteps,
  selectedProducts,
  partnerId,
  partnerTier,
  totalEarnings,
  customContext,
  suggestedTopics,
}: VoiceContextSetterProps) {
  const { updateContext } = useVoiceAgent()

  useEffect(() => {
    const contextUpdate: Partial<VoiceContextData> = {
      screenType,
      screenName,
      journeyStage,
    }

    // Add optional fields only if provided
    if (userName !== undefined) contextUpdate.userName = userName
    if (userEmail !== undefined) contextUpdate.userEmail = userEmail
    if (businessName !== undefined) contextUpdate.businessName = businessName
    if (businessType !== undefined) contextUpdate.businessType = businessType
    if (onboardingStep !== undefined) contextUpdate.onboardingStep = onboardingStep
    if (onboardingTotalSteps !== undefined) contextUpdate.onboardingTotalSteps = onboardingTotalSteps
    if (currentStepName !== undefined) contextUpdate.currentStepName = currentStepName
    if (completedSteps !== undefined) contextUpdate.completedSteps = completedSteps
    if (selectedProducts !== undefined) contextUpdate.selectedProducts = selectedProducts
    if (partnerId !== undefined) contextUpdate.partnerId = partnerId
    if (partnerTier !== undefined) contextUpdate.partnerTier = partnerTier
    if (totalEarnings !== undefined) contextUpdate.totalEarnings = totalEarnings
    if (customContext !== undefined) contextUpdate.customContext = customContext
    if (suggestedTopics !== undefined) contextUpdate.suggestedTopics = suggestedTopics

    updateContext(contextUpdate)
  }, [
    screenType,
    screenName,
    journeyStage,
    userName,
    userEmail,
    businessName,
    businessType,
    onboardingStep,
    onboardingTotalSteps,
    currentStepName,
    completedSteps,
    selectedProducts,
    partnerId,
    partnerTier,
    totalEarnings,
    customContext,
    suggestedTopics,
    updateContext,
  ])

  // This component doesn't render anything
  return null
}

/**
 * Pre-configured context setters for common pages
 */

export function HomePageContext() {
  return (
    <VoiceContextSetter
      screenType="home"
      screenName="Homepage"
      journeyStage="discovery"
      suggestedTopics={[
        "How our platform works",
        "Commission structure",
        "Integration process",
        "Partner success stories",
      ]}
    />
  )
}

export function PricingPageContext() {
  return (
    <VoiceContextSetter
      screenType="pricing"
      screenName="Pricing"
      journeyStage="consideration"
      suggestedTopics={[
        "Commission tiers explained",
        "ROI calculator",
        "No hidden fees",
      ]}
    />
  )
}

export function AboutPageContext() {
  return (
    <VoiceContextSetter
      screenType="about"
      screenName="About Us"
      journeyStage="discovery"
      suggestedTopics={[
        "Our mission and vision",
        "Team background",
        "Why we built this",
      ]}
    />
  )
}

export function HelpPageContext() {
  return (
    <VoiceContextSetter
      screenType="help"
      screenName="Help Center"
      journeyStage="support"
      suggestedTopics={[
        "Common questions",
        "Technical support",
        "Contact options",
      ]}
    />
  )
}

export function CarriersPageContext() {
  return (
    <VoiceContextSetter
      screenType="carriers"
      screenName="For Insurance Carriers"
      journeyStage="discovery"
      suggestedTopics={[
        "Embedded distribution model",
        "Risk data and analytics",
        "Carrier partnership benefits",
      ]}
    />
  )
}
