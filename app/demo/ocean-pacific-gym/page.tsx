'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Shield,
  Calendar,
  Users,
  DollarSign,
  Check,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  Dumbbell,
  Waves,
  Star,
  MessageCircle,
  HelpCircle
} from 'lucide-react'

const coverageOptions = [
  {
    name: 'Basic Coverage',
    price: 15,
    coverage: '$500,000',
    features: ['General Liability', 'Property Damage', 'Medical Payments up to $5,000']
  },
  {
    name: 'Standard Coverage',
    price: 35,
    coverage: '$1,000,000',
    features: ['General Liability', 'Property Damage', 'Medical Payments up to $10,000', 'Equipment Coverage'],
    popular: true
  },
  {
    name: 'Premium Coverage',
    price: 65,
    coverage: '$2,000,000',
    features: ['General Liability', 'Property Damage', 'Medical Payments up to $25,000', 'Equipment Coverage', 'Event Cancellation']
  }
]

const eventTypes = [
  'Fitness Class',
  'Personal Training Session',
  'Group Workout',
  'Yoga/Pilates Class',
  'CrossFit Session',
  'Swimming Lesson',
  'Sports Tournament',
  'Gym Event/Competition',
  'Other'
]

export default function OceanPacificGymPage() {
  const [step, setStep] = useState(1)
  const [selectedCoverage, setSelectedCoverage] = useState<number | null>(null)
  const [eventType, setEventType] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [attendees, setAttendees] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50">
      {/* Header */}
      <header className="bg-white border-b border-sky-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-cyan-600 rounded-xl flex items-center justify-center">
                <Waves className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Ocean Pacific Gym</h1>
                <p className="text-xs text-sky-600 font-medium">Event Insurance Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="text-slate-600 hover:text-sky-600 transition-colors">
                <HelpCircle className="w-5 h-5" />
              </a>
              <button className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg font-medium text-sm hover:bg-sky-600 transition-colors">
                <MessageCircle className="w-4 h-4" />
                Live Chat
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-6 bg-gradient-to-r from-sky-600 to-cyan-600 relative overflow-hidden">
        {/* Decorative waves */}
        <div className="absolute inset-0 opacity-10">
          <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 120" fill="none">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Protect Your Fitness Events
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Event Insurance for
              <span className="block">Ocean Pacific Gym Members</span>
            </h2>
            <p className="text-sky-100 text-lg max-w-xl mx-auto">
              Get instant coverage for your fitness classes, training sessions, and gym events.
              Protection starts at just $15.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Progress Steps */}
      <div className="bg-white border-b border-slate-200 py-4 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            {['Event Details', 'Select Coverage', 'Review & Pay'].map((label, index) => (
              <div key={label} className="flex items-center">
                <div className={`flex items-center gap-2 ${step > index + 1 ? 'text-sky-600' : step === index + 1 ? 'text-sky-600' : 'text-slate-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step > index + 1 ? 'bg-sky-600 text-white' :
                    step === index + 1 ? 'bg-sky-100 text-sky-600 border-2 border-sky-600' :
                    'bg-slate-100 text-slate-400'
                  }`}>
                    {step > index + 1 ? <Check className="w-4 h-4" /> : index + 1}
                  </div>
                  <span className="font-medium text-sm hidden sm:block">{label}</span>
                </div>
                {index < 2 && (
                  <div className={`w-12 sm:w-24 h-0.5 mx-2 ${step > index + 1 ? 'bg-sky-600' : 'bg-slate-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="py-12 px-6">
        <div className="max-w-4xl mx-auto">

          {/* Step 1: Event Details */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Tell Us About Your Event</h3>

                <div className="space-y-6">
                  {/* Event Type */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Event Type
                    </label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                    >
                      <option value="">Select event type...</option>
                      {eventTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Event Date */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Event Date
                    </label>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                    />
                  </div>

                  {/* Number of Attendees */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <Users className="w-4 h-4 inline mr-1" />
                      Expected Attendees
                    </label>
                    <select
                      value={attendees}
                      onChange={(e) => setAttendees(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                    >
                      <option value="">Select number of attendees...</option>
                      <option value="1-10">1-10 people</option>
                      <option value="11-25">11-25 people</option>
                      <option value="26-50">26-50 people</option>
                      <option value="51-100">51-100 people</option>
                      <option value="100+">100+ people</option>
                    </select>
                  </div>

                  {/* Venue */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Venue Location
                    </label>
                    <div className="px-4 py-3 bg-sky-50 border border-sky-200 rounded-xl text-sky-800">
                      <strong>Ocean Pacific Gym</strong>
                      <br />
                      <span className="text-sm text-sky-600">1234 Pacific Coast Highway, Santa Monica, CA 90401</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    disabled={!eventType || !eventDate || !attendees}
                    className="flex items-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to Coverage
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Select Coverage */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Select Your Coverage</h3>
                <p className="text-slate-600">Choose the protection level that's right for your event.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {coverageOptions.map((option, index) => (
                  <div
                    key={option.name}
                    onClick={() => setSelectedCoverage(index)}
                    className={`relative bg-white rounded-2xl border-2 p-6 cursor-pointer transition-all ${
                      selectedCoverage === index
                        ? 'border-sky-500 shadow-lg shadow-sky-500/20'
                        : 'border-slate-200 hover:border-sky-300'
                    }`}
                  >
                    {option.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-sky-600 text-white text-xs font-bold rounded-full">
                        MOST POPULAR
                      </div>
                    )}

                    <div className="text-center mb-4">
                      <h4 className="font-bold text-slate-900">{option.name}</h4>
                      <div className="text-3xl font-bold text-sky-600 mt-2">
                        ${option.price}
                        <span className="text-sm font-normal text-slate-500">/event</span>
                      </div>
                      <div className="text-sm text-slate-500 mt-1">
                        Up to {option.coverage} coverage
                      </div>
                    </div>

                    <ul className="space-y-2">
                      {option.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm text-slate-600">
                          <Check className="w-4 h-4 text-sky-500 mt-0.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {selectedCoverage === index && (
                      <div className="absolute top-4 right-4 w-6 h-6 bg-sky-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 text-slate-600 font-semibold hover:text-slate-900 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={selectedCoverage === null}
                  className="flex items-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Review Order
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Review & Pay */}
          {step === 3 && selectedCoverage !== null && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="grid md:grid-cols-3 gap-6">
                {/* Order Summary */}
                <div className="md:col-span-2">
                  <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">Review Your Order</h3>

                    {/* Event Details */}
                    <div className="mb-6 pb-6 border-b border-slate-200">
                      <h4 className="font-semibold text-slate-700 mb-3">Event Details</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-500">Event Type:</span>
                          <p className="font-medium text-slate-900">{eventType}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Date:</span>
                          <p className="font-medium text-slate-900">{eventDate}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Attendees:</span>
                          <p className="font-medium text-slate-900">{attendees}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Venue:</span>
                          <p className="font-medium text-slate-900">Ocean Pacific Gym</p>
                        </div>
                      </div>
                    </div>

                    {/* Coverage Details */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-slate-700 mb-3">Coverage Selected</h4>
                      <div className="flex items-center justify-between p-4 bg-sky-50 rounded-xl border border-sky-200">
                        <div>
                          <p className="font-bold text-slate-900">{coverageOptions[selectedCoverage].name}</p>
                          <p className="text-sm text-sky-600">Up to {coverageOptions[selectedCoverage].coverage} coverage</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-sky-600">${coverageOptions[selectedCoverage].price}</p>
                        </div>
                      </div>
                    </div>

                    {/* Payment Form (Mock) */}
                    <div>
                      <h4 className="font-semibold text-slate-700 mb-3">Payment Information</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-600 mb-1">Card Number</label>
                          <input
                            type="text"
                            placeholder="4242 4242 4242 4242"
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Expiry</label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">CVC</label>
                            <input
                              type="text"
                              placeholder="123"
                              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <button
                      onClick={() => setStep(2)}
                      className="px-6 py-3 text-slate-600 font-semibold hover:text-slate-900 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-sky-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-sky-500/25 transition-all"
                    >
                      <Shield className="w-5 h-5" />
                      Complete Purchase
                    </button>
                  </div>
                </div>

                {/* Order Sidebar */}
                <div>
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-24">
                    <h4 className="font-bold text-slate-900 mb-4">Order Summary</h4>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">{coverageOptions[selectedCoverage].name}</span>
                        <span className="font-medium">${coverageOptions[selectedCoverage].price}.00</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Processing Fee</span>
                        <span>$0.00</span>
                      </div>
                      <div className="border-t border-slate-200 pt-3 flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span className="text-sky-600">${coverageOptions[selectedCoverage].price}.00</span>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
                      <div className="flex items-start gap-2">
                        <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-green-800 text-sm">Instant Coverage</p>
                          <p className="text-green-600 text-xs mt-1">Your policy will be active immediately after purchase.</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 text-center">
                      <p className="text-xs text-slate-500">
                        Powered by Daily Event Insurance
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Trust Badges */}
      <section className="py-8 px-6 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-8 text-slate-400">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium">Secure Checkout</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span className="text-sm font-medium">Instant Coverage</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              <span className="text-sm font-medium">A+ Rated Carrier</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              <span className="text-sm font-medium">24/7 Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <Waves className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold">Ocean Pacific Gym</p>
                <p className="text-xs text-slate-400">Insurance Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-500">
              Powered by <a href="https://dailyeventinsurance.com" className="text-sky-400 hover:text-sky-300">Daily Event Insurance</a> &middot; Events-Based InsurTech Platform
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
