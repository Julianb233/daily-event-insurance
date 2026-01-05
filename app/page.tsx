"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { FAQSection } from "@/components/faq-section"
import { HowItWorks } from "@/components/how-it-works"
import Benefits from "@/components/benefits"
import { DEIIntroSection } from "@/components/dei-intro-section"
import { DEITrustBadges } from "@/components/dei-trust-badges"
import { HiqorValueProp } from "@/components/hiqor-value-prop"
import { FounderStory } from "@/components/founder-story"
import { TestimonialsSection } from "@/components/dei-testimonials-section"
import { MidPageCTA } from "@/components/dei-mid-page-cta"
import { ApplySection } from "@/components/dei-apply-section"
import { TimelineSection } from "@/components/timeline-section"
import { RevenueCalculator } from "@/components/revenue-calculator"
import InsuranceModes from "@/components/insurance-modes"
import { CategoryShowcase } from "@/components/category-showcase"
import { ActiveGuardSection } from "@/components/activeguard-section"

// New HIQOR positioning sections
import { WhoWeAreSection } from "@/components/who-we-are-section"
import { ProblemWeSolveSection } from "@/components/problem-we-solve-section"
import { DataAdvantageSection } from "@/components/data-advantage-section"
import { HowTheModelWorksSection } from "@/components/how-the-model-works-section"
import { WhyThisMattersSection } from "@/components/why-this-matters-section"
import { MissionVisionSection } from "@/components/mission-vision-section"

export default function Home() {
  return (
    <main className="relative overflow-x-hidden max-w-full bg-white">
      {/* 1. Header - Navigation bar */}
      <Header />

      {/* 2. HIQOR Value Proposition - Event-activated insurance (HIQOR first) */}
      <HiqorValueProp />

      {/* 3. Problem We Solve - Static vs dynamic risk (Section vs Coverage comparison) */}
      <ProblemWeSolveSection />

      {/* 4. DEI Intro Section - "Insurance for Moments, Not Time" (after comparison) */}
      <DEIIntroSection />

      {/* 5. DEI Trust Badges - Stats and partner types */}
      <DEITrustBadges />

      {/* 6. Who We Are - Infrastructure positioning */}
      <WhoWeAreSection />

      {/* 7. Data Advantage - Experience intelligence & digital health */}
      <DataAdvantageSection />

      {/* 8. How The Model Works - Carrier-funded acquisition engine (PROMINENT) */}
      <HowTheModelWorksSection />

      {/* 9. Why This Matters - Three-audience value props */}
      <WhyThisMattersSection />

      {/* 10. How It Works - 3-step partner process */}
      <HowItWorks />

      {/* 11. Category Showcase - Industries served */}
      <CategoryShowcase />

      {/* 12. ActiveGuard Section - Monthly subscription product */}
      <ActiveGuardSection />

      {/* 13. Founder Story - Origin story */}
      <FounderStory />

      {/* 14. Revenue Calculator - Earnings calculator */}
      <RevenueCalculator />

      {/* 15. Testimonials Section - Social proof */}
      <TestimonialsSection />

      {/* 16. Timeline Section - Implementation timeline */}
      <TimelineSection />

      {/* 17. Benefits - Partner benefits */}
      <Benefits />

      {/* 18. Insurance Modes - Coverage options */}
      <InsuranceModes />

      {/* 19. Mission & Vision - Our purpose */}
      <MissionVisionSection />

      {/* 20. Mid Page CTA - Floating sticky CTA */}
      <MidPageCTA />

      {/* 21. FAQ Section - Frequently asked questions */}
      <FAQSection />

      {/* 22. Apply Section - Partner application form */}
      <ApplySection />

      {/* 23. Footer */}
      <Footer />
    </main>
  )
}
