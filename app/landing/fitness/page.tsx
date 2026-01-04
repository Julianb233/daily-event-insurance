'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  CheckCircle,
  DollarSign,
  Activity,
  Users,
  Shield,
  Quote,
  Star,
  Target,
  Trophy,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default function FitnessLandingPage() {
  const [participantsPerEvent, setParticipantsPerEvent] = useState(200)
  const [eventsPerYear, setEventsPerYear] = useState(12)
  const [optInRate] = useState(82) // Fitness events see high opt-in

  const totalParticipants = participantsPerEvent * eventsPerYear
  const policiesSold = Math.round(totalParticipants * (optInRate / 100))
  const annualRevenue = policiesSold * 14
  const revenuePerEvent = Math.round(participantsPerEvent * (optInRate / 100) * 14)

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* HERO */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-500 text-white overflow-hidden">
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
            className="inline-flex items-center gap-2 bg-orange-500/30 border border-orange-400/50 rounded-full px-4 py-2 mb-6"
          >
            <Activity className="w-4 h-4" />
            <span className="text-sm font-bold uppercase tracking-wide">For Race Directors & Event Organizers</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black mb-6 leading-tight"
          >
            Add ${revenuePerEvent.toLocaleString()} To
            <span className="block text-orange-200">Every Event You Run</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-3xl font-semibold mb-4 text-orange-50"
          >
            One checkbox at registration. Massive profit increase.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-orange-100 mb-12 max-w-3xl mx-auto"
          >
            82% of participants add $40 event insurance. You earn $14 commission per policy. Pure profit margin.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              size="lg"
              className="bg-white text-orange-700 hover:bg-orange-50 text-xl font-bold px-12 py-6 h-auto shadow-2xl"
              onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Calculate Your Event Revenue
              <ArrowRight className="ml-2 w-6 h-6" />
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-orange-100 mt-6 text-lg"
          >
            Works with any registration platform • No tech skills required
          </motion.p>
        </div>
      </section>

      {/* THE NUMBERS */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-center">
            Here&apos;s The Model
          </h2>
          <p className="text-xl text-gray-700 text-center mb-12">
            (It&apos;s embarrassingly simple)
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 bg-white border-2">
              <div className="text-center mb-4">
                <Target className="w-12 h-12 text-orange-600 mx-auto mb-2" />
                <h3 className="text-2xl font-bold">What Participants Pay</h3>
              </div>
              <div className="space-y-3 text-lg">
                <div className="flex justify-between">
                  <span className="text-gray-600">Event insurance</span>
                  <span className="font-bold">$40</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Coverage amount</span>
                  <span className="font-bold">$1M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Typical opt-in rate</span>
                  <span className="font-bold text-orange-600">82%</span>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-white border-2 border-orange-500">
              <div className="text-center mb-4">
                <DollarSign className="w-12 h-12 text-orange-600 mx-auto mb-2" />
                <h3 className="text-2xl font-bold">What You Make</h3>
              </div>
              <div className="space-y-3 text-lg">
                <div className="flex justify-between">
                  <span className="text-gray-600">Commission per policy</span>
                  <span className="font-bold">$14</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Commission percentage</span>
                  <span className="font-bold">35%</span>
                </div>
                <div className="flex justify-between pt-3 border-t">
                  <span className="text-gray-900 font-bold">Per-event profit</span>
                  <span className="font-black text-2xl text-orange-600">${revenuePerEvent.toLocaleString()}</span>
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-12 bg-gradient-to-r from-orange-600 to-amber-600 rounded-xl p-8 text-center text-white">
            <p className="text-3xl font-black mb-4">
              Run {eventsPerYear} Events? Make ${annualRevenue.toLocaleString()}/Year.
            </p>
            <p className="text-xl text-orange-100">
              No extra work. Just add it to registration. Done.
            </p>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-center">
            Real Events. Real Profits.
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            Last month alone:
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="p-8 border-2 hover:border-orange-500 transition-colors">
              <Trophy className="w-12 h-12 text-orange-500 mb-4" />
              <div className="font-bold text-2xl text-gray-900 mb-2">Spartan Race</div>
              <div className="text-sm text-gray-500 mb-4">San Diego</div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Participants:</span>
                  <span className="font-bold">487</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Opt-in rate:</span>
                  <span className="font-bold">84%</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-gray-900 font-bold">Commission:</span>
                  <span className="font-black text-xl text-orange-600">$5,730</span>
                </div>
              </div>
            </Card>

            <Card className="p-8 border-2 hover:border-orange-500 transition-colors">
              <Trophy className="w-12 h-12 text-orange-500 mb-4" />
              <div className="font-bold text-2xl text-gray-900 mb-2">Local 5K</div>
              <div className="text-sm text-gray-500 mb-4">Portland</div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Participants:</span>
                  <span className="font-bold">183</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Opt-in rate:</span>
                  <span className="font-bold">79%</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-gray-900 font-bold">Commission:</span>
                  <span className="font-black text-xl text-orange-600">$2,024</span>
                </div>
              </div>
            </Card>

            <Card className="p-8 border-2 hover:border-orange-500 transition-colors">
              <Trophy className="w-12 h-12 text-orange-500 mb-4" />
              <div className="font-bold text-2xl text-gray-900 mb-2">CrossFit Open</div>
              <div className="text-sm text-gray-500 mb-4">Austin</div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Participants:</span>
                  <span className="font-bold">312</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Opt-in rate:</span>
                  <span className="font-bold">88%</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-gray-900 font-bold">Commission:</span>
                  <span className="font-black text-xl text-orange-600">$3,847</span>
                </div>
              </div>
            </Card>
          </div>

          <div className="bg-green-50 border-2 border-green-500 rounded-xl p-8 text-center">
            <p className="text-2xl font-black text-gray-900 mb-2">
              Total Commission From These 3 Events: $11,601
            </p>
            <p className="text-lg text-gray-700">
              That&apos;s just one month. Imagine your whole year.
            </p>
          </div>
        </div>
      </section>

      {/* CALCULATOR */}
      <section id="calculator" className="py-20 bg-gradient-to-br from-gray-900 to-orange-900 text-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black mb-12 text-center">
            Your Event Revenue Calculator
          </h2>

          <Card className="p-8 bg-white text-gray-900">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-lg font-bold mb-4">
                  Avg Participants Per Event
                </label>
                <Input
                  type="number"
                  value={participantsPerEvent}
                  onChange={(e) => setParticipantsPerEvent(parseInt(e.target.value) || 0)}
                  className="text-2xl font-bold h-16 text-center"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-lg font-bold mb-4">
                  Events Per Year
                </label>
                <Input
                  type="number"
                  value={eventsPerYear}
                  onChange={(e) => setEventsPerYear(parseInt(e.target.value) || 0)}
                  className="text-2xl font-bold h-16 text-center"
                  min="0"
                />
              </div>
            </div>

            <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-8">
              <div className="text-center mb-6">
                <div className="text-sm text-gray-600 mb-2">ANNUAL COMMISSION</div>
                <div className="text-6xl font-black text-orange-700 mb-2">
                  ${annualRevenue.toLocaleString()}
                </div>
                <div className="text-lg text-gray-600">from {eventsPerYear} events</div>
              </div>

              <hr className="border-gray-300 my-6" />

              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Per Event</div>
                  <div className="text-3xl font-black text-orange-600">${revenuePerEvent.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Total Policies</div>
                  <div className="text-3xl font-black text-orange-600">{policiesSold.toLocaleString()}</div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-white rounded-lg">
                <p className="text-center text-lg font-bold text-gray-800">
                  This is profit on top of your registration fees
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Button
                size="lg"
                className="bg-orange-600 hover:bg-orange-700 text-white text-xl font-bold px-12 py-6 h-auto w-full md:w-auto"
              >
                Add This To My Next Event
                <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
              <p className="text-sm text-gray-500 mt-4">
                Works with any registration platform • No upfront cost
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* THE PROBLEM */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-center">
            You&apos;re Already Managing The Risk
          </h2>
          <p className="text-xl text-gray-700 text-center mb-12">
            Might as well get paid for it.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-red-50 border-l-4 border-red-500 p-6">
              <h3 className="font-bold text-xl mb-3 text-red-700">Current Reality:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>✗ You organize the event</li>
                <li>✗ You assume the liability</li>
                <li>✗ You handle participant concerns</li>
                <li>✗ You make $0 from risk mitigation</li>
              </ul>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-6">
              <h3 className="font-bold text-xl mb-3 text-green-700">With Daily Event Insurance:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>✓ You still organize the event</li>
                <li>✓ Participants get $1M coverage</li>
                <li>✓ We handle all insurance questions</li>
                <li>✓ You make ${revenuePerEvent.toLocaleString()} per event</li>
              </ul>
            </div>
          </div>

          <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-8 text-center">
            <p className="text-2xl font-black text-gray-900 mb-4">
              Same Work. Better Margins. Happier Participants.
            </p>
            <p className="text-lg text-gray-700">
              That&apos;s the entire pitch.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black mb-12 text-center">
            Integration Takes 10 Minutes
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div>
              <div className="bg-orange-600 text-white font-black text-2xl w-12 h-12 rounded-full flex items-center justify-center mb-4">
                1
              </div>
              <h3 className="text-xl font-bold mb-3">Add To Registration</h3>
              <p className="text-gray-600">
                We give you one line of code or a webhook (depending on your platform).
                It adds an insurance checkbox to registration.
              </p>
            </div>

            <div>
              <div className="bg-orange-600 text-white font-black text-2xl w-12 h-12 rounded-full flex items-center justify-center mb-4">
                2
              </div>
              <h3 className="text-xl font-bold mb-3">Participants Choose</h3>
              <p className="text-gray-600">
                They see &quot;Add event day coverage - $40&quot; during checkout.
                82% say yes. Completely automatic.
              </p>
            </div>

            <div>
              <div className="bg-orange-600 text-white font-black text-2xl w-12 h-12 rounded-full flex items-center justify-center mb-4">
                3
              </div>
              <h3 className="text-xl font-bold mb-3">You Get Paid</h3>
              <p className="text-gray-600">
                Track commissions in real-time. Get paid within 30 days.
                Repeat for every event.
              </p>
            </div>
          </div>

          <div className="text-center">
            <Button
              size="lg"
              className="bg-orange-600 hover:bg-orange-700 text-white text-xl font-bold px-12 py-6 h-auto"
            >
              Set Up My Next Event
              <ArrowRight className="ml-2 w-6 h-6" />
            </Button>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black mb-12 text-center">
            What Race Directors Are Saying
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 border-2 hover:border-orange-500 transition-colors">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <Quote className="w-8 h-8 text-orange-200 mb-4" />
              <p className="text-gray-700 mb-4 italic text-lg">
                &quot;Made $18,000 last year from 6 races. Literally added one checkbox to RunSignUp. That&apos;s it.&quot;
              </p>
              <div className="font-bold text-gray-900">Marcus T.</div>
              <div className="text-sm text-gray-500">Trail Running Events, Colorado</div>
              <div className="text-sm text-orange-600 font-semibold mt-2">
                ~250 participants per event
              </div>
            </Card>

            <Card className="p-8 border-2 hover:border-orange-500 transition-colors">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <Quote className="w-8 h-8 text-orange-200 mb-4" />
              <p className="text-gray-700 mb-4 italic text-lg">
                &quot;Our participants actually prefer having the option. And we&apos;re making $3,200 per event. Absolute no-brainer.&quot;
              </p>
              <div className="font-bold text-gray-900">Sarah K.</div>
              <div className="text-sm text-gray-500">Obstacle Course Racing, Texas</div>
              <div className="text-sm text-orange-600 font-semibold mt-2">
                ~280 participants per event
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black mb-12 text-center">
            Common Questions
          </h2>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-3">
                Q: &quot;Does this work with [my registration platform]?&quot;
              </h3>
              <p className="text-gray-700">
                <strong>A:</strong> Yes. RunSignUp, Eventbrite, Active.com, custom platforms - we integrate with everything. Worst case, it&apos;s a webhook. 5 minutes max.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold mb-3">
                Q: &quot;What about refunds and cancellations?&quot;
              </h3>
              <p className="text-gray-700">
                <strong>A:</strong> We handle it all. Participant cancels? Insurance refunds automatically. You keep your commission. Zero headache for you.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold mb-3">
                Q: &quot;Is there a minimum event size?&quot;
              </h3>
              <p className="text-gray-700">
                <strong>A:</strong> Nope. 50 participants or 5,000 - doesn&apos;t matter. Commission is the same per policy.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold mb-3">
                Q: &quot;How fast do I get paid?&quot;
              </h3>
              <p className="text-gray-700">
                <strong>A:</strong> Commission paid within 30 days of event completion. Direct deposit. Track it in real-time on your dashboard.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 bg-gradient-to-br from-orange-600 to-amber-600 text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Stop Leaving Money On The Table
          </h2>
          <p className="text-2xl mb-4 text-orange-100">
            ${annualRevenue.toLocaleString()} this year. From work you&apos;re already doing.
          </p>
          <p className="text-xl mb-8 text-orange-200">
            Add one checkbox. Make thousands. That&apos;s the deal.
          </p>

          <Button
            size="lg"
            className="bg-white text-orange-700 hover:bg-orange-50 text-xl font-bold px-12 py-6 h-auto mb-6"
          >
            Get Started Before Your Next Event
            <ArrowRight className="ml-2 w-6 h-6" />
          </Button>

          <p className="text-orange-100 text-lg">
            [CALENDAR_LINK] | Takes 10 minutes to integrate
          </p>

          <div className="mt-12 pt-12 border-t border-orange-400/30">
            <p className="text-lg text-orange-200">
              <strong className="text-white">P.S.</strong> Your next event is worth ${revenuePerEvent.toLocaleString()} in commission. Don&apos;t run it without this.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
