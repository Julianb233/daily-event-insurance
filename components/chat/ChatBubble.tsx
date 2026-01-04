'use client'

import { MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ChatBubbleProps } from './types'

export function ChatBubble({
  config,
  onClick,
  unreadCount = 0
}: ChatBubbleProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'fixed bottom-6 right-6 z-50',
        'flex items-center gap-3 px-4 py-3 rounded-full',
        'text-white shadow-lg hover:shadow-xl',
        'transition-all duration-300 transform hover:scale-105',
        'group'
      )}
      style={{ backgroundColor: config.primaryColor }}
      aria-label={`Chat with ${config.agentName}`}
    >
      {/* Avatar */}
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          {config.avatarUrl ? (
            <img
              src={config.avatarUrl}
              alt={config.agentName}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-lg font-semibold">{config.agentName[0]}</span>
          )}
        </div>
        {/* Online indicator */}
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
      </div>

      {/* Text content */}
      <div className="flex flex-col items-start">
        <span className="font-semibold text-sm">{config.agentName}</span>
        <span className="text-xs text-white/80">
          {config.agentTitle} • Online
        </span>
      </div>

      {/* Message icon */}
      <MessageCircle className="w-5 h-5 ml-2 group-hover:animate-bounce" />

      {/* Unread badge */}
      {unreadCount > 0 && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
          {unreadCount > 9 ? '9+' : unreadCount}
        </div>
      )}
    </button>
  )
}

// Compact version - just an icon
export function ChatBubbleCompact({
  config,
  onClick,
  unreadCount = 0
}: ChatBubbleProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'fixed bottom-6 right-6 z-50',
        'w-14 h-14 rounded-full',
        'text-white shadow-lg hover:shadow-xl',
        'transition-all duration-300 transform hover:scale-110',
        'flex items-center justify-center'
      )}
      style={{ backgroundColor: config.primaryColor }}
      aria-label={`Chat with ${config.agentName}`}
    >
      <MessageCircle className="w-6 h-6" />

      {/* Unread badge */}
      {unreadCount > 0 && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
          {unreadCount > 9 ? '9+' : unreadCount}
        </div>
      )}
    </button>
  )
}
