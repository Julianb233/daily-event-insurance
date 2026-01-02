'use client';

import { useState } from 'react';
import { ArrowRight, Mountain, Users, Calendar, Mail, Phone, Building2, CheckCircle2, Snowflake } from 'lucide-react';

interface SkiResortQuoteFormProps {
  className?: string;
}

export default function SkiResortQuoteForm({ className = '' }: SkiResortQuoteFormProps) {
  const [formData, setFormData] = useState({
    resortName: '',
    contactName: '',
    email: '',
    phone: '',
    resortType: '',
    dailyVisitors: '',
    seasonLength: '',
    liftCount: '',
    currentCoverage: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          vertical: 'ski-resort',
          source: 'ski-resort-quote-form'
        })
      });

      if (response.ok) {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            resortName: '',
            contactName: '',
            email: '',
            phone: '',
            resortType: '',
            dailyVisitors: '',
            seasonLength: '',
            liftCount: '',
            currentCoverage: '',
            message: ''
          });
        }, 3000);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Calculate estimated season revenue
  const dailyVisitors = parseInt(formData.dailyVisitors) || 0;
  const seasonDays = parseInt(formData.seasonLength) || 120;
  const optInRate = 0.65;
  const commissionPerPolicy = 14;
  const estimatedSeason = Math.round(dailyVisitors * seasonDays * optInRate * commissionPerPolicy);
  const estimatedMonthly = Math.round(estimatedSeason / 4); // ~4 months active season

  return (
    <div className={`bg-white rounded-2xl shadow-2xl p-8 lg:p-10 ${className}`}>
      {isSubmitted ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Thank You!
          </h3>
          <p className="text-gray-600">
            We&apos;ll contact you within 24 hours with your custom quote.
          </p>
        </div>
      ) : (
        <>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-sky-100 mb-4">
              <Snowflake className="h-6 w-6 text-sky-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Get Your Resort Quote
            </h3>
            <p className="text-gray-600">
              Day pass coverage tailored for ski and mountain resorts
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Resort Name */}
            <div>
              <label htmlFor="resortName" className="block text-sm font-medium text-gray-700 mb-2">
                Resort Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mountain className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="resortName"
                  name="resortName"
                  required
                  value={formData.resortName}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                  placeholder="Mountain Resort Name"
                />
              </div>
            </div>

            {/* Contact Name */}
            <div>
              <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-2">
                Contact Name *
              </label>
              <input
                type="text"
                id="contactName"
                name="contactName"
                required
                value={formData.contactName}
                onChange={handleChange}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                placeholder="Your Name"
              />
            </div>

            {/* Email & Phone Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                    placeholder="you@resort.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>

            {/* Resort Type */}
            <div>
              <label htmlFor="resortType" className="block text-sm font-medium text-gray-700 mb-2">
                Resort Type *
              </label>
              <select
                id="resortType"
                name="resortType"
                required
                value={formData.resortType}
                onChange={handleChange}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors bg-white"
              >
                <option value="">Select resort type</option>
                <option value="destination">Destination Ski Resort</option>
                <option value="regional">Regional Ski Area</option>
                <option value="local">Local / Community Hill</option>
                <option value="four-season">Four-Season Mountain Resort</option>
                <option value="cross-country">Cross-Country / Nordic Center</option>
                <option value="terrain-park">Terrain Park / Snow Park</option>
                <option value="tubing">Snow Tubing Hill</option>
                <option value="multi-resort">Multi-Resort Pass Network</option>
              </select>
            </div>

            {/* Volume Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="dailyVisitors" className="block text-sm font-medium text-gray-700 mb-2">
                  Average Daily Visitors *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="dailyVisitors"
                    name="dailyVisitors"
                    required
                    value={formData.dailyVisitors}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                    placeholder="2,500"
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="seasonLength" className="block text-sm font-medium text-gray-700 mb-2">
                  Season Length (Days)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="seasonLength"
                    name="seasonLength"
                    value={formData.seasonLength}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                    placeholder="120"
                    min="30"
                    max="365"
                  />
                </div>
              </div>
            </div>

            {/* Lift Count */}
            <div>
              <label htmlFor="liftCount" className="block text-sm font-medium text-gray-700 mb-2">
                Number of Lifts / Terrain
              </label>
              <select
                id="liftCount"
                name="liftCount"
                value={formData.liftCount}
                onChange={handleChange}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors bg-white"
              >
                <option value="">Select lift count</option>
                <option value="1-3">1-3 Lifts (Small)</option>
                <option value="4-8">4-8 Lifts (Medium)</option>
                <option value="9-15">9-15 Lifts (Large)</option>
                <option value="16+">16+ Lifts (Major Resort)</option>
              </select>
            </div>

            {/* Revenue Preview */}
            {dailyVisitors > 0 && (
              <div className="bg-sky-50 rounded-lg p-4 border border-sky-100">
                <p className="text-sm text-sky-800 font-medium mb-1">Estimated Season Revenue</p>
                <p className="text-2xl font-bold text-sky-600">
                  ${estimatedSeason.toLocaleString()}/season
                </p>
                <p className="text-xs text-sky-600 mt-1">
                  ~${estimatedMonthly.toLocaleString()}/month based on {seasonDays} operating days
                </p>
              </div>
            )}

            {/* Current Coverage */}
            <div>
              <label htmlFor="currentCoverage" className="block text-sm font-medium text-gray-700 mb-2">
                Current Day Pass Coverage
              </label>
              <select
                id="currentCoverage"
                name="currentCoverage"
                value={formData.currentCoverage}
                onChange={handleChange}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors bg-white"
              >
                <option value="">Select current situation</option>
                <option value="no-coverage">No day pass coverage</option>
                <option value="waivers-only">Liability waivers only</option>
                <option value="bundled">Coverage bundled with tickets</option>
                <option value="has-coverage">Have coverage, comparing options</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Information
              </label>
              <textarea
                id="message"
                name="message"
                rows={3}
                value={formData.message}
                onChange={handleChange}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors resize-none"
                placeholder="Terrain types, summer operations, special considerations..."
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-sky-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl group"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                <span className="inline-flex items-center">
                  Get My Resort Quote
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center">
              By submitting, you agree to receive communications about our resort coverage solutions.
            </p>
          </form>
        </>
      )}
    </div>
  );
}
