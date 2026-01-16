'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowRight,
    Check,
    ChevronRight,
    Shield,
    ScanFace,
    AlertCircle,
    X,
    Loader2,
    Calendar,
    CreditCard,
    Download
} from 'lucide-react'
import Link from 'next/link'

// Types
type Step = 'info' | 'coverage' | 'face-scan' | 'protection-upsell' | 'review' | 'success'

// Mock Data
const EVENT_NAME = "Mountain Trail Challenge 2026"
const EVENT_DATE = "April 15, 2026"
const EVENT_LOCATION = "Boulder, CO"

export default function MicrositeWizard() {
    const [step, setStep] = useState<Step>('info')
    const [loading, setLoading] = useState(false)

    // Form State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        dob: '',
        address: '',
        city: '',
        state: '',
        zip: ''
    })

    // Review Checkboxes
    const [agreedToTerms, setAgreedToTerms] = useState(false)
    const [electronicNtc, setElectronicNtc] = useState(false)
    const [confirmedReview, setConfirmedReview] = useState(false)

    // Face Scan State
    const [isScanning, setIsScanning] = useState(false)
    const [scanProgress, setScanProgress] = useState(0)

    // Handlers
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const nextStep = (target: Step) => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setStep(target)
    }

    // --- Step Components ---

    const StepInfo = () => (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Guest Registration</h2>
                <p className="text-slate-500">Please provide your details for coverage.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">First Name</label>
                    <input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        placeholder="Jane"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Last Name</label>
                    <input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        placeholder="Doe"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email Address</label>
                <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    placeholder="jane@example.com"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Date of Birth</label>
                <input
                    name="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Address</label>
                <input
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    placeholder="123 Trail Lane"
                />
            </div>

            <div className="grid grid-cols-6 gap-4">
                <div className="col-span-3 space-y-2">
                    <label className="text-sm font-medium text-slate-700">City</label>
                    <input name="city" value={formData.city} onChange={handleInputChange} className="w-full p-3 border border-slate-200 rounded-xl outline-none" placeholder="Boulder" />
                </div>
                <div className="col-span-1 space-y-2">
                    <label className="text-sm font-medium text-slate-700">State</label>
                    <input name="state" value={formData.state} onChange={handleInputChange} className="w-full p-3 border border-slate-200 rounded-xl outline-none" placeholder="CO" />
                </div>
                <div className="col-span-2 space-y-2">
                    <label className="text-sm font-medium text-slate-700">Zip</label>
                    <input name="zip" value={formData.zip} onChange={handleInputChange} className="w-full p-3 border border-slate-200 rounded-xl outline-none" placeholder="80302" />
                </div>
            </div>

            <button
                onClick={() => nextStep('coverage')}
                className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl mt-4 hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
            >
                Continue <ArrowRight className="w-5 h-5" />
            </button>
        </div>
    )

    const StepCoverage = () => (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Your Base Coverage</h2>
                <p className="text-slate-500">included with your registration</p>
            </div>

            <div className="bg-white border-2 border-slate-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                        <Shield className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg">Participant Accident</h3>
                        <p className="text-sm text-slate-500">{EVENT_NAME}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-slate-600">Accidental Death & Dismemberment</span>
                        <span className="font-bold text-slate-900">$50,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-600">Accident Medical Expense</span>
                        <span className="font-bold text-slate-900">$5,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-600">Deductible</span>
                        <span className="font-bold text-emerald-600">$0</span>
                    </div>
                </div>
            </div>

            <button
                onClick={() => nextStep('face-scan')}
                className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
            >
                Next: Review Coverage <ArrowRight className="w-5 h-5" />
            </button>
        </div>
    )

    const StepFaceScan = () => {
        useEffect(() => {
            if (isScanning) {
                const interval = setInterval(() => {
                    setScanProgress(prev => {
                        if (prev >= 100) {
                            clearInterval(interval)
                            return 100
                        }
                        return prev + 2
                    })
                }, 50)
                return () => clearInterval(interval)
            }
        }, [isScanning])

        return (
            <div className="space-y-6 text-center">
                <div className="mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                        New Feature
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Smart Coverage Match</h2>
                    <p className="text-slate-500 text-sm mt-2 max-w-xs mx-auto">
                        Take a 3-second face scan to see if you qualify for premium rate discounts based on biometrics.
                    </p>
                </div>

                <div className="relative w-64 h-64 mx-auto bg-slate-100 rounded-full overflow-hidden border-4 border-slate-200">
                    {isScanning ? (
                        <>
                            <video autoPlay loop muted className="w-full h-full object-cover opacity-50">
                                <source src="https://assets.mixkit.co/videos/preview/mixkit-man-working-on-his-laptop-308-large.mp4" type="video/mp4" />
                                {/* Just a placeholder video source or solid color if needed */}
                            </video>
                            <div className="absolute inset-0 bg-emerald-500/20 z-10"></div>
                            <motion.div
                                className="absolute top-0 left-0 right-0 h-1 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)] z-20"
                                animate={{ top: ["0%", "100%", "0%"] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center z-30">
                                <span className="text-2xl font-bold text-emerald-900">{scanProgress}%</span>
                            </div>
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-200">
                            <ScanFace className="w-24 h-24 text-slate-400" />
                        </div>
                    )}
                </div>

                <div className="space-y-3 pt-4">
                    {!isScanning ? (
                        <button
                            onClick={() => setIsScanning(true)}
                            className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20"
                        >
                            Start Scan (Safe & Private)
                        </button>
                    ) : (
                        <button
                            disabled
                            className="w-full py-4 bg-slate-100 text-slate-400 font-bold rounded-xl cursor-wait"
                        >
                            Scanning...
                        </button>
                    )}

                    <button
                        onClick={() => nextStep('protection-upsell')}
                        className="w-full py-3 text-slate-500 font-medium hover:text-slate-800 transition-colors text-sm"
                    >
                        Skip and continue
                    </button>
                </div>

                <p className="text-xs text-slate-400 mt-4">
                    Biometric data is processed locally and never stored.
                </p>
            </div>
        )
    }

    const StepProtectionUpsell = () => (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Upgrade Your Peace of Mind?</h2>
                <p className="text-slate-500">Most participants choose annual protection.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {/* Event Only Card */}
                <div className="border-2 border-slate-100 rounded-2xl p-6 relative opacity-70 hover:opacity-100 transition-opacity">
                    <h3 className="text-lg font-bold text-slate-900">Event Only</h3>
                    <div className="my-4">
                        <span className="text-3xl font-bold text-slate-900">$0</span>
                        <span className="text-slate-500"> / event</span>
                    </div>
                    <ul className="space-y-3 text-sm text-slate-600 mb-6">
                        <li className="flex gap-2"><Check className="w-4 h-4 text-emerald-500" /> Accident Medical</li>
                        <li className="flex gap-2"><Check className="w-4 h-4 text-emerald-500" /> AD&D Coverage</li>
                        <li className="flex gap-2 text-slate-400"><X className="w-4 h-4" /> 24/7 Coverage</li>
                        <li className="flex gap-2 text-slate-400"><X className="w-4 h-4" /> Multi-Sport</li>
                    </ul>
                    <button
                        onClick={() => nextStep('review')}
                        className="w-full py-2 border-2 border-slate-200 text-slate-600 font-bold rounded-lg hover:bg-slate-50"
                    >
                        No thanks, continue with event coverage only
                    </button>
                </div>

                {/* Annual Protection Card */}
                <div className="border-2 border-blue-500 bg-blue-50/50 rounded-2xl p-6 relative shadow-xl shadow-blue-500/10">
                    <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-lg">
                        RECOMMENDED
                    </div>
                    <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2">
                        Annual Protection <Shield className="w-4 h-4 fill-blue-600 text-blue-600" />
                    </h3>
                    <div className="my-4">
                        <span className="text-3xl font-bold text-slate-900">$4.99</span>
                        <span className="text-slate-500"> / month</span>
                    </div>
                    <ul className="space-y-3 text-sm text-slate-700 mb-6">
                        <li className="flex gap-2"><Check className="w-4 h-4 text-blue-500" /> <span className="font-semibold">24/7 Accident Coverage</span></li>
                        <li className="flex gap-2"><Check className="w-4 h-4 text-blue-500" /> Covers All Sports</li>
                        <li className="flex gap-2"><Check className="w-4 h-4 text-blue-500" /> 50% Higher Limits</li>
                        <li className="flex gap-2"><Check className="w-4 h-4 text-blue-500" /> Cancel Anytime</li>
                    </ul>
                    <button
                        onClick={() => nextStep('review')}
                        className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 shadow-lg shadow-blue-500/20"
                    >
                        Add Annual Protection
                    </button>
                </div>
            </div>
        </div>
    )

    const StepReview = () => (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Final Review</h2>
                <p className="text-slate-500">Please confirm your details to activate.</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl space-y-4 border border-slate-100">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Participant</p>
                        <p className="font-medium text-slate-900">{formData.firstName} {formData.lastName}</p>
                        <p className="text-sm text-slate-500">{formData.email}</p>
                    </div>
                    <button onClick={() => setStep('info')} className="text-emerald-600 text-sm font-medium hover:underline">Edit</button>
                </div>
                <div className="h-px bg-slate-200 w-full" />
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Coverage</p>
                        <p className="font-medium text-slate-900">Standard Event Coverage</p>
                        <p className="text-sm text-slate-500">{EVENT_NAME}</p>
                    </div>
                    <div className="text-right">
                        <span className="block font-bold text-slate-900">$0.00</span>
                    </div>
                </div>
            </div>

            <div className="space-y-4 pt-4">
                <label className="flex items-start gap-3 cursor-pointer p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                    <input type="checkbox" checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)} className="mt-1 w-5 h-5 accent-emerald-600" />
                    <span className="text-sm text-slate-600">I agree to the <span className="text-emerald-600 underline">Terms of Coverage</span>, Release of Liability, and Privacy Policy.</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                    <input type="checkbox" checked={electronicNtc} onChange={e => setElectronicNtc(e.target.checked)} className="mt-1 w-5 h-5 accent-emerald-600" />
                    <span className="text-sm text-slate-600">I consent to electronic delivery of all policy documents and notices.</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                    <input type="checkbox" checked={confirmedReview} onChange={e => setConfirmedReview(e.target.checked)} className="mt-1 w-5 h-5 accent-emerald-600" />
                    <span className="text-sm text-slate-600">I have reviewed my application and confirm all information is accurate.</span>
                </label>
            </div>

            <button
                disabled={!agreedToTerms || !electronicNtc || !confirmedReview}
                onClick={() => {
                    setLoading(true)
                    setTimeout(() => {
                        setLoading(false)
                        nextStep('success')
                    }, 2000)
                }}
                className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl mt-4 hover:bg-emerald-500 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-600/20"
            >
                {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin w-5 h-5" /> Activating...</span> : "Activate Policy"}
            </button>
        </div>
    )

    const StepSuccess = () => (
        <div className="text-center space-y-6 py-8">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
                <Check className="w-12 h-12 text-emerald-600" strokeWidth={3} />
            </motion.div>

            <h2 className="text-3xl font-black text-slate-900 tracking-tight">All Set for Race Day!</h2>

            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 max-w-sm mx-auto">
                <p className="text-slate-500 mb-2 uppercase tracking-widest text-xs font-bold">Policy Number</p>
                <p className="text-2xl font-mono text-slate-900 tracking-widest mb-6">DEI-8842-XJ9</p>

                <div className="space-y-4">
                    <button className="w-full py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 flex items-center justify-center gap-2">
                        <Download className="w-5 h-5" /> Download Certificate
                    </button>
                    <Link href="/microsite-v2">
                        <button className="w-full py-3 text-emerald-600 font-medium hover:underline mt-4">
                            Return to Event Page
                        </button>
                    </Link>
                </div>
            </div>

            <p className="text-slate-400 text-sm max-w-xs mx-auto">
                A confirmation email has been sent to {formData.email}
            </p>
        </div>
    )


    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header / Progress */}
                {step !== 'success' && (
                    <div className="mb-8 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-white rounded-lg shadow-sm border border-slate-100 flex items-center justify-center">
                                <span className="font-bold text-slate-900">1</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Step {step === 'info' ? 1 : step === 'coverage' ? 2 : step === 'face-scan' ? 3 : step === 'review' ? 5 : 4} of 5</span>
                                <span className="font-bold text-slate-900 text-sm">
                                    {step === 'info' && "Personal Details"}
                                    {step === 'coverage' && "Confirm Coverage"}
                                    {step === 'face-scan' && "Smart Match"}
                                    {step === 'protection-upsell' && "Upgrade"}
                                    {step === 'review' && "Final Review"}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Card */}
                <motion.div
                    layout
                    className="bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 p-6 md:p-10"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {step === 'info' && <StepInfo />}
                            {step === 'coverage' && <StepCoverage />}
                            {step === 'face-scan' && <StepFaceScan />}
                            {step === 'protection-upsell' && <StepProtectionUpsell />}
                            {step === 'review' && <StepReview />}
                            {step === 'success' && <StepSuccess />}
                        </motion.div>
                    </AnimatePresence>
                </motion.div>

                {/* Security Footer */}
                <div className="mt-8 text-center flex items-center justify-center gap-2 text-slate-400 text-xs font-medium">
                    <Shield className="w-3 h-3" />
                    <span>Bank-level 256-bit SSL Encryption</span>
                </div>
            </div>
        </div>
    )
}
