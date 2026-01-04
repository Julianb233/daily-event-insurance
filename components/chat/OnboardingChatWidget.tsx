'use client'

import { useState } from 'react'
import { ChatWidget } from './ChatWidget'
import { ChatBubble } from './ChatBubble'
import { AGENT_CONFIGS } from './types'

interface OnboardingChatWidgetProps {
  position?: 'bottom-right' | 'bottom-left' | 'center'
  className?: string
  autoOpen?: boolean
}

export function OnboardingChatWidget({
  position = 'bottom-right',
  className,
  autoOpen = false
}: OnboardingChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(autoOpen)
  const [unreadCount, setUnreadCount] = useState(0)

  const config = AGENT_CONFIGS.onboarding

  const handleOpen = () => {
    setIsOpen(true)
    setUnreadCount(0)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <>
      {!isOpen && (
        <ChatBubble
          config={config}
          onClick={handleOpen}
          unreadCount={unreadCount}
        />
      )}
      <ChatWidget
        config={config}
        isOpen={isOpen}
        onClose={handleClose}
        position={position}
        className={className}
      />
    </>
  )
}
