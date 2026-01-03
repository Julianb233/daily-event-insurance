'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  CheckCircle,
  DollarSign,
  TrendingUp,
  Users,
  Zap,
  Shield,
  Clock,
  Calculator,
  Quote,
  Star
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default function GymLandingPage() {
  const [monthlyMembers, setMonthlyMembers] = useState(500)
  const [optInRate] = useState(65) // Industry average

  // Calculate revenue
  const policiesPerMonth = Math.round(monthlyMembers * (optInRate / 100))
  const monthlyRevenue = policiesPerMonth * 14 // $14 commission per policy
  const annualRevenue = monthlyRevenue * 12

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* HERO - Direct Value Prop */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-teal-600 to-teal-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-teal-500/30 border border-teal-400/50 rounded-full px-4 py-2 mb-6"
          >
            <Shield className="w-4 h-4" />
            <span className="text-sm font-bold uppercase tracking-wide">For Gym Owners</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black mb-6 leading-tight"
          >
            Turn Every Member Into
            <span className="block text-teal-200">$14 Monthly Profit</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-3xl font-semibold mb-4 text-teal-50"
          >
            No extra work. No overhead. Pure recurring revenue.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-teal-100 mb-12 max-w-3xl mx-auto"
          >
            Add liability insurance to your membership offerings and earn 35% commission on every policy sold.
            5-minute integration. Zero ongoing work.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Button
              size="lg"
              className="bg-white text-teal-700 hover:bg-teal-50 text-xl font-bold px-12 py-6 h-auto shadow-2xl"
              onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Calculate Your Revenue
              <ArrowRight className="ml-2 w-6 h-6" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-6 justify-center text-sm"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-teal-200" />
              <span className="font-semibold">No Contracts</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-teal-200" />
              <span className="font-semibold">5-Minute Setup</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-teal-200" />
              <span className="font-semibold">Zero Ongoing Work</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* THE PROBLEM */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-center">
            You're Already Doing The Work
          </h2>
          <p className="text-xl text-gray-700 text-center mb-12 leading-relaxed">
            Your members show up. You train them. They trust you. But you're leaving money on the table.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 border-2 border-red-200 bg-red-50">
              <div className="text-red-600 font-bold mb-2 text-lg">Problem #1</div>
              <p className="text-gray-800 font-semibold">Members are buying insurance anyway - from other people</p>
            </Card>
            <Card className="p-6 border-2 border-red-200 bg-red-50">
              <div className="text-red-600 font-bold mb-2 text-lg">Problem #2</div>
              <p className="text-gray-800 font-semibold">You're liable for injuries but not making anything from risk mitigation</p>
            </Card>
            <Card className="p-6 border-2 border-red-200 bg-red-50">
              <div className="text-red-600 font-bold mb-2 text-lg">Problem #3</div>
              <p className="text-gray-800 font-semibold">Every month you wait = thousands in lost revenue</p>
            </Card>
          </div>
        </div>
      </section>

      {/* THE SOLUTION */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black mb-12 text-center">
            Here's How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-black text-teal-600">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3">5-Minute Integration</h3>
              <p className="text-gray-600">
                Add insurance option to your check-in flow. We handle the tech. You copy-paste one line of code.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-black text-teal-600">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Members Opt In</h3>
              <p className="text-gray-600">
                65% of members add $40 daily coverage. Your staff doesn't do anything - it's automatic.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-black text-teal-600">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3">You Get Paid</h3>
              <p className="text-gray-600">
                $14 commission per policy. Direct deposit monthly. No invoicing, no chasing payments.
              </p>
            </div>
          </div>

          <div className="bg-teal-50 border-2 border-teal-200 rounded-xl p-8 text-center">
            <p className="text-2xl font-bold text-gray-800 mb-2">
              That's It. That's The Whole Business Model.
            </p>
            <p className="text-lg text-gray-600">
              We handle everything else: underwriting, claims, compliance, customer support, billing.
            </p>
          </div>
        </div>
      </section>

      {/* CALCULATOR */}
      <section id="calculator" className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-center">
            Calculate Your Revenue
          </h2>
          <p className="text-xl text-gray-300 text-center mb-12">
            Enter your numbers. See your profit. It's that simple.
          </p>

          <Card className="p-8 bg-white text-gray-900">
            <div className="mb-8">
              <label className="block text-lg font-bold mb-4">
                How many members visit per month?
              </label>
              <Input
                type="number"
                value={monthlyMembers}
                onChange={(e) => setMonthlyMembers(parseInt(e.target.value) || 0)}
                className="text-2xl font-bold h-16 text-center"
                min="0"
              />
            </div>

            <div className="bg-teal-50 border-2 border-teal-200 rounded-xl p-8">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Monthly Members</div>
                  <div className="text-3xl font-black text-teal-600">{monthlyMembers.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Policies Sold (65% opt-in)</div>
                  <div className="text-3xl font-black text-teal-600">{policiesPerMonth.toLocaleString()}</div>
                </div>
              </div>

              <hr className="border-gray-300 my-6" />

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Monthly Revenue</div>
                  <div className="text-4xl font-black text-teal-700">${monthlyRevenue.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Annual Revenue</div>
                  <div className="text-4xl font-black text-teal-700">${annualRevenue.toLocaleString()}</div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-white rounded-lg">
                <p className="text-center text-sm text-gray-600 mb-2">
                  Based on industry average 65% opt-in rate
                </p>
                <p className="text-center text-lg font-bold text-gray-800">
                  Pure profit. Zero overhead.
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Button
                size="lg"
                className="bg-teal-600 hover:bg-teal-700 text-white text-xl font-bold px-12 py-6 h-auto w-full md:w-auto"
              >
                Get Started Now
                <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
              <p className="text-sm text-gray-500 mt-4">
                No credit card required • 5-minute setup • Cancel anytime
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black mb-12 text-center">
            Real Gyms. Real Numbers.
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="p-8 border-2 hover:border-teal-500 transition-colors">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <Quote className="w-8 h-8 text-teal-200 mb-4" />
              <p className="text-gray-700 mb-4 italic">
                "We added $3,200 per month in the first 30 days. I literally did nothing after the initial setup."
              </p>
              <div className="font-bold text-gray-900">Mike R.</div>
              <div className="text-sm text-gray-500">CrossFit Box, Denver</div>
              <div className="text-sm text-teal-600 font-semibold mt-2">480 members → $3,200/mo</div>
            </Card>

            <Card className="p-8 border-2 hover:border-teal-500 transition-colors">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <Quote className="w-8 h-8 text-teal-200 mb-4" />
              <p className="text-gray-700 mb-4 italic">
                "I was skeptical. Then I got my first commission check for $2,870. Now I'm a believer."
              </p>
              <div className="font-bold text-gray-900">Sarah K.</div>
              <div className="text-sm text-gray-500">24/7 Fitness, Austin</div>
              <div className="text-sm text-teal-600 font-semibold mt-2">650 members → $2,870/mo</div>
            </Card>

            <Card className="p-8 border-2 hover:border-teal-500 transition-colors">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <Quote className="w-8 h-8 text-teal-200 mb-4" />
              <p className="text-gray-700 mb-4 italic">
                "Setup took 6 minutes on a Zoom call. We've made $47,000 in commissions this year."
              </p>
              <div className="font-bold text-gray-900">James P.</div>
              <div className="text-sm text-gray-500">Elite Performance, Miami</div>
              <div className="text-sm text-teal-600 font-semibold mt-2">920 members → $4,100/mo</div>
            </Card>
          </div>
        </div>
      </section>

      {/* THE OFFER */}
      <section className="py-20 bg-gradient-to-br from-teal-50 to-cyan-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-center">
            Zero Risk. Zero Overhead.
          </h2>
          <p className="text-xl text-gray-700 text-center mb-12">
            Here's everything you get (and don't have to do):
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
              <div>
                <div className="font-bold text-lg mb-1">No Contracts</div>
                <p className="text-gray-600">Cancel anytime. No questions asked.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
              <div>
                <div className="font-bold text-lg mb-1">No Customer Support</div>
                <p className="text-gray-600">We handle all member questions and claims.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
              <div>
                <div className="font-bold text-lg mb-1">No Liability</div>
                <p className="text-gray-600">We underwrite and manage all risk.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
              <div>
                <div className="font-bold text-lg mb-1">No Integration Work</div>
                <p className="text-gray-600">We integrate with your system in one call.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
              <div>
                <div className="font-bold text-lg mb-1">No Accounting Headaches</div>
                <p className="text-gray-600">Direct deposit. Monthly. Automatic.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
              <div>
                <div className="font-bold text-lg mb-1">No Minimum Volume</div>
                <p className="text-gray-600">10 members or 10,000 - doesn't matter.</p>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-teal-500 rounded-xl p-8 text-center">
            <p className="text-2xl font-bold mb-4">
              You Literally Just Collect Checks
            </p>
            <p className="text-lg text-gray-600 mb-6">
              We do everything else. That's the deal.
            </p>
            <Button
              size="lg"
              className="bg-teal-600 hover:bg-teal-700 text-white text-xl font-bold px-12 py-6 h-auto"
            >
              Yes, I Want Free Money
              <ArrowRight className="ml-2 w-6 h-6" />
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black mb-12 text-center">
            Common Objections (Answered)
          </h2>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-3">
                Q: "This sounds too good to be true."
              </h3>
              <p className="text-gray-700">
                <strong>A:</strong> Fair. But the math is simple: We make money when you make money. We charge $40 per policy, pay you $14 commission, keep $26 to cover insurance and operations. Everyone wins.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold mb-3">
                Q: "My members won't pay for this."
              </h3>
              <p className="text-gray-700">
                <strong>A:</strong> Industry data says 65% say yes. But even if only 50% opt in, you're still making thousands per month. Test it and see.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold mb-3">
                Q: "How long is the contract?"
              </h3>
              <p className="text-gray-700">
                <strong>A:</strong> There isn't one. Cancel anytime via email. No penalties, no questions.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold mb-3">
                Q: "What's the catch?"
              </h3>
              <p className="text-gray-700">
                <strong>A:</strong> There isn't one. You make recurring revenue. We get insurance volume. Members get protection. It's aligned incentives.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold mb-3">
                Q: "How fast can I start making money?"
              </h3>
              <p className="text-gray-700">
                <strong>A:</strong> Integration takes 5 minutes. First commission check within 30 days. Most gyms see revenue in week one.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 bg-gradient-to-br from-teal-600 to-teal-700 text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Stop Leaving Money On The Table
          </h2>
          <p className="text-2xl mb-8 text-teal-100">
            Every month you wait costs you ${monthlyRevenue.toLocaleString()}.
          </p>

          <Button
            size="lg"
            className="bg-white text-teal-700 hover:bg-teal-50 text-xl font-bold px-12 py-6 h-auto mb-6"
          >
            Get Started in 5 Minutes
            <ArrowRight className="ml-2 w-6 h-6" />
          </Button>

          <p className="text-teal-100">
            Book a call: [CALENDAR_LINK] | Or reply to the email
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
