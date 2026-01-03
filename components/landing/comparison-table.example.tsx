// Example usage of the ComparisonTable component

import ComparisonTable from "./comparison-table"

export function ComparisonTableExample() {
  return (
    <>
      {/* For Gym Vertical - $2,000/month baseline revenue */}
      <ComparisonTable vertical="gym" estimatedRevenue={2000} />

      {/* For Wellness Vertical - $1,500/month baseline revenue */}
      <ComparisonTable vertical="wellness" estimatedRevenue={1500} />

      {/* For Ski Resort Vertical - $5,000/month baseline revenue */}
      <ComparisonTable vertical="ski-resort" estimatedRevenue={5000} />

      {/* For Fitness Center Vertical - $3,000/month baseline revenue */}
      <ComparisonTable vertical="fitness" estimatedRevenue={3000} />
    </>
  )
}

// To use in a section (recommended):
export function ComparisonSection() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            See the Difference
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Compare what happens when you protect your business with our insurance coverage
          </p>
        </div>

        {/* Insert for your specific vertical */}
        <ComparisonTable vertical="gym" estimatedRevenue={2000} />
      </div>
    </section>
  )
}
