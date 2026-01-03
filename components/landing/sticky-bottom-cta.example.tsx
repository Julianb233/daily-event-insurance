'use client';

/**
 * Example usage of StickyBottomCTA component
 *
 * This example demonstrates how to implement the sticky bottom CTA
 * in your landing page or application.
 */

import { useState } from 'react';
import { StickyBottomCTA } from './sticky-bottom-cta';

export function StickyBottomCTAExample() {
  const [ctaClicked, setCtaClicked] = useState(false);

  const handleCTAClick = () => {
    // Handle the CTA action - typically navigation or opening a modal
    setCtaClicked(true);
    // You might want to:
    // - Navigate to a signup page
    // - Open a modal or dialog
    // - Scroll to a specific section
    // - Track analytics
    console.log('CTA clicked!');
  };

  return (
    <>
      <StickyBottomCTA
        text="Don't let your events go uninsured. Protect your investment today."
        buttonText="Get Coverage Now"
        onClick={handleCTAClick}
        lossPerDay={127.50}
      />

      {/* Example page content to demonstrate scroll behavior */}
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold mb-6">Event Insurance Coverage</h1>
          <p className="text-lg text-gray-600 mb-8">
            Scroll down 200px to see the sticky bottom CTA hide. Scroll back up to see it reappear.
          </p>

          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="mb-8 p-6 border border-gray-200 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Section {i + 1}</h2>
              <p className="text-gray-600 mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p className="text-gray-600">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>
          ))}

          {ctaClicked && (
            <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg mt-12">
              <p className="text-blue-900 font-semibold">
                CTA was clicked! You can now handle the action (navigate, open modal, etc.)
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/**
 * Alternative examples with different configurations
 */

export function StickyBottomCTAVariant1() {
  return (
    <StickyBottomCTA
      text="Limited time: Save 20% on annual coverage"
      buttonText="Claim Your Discount"
      onClick={() => console.log('Discount claimed')}
      lossPerDay={250.75}
    />
  );
}

export function StickyBottomCTAVariant2() {
  return (
    <StickyBottomCTA
      text="Your event is at risk. Secure protection in minutes."
      buttonText="Start Quote"
      onClick={() => console.log('Starting quote process')}
      lossPerDay={500.00}
    />
  );
}
