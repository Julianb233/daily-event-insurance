'use client';

import { useState } from 'react';
import { ArrowRight, Trophy, Users, Calendar, Mail, Phone, Building2, CheckCircle2, Timer, MapPin } from 'lucide-react';

interface FitnessQuoteFormProps {
  className?: string;
}

export default function FitnessQuoteForm({ className = '' }: FitnessQuoteFormProps) {
  const [formData, setFormData] = useState({
    organizationName: '',
    contactName: '',
    email: '',
    phone: '',
    eventType: '',
    eventName: '',
    expectedParticipants: '',
    eventsPerYear: '',
    eventDate: '',
    eventLocation: '',
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
          vertical: 'fitness',
          source: 'fitness-quote-form'
        })
      });

      if (response.ok) {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            organizationName: '',
            contactName: '',
            email: '',
            phone: '',
            eventType: '',
            eventName: '',
            expectedParticipants: '',
            eventsPerYear: '',
            eventDate: '',
            eventLocation: '',
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

  // Calculate estimated revenue
  const participants = parseInt(formData.expectedParticipants) || 0;
  const eventsPerYear = parseInt(formData.eventsPerYear) || 1;
  const optInRate = 0.65;
  const commissionPerPolicy = 14;
  const estimatedPerEvent = Math.round(participants * optInRate * commissionPerPolicy);
  const estimatedAnnual = estimatedPerEvent * eventsPerYear;

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
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 mb-4">
              <Trophy className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Get Your Event Quote
            </h3>
            <p className="text-gray-600">
              Same-day coverage for fitness competitions and sporting events
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Organization Name */}
            <div>
              <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-2">
                Organization / Event Company *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="organizationName"
                  name="organizationName"
                  required
                  value={formData.organizationName}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="Your Organization"
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
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
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
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="you@events.com"
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
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>

            {/* Event Type */}
            <div>
              <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-2">
                Event Type *
              </label>
              <select
                id="eventType"
                name="eventType"
                required
                value={formData.eventType}
                onChange={handleChange}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-white"
              >
                <option value="">Select event type</option>
                <option value="obstacle-race">Obstacle Course Race</option>
                <option value="marathon">Marathon / Running Event</option>
                <option value="triathlon">Triathlon / Multi-Sport</option>
                <option value="crossfit">CrossFit Competition</option>
                <option value="powerlifting">Powerlifting / Strongman</option>
                <option value="cycling">Cycling Event</option>
                <option value="swimming">Swimming Competition</option>
                <option value="martial-arts">Martial Arts Tournament</option>
                <option value="team-sport">Team Sport Tournament</option>
                <option value="adventure">Adventure Race</option>
                <option value="fitness-expo">Fitness Expo / Convention</option>
                <option value="other">Other Fitness Event</option>
              </select>
            </div>

            {/* Event Name */}
            <div>
              <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-2">
                Event Name (if known)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Trophy className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="eventName"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="e.g., Summer Sprint Challenge 2026"
                />
              </div>
            </div>

            {/* Participants & Events Per Year */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="expectedParticipants" className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Participants *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="expectedParticipants"
                    name="expectedParticipants"
                    required
                    value={formData.expectedParticipants}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="500"
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="eventsPerYear" className="block text-sm font-medium text-gray-700 mb-2">
                  Events Per Year
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Timer className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="eventsPerYear"
                    name="eventsPerYear"
                    value={formData.eventsPerYear}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="4"
                    min="1"
                  />
                </div>
              </div>
            </div>

            {/* Event Date & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Next Event Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="eventDate"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="eventLocation" className="block text-sm font-medium text-gray-700 mb-2">
                  Event Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="eventLocation"
                    name="eventLocation"
                    value={formData.eventLocation}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="City, State"
                  />
                </div>
              </div>
            </div>

            {/* Revenue Preview */}
            {participants > 0 && (
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                <p className="text-sm text-orange-800 font-medium mb-1">Estimated Revenue</p>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-2xl font-bold text-orange-600">
                      ${estimatedPerEvent.toLocaleString()}/event
                    </p>
                    <p className="text-xs text-orange-600 mt-1">
                      {Math.round(participants * optInRate)} covered at $14 each
                    </p>
                  </div>
                  {eventsPerYear > 1 && (
                    <div className="text-right">
                      <p className="text-lg font-semibold text-orange-600">
                        ${estimatedAnnual.toLocaleString()}/year
                      </p>
                      <p className="text-xs text-orange-600">
                        {eventsPerYear} events
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Current Coverage */}
            <div>
              <label htmlFor="currentCoverage" className="block text-sm font-medium text-gray-700 mb-2">
                Current Coverage Approach
              </label>
              <select
                id="currentCoverage"
                name="currentCoverage"
                value={formData.currentCoverage}
                onChange={handleChange}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-white"
              >
                <option value="">Select current approach</option>
                <option value="no-coverage">No participant coverage</option>
                <option value="waivers-only">Liability waivers only</option>
                <option value="included">Coverage included in registration</option>
                <option value="optional">Optional coverage at checkout</option>
                <option value="has-coverage">Have coverage, exploring options</option>
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
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                placeholder="Event details, venue requirements, special considerations..."
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl group"
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
                  Get My Event Quote
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center">
              By submitting, you agree to receive communications about our event coverage solutions.
            </p>
          </form>
        </>
      )}
    </div>
  );
}
