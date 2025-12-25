"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { FAQSection } from "@/components/faq-section"
import { HowItWorks } from "@/components/how-it-works"
import Benefits from "@/components/benefits"
import { DEIIntroSection } from "@/components/dei-intro-section"
import { DEITrustBadges } from "@/components/dei-trust-badges"
import { FounderStory } from "@/components/founder-story"
import { DEIWhoWeServe } from "@/components/dei-who-we-serve"
import { TestimonialsSection } from "@/components/dei-testimonials-section"
import { MidPageCTA } from "@/components/dei-mid-page-cta"
import { ApplySection } from "@/components/dei-apply-section"
import { TimelineSection } from "@/components/timeline-section"
import { RevenueCalculator } from "@/components/revenue-calculator"
import InsuranceModes from "@/components/insurance-modes"

export default function Home() {
  return (
    <main className="relative overflow-x-hidden max-w-full bg-white">
      {/* 1. Header - Navigation bar */}
      <Header />

      {/* 2. DEI Intro Section - Animated hero with teal sparkles */}
      <DEIIntroSection />

      {/* 3. DEI Trust Badges - Stats and partner types */}
      <DEITrustBadges />

      {/* 4. How It Works - 3-step process (moved earlier per request) */}
      <HowItWorks />

      {/* 5. Founder Story - Epiphany Bridge origin story */}
      <FounderStory />

      {/* 6. DEI Who We Serve - Animated market cards */}
      <DEIWhoWeServe />

      {/* 7. Revenue Calculator - Interactive earnings calculator */}
      <RevenueCalculator />

      {/* 8. Testimonials Section - Customer reviews */}
      <TestimonialsSection />

      {/* 9. Timeline Section - Implementation timeline */}
      <TimelineSection />

      {/* 10. Benefits - Business owner benefits */}
      <Benefits />

      {/* 11. Insurance Modes - Optional vs Required coverage */}
      <InsuranceModes />

      {/* 12. Mid Page CTA - Floating sticky CTA */}
      <MidPageCTA />

      {/* 12. FAQ - Frequently asked questions */}
      <FAQSection />

      {/* 13. Apply Section - Partner application form */}
      <ApplySection />

      {/* 14. Footer */}
      <Footer />
    </main>
  )
}
