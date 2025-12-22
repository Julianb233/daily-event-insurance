"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { FAQSection } from "@/components/faq-section"
import { HowItWorks } from "@/components/how-it-works"
import Benefits from "@/components/benefits"
import { DEIIntroSection } from "@/components/dei-intro-section"
import { DEITrustBadges } from "@/components/dei-trust-badges"
import { DEIWhoWeServe } from "@/components/dei-who-we-serve"
import { TestimonialsSection } from "@/components/dei-testimonials-section"
import { MidPageCTA } from "@/components/dei-mid-page-cta"
import { ApplySection } from "@/components/dei-apply-section"
import { TimelineSection } from "@/components/timeline-section"

export default function Home() {
  return (
    <main className="relative overflow-x-hidden max-w-full bg-white">
      {/* 1. Header - Navigation bar */}
      <Header />

      {/* 2. DEI Intro Section - Animated hero with teal sparkles */}
      <DEIIntroSection />

      {/* 3. DEI Trust Badges - Stats and partner types */}
      <DEITrustBadges />

      {/* 4. DEI Who We Serve - Animated market cards */}
      <DEIWhoWeServe />

      {/* 5. How It Works - 3-step process */}
      <HowItWorks />

      {/* 6. Timeline Section - Implementation timeline */}
      <TimelineSection />

      {/* 7. Benefits - Business owner benefits */}
      <Benefits />

      {/* 7. Mid Page CTA - Floating sticky CTA */}
      <MidPageCTA />

      {/* 8. Testimonials Section - Customer reviews */}
      <TestimonialsSection />

      {/* 9. FAQ - Frequently asked questions */}
      <FAQSection />

      {/* 10. Apply Section - Partner application form */}
      <ApplySection />

      {/* 11. Footer */}
      <Footer />
    </main>
  )
}
