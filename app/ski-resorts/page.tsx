'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Shield,
  CheckCircle,
  ArrowRight,
  Mountain,
  Snowflake,
  Users,
  DollarSign,
  Clock,
  FileCheck,
  TrendingUp,
  Building2,
  Phone,
  Mail,
  ChevronDown,
  Star,
  Zap,
  BadgeCheck,
  Ticket,
  AlertTriangle,
  Activity
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

// ============================================
// Section 1: Hero
// ============================================
function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-sky-900 via-blue-800 to-cyan-900 text-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-400 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      {/* Snow effect overlay */}
      <div className="absolute inset-0 opacity-10 bg-[url('/patterns/snow.svg')]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Snowflake className="w-4 h-4 text-cyan-300" />
              <span className="text-sm font-medium">Per-Skier Day Coverage</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Protect Every
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">
                Day Pass Sold
              </span>
            </h1>

            <p className="text-xl text-blue-100 mb-8 max-w-xl">
              Instant liability coverage for day pass holders and lift ticket purchasers.
              $40 per skier. Integrates with your ticketing system in 24 hours.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50 text-lg px-8">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8">
                Calculate Earnings
              </Button>
            </div>

            <div className="flex items-center gap-6 text-sm text-blue-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Instant Certificates</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Earn 35% Commission</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
              <div className="text-center mb-6">
                <div className="text-6xl font-bold mb-2">$40</div>
                <div className="text-blue-200">Per Skier Day Coverage</div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-blue-100">
                  <Shield className="w-5 h-5 text-cyan-300" />
                  <span>$1M liability per occurrence</span>
                </div>
                <div className="flex items-center gap-3 text-blue-100">
                  <FileCheck className="w-5 h-5 text-cyan-300" />
                  <span>Added at ticket checkout</span>
                </div>
                <div className="flex items-center gap-3 text-blue-100">
                  <Activity className="w-5 h-5 text-cyan-300" />
                  <span>Covers skiing & snowboarding</span>
                </div>
                <div className="flex items-center gap-3 text-blue-100">
                  <DollarSign className="w-5 h-5 text-cyan-300" />
                  <span>Earn $14 per day pass sold</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================
// Section 2: Problem/Solution
// ============================================
function ProblemSolutionSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Your Guests Are One Injury Away From a Lawsuit
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Waivers don't stop lawsuits. Per-skier coverage gives you real protection.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Problem Side */}
          <div className="bg-red-50 rounded-2xl p-8 border border-red-100">
            <div className="inline-flex items-center gap-2 bg-red-100 rounded-full px-4 py-2 mb-6">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-red-600 font-semibold">The Risk</span>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              The Numbers Are Against You
            </h3>

            <ul className="space-y-4">
              {[
                'Average ski injury lawsuit: $150,000-$500,000',
                'Waivers thrown out in 40%+ of cases',
                'Insurance premiums rising 15-20% annually',
                'One fatality claim can exceed $3M',
                'Day pass guests often least careful'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-600 text-sm">✕</span>
                  </div>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Solution Side */}
          <div className="bg-green-50 rounded-2xl p-8 border border-green-100">
            <div className="inline-flex items-center gap-2 bg-green-100 rounded-full px-4 py-2 mb-6">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-green-600 font-semibold">The Solution</span>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Per-Skier Day Coverage
            </h3>

            <ul className="space-y-4">
              {[
                '$1M liability coverage per skier',
                'Supplements your resort policy',
                'Adds at ticket checkout automatically',
                'Guests get immediate coverage proof',
                'You earn 35% of every policy'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================
// Section 3: Coverage Details
// ============================================
function CoverageDetailsSection() {
  const coverageItems = [
    {
      icon: Mountain,
      title: 'Downhill Skiing',
      description: 'All marked trails and terrain parks',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Snowflake,
      title: 'Snowboarding',
      description: 'Full coverage on all resort terrain',
      color: 'bg-cyan-100 text-cyan-600'
    },
    {
      icon: Activity,
      title: 'Cross-Country',
      description: 'Nordic trails and backcountry access',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: Zap,
      title: 'Terrain Parks',
      description: 'Jumps, rails, and halfpipe coverage',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: Ticket,
      title: 'Lift Operations',
      description: 'Coverage during lift loading/unloading',
      color: 'bg-amber-100 text-amber-600'
    },
    {
      icon: Users,
      title: 'Lessons & Guides',
      description: 'Instruction and guided tours included',
      color: 'bg-pink-100 text-pink-600'
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Complete Mountain Coverage
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            One policy covers all activities within your resort boundaries
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coverageItems.map((item, i) => (
            <Card key={i} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-4`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================
// Section 4: How It Works
// ============================================
function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'Quick Integration',
      description: 'We connect to your ticketing system in 24 hours. Works with all major platforms.',
      icon: Building2
    },
    {
      number: '02',
      title: 'Guest Adds Coverage',
      description: 'At ticket checkout, guests see option to add $40 day coverage.',
      icon: Ticket
    },
    {
      number: '03',
      title: 'Instant Certificate',
      description: 'Coverage proof delivered via email/SMS before they hit the slopes.',
      icon: FileCheck
    },
    {
      number: '04',
      title: 'You Earn 35%',
      description: 'Receive $14 for every covered day pass - paid monthly via direct deposit.',
      icon: DollarSign
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Live in 24 Hours
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Integrate with your existing ticketing system seamlessly
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-blue-200" />
              )}

              <div className="relative bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-300 transition-colors">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4 relative z-10">
                  <step.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-sm font-medium text-blue-600 mb-2">
                  Step {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Works with: Inntopia, RTP, Aspenware, SKIDATA, Liftopia, and custom systems
          </p>
        </div>
      </div>
    </section>
  )
}

// ============================================
// Section 5: Revenue Calculator
// ============================================
function RevenueCalculatorSection() {
  const [dailyVisitors, setDailyVisitors] = useState(2000)
  const [operatingDays, setOperatingDays] = useState(120)
  const [conversionRate, setConversionRate] = useState(30)
  const [pricePerPolicy] = useState(40)
  const [commissionRate] = useState(35)

  const seasonVisitors = dailyVisitors * operatingDays
  const coveredSkiers = Math.round(seasonVisitors * (conversionRate / 100))
  const seasonRevenue = Math.round(coveredSkiers * pricePerPolicy * (commissionRate / 100))
  const dailyRevenue = Math.round(seasonRevenue / operatingDays)

  return (
    <section className="py-20 bg-gradient-to-br from-sky-900 via-blue-800 to-cyan-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Calculate Your Season Earnings
          </h2>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            See the revenue potential for your resort
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
            <div className="space-y-8">
              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-white">Average Daily Visitors</Label>
                  <span className="text-blue-200">{dailyVisitors.toLocaleString()}</span>
                </div>
                <Slider
                  value={[dailyVisitors]}
                  onValueChange={(value) => setDailyVisitors(value[0])}
                  min={500}
                  max={10000}
                  step={100}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-blue-300 mt-1">
                  <span>500</span>
                  <span>10,000</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-white">Operating Days/Season</Label>
                  <span className="text-blue-200">{operatingDays}</span>
                </div>
                <Slider
                  value={[operatingDays]}
                  onValueChange={(value) => setOperatingDays(value[0])}
                  min={60}
                  max={200}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-blue-300 mt-1">
                  <span>60 days</span>
                  <span>200 days</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-white">Coverage Opt-in Rate</Label>
                  <span className="text-blue-200">{conversionRate}%</span>
                </div>
                <Slider
                  value={[conversionRate]}
                  onValueChange={(value) => setConversionRate(value[0])}
                  min={10}
                  max={60}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-blue-300 mt-1">
                  <span>10%</span>
                  <span>60%</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/20">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-300">Coverage Price</span>
                    <div className="text-xl font-semibold">${pricePerPolicy}/skier</div>
                  </div>
                  <div>
                    <span className="text-blue-300">Your Commission</span>
                    <div className="text-xl font-semibold">{commissionRate}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center lg:text-left">
            <div className="inline-block bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="text-blue-200 mb-1">Season Visitors</div>
                  <div className="text-2xl font-bold">{seasonVisitors.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-blue-200 mb-1">Covered Skiers</div>
                  <div className="text-2xl font-bold">{coveredSkiers.toLocaleString()}</div>
                </div>
              </div>

              <div className="text-blue-200 mb-2">Season Earnings</div>
              <div className="text-5xl font-bold text-green-400 mb-2">
                ${seasonRevenue.toLocaleString()}
              </div>

              <div className="text-blue-200 mb-2 mt-6">Average Daily Revenue</div>
              <div className="text-3xl font-bold text-green-300">
                ${dailyRevenue.toLocaleString()}/day
              </div>

              <Button className="w-full mt-8 bg-white text-blue-900 hover:bg-blue-50" size="lg">
                Start This Season
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================
// Section 6: Testimonials
// ============================================
function TestimonialsSection() {
  const testimonials = [
    {
      quote: "We added day coverage to our ticket system last season. 28% of day pass buyers opted in, generating an extra $180,000 in commission for us - pure profit.",
      name: "Mike Henderson",
      title: "VP Operations, Powder Peak Resort",
      image: "/testimonials/ski-1.jpg"
    },
    {
      quote: "The integration took one day. Our IT team was impressed. Now our guests have better protection and we have a new revenue stream.",
      name: "Sarah Thompson",
      title: "GM, Mountain Valley Ski Area",
      image: "/testimonials/ski-2.jpg"
    },
    {
      quote: "After a lawsuit that cost us $350K, we wish we'd had this years ago. Now every day pass buyer has the option to protect themselves - and us.",
      name: "James Kowalski",
      title: "Owner, Summit Ridge",
      image: "/testimonials/ski-3.jpg"
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Resorts Nationwide
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See why ski areas are adding per-skier coverage
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <Card key={i} className="bg-white">
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.title}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================
// Section 7: Demo/Contact Form
// ============================================
function DemoFormSection() {
  const [formData, setFormData] = useState({
    resortName: '',
    contactName: '',
    email: '',
    phone: '',
    dailyCapacity: '',
    ticketingSystem: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Ready for This Season?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Get integrated before your peak season. Most resorts go live in 24-48 hours.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">24-Hour Integration</h3>
                  <p className="text-gray-600">Works with all major ticketing platforms</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">$1M Coverage Per Skier</h3>
                  <p className="text-gray-600">Real protection, not just a waiver</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">35% Commission Forever</h3>
                  <p className="text-gray-600">Earn on every covered day pass sold</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="resortName">Resort Name</Label>
                  <Input
                    id="resortName"
                    placeholder="Mountain Resort"
                    value={formData.resortName}
                    onChange={(e) => setFormData({ ...formData, resortName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contactName">Contact Name</Label>
                  <Input
                    id="contactName"
                    placeholder="John Smith"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@resort.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="dailyCapacity">Average Daily Visitors</Label>
                <Input
                  id="dailyCapacity"
                  placeholder="e.g., 3000"
                  value={formData.dailyCapacity}
                  onChange={(e) => setFormData({ ...formData, dailyCapacity: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="ticketingSystem">Ticketing System</Label>
                <Input
                  id="ticketingSystem"
                  placeholder="e.g., Inntopia, RTP, Custom"
                  value={formData.ticketingSystem}
                  onChange={(e) => setFormData({ ...formData, ticketingSystem: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                Schedule Integration Call
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

              <p className="text-sm text-gray-500 text-center">
                We'll review your setup and have you live before peak season.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================
// Section 8: FAQ
// ============================================
function FAQSection() {
  const faqs = [
    {
      question: 'How does this integrate with our ticketing system?',
      answer: 'We have pre-built integrations for Inntopia, RTP, Aspenware, SKIDATA, Liftopia, and most major platforms. For custom systems, we provide a simple API. Most integrations take less than 24 hours.'
    },
    {
      question: 'Does this replace our resort liability insurance?',
      answer: 'No, this supplements your existing coverage. It provides individual protection for each guest, reducing your resort\'s exposure and giving guests peace of mind.'
    },
    {
      question: 'What happens if there\'s a claim?',
      answer: 'Claims are handled directly by our underwriter, Mutual of Omaha. Your resort is not involved in the claims process - that\'s the whole point. The guest deals directly with the insurer.'
    },
    {
      question: 'How much can we realistically earn?',
      answer: 'At 30% opt-in with 2,000 daily visitors over 120 days, you\'d earn about $100,000 per season. Larger resorts with 5,000+ daily visitors often earn $200,000+.'
    },
    {
      question: 'Can guests add coverage after buying their ticket?',
      answer: 'Yes, guests can add coverage anytime before they ski via a mobile link. However, integration at checkout yields the highest opt-in rates (typically 25-35%).'
    },
    {
      question: 'What about season pass holders?',
      answer: 'We offer discounted season coverage for pass holders - contact us for enterprise pricing. Day coverage is specifically designed for day pass and lift ticket purchasers.'
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about per-skier coverage
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left font-semibold">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

// ============================================
// Footer CTA
// ============================================
function FooterCTA() {
  return (
    <section className="py-16 bg-blue-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Protect Your Resort This Season
        </h2>
        <p className="text-xl text-blue-200 mb-8">
          Join ski areas earning six figures while protecting their guests
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50 text-lg px-8">
            Get Started Free
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8">
            <Phone className="mr-2 w-5 h-5" />
            Talk to Sales
          </Button>
        </div>
      </div>
    </section>
  )
}

// ============================================
// Main Page Component
// ============================================
export default function SkiResortsPage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <ProblemSolutionSection />
      <CoverageDetailsSection />
      <HowItWorksSection />
      <RevenueCalculatorSection />
      <TestimonialsSection />
      <DemoFormSection />
      <FAQSection />
      <FooterCTA />
    </main>
  )
}
