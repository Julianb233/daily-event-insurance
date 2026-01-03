/**
 * Example: Statistics Section using AnimatedCounter
 *
 * This demonstrates how to integrate AnimatedCounter into a full page section
 * with multiple counters and proper styling
 */

import AnimatedCounter from './animated-counter';

export function StatsSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white py-20 sm:py-32">
      {/* Background decorative elements */}
      <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-blue-100 opacity-40 blur-3xl" />
      <div className="absolute -right-40 -bottom-40 h-80 w-80 rounded-full bg-indigo-100 opacity-40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Trusted by thousands of event organizers
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Join the fastest-growing event insurance platform
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Stat 1: Annual Pricing */}
          <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Most Popular Plan</p>
                <p className="mt-2 text-4xl font-bold text-gray-900">
                  <AnimatedCounter
                    end={38400}
                    prefix="$"
                    suffix="/year"
                    duration={2000}
                  />
                </p>
                <p className="mt-2 text-xs text-gray-500">Billed annually</p>
              </div>
            </div>
          </div>

          {/* Stat 2: Active Customers */}
          <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="mt-2 text-4xl font-bold text-gray-900">
                <AnimatedCounter
                  end={15000}
                  suffix="+"
                  duration={2500}
                />
              </p>
              <p className="mt-2 text-xs text-gray-500">Across all platforms</p>
            </div>
          </div>

          {/* Stat 3: Success Rate */}
          <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
            <div>
              <p className="text-sm font-medium text-gray-600">Claims Approved</p>
              <p className="mt-2 text-4xl font-bold text-green-600">
                <AnimatedCounter
                  end={99}
                  suffix="%"
                  duration={1800}
                />
              </p>
              <p className="mt-2 text-xs text-gray-500">On first submission</p>
            </div>
          </div>

          {/* Stat 4: Total Claims Processed */}
          <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
            <div>
              <p className="text-sm font-medium text-gray-600">Claims Processed</p>
              <p className="mt-2 text-4xl font-bold text-gray-900">
                <AnimatedCounter
                  end={1250000}
                  duration={3000}
                />
              </p>
              <p className="mt-2 text-xs text-gray-500">Total since launch</p>
            </div>
          </div>
        </div>

        {/* Additional stats section */}
        <div className="mt-16 grid grid-cols-1 gap-12 sm:grid-cols-3">
          {/* Growth stat */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              <AnimatedCounter
                end={240}
                suffix="%"
                duration={2200}
              />
            </p>
            <p className="mt-2 text-sm text-gray-600">Growth in past year</p>
          </div>

          {/* Uptime stat */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              <AnimatedCounter
                end={99}
                suffix=".9%"
                duration={2000}
              />
            </p>
            <p className="mt-2 text-sm text-gray-600">Platform uptime</p>
          </div>

          {/* Support stat */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
              <svg
                className="w-8 h-8 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5-4a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              <AnimatedCounter
                end={24}
                suffix="/7"
                duration={1500}
              />
            </p>
            <p className="mt-2 text-sm text-gray-600">Support availability</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Simplified version for minimal stats display
 */
export function SimpleStatsRow() {
  return (
    <div className="grid grid-cols-3 gap-8 py-12">
      <div className="text-center">
        <p className="text-5xl font-bold text-gray-900">
          <AnimatedCounter end={5000000} prefix="$" duration={2500} />
        </p>
        <p className="mt-2 text-gray-600">Total Claims Paid</p>
      </div>
      <div className="text-center">
        <p className="text-5xl font-bold text-gray-900">
          <AnimatedCounter end={12} duration={1500} />
          <span className="text-2xl ml-2">Years</span>
        </p>
        <p className="mt-2 text-gray-600">in Business</p>
      </div>
      <div className="text-center">
        <p className="text-5xl font-bold text-gray-900">
          <AnimatedCounter end={50000} suffix="+" duration={2000} />
        </p>
        <p className="mt-2 text-gray-600">Events Insured</p>
      </div>
    </div>
  );
}
