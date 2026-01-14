"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Users, Shield, ArrowRight } from "lucide-react"

interface MicroSiteFormProps {
    primaryColor: string
    businessName: string
}

export function MicroSiteForm({ primaryColor, businessName }: MicroSiteFormProps) {
    const [step, setStep] = useState(1)

    return (
        <div className="w-full max-w-lg mx-auto">
            {/* Progress Bar */}
            <div className="flex items-center justify-between mb-8">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex-1 h-2 mx-1 rounded-full bg-slate-100 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: s <= step ? "100%" : "0%" }}
                            className="h-full rounded-full transition-all duration-500"
                            style={{ backgroundColor: s <= step ? primaryColor : 'transparent' }}
                        />
                    </div>
                ))}
            </div>

            <div className="space-y-6 text-left">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Event Type</label>
                    <select className="w-full p-4 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-offset-2 outline-none transition-all" style={{ '--tw-ring-color': primaryColor } as any}>
                        <option>Select an activity...</option>
                        <option>Birthday Party</option>
                        <option>Competition / Tournament</option>
                        <option>Private Rental</option>
                        <option>Video / Photo Shoot</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Event Date</label>
                    <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input type="date" className="w-full p-4 pl-12 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-offset-2 outline-none transition-all" style={{ '--tw-ring-color': primaryColor } as any} />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Estimated Participants</label>
                    <div className="relative">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <select className="w-full p-4 pl-12 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-offset-2 outline-none transition-all" style={{ '--tw-ring-color': primaryColor } as any}>
                            <option>0 - 50</option>
                            <option>50 - 100</option>
                            <option>100+ (Custom Quote)</option>
                        </select>
                    </div>
                </div>

                <button
                    className="w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    style={{ backgroundColor: primaryColor }}
                >
                    Get Instant Quote
                    <ArrowRight className="w-5 h-5" />
                </button>

                <p className="text-xs text-center text-slate-400 mt-4">
                    <Shield className="w-3 h-3 inline mr-1" />
                    Secure SSL &middot; Lowest Price Guarantee
                </p>
            </div>
        </div>
    )
}
