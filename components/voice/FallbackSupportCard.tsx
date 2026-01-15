"use client"

import { motion } from 'framer-motion'
import { Mail, Phone, MessageCircle, ExternalLink, Clock, HelpCircle } from 'lucide-react'
import Link from 'next/link'

interface FallbackSupportCardProps {
  onClose: () => void
  errorMessage?: string
  errorCode?: string
}

export function FallbackSupportCard({ onClose, errorMessage, errorCode }: FallbackSupportCardProps) {
  const supportOptions = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get help via email within 24 hours',
      action: 'Send Email',
      href: 'mailto:support@dailyeventinsurance.com',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Call us Monday-Friday, 9am-5pm EST',
      action: 'Call Now',
      href: 'tel:+18005551234',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: MessageCircle,
      title: 'Help Center',
      description: 'Browse FAQs and documentation',
      action: 'Visit Help Center',
      href: '/support-hub',
      color: 'from-purple-500 to-purple-600'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col bg-white shadow-2xl rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 text-white">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <HelpCircle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Voice Chat Unavailable</h3>
              <p className="text-sm text-white/90 mt-1">
                Our voice assistant is temporarily offline. Let's get you help another way!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-full transition-colors ml-2"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Error Details (if helpful for debugging) */}
      {errorCode && (
        <div className="px-6 py-3 bg-amber-50 border-b border-amber-100">
          <div className="flex items-center gap-2 text-xs text-amber-700">
            <Clock className="h-3.5 w-3.5" />
            <span>Error Code: {errorCode}</span>
          </div>
          {errorMessage && (
            <p className="text-xs text-amber-600 mt-1 opacity-75">{errorMessage}</p>
          )}
        </div>
      )}

      {/* Support Options */}
      <div className="p-6 space-y-3">
        <p className="text-sm text-gray-600 mb-4">
          Choose how you'd like to get support:
        </p>

        {supportOptions.map((option, index) => {
          const Icon = option.icon
          return (
            <motion.div
              key={option.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={option.href}
                target={option.href.startsWith('http') ? '_blank' : undefined}
                className="block group"
              >
                <div className="p-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all hover:shadow-md bg-white">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${option.color} text-white flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                        {option.title}
                      </h4>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {option.description}
                      </p>
                      <div className="flex items-center gap-1 mt-2 text-sm font-medium text-teal-600 group-hover:text-teal-700 transition-colors">
                        <span>{option.action}</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">We'll fix this soon!</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium text-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </motion.div>
  )
}
