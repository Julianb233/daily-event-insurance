"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

/**
 * Screen types for context-aware voice assistant
 */
export type ScreenType =
  | 'home'
  | 'sales'
  | 'pricing'
  | 'about'
  | 'onboarding'
  | 'onboarding-business'
  | 'onboarding-products'
  | 'onboarding-integration'
  | 'onboarding-documents'
  | 'onboarding-review'
  | 'partner-dashboard'
  | 'partner-earnings'
  | 'partner-materials'
  | 'partner-settings'
  | 'help'
  | 'integration'
  | 'admin'
  | 'carriers'
  | 'blog'
  | 'unknown'

/**
 * User journey stage
 */
export type JourneyStage =
  | 'discovery'      // Just browsing, learning about the platform
  | 'consideration'  // Comparing options, looking at pricing
  | 'decision'       // Ready to sign up, on application/onboarding
  | 'onboarding'     // Actively signing up
  | 'active-partner' // Already a partner, using the platform
  | 'support'        // Seeking help

/**
 * Context data that pages can provide
 */
export interface VoiceContextData {
  // Current screen info
  screenType: ScreenType
  screenName: string
  journeyStage: JourneyStage

  // User info (if known)
  userName?: string
  userEmail?: string
  businessName?: string
  businessType?: string

  // Onboarding specific
  onboardingStep?: number
  onboardingTotalSteps?: number
  completedSteps?: string[]
  currentStepName?: string

  // Form data context
  formData?: Record<string, unknown>

  // Products/interests
  selectedProducts?: string[]
  interests?: string[]

  // Partner specific
  partnerId?: string
  partnerTier?: string
  totalEarnings?: number

  // Custom context
  customContext?: string
  suggestedTopics?: string[]
}

interface VoiceAgentContextType {
  // Context state
  context: VoiceContextData

  // Methods to update context
  setScreenContext: (screenType: ScreenType, screenName: string, journeyStage: JourneyStage) => void
  setUserInfo: (info: Partial<Pick<VoiceContextData, 'userName' | 'userEmail' | 'businessName' | 'businessType'>>) => void
  setOnboardingContext: (step: number, totalSteps: number, stepName: string, completedSteps?: string[]) => void
  setPartnerContext: (partnerId: string, tier: string, earnings?: number) => void
  setFormData: (data: Record<string, unknown>) => void
  setCustomContext: (context: string, topics?: string[]) => void
  updateContext: (partial: Partial<VoiceContextData>) => void
  resetContext: () => void

  // Voice agent state
  isOpen: boolean
  openVoiceAgent: () => void
  closeVoiceAgent: () => void
}

const defaultContext: VoiceContextData = {
  screenType: 'unknown',
  screenName: 'Unknown Page',
  journeyStage: 'discovery',
}

const VoiceAgentContext = createContext<VoiceAgentContextType | null>(null)

export function VoiceAgentProvider({ children }: { children: ReactNode }) {
  const [context, setContext] = useState<VoiceContextData>(defaultContext)
  const [isOpen, setIsOpen] = useState(false)

  const setScreenContext = useCallback((
    screenType: ScreenType,
    screenName: string,
    journeyStage: JourneyStage
  ) => {
    setContext(prev => ({
      ...prev,
      screenType,
      screenName,
      journeyStage,
    }))
  }, [])

  const setUserInfo = useCallback((
    info: Partial<Pick<VoiceContextData, 'userName' | 'userEmail' | 'businessName' | 'businessType'>>
  ) => {
    setContext(prev => ({
      ...prev,
      ...info,
    }))
  }, [])

  const setOnboardingContext = useCallback((
    step: number,
    totalSteps: number,
    stepName: string,
    completedSteps?: string[]
  ) => {
    setContext(prev => ({
      ...prev,
      onboardingStep: step,
      onboardingTotalSteps: totalSteps,
      currentStepName: stepName,
      completedSteps,
      journeyStage: 'onboarding',
    }))
  }, [])

  const setPartnerContext = useCallback((
    partnerId: string,
    tier: string,
    earnings?: number
  ) => {
    setContext(prev => ({
      ...prev,
      partnerId,
      partnerTier: tier,
      totalEarnings: earnings,
      journeyStage: 'active-partner',
    }))
  }, [])

  const setFormData = useCallback((data: Record<string, unknown>) => {
    setContext(prev => ({
      ...prev,
      formData: { ...prev.formData, ...data },
    }))
  }, [])

  const setCustomContext = useCallback((customContext: string, suggestedTopics?: string[]) => {
    setContext(prev => ({
      ...prev,
      customContext,
      suggestedTopics,
    }))
  }, [])

  const updateContext = useCallback((partial: Partial<VoiceContextData>) => {
    setContext(prev => ({
      ...prev,
      ...partial,
    }))
  }, [])

  const resetContext = useCallback(() => {
    setContext(defaultContext)
  }, [])

  const openVoiceAgent = useCallback(() => setIsOpen(true), [])
  const closeVoiceAgent = useCallback(() => setIsOpen(false), [])

  return (
    <VoiceAgentContext.Provider
      value={{
        context,
        setScreenContext,
        setUserInfo,
        setOnboardingContext,
        setPartnerContext,
        setFormData,
        setCustomContext,
        updateContext,
        resetContext,
        isOpen,
        openVoiceAgent,
        closeVoiceAgent,
      }}
    >
      {children}
    </VoiceAgentContext.Provider>
  )
}

export function useVoiceAgent() {
  const context = useContext(VoiceAgentContext)
  if (!context) {
    throw new Error('useVoiceAgent must be used within VoiceAgentProvider')
  }
  return context
}

/**
 * Hook to set page context on mount
 */
export function useSetVoiceContext(
  screenType: ScreenType,
  screenName: string,
  journeyStage: JourneyStage,
  additionalContext?: Partial<VoiceContextData>
) {
  const { setScreenContext, updateContext } = useVoiceAgent()

  // Set context on mount
  useState(() => {
    setScreenContext(screenType, screenName, journeyStage)
    if (additionalContext) {
      updateContext(additionalContext)
    }
  })
}
