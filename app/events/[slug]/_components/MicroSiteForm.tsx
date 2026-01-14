"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Loader2 } from "lucide-react"

interface MicroSiteFormProps {
    primaryColor: string
    businessName: string
}

export function MicroSiteForm({ primaryColor, businessName }: MicroSiteFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        accepted: false
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.accepted) return

        setIsLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        setIsLoading(false)
        setIsSuccess(true)
    }

    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
            >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Coverage Activated!</h3>
                <p className="text-gray-600">Your certificate has been sent to your email.</p>
            </motion.div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                        type="text"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 outline-none transition-all"
                        style={{ outlineColor: primaryColor }}
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                        type="text"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 outline-none transition-all"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                    type="email"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 outline-none transition-all"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                    type="tel"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 outline-none transition-all"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
            </div>

            <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center mt-1">
                        <input
                            type="checkbox"
                            required
                            className="peer sr-only"
                            checked={formData.accepted}
                            onChange={(e) => setFormData({ ...formData, accepted: e.target.checked })}
                        />
                        <div className={`w-5 h-5 border-2 rounded transition-colors ${formData.accepted ? 'bg-black border-black' : 'border-gray-300 bg-white group-hover:border-gray-400'}`}
                            style={formData.accepted ? { backgroundColor: primaryColor, borderColor: primaryColor } : {}}>
                            {formData.accepted && <Check className="w-3.5 h-3.5 text-white absolute top-0.5 left-0.5" />}
                        </div>
                    </div>
                    <span className="text-sm text-gray-600 leading-tight select-none">
                        I accept the coverage terms and conditions for activities at <span className="font-semibold">{businessName}</span>.
                    </span>
                </label>
            </div>

            <button
                type="submit"
                disabled={!formData.accepted || isLoading}
                className="w-full py-3.5 px-6 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                style={{ backgroundColor: primaryColor }}
            >
                {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Activating...
                    </span>
                ) : (
                    "Activate Coverage"
                )}
            </button>

            <p className="text-xs text-center text-gray-400 mt-4">
                Secure 256-bit SSL encrypted. 100% compliant coverage.
            </p>
        </form>
    )
}
