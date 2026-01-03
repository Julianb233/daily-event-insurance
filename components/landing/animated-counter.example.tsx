/**
 * AnimatedCounter Component - Usage Examples
 *
 * This file demonstrates various ways to use the AnimatedCounter component
 */

import AnimatedCounter from './animated-counter';

export function AnimatedCounterExamples() {
  return (
    <div className="space-y-8 p-8">
      {/* Example 1: Price with prefix and suffix */}
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Annual Pricing:</p>
        <p className="text-3xl font-bold">
          <AnimatedCounter end={38400} prefix="$" suffix="/year" duration={2000} />
        </p>
      </div>

      {/* Example 2: Customer count with suffix */}
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Active Customers:</p>
        <p className="text-3xl font-bold">
          <AnimatedCounter end={15000} suffix="+" duration={2500} />
        </p>
      </div>

      {/* Example 3: Percentage with suffix */}
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Success Rate:</p>
        <p className="text-3xl font-bold">
          <AnimatedCounter end={99} suffix="%" duration={1500} />
        </p>
      </div>

      {/* Example 4: Large number with default settings */}
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Total Claims Processed:</p>
        <p className="text-3xl font-bold">
          <AnimatedCounter end={1250000} duration={3000} />
        </p>
      </div>

      {/* Example 5: Currency with symbol */}
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Total Savings:</p>
        <p className="text-3xl font-bold">
          <AnimatedCounter end={5000000} prefix="$" duration={2500} />
        </p>
      </div>

      {/* Example 6: Small number, fast animation */}
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Years in Business:</p>
        <p className="text-3xl font-bold">
          <AnimatedCounter end={12} suffix=" years" duration={800} />
        </p>
      </div>
    </div>
  );
}
