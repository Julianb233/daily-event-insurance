'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Shield,
  CheckCircle,
  ArrowRight,
  Trophy,
  Timer,
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
  Dumbbell,
  Mountain,
  Bike,
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
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-900 via-red-800 to-amber-900 text-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-400 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-400 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Trophy className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-medium">Per-Participant Coverage</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Protect Every
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-300">
                Competitor at Your Event
              </span>
            </h1>

            <p className="text-xl text-orange-100 mb-8 max-w-xl">
              Instant liability coverage for fitness competitions, obstacle races, CrossFit events,
              and athletic challenges. $40 per participant. No annual commitment.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button size="lg" className="bg-white text-orange-900 hover:bg-orange-50 text-lg px-8">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8">
                Calculate Earnings
              </Button>
            </div>

            <div className="flex items-center gap-6 text-sm text-orange-200">
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
                <div className="text-orange-200">Per Participant Coverage</div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-orange-100">
                  <Shield className="w-5 h-5 text-amber-300" />
                  <span>$1M liability per occurrence</span>
                </div>
                <div className="flex items-center gap-3 text-orange-100">
                  <FileCheck className="w-5 h-5 text-amber-300" />
                  <span>Certificate in 60 seconds</span>
                </div>
                <div className="flex items-center gap-3 text-orange-100">
                  <Trophy className="w-5 h-5 text-amber-300" />
                  <span>All competition types covered</span>
                </div>
                <div className="flex items-center gap-3 text-orange-100">
                  <DollarSign className="w-5 h-5 text-amber-300" />
                  <span>Earn $14 per participant sold</span>
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
            Traditional Event Insurance Doesn't Work for Competitions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Fitness events need specialized coverage that traditional policies don't provide
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Problem Side */}
          <div className="bg-red-50 rounded-2xl p-8 border border-red-100">
            <div className="inline-flex items-center gap-2 bg-red-100 rounded-full px-4 py-2 mb-6">
              <span className="text-red-600 font-semibold">❌ The Problem</span>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Traditional Event Insurance Gaps
            </h3>

            <ul className="space-y-4">
              {[
                'Annual policies cost $10,000-$50,000+',
                'Per-event certificates take weeks to issue',
                'Doesn\'t cover high-intensity activities',
                'No individual participant tracking',
                'Venues require proof before booking'
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
              Per-Participant Coverage
            </h3>

            <ul className="space-y-4">
              {[
                'Pay only for participants who compete',
                'All fitness activities included',
                'Instant digital certificates',
                'Venues accept immediately',
                'Scale with your event size'
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
// Section 3: Event Types Covered
// ============================================
function EventTypesCoveredSection() {
  const eventTypes = [
    {
      icon: Mountain,
      title: 'Obstacle Course Races',
      description: 'Spartan, Tough Mudder, mud runs, ninja courses',
      color: 'bg-orange-100 text-orange-600'
    },
    {
      icon: Dumbbell,
      title: 'CrossFit Competitions',
      description: 'Local throwdowns, regionals, functional fitness',
      color: 'bg-red-100 text-red-600'
    },
    {
      icon: Activity,
      title: 'Strength Events',
      description: 'Powerlifting meets, strongman competitions',
      color: 'bg-amber-100 text-amber-600'
    },
    {
      icon: Timer,
      title: 'Endurance Challenges',
      description: 'Triathlons, marathons, ultra races, swim events',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Bike,
      title: 'Cycling Events',
      description: 'Road races, criteriums, mountain bike events',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: Trophy,
      title: 'Fitness Challenges',
      description: 'Bootcamps, fitness tests, corporate events',
      color: 'bg-purple-100 text-purple-600'
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Complete Coverage for Every Competition
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            One policy covers all your fitness events and competitions
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventTypes.map((eventType, i) => (
            <Card key={i} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className={`w-12 h-12 rounded-xl ${eventType.color} flex items-center justify-center mb-4`}>
                  <eventType.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {eventType.title}
                </h3>
                <p className="text-gray-600">
                  {eventType.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Running a different type of event? Contact us - we cover most athletic competitions.
          </p>
          <Button variant="outline" size="lg">
            Check Coverage for Your Event
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
      title: 'Register Your Event',
      description: 'Quick online signup - just basic event info and expected participant count.',
      icon: Building2
    },
    {
      number: '02',
      title: 'Participant Registers',
      description: 'Coverage is added automatically at checkout when athletes sign up.',
      icon: Users
    },
    {
      number: '03',
      title: 'Instant Certificate',
      description: 'Both you and participants receive proof of coverage in 60 seconds.',
      icon: FileCheck
    },
    {
      number: '04',
      title: 'Earn Commission',
      description: 'Receive 35% of every $40 policy - that\'s $14 per participant.',
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
            Start protecting your events in minutes, not weeks
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-orange-200" />
              )}

              <div className="relative bg-white rounded-2xl p-6 border border-gray-200 hover:border-orange-300 transition-colors">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4 relative z-10">
                  <step.icon className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-sm font-medium text-orange-600 mb-2">
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
  const [monthlyParticipants, setMonthlyParticipants] = useState(500)
  const [conversionRate, setConversionRate] = useState(65)
  const [pricePerPolicy] = useState(40)
  const [commissionRate] = useState(35)

  const coveredParticipants = Math.round(monthlyParticipants * (conversionRate / 100))
  const monthlyRevenue = Math.round(coveredParticipants * pricePerPolicy * (commissionRate / 100))
  const annualRevenue = monthlyRevenue * 12

  return (
    <section className="py-20 bg-gradient-to-br from-orange-900 via-red-800 to-amber-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Calculate Your Earnings
          </h2>
          <p className="text-xl text-orange-200 max-w-3xl mx-auto">
            See how much you could earn with per-participant coverage
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
            <div className="space-y-8">
              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-white">Monthly Participants</Label>
                  <span className="text-orange-200">{monthlyParticipants}</span>
                </div>
                <Slider
                  value={[monthlyParticipants]}
                  onValueChange={(value) => setMonthlyParticipants(value[0])}
                  min={100}
                  max={5000}
                  step={50}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-orange-300 mt-1">
                  <span>100</span>
                  <span>5,000</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-white">Participant Opt-in Rate</Label>
                  <span className="text-orange-200">{conversionRate}%</span>
                </div>
                <Slider
                  value={[conversionRate]}
                  onValueChange={(value) => setConversionRate(value[0])}
                  min={20}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-orange-300 mt-1">
                  <span>20%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/20">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-orange-300">Coverage Price</span>
                    <div className="text-xl font-semibold">${pricePerPolicy}/participant</div>
                  </div>
                  <div>
                    <span className="text-orange-300">Your Commission</span>
                    <div className="text-xl font-semibold">{commissionRate}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center lg:text-left">
            <div className="inline-block bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
              <div className="text-orange-200 mb-2">Covered Participants/Month</div>
              <div className="text-3xl font-bold mb-6">{coveredParticipants.toLocaleString()}</div>

              <div className="text-orange-200 mb-2">Monthly Commission</div>
              <div className="text-5xl font-bold text-green-400 mb-2">
                ${monthlyRevenue.toLocaleString()}
              </div>

              <div className="text-orange-200 mb-2 mt-6">Annual Earnings</div>
              <div className="text-3xl font-bold text-green-300">
                ${annualRevenue.toLocaleString()}
              </div>

              <Button className="w-full mt-8 bg-white text-orange-900 hover:bg-orange-50" size="lg">
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
      quote: "We run 12 CrossFit throwdowns a year with 200+ athletes each. Per-participant coverage saves us thousands compared to annual event insurance and participants love knowing they're protected.",
      name: "Mike Thompson",
      title: "CrossFit Games Director, Austin",
      image: "/testimonials/fitness-1.jpg"
    },
    {
      quote: "Venues used to give us problems about insurance certificates. Now we send them in 60 seconds and book immediately. The commission covers our registration platform costs.",
      name: "Sarah Martinez",
      title: "OCR Event Organizer, Denver",
      image: "/testimonials/fitness-2.jpg"
    },
    {
      quote: "1,500 participants at our annual Spartan-style event means $21,000 in commissions. That's profit we never had before while giving athletes peace of mind.",
      name: "James Wilson",
      title: "Endurance Events LLC, Phoenix",
      image: "/testimonials/fitness-3.jpg"
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Event Organizers Nationwide
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See why fitness competitions are switching to per-participant coverage
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
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                    <span className="text-orange-600 font-semibold">
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
    eventName: '',
    contactName: '',
    email: '',
    phone: '',
    expectedParticipants: '',
    eventType: ''
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
              Ready to Protect Your Events?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Get set up in 24 hours. No contracts, no minimums, just better coverage.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <BadgeCheck className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Free Setup</h3>
                  <p className="text-gray-600">No setup fees, no monthly minimums</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Live in 24 Hours</h3>
                  <p className="text-gray-600">Quick onboarding, instant coverage</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Earn 35% Forever</h3>
                  <p className="text-gray-600">Lifetime commission on every participant</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="eventName">Event/Company Name</Label>
                  <Input
                    id="eventName"
                    placeholder="Your Fitness Event"
                    value={formData.eventName}
                    onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
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
                    placeholder="you@events.com"
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
                <Label htmlFor="expectedParticipants">Expected Participants Per Event</Label>
                <Input
                  id="expectedParticipants"
                  placeholder="e.g., 500"
                  value={formData.expectedParticipants}
                  onChange={(e) => setFormData({ ...formData, expectedParticipants: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="eventType">Event Type</Label>
                <Input
                  id="eventType"
                  placeholder="CrossFit, OCR, Triathlon, etc."
                  value={formData.eventType}
                  onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" size="lg">
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
      question: 'What event types are covered?',
      answer: 'We cover all fitness and athletic competitions including obstacle course races, CrossFit events, powerlifting meets, triathlons, marathons, cycling events, bootcamps, and more. If you\'re unsure about your specific event type, contact us and we\'ll confirm coverage.'
    },
    {
      question: 'How much does coverage cost?',
      answer: 'Coverage is $40 per participant. There are no monthly fees, no minimums, and no annual commitments. You only pay for participants who opt in.'
    },
    {
      question: 'How do I earn commission?',
      answer: 'You earn 35% commission on every $40 policy - that\'s $14 per participant. Commissions are paid monthly via direct deposit. With 500 participants per month at 65% opt-in, you\'d earn over $4,500/month.'
    },
    {
      question: 'Will venues accept this coverage?',
      answer: 'Yes! We provide instant certificates that meet venue requirements. Most venues accept our coverage immediately because it\'s backed by Mutual of Omaha, a trusted A-rated carrier.'
    },
    {
      question: 'How do participants receive their certificate?',
      answer: 'Certificates are delivered instantly via email and text message when they register. They can also download them from our portal. The whole process takes about 60 seconds.'
    },
    {
      question: 'Does this cover high-intensity activities?',
      answer: 'Absolutely! Unlike traditional event insurance, we specifically cover high-intensity activities like obstacle courses, extreme fitness challenges, and competitive athletics. Coverage is active for the entire event duration.'
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
            Everything you need to know about per-participant coverage
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
    <section className="py-16 bg-orange-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Start Protecting Your Events Today
        </h2>
        <p className="text-xl text-orange-200 mb-8">
          Join hundreds of event organizers earning while they protect their athletes
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-white text-orange-900 hover:bg-orange-50 text-lg px-8">
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
export default function FitnessPage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <ProblemSolutionSection />
      <EventTypesCoveredSection />
      <HowItWorksSection />
      <RevenueCalculatorSection />
      <TestimonialsSection />
      <DemoFormSection />
      <FAQSection />
      <FooterCTA />
    </main>
  )
}
