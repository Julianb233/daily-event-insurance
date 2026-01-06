"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { FAQSection } from "@/components/faq-section"
import { HowItWorks } from "@/components/how-it-works"
import Benefits from "@/components/benefits"
import { DEIIntroSection } from "@/components/dei-intro-section"
import { DEITrustBadges } from "@/components/dei-trust-badges"
import { FounderStory } from "@/components/founder-story"
import { TestimonialsSection } from "@/components/dei-testimonials-section"
import { MidPageCTA } from "@/components/dei-mid-page-cta"
import { ApplySection } from "@/components/dei-apply-section"
import { TimelineSection } from "@/components/timeline-section"
import { RevenueCalculator } from "@/components/revenue-calculator"
import InsuranceModes from "@/components/insurance-modes"
import { CategoryShowcase } from "@/components/category-showcase"
import { ActiveGuardSection } from "@/components/activeguard-section"

export default function Home() {
  return (
    <main className="relative overflow-x-hidden max-w-full bg-white">
      {/* 1. Header - Navigation bar */}
      <Header />

      {/* 2. DEI Intro Section - "Insurance for Moments, Not Time" */}
      <DEIIntroSection />

      {/* 3. DEI Trust Badges - Stats and partner types */}
      <DEITrustBadges />

      {/* 4. How It Works - 3-step partner process */}
      <HowItWorks />

      {/* 5. Category Showcase - Industries served */}
      <CategoryShowcase />

      {/* 6. ActiveGuard Section - Monthly subscription product */}
      <ActiveGuardSection />

      {/* 7. Founder Story - Origin story */}
      <FounderStory />

      {/* 8. Revenue Calculator - Earnings calculator */}
      <RevenueCalculator />

      {/* 9. Testimonials Section - Social proof */}
      <TestimonialsSection />

      {/* 10. Timeline Section - Implementation timeline */}
      <TimelineSection />

      {/* 11. Benefits - Partner benefits */}
      <Benefits />

      {/* 12. Insurance (Mandatory Only) */}
      <InsuranceModes variant="requiredOnly" />

      {/* 13. Mid Page CTA - Floating sticky CTA */}
      <MidPageCTA />

      {/* 14. FAQ Section - Frequently asked questions */}
      <FAQSection />

      {/* 15. Apply Section - Partner application form */}
      <ApplySection />

      {/* 16. Footer */}
      <Footer />
    </main>
  )
}
