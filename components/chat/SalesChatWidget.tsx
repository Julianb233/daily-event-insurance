'use client'

import { useState } from 'react'
import { ChatWidget } from './ChatWidget'
import { ChatBubble } from './ChatBubble'
import { AGENT_CONFIGS } from './types'

interface SalesChatWidgetProps {
  position?: 'bottom-right' | 'bottom-left' | 'center'
  className?: string
  autoOpen?: boolean
}

export function SalesChatWidget({
  position = 'bottom-right',
  className,
  autoOpen = false
}: SalesChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(autoOpen)
  const [unreadCount, setUnreadCount] = useState(0)

  const config = AGENT_CONFIGS.sales

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
