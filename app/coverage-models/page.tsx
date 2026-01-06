"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { InsuranceModesSection } from "@/components/insurance-modes"

export default function CoverageModelsPage() {
  return (
    <main className="relative overflow-x-hidden max-w-full bg-white">
      <Header />

      <section className="pt-28 md:pt-32 pb-10 md:pb-14 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Coverage Models
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl">
            For partners, implementation is <span className="font-semibold text-slate-900">mandatory/bundled</span>:
            coverage is included for every customer, we cover the cost, and you earn a commission split on every covered
            participant—without raising your prices. The comparison below is provided for context.
          </p>
        </div>
      </section>

      <InsuranceModesSection variant="full" />

      <Footer />
    </main>
  )
}

