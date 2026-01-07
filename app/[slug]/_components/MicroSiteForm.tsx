"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface MicroSiteFormProps {
    partnerId: string
    micrositeUrl: string
    colors: {
        primary: string
        secondary: string
        accent: string
    }
}

export default function MicroSiteForm({ partnerId, micrositeUrl, colors }: MicroSiteFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const [showSuccess, setShowSuccess] = useState(false)
    const [idleTimer, setIdleTimer] = useState<NodeJS.Timeout | null>(null)

    // Auto-reset for Kiosk Mode (Privacy)
    const resetForm = () => {
        const form = document.querySelector('form') as HTMLFormElement
        if (form) form.reset()
        setShowSuccess(false)
        setLoading(false)
        router.refresh()
    }

    // Idle Timeout (30s) - prevent abandoned sessions
    const resetIdleTimer = () => {
        if (idleTimer) clearTimeout(idleTimer)
        const timer = setTimeout(() => {
            resetForm()
        }, 30000) // 30s timeout
        setIdleTimer(timer)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const data = {
            partnerId,
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            activity: formData.get('activity'),
            source: 'checkin-microsite',
            micrositeUrl
        }

        try {
            const response = await fetch('/api/checkin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            if (response.ok) {
                const result = await response.json()
                // Show success state
                setShowSuccess(true)

                // Privacy: Auto-reset after 5 seconds for the next user
                setTimeout(() => {
                    resetForm()
                    if (result.data?.redirectUrl) {
                        // Optional: only redirect if not in kiosk mode, but for now just reset
                    }
                }, 5000)
            }
        } catch (error) {
            console.error('Checkin failed', error)
            setLoading(false)
        }
    }

    return (
        <div onMouseMove={resetIdleTimer} onTouchStart={resetIdleTimer}>
            {showSuccess ? (
                <div className="text-center py-12 animate-in fade-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">You're Covered!</h2>
                    <p className="text-slate-600 mb-8">Certificate of insurance has been sent to your email.</p>
                    <div className="text-sm text-slate-400">Refreshing for next user in 5s...</div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1">Your Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            placeholder="Enter your full name"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all bg-white/80"
                            style={{ focusRingColor: colors.primary } as any}
                        />
                        <style jsx>{`
                  input:focus {
                    border-color: ${colors.primary};
                    box-shadow: 0 0 0 4px ${colors.primary}20;
                  }
                `}</style>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                placeholder="you@email.com"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all bg-white/80"
                            />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-1">Phone</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                placeholder="(555) 123-4567"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all bg-white/80"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="activity" className="block text-sm font-semibold text-slate-700 mb-1">Activity Type</label>
                        <div className="relative">
                            <select
                                id="activity"
                                name="activity"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all bg-white/80 appearance-none"
                            >
                                <option value="day-pass">Day Pass / Single Visit</option>
                                <option value="class">Class or Session</option>
                                <option value="rental">Equipment Rental</option>
                                <option value="event">Private Event</option>
                                <option value="other">Other Activity</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
                        style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)` }}
                    >
                        {loading ? 'Activating...' : 'Activate Coverage →'}
                    </button>
                </form>
            )}
        </div>
    )
}
