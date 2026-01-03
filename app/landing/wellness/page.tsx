'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  CheckCircle,
  DollarSign,
  Sparkles,
  Users,
  Zap,
  Shield,
  Clock,
  Quote,
  Star,
  Heart
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default function WellnessLandingPage() {
  const [monthlyClients, setMonthlyClients] = useState(300)
  const [optInRate] = useState(95) // Wellness centers see higher opt-in

  const policiesPerMonth = Math.round(monthlyClients * (optInRate / 100))
  const monthlyRevenue = policiesPerMonth * 14
  const annualRevenue = monthlyRevenue * 12

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* HERO */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-purple-600 via-violet-600 to-fuchsia-600 text-white overflow-hidden">
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
            className="inline-flex items-center gap-2 bg-purple-500/30 border border-purple-400/50 rounded-full px-4 py-2 mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-bold uppercase tracking-wide">For Wellness Centers & Spas</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black mb-6 leading-tight"
          >
            $14 Profit Per Treatment
            <span className="block text-purple-200">Every Single Day</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-3xl font-semibold mb-4 text-purple-50"
          >
            Add liability insurance to your services. Keep 35% commission.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-purple-100 mb-12 max-w-3xl mx-auto"
          >
            IV therapy, laser treatments, injectables, aesthetic procedures - every treatment becomes recurring revenue.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              size="lg"
              className="bg-white text-purple-700 hover:bg-purple-50 text-xl font-bold px-12 py-6 h-auto shadow-2xl"
              onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}
            >
              See Your Numbers
              <ArrowRight className="ml-2 w-6 h-6" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-6 justify-center text-sm mt-8"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-purple-200" />
              <span className="font-semibold">95% Client Opt-In</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-purple-200" />
              <span className="font-semibold">No Staff Training</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-purple-200" />
              <span className="font-semibold">Instant Payouts</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* THE REALITY CHECK */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-center">
            Let's Be Honest
          </h2>

          <div className="bg-red-50 border-l-4 border-red-500 p-8 mb-8">
            <p className="text-xl text-gray-800 leading-relaxed">
              <strong className="text-red-600">Right now:</strong> Your clients are getting treatments without liability coverage.
              You're exposed. They're exposed. And you're making $0 from it.
            </p>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-8">
            <p className="text-xl text-gray-800 leading-relaxed">
              <strong className="text-green-600">With us:</strong> Every client gets $1M liability coverage for $40.
              You earn $14 commission. They get protection. You get monthly recurring revenue.
            </p>
          </div>

          <div className="mt-12 text-center">
            <p className="text-2xl font-bold text-gray-800 mb-4">
              Which scenario makes more sense?
            </p>
            <p className="text-lg text-gray-600">
              (Hint: The one where you make money)
            </p>
          </div>
        </div>
      </section>

      {/* CALCULATOR */}
      <section id="calculator" className="py-20 bg-gradient-to-br from-gray-900 to-purple-900 text-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-center">
            Your Revenue Calculator
          </h2>
          <p className="text-xl text-gray-300 text-center mb-12">
            Real numbers based on actual wellness center data
          </p>

          <Card className="p-8 bg-white text-gray-900">
            <div className="mb-8">
              <label className="block text-lg font-bold mb-4">
                How many treatments do you perform per month?
              </label>
              <Input
                type="number"
                value={monthlyClients}
                onChange={(e) => setMonthlyClients(parseInt(e.target.value) || 0)}
                className="text-2xl font-bold h-16 text-center"
                min="0"
              />
              <p className="text-sm text-gray-500 mt-2 text-center">
                Include IV therapy, laser, injectables, aesthetic procedures, massage
              </p>
            </div>

            <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-8">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Monthly Treatments</div>
                  <div className="text-3xl font-black text-purple-600">{monthlyClients.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Policies Sold (95% opt-in)</div>
                  <div className="text-3xl font-black text-purple-600">{policiesPerMonth.toLocaleString()}</div>
                </div>
              </div>

              <hr className="border-gray-300 my-6" />

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Monthly Commission</div>
                  <div className="text-4xl font-black text-purple-700">${monthlyRevenue.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Annual Commission</div>
                  <div className="text-4xl font-black text-purple-700">${annualRevenue.toLocaleString()}</div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-white rounded-lg">
                <p className="text-center text-lg font-bold text-gray-800">
                  This is passive income from work you're already doing.
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Button
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white text-xl font-bold px-12 py-6 h-auto w-full md:w-auto"
              >
                Lock In These Numbers
                <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
              <p className="text-sm text-gray-500 mt-4">
                Free setup • No contracts • Start earning immediately
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black mb-12 text-center">
            What Other Wellness Centers Are Making
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 border-2 hover:border-purple-500 transition-colors">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <Quote className="w-8 h-8 text-purple-200 mb-4" />
              <p className="text-gray-700 mb-4 italic">
                "Added it to our IV therapy intake. First month: $4,200 in commissions. I did literally nothing."
              </p>
              <div className="font-bold text-gray-900">Dr. Lisa M.</div>
              <div className="text-sm text-gray-500">Vitality Wellness, LA</div>
              <div className="text-sm text-purple-600 font-semibold mt-2">320 monthly treatments → $4,200/mo</div>
            </Card>

            <Card className="p-8 border-2 hover:border-purple-500 transition-colors">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <Quote className="w-8 h-8 text-purple-200 mb-4" />
              <p className="text-gray-700 mb-4 italic">
                "My clients actually thank me for offering this. And I'm making an extra $2,800/month. Win-win."
              </p>
              <div className="font-bold text-gray-900">Amanda R.</div>
              <div className="text-sm text-gray-500">Serenity Med Spa, NYC</div>
              <div className="text-sm text-purple-600 font-semibold mt-2">210 monthly treatments → $2,800/mo</div>
            </Card>

            <Card className="p-8 border-2 hover:border-purple-500 transition-colors">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <Quote className="w-8 h-8 text-purple-200 mb-4" />
              <p className="text-gray-700 mb-4 italic">
                "We offer laser treatments and Botox. This added $68,000 to our bottom line last year."
              </p>
              <div className="font-bold text-gray-900">Dr. James K.</div>
              <div className="text-sm text-gray-500">Glow Aesthetics, Miami</div>
              <div className="text-sm text-purple-600 font-semibold mt-2">410 monthly treatments → $5,500/mo</div>
            </Card>
          </div>
        </div>
      </section>

      {/* THE NUMBERS DON'T LIE */}
      <section className="py-20 bg-purple-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black mb-12 text-center">
            The Numbers Don't Lie
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-xl p-8 border-2 border-purple-200">
              <div className="text-5xl font-black text-purple-600 mb-2">$40</div>
              <div className="text-lg font-bold text-gray-800 mb-2">Per Treatment (Client Pays)</div>
              <p className="text-gray-600">
                Your clients add this to their treatment cost. Most don't even blink.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 border-2 border-purple-200">
              <div className="text-5xl font-black text-purple-600 mb-2">$14</div>
              <div className="text-lg font-bold text-gray-800 mb-2">Your Commission (You Keep)</div>
              <p className="text-gray-600">
                35% of every policy. Direct deposit monthly. No invoicing.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 border-2 border-purple-200">
              <div className="text-5xl font-black text-purple-600 mb-2">95%</div>
              <div className="text-lg font-bold text-gray-800 mb-2">Average Opt-In Rate</div>
              <p className="text-gray-600">
                Wellness clients expect premium service. They say yes to protection.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 border-2 border-purple-200">
              <div className="text-5xl font-black text-purple-600 mb-2">5min</div>
              <div className="text-lg font-bold text-gray-800 mb-2">Setup Time</div>
              <p className="text-gray-600">
                One Zoom call. Add checkbox to intake form. Start earning.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-xl p-8 text-center text-white">
            <p className="text-3xl font-black mb-4">
              This Is Free Money
            </p>
            <p className="text-xl text-purple-100 mb-6">
              You're already doing the treatments. Just add protection and collect commission.
            </p>
            <Button
              size="lg"
              className="bg-white text-purple-700 hover:bg-purple-50 text-xl font-bold px-12 py-6 h-auto"
            >
              I Want This
              <ArrowRight className="ml-2 w-6 h-6" />
            </Button>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black mb-12 text-center">
            Stupidly Simple Process
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Step 1: 5-Min Call</h3>
              <p className="text-gray-600 text-lg">
                We integrate with your intake process. You copy-paste. We test. Done.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Step 2: Clients Choose</h3>
              <p className="text-gray-600 text-lg">
                They see "Add liability coverage - $40" at checkout. 95% say yes. Automatic.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <DollarSign className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Step 3: Get Paid</h3>
              <p className="text-gray-600 text-lg">
                Direct deposit on the 1st of every month. Track everything in your dashboard.
              </p>
            </div>
          </div>

          <div className="mt-16 bg-yellow-50 border-2 border-yellow-400 rounded-xl p-8 text-center">
            <p className="text-2xl font-black text-gray-900 mb-2">
              "But what about customer support?"
            </p>
            <p className="text-xl text-gray-700">
              We handle it. Claims, questions, billing disputes - all us. You just cash checks.
            </p>
          </div>
        </div>
      </section>

      {/* CALCULATOR */}
      <section id="calculator" className="py-20 bg-gradient-to-br from-purple-900 to-fuchsia-900 text-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-center">
            Calculate Your Monthly Profit
          </h2>
          <p className="text-xl text-purple-200 text-center mb-12">
            Based on 95% opt-in rate (wellness center average)
          </p>

          <Card className="p-8 bg-white text-gray-900">
            <div className="mb-8">
              <label className="block text-lg font-bold mb-4">
                Monthly Treatments (All Types)
              </label>
              <Input
                type="number"
                value={monthlyClients}
                onChange={(e) => setMonthlyClients(parseInt(e.target.value) || 0)}
                className="text-2xl font-bold h-16 text-center"
                min="0"
                placeholder="e.g., 300"
              />
            </div>

            <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-8">
              <div className="text-center mb-6">
                <div className="text-6xl font-black text-purple-700 mb-2">
                  ${monthlyRevenue.toLocaleString()}
                </div>
                <div className="text-lg text-gray-600">per month in pure profit</div>
              </div>

              <hr className="border-gray-300 my-6" />

              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Policies/Month</div>
                  <div className="text-2xl font-black text-purple-600">{policiesPerMonth}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Annual Revenue</div>
                  <div className="text-2xl font-black text-purple-600">${annualRevenue.toLocaleString()}</div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Button
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white text-xl font-bold px-12 py-6 h-auto w-full md:w-auto"
              >
                Get Started Now
                <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
              <p className="text-sm text-gray-500 mt-4">
                Start earning within 7 days • No minimums • Cancel anytime
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black mb-12 text-center">
            Questions You're Probably Asking
          </h2>

          <div className="space-y-6">
            <Card className="p-6 border-2">
              <h3 className="text-xl font-bold mb-3">
                Q: "My clients won't want to pay extra."
              </h3>
              <p className="text-gray-700">
                <strong>A:</strong> Wellness clients spend hundreds per treatment. $40 for liability coverage is nothing. Plus, 95% opt-in rate proves they want it.
              </p>
            </Card>

            <Card className="p-6 border-2">
              <h3 className="text-xl font-bold mb-3">
                Q: "I don't have time to manage this."
              </h3>
              <p className="text-gray-700">
                <strong>A:</strong> You don't manage anything. Add one checkbox to your intake form. We handle the rest. Literally zero ongoing work.
              </p>
            </Card>

            <Card className="p-6 border-2">
              <h3 className="text-xl font-bold mb-3">
                Q: "What if I want to stop?"
              </h3>
              <p className="text-gray-700">
                <strong>A:</strong> Send one email. We turn it off same day. No fees, no penalties, no questions. Keep the commissions you've earned.
              </p>
            </Card>

            <Card className="p-6 border-2">
              <h3 className="text-xl font-bold mb-3">
                Q: "How do I get paid?"
              </h3>
              <p className="text-gray-700">
                <strong>A:</strong> Direct deposit on the 1st of every month. Track everything in your dashboard. Simple as that.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Start Making Money This Week
          </h2>
          <p className="text-2xl mb-4 text-purple-100">
            5-minute setup. ${monthlyRevenue.toLocaleString()}/month in new revenue.
          </p>
          <p className="text-xl mb-8 text-purple-200">
            What are you waiting for?
          </p>

          <Button
            size="lg"
            className="bg-white text-purple-700 hover:bg-purple-50 text-xl font-bold px-12 py-6 h-auto mb-6"
          >
            Book Your Setup Call
            <ArrowRight className="ml-2 w-6 h-6" />
          </Button>

          <p className="text-purple-100">
            [CALENDAR_LINK] | Questions? Reply to the email
          </p>

          <div className="mt-12 pt-12 border-t border-purple-400/30">
            <p className="text-lg text-purple-200">
              <strong className="text-white">P.S.</strong> Every day you wait is another ${Math.round(monthlyRevenue/30)} you're not making. Book the call.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
