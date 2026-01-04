'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Shield,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Syringe,
  Heart,
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
  BadgeCheck
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
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-violet-800 to-fuchsia-900 text-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-400 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-400 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-pink-300" />
              <span className="text-sm font-medium">Per-Treatment Coverage</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Protect Every
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-violet-300">
                Treatment You Perform
              </span>
            </h1>

            <p className="text-xl text-purple-100 mb-8 max-w-xl">
              Instant liability coverage for IV therapy, GLP-1 injections, laser treatments,
              and aesthetic procedures. $40 per treatment. No annual commitment.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button size="lg" className="bg-white text-purple-900 hover:bg-purple-50 text-lg px-8">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8">
                Calculate Earnings
              </Button>
            </div>

            <div className="flex items-center gap-6 text-sm text-purple-200">
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
                <div className="text-purple-200">Per Treatment Coverage</div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-purple-100">
                  <Shield className="w-5 h-5 text-pink-300" />
                  <span>$1M liability per occurrence</span>
                </div>
                <div className="flex items-center gap-3 text-purple-100">
                  <FileCheck className="w-5 h-5 text-pink-300" />
                  <span>Certificate in 60 seconds</span>
                </div>
                <div className="flex items-center gap-3 text-purple-100">
                  <Syringe className="w-5 h-5 text-pink-300" />
                  <span>All aesthetic procedures covered</span>
                </div>
                <div className="flex items-center gap-3 text-purple-100">
                  <DollarSign className="w-5 h-5 text-pink-300" />
                  <span>Earn $14 per treatment sold</span>
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
            Traditional Malpractice Doesn&apos;t Fit Your Business
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Aesthetic and wellness procedures require specialized coverage that traditional policies don&apos;t provide
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Problem Side */}
          <div className="bg-red-50 rounded-2xl p-8 border border-red-100">
            <div className="inline-flex items-center gap-2 bg-red-100 rounded-full px-4 py-2 mb-6">
              <span className="text-red-600 font-semibold">❌ The Problem</span>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Traditional Coverage Gaps
            </h3>

            <ul className="space-y-4">
              {[
                'Annual malpractice costs $5,000-$15,000+',
                'Doesn\'t cover new procedures like GLP-1s',
                'Claims process takes months',
                'No coverage for mobile or pop-up services',
                'One claim can increase premiums 300%'
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
              <span className="text-green-600 font-semibold">✓ The Solution</span>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Per-Treatment Coverage
            </h3>

            <ul className="space-y-4">
              {[
                'Pay only for treatments you perform',
                'All aesthetic procedures included',
                'Instant digital certificates',
                'Works anywhere - clinic, mobile, events',
                'No premium increases after claims'
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
// Section 3: Services Covered
// ============================================
function ServicesCoveredSection() {
  const services = [
    {
      icon: Syringe,
      title: 'IV Hydration Therapy',
      description: 'Vitamin infusions, NAD+, Myers cocktails, hydration drips',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Zap,
      title: 'GLP-1 Injections',
      description: 'Semaglutide, Tirzepatide, weight loss treatments',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: Sparkles,
      title: 'Laser Treatments',
      description: 'Hair removal, skin resurfacing, tattoo removal',
      color: 'bg-pink-100 text-pink-600'
    },
    {
      icon: Heart,
      title: 'Injectables & Fillers',
      description: 'Botox, Dysport, dermal fillers, lip augmentation',
      color: 'bg-red-100 text-red-600'
    },
    {
      icon: Star,
      title: 'Body Contouring',
      description: 'CoolSculpting, RF treatments, cellulite reduction',
      color: 'bg-amber-100 text-amber-600'
    },
    {
      icon: Shield,
      title: 'Aesthetic Procedures',
      description: 'Chemical peels, microneedling, PRP treatments',
      color: 'bg-green-100 text-green-600'
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Complete Coverage for Every Treatment
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            One policy covers all your aesthetic and wellness services
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <Card key={i} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className={`w-12 h-12 rounded-xl ${service.color} flex items-center justify-center mb-4`}>
                  <service.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Don&apos;t see your service? Contact us - we cover most aesthetic procedures.
          </p>
          <Button variant="outline" size="lg">
            Check Coverage for Your Services
          </Button>
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
      title: 'Register Your Practice',
      description: 'Quick online signup - just basic practice info and the procedures you offer.',
      icon: Building2
    },
    {
      number: '02',
      title: 'Client Books Treatment',
      description: 'When a client books, coverage is added automatically at checkout.',
      icon: Clock
    },
    {
      number: '03',
      title: 'Instant Certificate',
      description: 'Both you and your client receive proof of coverage in 60 seconds.',
      icon: FileCheck
    },
    {
      number: '04',
      title: 'Earn Commission',
      description: 'Receive 35% of every $40 policy - that\'s $14 per treatment.',
      icon: DollarSign
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start protecting your treatments in minutes, not weeks
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-purple-200" />
              )}

              <div className="relative bg-white rounded-2xl p-6 border border-gray-200 hover:border-purple-300 transition-colors">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4 relative z-10">
                  <step.icon className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-sm font-medium text-purple-600 mb-2">
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
      </div>
    </section>
  )
}

// ============================================
// Section 5: Revenue Calculator
// ============================================
function RevenueCalculatorSection() {
  const [monthlyTreatments, setMonthlyTreatments] = useState(200)
  const [conversionRate, setConversionRate] = useState(65)
  const [pricePerPolicy] = useState(40)
  const [commissionRate] = useState(35)

  const coveredTreatments = Math.round(monthlyTreatments * (conversionRate / 100))
  const monthlyRevenue = Math.round(coveredTreatments * pricePerPolicy * (commissionRate / 100))
  const annualRevenue = monthlyRevenue * 12

  return (
    <section className="py-20 bg-gradient-to-br from-purple-900 via-violet-800 to-fuchsia-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Calculate Your Earnings
          </h2>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            See how much you could earn with per-treatment coverage
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
            <div className="space-y-8">
              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-white">Monthly Treatments</Label>
                  <span className="text-purple-200">{monthlyTreatments}</span>
                </div>
                <Slider
                  value={[monthlyTreatments]}
                  onValueChange={(value) => setMonthlyTreatments(value[0])}
                  min={50}
                  max={1000}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-purple-300 mt-1">
                  <span>50</span>
                  <span>1,000</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-white">Client Opt-in Rate</Label>
                  <span className="text-purple-200">{conversionRate}%</span>
                </div>
                <Slider
                  value={[conversionRate]}
                  onValueChange={(value) => setConversionRate(value[0])}
                  min={20}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-purple-300 mt-1">
                  <span>20%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/20">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-purple-300">Coverage Price</span>
                    <div className="text-xl font-semibold">${pricePerPolicy}/treatment</div>
                  </div>
                  <div>
                    <span className="text-purple-300">Your Commission</span>
                    <div className="text-xl font-semibold">{commissionRate}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center lg:text-left">
            <div className="inline-block bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
              <div className="text-purple-200 mb-2">Covered Treatments/Month</div>
              <div className="text-3xl font-bold mb-6">{coveredTreatments.toLocaleString()}</div>

              <div className="text-purple-200 mb-2">Monthly Commission</div>
              <div className="text-5xl font-bold text-green-400 mb-2">
                ${monthlyRevenue.toLocaleString()}
              </div>

              <div className="text-purple-200 mb-2 mt-6">Annual Earnings</div>
              <div className="text-3xl font-bold text-green-300">
                ${annualRevenue.toLocaleString()}
              </div>

              <Button className="w-full mt-8 bg-white text-purple-900 hover:bg-purple-50" size="lg">
                Start Earning Today
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
      quote: "Finally, coverage that makes sense for my IV therapy business. I was paying $8,000/year for malpractice that didn't even cover mobile services. Now I pay per treatment and actually save money.",
      name: "Dr. Sarah Chen",
      title: "Wellness IV Lounge, Miami",
      image: "/testimonials/wellness-1.jpg"
    },
    {
      quote: "My GLP-1 patients love knowing they're covered. It builds trust and the commission helps offset my liability costs. Win-win.",
      name: "Jennifer Martinez, NP",
      title: "Aesthetic Solutions, Phoenix",
      image: "/testimonials/wellness-2.jpg"
    },
    {
      quote: "We do 400+ treatments a month. The per-treatment model means I'm earning $5,600/month in commissions while my clients get peace of mind.",
      name: "Dr. Michael Roberts",
      title: "Elite Med Spa, LA",
      image: "/testimonials/wellness-3.jpg"
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Wellness Providers Nationwide
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See why medical spas and wellness clinics are switching to per-treatment coverage
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
                  &quot;{testimonial.quote}&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-purple-600 font-semibold">
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
    practiceName: '',
    contactName: '',
    email: '',
    phone: '',
    monthlyTreatments: '',
    services: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Ready to Protect Your Practice?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Get set up in 24 hours. No contracts, no minimums, just better coverage.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <BadgeCheck className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Free Setup</h3>
                  <p className="text-gray-600">No setup fees, no monthly minimums</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Live in 24 Hours</h3>
                  <p className="text-gray-600">Quick onboarding, instant coverage</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Earn 35% Forever</h3>
                  <p className="text-gray-600">Lifetime commission on every treatment</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="practiceName">Practice Name</Label>
                  <Input
                    id="practiceName"
                    placeholder="Your Med Spa"
                    value={formData.practiceName}
                    onChange={(e) => setFormData({ ...formData, practiceName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contactName">Contact Name</Label>
                  <Input
                    id="contactName"
                    placeholder="Dr. Jane Smith"
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
                    placeholder="you@practice.com"
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
                <Label htmlFor="monthlyTreatments">Estimated Monthly Treatments</Label>
                <Input
                  id="monthlyTreatments"
                  placeholder="e.g., 200"
                  value={formData.monthlyTreatments}
                  onChange={(e) => setFormData({ ...formData, monthlyTreatments: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="services">Services Offered</Label>
                <Input
                  id="services"
                  placeholder="IV therapy, GLP-1s, Botox, etc."
                  value={formData.services}
                  onChange={(e) => setFormData({ ...formData, services: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" size="lg">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

              <p className="text-sm text-gray-500 text-center">
                By submitting, you agree to our Terms of Service and Privacy Policy.
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
      question: 'What procedures are covered?',
      answer: 'We cover all common aesthetic and wellness procedures including IV therapy, GLP-1 injections, laser treatments, Botox, fillers, chemical peels, microneedling, and more. If you\'re unsure about a specific procedure, contact us and we\'ll confirm coverage.'
    },
    {
      question: 'How much does coverage cost?',
      answer: 'Coverage is $40 per treatment. There are no monthly fees, no minimums, and no annual commitments. You only pay for treatments you perform.'
    },
    {
      question: 'How do I earn commission?',
      answer: 'You earn 35% commission on every $40 policy - that\'s $14 per treatment. Commissions are paid monthly via direct deposit. With 200 treatments per month at 65% opt-in, you\'d earn over $1,800/month.'
    },
    {
      question: 'Does this replace my malpractice insurance?',
      answer: 'No, this is supplemental coverage that protects individual treatments. You should maintain your standard malpractice policy. However, many providers find they can reduce their malpractice coverage when using per-treatment protection.'
    },
    {
      question: 'How do clients receive their certificate?',
      answer: 'Certificates are delivered instantly via email and text message. Clients can also download them from our portal. The whole process takes about 60 seconds.'
    },
    {
      question: 'Can I use this for mobile or event-based services?',
      answer: 'Absolutely! Per-treatment coverage works anywhere - your clinic, pop-up events, home visits, or wellness festivals. Coverage follows the treatment, not the location.'
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
            Everything you need to know about per-treatment coverage
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
    <section className="py-16 bg-purple-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Start Protecting Your Practice Today
        </h2>
        <p className="text-xl text-purple-200 mb-8">
          Join hundreds of wellness providers earning while they protect their clients
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-white text-purple-900 hover:bg-purple-50 text-lg px-8">
            Get Started Free
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8">
            <Phone className="mr-2 w-5 h-5" />
            Schedule a Call
          </Button>
        </div>
      </div>
    </section>
  )
}

// ============================================
// Main Page Component
// ============================================
export default function WellnessPage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <ProblemSolutionSection />
      <ServicesCoveredSection />
      <HowItWorksSection />
      <RevenueCalculatorSection />
      <TestimonialsSection />
      <DemoFormSection />
      <FAQSection />
      <FooterCTA />
    </main>
  )
}
