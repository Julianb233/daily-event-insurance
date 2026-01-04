'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  CheckCircle,
  DollarSign,
  Mountain,
  Users,
  Shield,
  Quote,
  Star,
  TrendingUp,
  Snowflake
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default function SkiResortLandingPage() {
  const [dailyVisitors, setDailyVisitors] = useState(500)
  const [seasonDays, setSeasonDays] = useState(120)
  const [optInRate] = useState(65)

  const totalVisitors = dailyVisitors * seasonDays
  const policiesSold = Math.round(totalVisitors * (optInRate / 100))
  const seasonRevenue = policiesSold * 14
  const dailyRevenue = Math.round(dailyVisitors * (optInRate / 100) * 14)

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* HERO */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-blue-600 via-cyan-600 to-sky-500 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-blue-500/30 border border-blue-400/50 rounded-full px-4 py-2 mb-6"
          >
            <Mountain className="w-4 h-4" />
            <span className="text-sm font-bold uppercase tracking-wide">For Ski Resorts</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black mb-6 leading-tight"
          >
            Add ${dailyRevenue.toLocaleString()}/Day
            <span className="block text-blue-200">To Your Bottom Line</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-3xl font-semibold mb-4 text-blue-50"
          >
            Every lift ticket is potential commission. You're just not collecting it yet.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto"
          >
            Integrate daily insurance at ticket purchase. Earn $14 per policy. Zero work after setup.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              size="lg"
              className="bg-white text-blue-700 hover:bg-blue-50 text-xl font-bold px-12 py-6 h-auto shadow-2xl"
              onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Calculate Season Revenue
              <ArrowRight className="ml-2 w-6 h-6" />
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-blue-100 mt-6"
          >
            10-minute integration • No contracts • Direct deposit
          </motion.p>
        </div>
      </section>

      {/* THE MATH */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-center">
            The Math Is Simple
          </h2>
          <p className="text-xl text-gray-700 text-center mb-12">
            Let's say you sell {dailyVisitors} lift tickets per day during peak season:
          </p>

          <div className="bg-white rounded-xl p-8 border-2 border-blue-500 mb-8">
            <div className="space-y-4 text-lg">
              <div className="flex justify-between items-center pb-4 border-b">
                <span className="text-gray-700">Daily visitors</span>
                <span className="font-bold text-2xl">{dailyVisitors.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b">
                <span className="text-gray-700">Opt-in rate (industry avg)</span>
                <span className="font-bold text-2xl">65%</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b">
                <span className="text-gray-700">Policies sold per day</span>
                <span className="font-bold text-2xl text-blue-600">{Math.round(dailyVisitors * 0.65)}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b">
                <span className="text-gray-700">Commission per policy</span>
                <span className="font-bold text-2xl">$14</span>
              </div>
              <div className="flex justify-between items-center pt-4 bg-blue-50 -mx-4 px-4 py-4 rounded-lg">
                <span className="text-gray-900 font-bold text-xl">Daily Revenue</span>
                <span className="font-black text-4xl text-blue-700">${dailyRevenue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-8 text-center text-white">
            <p className="text-3xl font-black mb-2">
              ${seasonRevenue.toLocaleString()} Per Season
            </p>
            <p className="text-xl text-blue-100 mb-6">
              Based on your {seasonDays}-day season. Conservative estimate.
            </p>
            <p className="text-lg text-blue-200">
              Most resorts exceed these numbers. Yours could too.
            </p>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-center">
            Real Resorts. Real Revenue.
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            These are actual numbers from actual ski resorts using our system
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="p-8 border-2 hover:border-blue-500 transition-colors">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <Quote className="w-8 h-8 text-blue-200 mb-4" />
              <p className="text-gray-700 mb-4 italic text-lg">
                &quot;We made $287,000 in commission revenue last season. Setup took one phone call.&quot;
              </p>
              <div className="font-bold text-gray-900">Operations Director</div>
              <div className="text-sm text-gray-500">Mountain Resort, Colorado</div>
              <div className="text-sm text-blue-600 font-semibold mt-2">
                680 daily visitors × 140-day season
              </div>
            </Card>

            <Card className="p-8 border-2 hover:border-blue-500 transition-colors">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <Quote className="w-8 h-8 text-blue-200 mb-4" />
              <p className="text-gray-700 mb-4 italic text-lg">
                &quot;Easiest revenue stream we&apos;ve ever added. Pays for two full-time staff members.&quot;
              </p>
              <div className="font-bold text-gray-900">GM, Alpine Resort</div>
              <div className="text-sm text-gray-500">Vermont</div>
              <div className="text-sm text-blue-600 font-semibold mt-2">
                420 daily visitors × 110-day season
              </div>
            </Card>
          </div>

          <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-8 text-center">
            <p className="text-2xl font-black text-gray-900 mb-4">
              Your Resort Could Be Next
            </p>
            <p className="text-lg text-gray-700 mb-6">
              Same system. Same results. Different mountain.
            </p>
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold px-12 py-6 h-auto"
            >
              Get Your Custom Projection
              <ArrowRight className="ml-2 w-6 h-6" />
            </Button>
          </div>
        </div>
      </section>

      {/* CALCULATOR */}
      <section id="calculator" className="py-20 bg-gradient-to-br from-gray-900 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black mb-12 text-center">
            Your Resort Revenue Calculator
          </h2>

          <Card className="p-8 bg-white text-gray-900">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-lg font-bold mb-4">
                  Daily Visitors (Peak)
                </label>
                <Input
                  type="number"
                  value={dailyVisitors}
                  onChange={(e) => setDailyVisitors(parseInt(e.target.value) || 0)}
                  className="text-2xl font-bold h-16 text-center"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-lg font-bold mb-4">
                  Season Length (Days)
                </label>
                <Input
                  type="number"
                  value={seasonDays}
                  onChange={(e) => setSeasonDays(parseInt(e.target.value) || 0)}
                  className="text-2xl font-bold h-16 text-center"
                  min="0"
                />
              </div>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-8">
              <div className="text-center mb-6">
                <div className="text-6xl font-black text-blue-700 mb-2">
                  ${seasonRevenue.toLocaleString()}
                </div>
                <div className="text-lg text-gray-600">projected season revenue</div>
              </div>

              <hr className="border-gray-300 my-6" />

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Daily Revenue</div>
                  <div className="text-2xl font-black text-blue-600">${dailyRevenue.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Total Policies</div>
                  <div className="text-2xl font-black text-blue-600">{policiesSold.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Opt-In Rate</div>
                  <div className="text-2xl font-black text-blue-600">65%</div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-white rounded-lg">
                <p className="text-center text-sm text-gray-600 mb-1">
                  Conservative estimate based on industry data
                </p>
                <p className="text-center text-lg font-bold text-gray-800">
                  Some resorts hit 75%+ opt-in rates
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold px-12 py-6 h-auto w-full md:w-auto"
              >
                Get Set Up Before Season
                <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
              <p className="text-sm text-gray-500 mt-4">
                Integration with any ticketing system • No upfront costs
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* THE OPPORTUNITY */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black mb-12 text-center">
            You're Selling Tickets. We'll Add The Revenue.
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-black text-blue-600">1</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">Integrate at Checkout</h3>
              <p className="text-gray-600 text-lg">
                Add insurance option to ticket purchase. One-time 10-minute setup. Works with any system.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-black text-blue-600">2</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">Visitors Opt In</h3>
              <p className="text-gray-600 text-lg">
                &quot;Add $40 daily coverage?&quot; 65% say yes. Completely automated. Your staff does nothing.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-black text-blue-600">3</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">Bank The Commission</h3>
              <p className="text-gray-600 text-lg">
                $14 per policy. Monthly direct deposit. Track it all in your dashboard.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500 rounded-xl p-8">
            <div className="text-center">
              <TrendingUp className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <p className="text-3xl font-black text-gray-900 mb-4">
                This Scales With Your Business
              </p>
              <p className="text-xl text-gray-700">
                Busier days = more revenue. Slower days = still profitable. No downside.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black mb-12 text-center">
            Other Resorts Are Already Cashing In
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 border-2 hover:border-blue-500 transition-colors">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <Quote className="w-8 h-8 text-blue-200 mb-4" />
              <p className="text-gray-700 mb-4 italic text-lg">
                &quot;$3,200 per day during peak season. That&apos;s an extra $384,000 this year. Absolutely insane ROI.&quot;
              </p>
              <div className="font-bold text-gray-900">Resort Director</div>
              <div className="text-sm text-gray-500">Peak Mountain, Utah</div>
              <div className="text-sm text-blue-600 font-semibold mt-2">750 daily visitors</div>
            </Card>

            <Card className="p-8 border-2 hover:border-blue-500 transition-colors">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <Quote className="w-8 h-8 text-blue-200 mb-4" />
              <p className="text-gray-700 mb-4 italic text-lg">
                &quot;Easiest decision I&apos;ve made as GM. Set up in one call. Haven&apos;t touched it since. Making $1,800/day.&quot;
              </p>
              <div className="font-bold text-gray-900">General Manager</div>
              <div className="text-sm text-gray-500">Alpine Valley, Idaho</div>
              <div className="text-sm text-blue-600 font-semibold mt-2">420 daily visitors</div>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black mb-12 text-center">
            You&apos;re Probably Thinking...
          </h2>

          <div className="space-y-6">
            <Card className="p-6 border-2">
              <h3 className="text-xl font-bold mb-3">
                &quot;Will this slow down our ticketing?&quot;
              </h3>
              <p className="text-gray-700">
                No. It&apos;s one checkbox at checkout. Adds 2 seconds max. Most systems auto-populate it.
              </p>
            </Card>

            <Card className="p-6 border-2">
              <h3 className="text-xl font-bold mb-3">
                &quot;What if there&apos;s a claim?&quot;
              </h3>
              <p className="text-gray-700">
                We handle it. Your staff doesn&apos;t touch claims. Ever. That&apos;s literally why we exist.
              </p>
            </Card>

            <Card className="p-6 border-2">
              <h3 className="text-xl font-bold mb-3">
                &quot;How long is the commitment?&quot;
              </h3>
              <p className="text-gray-700">
                There isn&apos;t one. Try it this season. If you hate it (you won&apos;t), cancel via email. Keep the money you made.
              </p>
            </Card>

            <Card className="p-6 border-2">
              <h3 className="text-xl font-bold mb-3">
                &quot;Do I need minimum volume?&quot;
              </h3>
              <p className="text-gray-700">
                Nope. Whether you&apos;re a small local hill or a major resort - doesn&apos;t matter. Commission is the same.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-cyan-600 text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Snowflake className="w-16 h-16 mx-auto mb-6 text-blue-200" />
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Season&apos;s Coming. Get Set Up Now.
          </h2>
          <p className="text-2xl mb-4 text-blue-100">
            ${seasonRevenue.toLocaleString()} in additional revenue this season.
          </p>
          <p className="text-xl mb-8 text-blue-200">
            Or you can leave it on the table. It&apos;s your call.
          </p>

          <Button
            size="lg"
            className="bg-white text-blue-700 hover:bg-blue-50 text-xl font-bold px-12 py-6 h-auto mb-6"
          >
            Book Integration Call Now
            <ArrowRight className="ml-2 w-6 h-6" />
          </Button>

          <p className="text-blue-100 text-lg">
            [CALENDAR_LINK] • Takes 10 minutes to set up
          </p>

          <div className="mt-12 pt-12 border-t border-blue-400/30">
            <p className="text-lg text-blue-200">
              <strong className="text-white">P.S.</strong> Peak season waits for no one. Every day you delay = ${dailyRevenue} you&apos;re not making. Book the call.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
