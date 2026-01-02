'use client';

import { useState } from 'react';
import { ArrowRight, Heart, Users, Calendar, Mail, Phone, Building2, CheckCircle2, Sparkles } from 'lucide-react';

interface WellnessQuoteFormProps {
  className?: string;
}

export default function WellnessQuoteForm({ className = '' }: WellnessQuoteFormProps) {
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    serviceType: '',
    monthlyClients: '',
    treatmentsPerMonth: '',
    locations: '1',
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
          vertical: 'wellness',
          source: 'wellness-quote-form'
        })
      });

      if (response.ok) {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            businessName: '',
            contactName: '',
            email: '',
            phone: '',
            serviceType: '',
            monthlyClients: '',
            treatmentsPerMonth: '',
            locations: '1',
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

  // Calculate estimated monthly revenue
  const treatments = parseInt(formData.treatmentsPerMonth) || 0;
  const locations = parseInt(formData.locations) || 1;
  const optInRate = 0.65;
  const commissionPerPolicy = 14;
  const estimatedMonthly = Math.round(treatments * locations * optInRate * commissionPerPolicy);

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
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 mb-4">
              <Sparkles className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Get Your Custom Quote
            </h3>
            <p className="text-gray-600">
              Tailored coverage for wellness and aesthetic providers
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Business Name */}
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                Business Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  required
                  value={formData.businessName}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  placeholder="Your Business Name"
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
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
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
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    placeholder="you@spa.com"
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
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>

            {/* Service Type */}
            <div>
              <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-2">
                Primary Service Type *
              </label>
              <select
                id="serviceType"
                name="serviceType"
                required
                value={formData.serviceType}
                onChange={handleChange}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white"
              >
                <option value="">Select service type</option>
                <option value="iv-therapy">IV Hydration Therapy</option>
                <option value="glp1">GLP-1 / Weight Loss Injections</option>
                <option value="aesthetics">Medical Aesthetics (Botox, Fillers)</option>
                <option value="laser">Laser Treatments</option>
                <option value="cryotherapy">Cryotherapy</option>
                <option value="float-tank">Float Tank / Sensory Deprivation</option>
                <option value="massage">Massage Therapy</option>
                <option value="acupuncture">Acupuncture</option>
                <option value="med-spa">Full Service Med Spa</option>
                <option value="other">Other Wellness Service</option>
              </select>
            </div>

            {/* Volume Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="monthlyClients" className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Clients
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="monthlyClients"
                    name="monthlyClients"
                    value={formData.monthlyClients}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    placeholder="200"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="treatmentsPerMonth" className="block text-sm font-medium text-gray-700 mb-2">
                  Treatments / Month *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Heart className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="treatmentsPerMonth"
                    name="treatmentsPerMonth"
                    required
                    value={formData.treatmentsPerMonth}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    placeholder="150"
                    min="1"
                  />
                </div>
              </div>
            </div>

            {/* Locations */}
            <div>
              <label htmlFor="locations" className="block text-sm font-medium text-gray-700 mb-2">
                Number of Locations
              </label>
              <select
                id="locations"
                name="locations"
                value={formData.locations}
                onChange={handleChange}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white"
              >
                <option value="1">1 Location</option>
                <option value="3">2-5 Locations</option>
                <option value="8">6-10 Locations</option>
                <option value="18">11-25 Locations</option>
                <option value="30">25+ Locations</option>
              </select>
            </div>

            {/* Revenue Preview */}
            {treatments > 0 && (
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                <p className="text-sm text-purple-800 font-medium mb-1">Estimated Monthly Revenue</p>
                <p className="text-2xl font-bold text-purple-600">
                  ${estimatedMonthly.toLocaleString()}/month
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  Based on {Math.round(treatments * locations * optInRate)} covered treatments at $14 commission each
                </p>
              </div>
            )}

            {/* Current Coverage */}
            <div>
              <label htmlFor="currentCoverage" className="block text-sm font-medium text-gray-700 mb-2">
                Current Coverage Situation
              </label>
              <select
                id="currentCoverage"
                name="currentCoverage"
                value={formData.currentCoverage}
                onChange={handleChange}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white"
              >
                <option value="">Select current situation</option>
                <option value="no-coverage">No per-treatment coverage</option>
                <option value="waivers-only">Using liability waivers only</option>
                <option value="has-coverage">Have coverage, looking to switch</option>
                <option value="new-business">New business, setting up coverage</option>
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
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none"
                placeholder="Specific treatments offered, compliance requirements, etc..."
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl group"
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
                  Get My Custom Quote
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center">
              By submitting, you agree to receive communications about our wellness coverage solutions.
            </p>
          </form>
        </>
      )}
    </div>
  );
}
