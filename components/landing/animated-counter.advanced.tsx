/**
 * Advanced AnimatedCounter Patterns and Customizations
 *
 * This file shows advanced usage patterns, custom variations,
 * and integration with other components
 */

import { useState } from 'react';
import AnimatedCounter from './animated-counter';

/**
 * Counter that animates when it comes into view using Intersection Observer
 * Useful for performance - only animates when user can see it
 */
export function VisibleAnimatedCounter({
  end,
  duration = 2000,
  prefix = '',
  suffix = '',
}: {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [hasAnimated]);

  return (
    <div ref={ref}>
      {isVisible ? (
        <AnimatedCounter
          end={end}
          duration={duration}
          prefix={prefix}
          suffix={suffix}
        />
      ) : (
        <span className="text-transparent">0{suffix}</span>
      )}
    </div>
  );
}

/**
 * Counter that can be triggered by a button or external event
 * Allows manual control over animation start
 */
export function ControlledAnimatedCounter({
  end,
  duration = 2000,
  prefix = '',
  suffix = '',
}: {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}) {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  return (
    <div className="space-y-4">
      <button
        onClick={() => {
          setShouldAnimate(false);
          // Reset animation
          setTimeout(() => setShouldAnimate(true), 0);
        }}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Start Animation
      </button>

      <div className="text-4xl font-bold">
        {shouldAnimate ? (
          <AnimatedCounter
            end={end}
            duration={duration}
            prefix={prefix}
            suffix={suffix}
          />
        ) : (
          <span>
            {prefix}0{suffix}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Animated counter with label and icon
 * Perfect for stats cards in grid layouts
 */
export function StatCard({
  icon: Icon,
  label,
  end,
  prefix = '',
  suffix = '',
  color = 'blue',
}: {
  icon: React.ComponentType<{ className: string }>;
  label: string;
  end: number;
  prefix?: string;
  suffix?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}) {
  const colorStyles = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    red: 'bg-red-50 text-red-600 border-red-200',
  };

  return (
    <div
      className={`rounded-lg border ${colorStyles[color]} p-6 text-center hover:shadow-lg transition-shadow`}
    >
      <Icon className="mx-auto h-8 w-8 mb-3" />
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <p className="mt-2 text-4xl font-bold">
        <AnimatedCounter
          end={end}
          prefix={prefix}
          suffix={suffix}
          duration={2000}
        />
      </p>
    </div>
  );
}

/**
 * Counter comparison - shows two values side by side
 * Useful for before/after or competitive comparisons
 */
export function CounterComparison({
  label,
  before,
  after,
  beforeLabel = 'Before',
  afterLabel = 'After',
  beforePrefix = '',
  afterPrefix = '$',
}: {
  label: string;
  before: number;
  after: number;
  beforeLabel?: string;
  afterLabel?: string;
  beforePrefix?: string;
  afterPrefix?: string;
}) {
  const savings = after - before;
  const percentChange = Math.round((savings / before) * 100);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-8">
      <h3 className="text-lg font-semibold text-gray-900">{label}</h3>

      <div className="mt-6 grid grid-cols-2 gap-4">
        {/* Before */}
        <div className="text-center">
          <p className="text-sm text-gray-600">{beforeLabel}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 line-through">
            <AnimatedCounter end={before} prefix={beforePrefix} duration={1500} />
          </p>
        </div>

        {/* After */}
        <div className="text-center">
          <p className="text-sm font-semibold text-green-600">{afterLabel}</p>
          <p className="mt-2 text-3xl font-bold text-green-600">
            <AnimatedCounter end={after} prefix={afterPrefix} duration={1500} />
          </p>
        </div>
      </div>

      {/* Savings info */}
      <div className="mt-6 border-t border-gray-200 pt-4">
        <p className="text-center text-sm text-gray-600">
          You save{' '}
          <span className="font-bold text-green-600">
            <AnimatedCounter
              end={savings}
              prefix={afterPrefix}
              duration={1500}
            />
          </span>{' '}
          ({percentChange}%)
        </p>
      </div>
    </div>
  );
}

/**
 * Animated progress counter
 * Shows progress toward a goal as a counter with optional progress bar
 */
export function ProgressCounter({
  current,
  goal,
  label,
  showBar = true,
}: {
  current: number;
  goal: number;
  label: string;
  showBar?: boolean;
}) {
  const percentage = (current / goal) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-600">
          <AnimatedCounter end={current} duration={2000} /> /{' '}
          {goal.toLocaleString()}
        </p>
      </div>

      {showBar && (
        <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}

      <p className="text-xs text-gray-500">
        {Math.round(percentage)}% complete
      </p>
    </div>
  );
}

/**
 * Animated difference counter
 * Shows the difference between two numbers with visual emphasis
 */
export function DifferenceCounter({
  value1,
  value2,
  label,
  showDifference = true,
}: {
  value1: number;
  value2: number;
  label: string;
  showDifference?: boolean;
}) {
  const difference = value2 - value1;
  const isPositive = difference >= 0;

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-4xl font-bold text-gray-900">
          <AnimatedCounter end={value2} duration={2000} />
        </p>
        {showDifference && (
          <p
            className={`text-lg font-semibold ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {isPositive ? '+' : ''}
            <AnimatedCounter end={difference} duration={2000} />
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Counter with custom formatting function
 * For use cases needing special number formatting beyond toLocaleString
 */
interface CustomFormattedCounterProps {
  end: number;
  duration?: number;
  formatter: (num: number) => string;
}

export function CustomFormattedCounter({
  end,
  duration = 2000,
  formatter,
}: CustomFormattedCounterProps) {
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) * (1 - progress);
      const current = Math.floor(end * eased);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, [end, duration]);

  return <span>{formatter(displayValue)}</span>;
}

/**
 * Examples of using CustomFormattedCounter
 */
export function CustomFormattingExamples() {
  return (
    <div className="space-y-6">
      {/* Time format: minutes:seconds */}
      <div>
        <p className="text-sm text-gray-600">Total Time Saved (minutes)</p>
        <p className="text-3xl font-bold">
          <CustomFormattedCounter
            end={1250}
            duration={2000}
            formatter={(num) => {
              const minutes = Math.floor(num / 60);
              const seconds = num % 60;
              return `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }}
          />
        </p>
      </div>

      {/* Percentage format with decimal */}
      <div>
        <p className="text-sm text-gray-600">Accuracy Rate</p>
        <p className="text-3xl font-bold">
          <CustomFormattedCounter
            end={9995}
            duration={2000}
            formatter={(num) => `${(num / 100).toFixed(2)}%`}
          />
        </p>
      </div>

      {/* Abbreviated numbers: K, M, B */}
      <div>
        <p className="text-sm text-gray-600">Total Impressions</p>
        <p className="text-3xl font-bold">
          <CustomFormattedCounter
            end={5000000}
            duration={2000}
            formatter={(num) => {
              if (num >= 1000000) {
                return (num / 1000000).toFixed(1) + 'M';
              }
              if (num >= 1000) {
                return (num / 1000).toFixed(1) + 'K';
              }
              return num.toString();
            }}
          />
        </p>
      </div>
    </div>
  );
}

// Export all variations
export default AnimatedCounter;
