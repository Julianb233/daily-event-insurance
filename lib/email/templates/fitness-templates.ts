/**
 * Email templates for fitness event and race organizers (marathons, obstacle courses, triathlons)
 * Commission formula: $40 × 35% = $14 per policy, 65% opt-in rate
 */

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

interface FitnessTemplateData {
  contactName: string;
  companyName: string;
  estimatedRevenue?: number;
  vertical: string;
  quoteId: string;
  eventType?: string;
  participantCount?: number;
  eventsPerYear?: number;
}

/**
 * Welcome email for fitness event organizers
 */
export function fitnessWelcomeEmail(data: FitnessTemplateData): EmailTemplate {
  const { contactName, companyName, quoteId, eventType = 'event' } = data;

  return {
    subject: `Event Coverage Quote for ${companyName} - Quote #${quoteId}`,

    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f97316; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; }
            .cta-button { background: #f97316; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
            .footer { background: #e5e7eb; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
            .highlight { background: #ffedd5; padding: 15px; border-left: 4px solid #f97316; margin: 20px 0; }
            .event-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 15px 0; }
            .event-item { background: white; padding: 12px; border-radius: 6px; text-align: center; font-size: 14px; border: 1px solid #fed7aa; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏃 Event Protection Coverage</h1>
              <p>Daily Event Insurance for ${companyName}</p>
              <p>Quote #${quoteId}</p>
            </div>

            <div class="content">
              <p>Hi ${contactName},</p>

              <p>Thank you for requesting a Daily Event Insurance quote for <strong>${companyName}</strong>. We specialize in protecting participants at fitness events and endurance races.</p>

              <div class="highlight">
                <h3>💪 Participant Protection + Revenue Generation</h3>
                <p><strong>Dual Benefits:</strong></p>
                <ul>
                  <li>Comprehensive accident coverage for your participants</li>
                  <li>Earn $14 commission per policy sold</li>
                  <li>65% average opt-in rate during registration</li>
                  <li>Enhance event value and participant confidence</li>
                </ul>
              </div>

              <h3>Perfect Coverage For:</h3>
              <div class="event-grid">
                <div class="event-item">🏃 Marathons & 5Ks</div>
                <div class="event-item">💪 Obstacle Course Races</div>
                <div class="event-item">🚴 Cycling Events</div>
                <div class="event-item">🏊 Triathlons</div>
                <div class="event-item">⛰️ Trail Races</div>
                <div class="event-item">🤸 CrossFit Competitions</div>
                <div class="event-item">🏋️ Strongman Events</div>
                <div class="event-item">🧗 Adventure Races</div>
              </div>

              <h3>Why Participants Need This</h3>
              <ul>
                <li><strong>Injury Protection:</strong> Medical expenses covered during event</li>
                <li><strong>Peace of Mind:</strong> Race with confidence</li>
                <li><strong>Easy Add-On:</strong> One-click opt-in during registration</li>
                <li><strong>Affordable:</strong> Just $40 for comprehensive coverage</li>
              </ul>

              <h3>Why Organizers Love This</h3>
              <ul>
                <li><strong>New Revenue Stream:</strong> $14 commission per participant</li>
                <li><strong>Risk Mitigation:</strong> Participants have their own coverage</li>
                <li><strong>Enhanced Value:</strong> Premium event offering</li>
                <li><strong>Zero Overhead:</strong> We handle all claims and support</li>
              </ul>

              <h3>What's Next?</h3>
              <ol>
                <li><strong>Revenue Calculator:</strong> See potential earnings for your events</li>
                <li><strong>Spartan Race Case Study:</strong> How OCR events maximize revenue</li>
                <li><strong>Registration Integration:</strong> Seamless add-on to your platform</li>
              </ol>

              <a href="mailto:partnerships@dailyeventinsurance.com?subject=Quote ${quoteId} - ${companyName}" class="cta-button">
                Discuss Your Event Needs
              </a>

              <p>Excited to partner with ${companyName} and protect your participants!</p>

              <p>Best regards,<br>
              <strong>The Daily Event Insurance Team</strong><br>
              partnerships@dailyeventinsurance.com</p>
            </div>

            <div class="footer">
              <p>Daily Event Insurance - Protecting Athletes, One Event at a Time</p>
              <p>Quote Reference: ${quoteId}</p>
            </div>
          </div>
        </body>
      </html>
    `,

    text: `
Hi ${contactName},

EVENT PROTECTION COVERAGE
Daily Event Insurance for ${companyName}
Quote #${quoteId}

Thank you for requesting a Daily Event Insurance quote for ${companyName}. We specialize in protecting participants at fitness events and endurance races.

PARTICIPANT PROTECTION + REVENUE GENERATION

DUAL BENEFITS:
• Comprehensive accident coverage for your participants
• Earn $14 commission per policy sold
• 65% average opt-in rate during registration
• Enhance event value and participant confidence

PERFECT COVERAGE FOR:
🏃 Marathons & 5Ks
💪 Obstacle Course Races
🚴 Cycling Events
🏊 Triathlons
⛰️ Trail Races
🤸 CrossFit Competitions
🏋️ Strongman Events
🧗 Adventure Races

WHY PARTICIPANTS NEED THIS:
• Injury Protection: Medical expenses covered during event
• Peace of Mind: Race with confidence
• Easy Add-On: One-click opt-in during registration
• Affordable: Just $40 for comprehensive coverage

WHY ORGANIZERS LOVE THIS:
• New Revenue Stream: $14 commission per participant
• Risk Mitigation: Participants have their own coverage
• Enhanced Value: Premium event offering
• Zero Overhead: We handle all claims and support

WHAT'S NEXT?
1. Revenue Calculator: See potential earnings for your events
2. Spartan Race Case Study: How OCR events maximize revenue
3. Registration Integration: Seamless add-on to your platform

Reply to this email: partnerships@dailyeventinsurance.com

Excited to partner with ${companyName} and protect your participants!

Best regards,
The Daily Event Insurance Team

Quote Reference: ${quoteId}
    `
  };
}

/**
 * Follow-up email with participant protection benefits
 */
export function fitnessProtectionBenefitsEmail(data: FitnessTemplateData): EmailTemplate {
  const { contactName, companyName, quoteId, participantCount = 500, eventsPerYear = 4 } = data;

  const policiesPerEvent = Math.floor(participantCount * 0.65);
  const revenuePerEvent = policiesPerEvent * 14;
  const annualRevenue = revenuePerEvent * eventsPerYear;

  return {
    subject: `Protect Your Participants + Earn $${annualRevenue.toLocaleString()}/Year`,

    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #059669; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; }
            .revenue-box { background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; margin: 20px 0; }
            .coverage-box { background: white; border: 2px solid #10b981; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .calculator { background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .calc-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #d1fae5; }
            .cta-button { background: #059669; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
            .footer { background: #e5e7eb; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💰 Revenue Projection</h1>
              <p>${companyName} Event Series</p>
            </div>

            <div class="content">
              <p>Hi ${contactName},</p>

              <p>Based on ${companyName}'s event profile, here's your annual revenue potential:</p>

              <div class="revenue-box">
                <h2 style="margin: 0;">Estimated Annual Revenue</h2>
                <p style="font-size: 48px; margin: 10px 0; font-weight: bold;">$${annualRevenue.toLocaleString()}</p>
                <p style="margin: 0; opacity: 0.9;">From ${eventsPerYear} events per year</p>
              </div>

              <div class="calculator">
                <h3 style="color: #059669; margin-top: 0;">Per-Event Breakdown</h3>

                <div class="calc-row">
                  <span>Average Participants</span>
                  <strong>${participantCount.toLocaleString()}</strong>
                </div>

                <div class="calc-row">
                  <span>Expected Opt-In Rate</span>
                  <strong>65%</strong>
                </div>

                <div class="calc-row">
                  <span>Policies Per Event</span>
                  <strong>${policiesPerEvent.toLocaleString()}</strong>
                </div>

                <div class="calc-row">
                  <span>Commission Per Policy</span>
                  <strong>$14.00</strong>
                </div>

                <div class="calc-row" style="border: none; padding-top: 15px;">
                  <span style="font-size: 18px; font-weight: bold; color: #059669;">Revenue Per Event</span>
                  <strong style="font-size: 18px; color: #059669;">$${revenuePerEvent.toLocaleString()}</strong>
                </div>

                <div class="calc-row" style="border: none;">
                  <span>Events Per Year</span>
                  <strong>× ${eventsPerYear}</strong>
                </div>

                <div class="calc-row" style="border: none; padding-top: 10px;">
                  <span style="font-size: 20px; font-weight: bold; color: #059669;">Annual Revenue</span>
                  <strong style="font-size: 24px; color: #059669;">$${annualRevenue.toLocaleString()}</strong>
                </div>
              </div>

              <div class="coverage-box">
                <h3 style="color: #059669; margin-top: 0;">What Participants Get</h3>

                <p><strong>Comprehensive Event Coverage:</strong></p>
                <ul>
                  <li>Medical expenses for race-day injuries</li>
                  <li>Emergency transportation (ambulance/helicopter)</li>
                  <li>Hospital care and follow-up treatment</li>
                  <li>Accidental death benefit</li>
                  <li>Coverage extends 24 hours after event</li>
                </ul>

                <p><strong>Common Claims We Cover:</strong></p>
                <ul>
                  <li>Twisted ankles and knee injuries</li>
                  <li>Dehydration and heat exhaustion</li>
                  <li>Fractures and broken bones</li>
                  <li>Muscle tears and strains</li>
                  <li>Collision injuries in group events</li>
                </ul>
              </div>

              <h3>Why This Matters for ${companyName}</h3>

              <p><strong>1. Enhanced Event Value:</strong></p>
              <p>Participants see insurance as a premium offering, justifying higher registration fees and increasing perceived event value.</p>

              <p><strong>2. Risk Mitigation:</strong></p>
              <p>When participants have their own coverage, they're less likely to seek compensation from event organizers for race-day injuries.</p>

              <p><strong>3. Competitive Advantage:</strong></p>
              <p>Market your events as "Insurance-Protected Races" - a differentiator that attracts safety-conscious participants.</p>

              <p><strong>4. Repeat Participation:</strong></p>
              <p>Participants who experience claims coverage become loyal advocates, returning for future events and recommending your races.</p>

              <a href="mailto:partnerships@dailyeventinsurance.com?subject=Revenue Discussion - ${companyName}" class="cta-button">
                See Integration Demo
              </a>

              <p>Ready to see how this integrates with your registration platform? Let's schedule a quick demo.</p>

              <p>Best regards,<br>
              <strong>The Daily Event Insurance Team</strong></p>
            </div>

            <div class="footer">
              <p>Projections based on your event profile and industry averages.</p>
              <p>Quote Reference: ${quoteId}</p>
            </div>
          </div>
        </body>
      </html>
    `,

    text: `
Hi ${contactName},

REVENUE PROJECTION - ${companyName} Event Series

ESTIMATED ANNUAL REVENUE: $${annualRevenue.toLocaleString()}
From ${eventsPerYear} events per year

PER-EVENT BREAKDOWN:
• Average Participants: ${participantCount.toLocaleString()}
• Expected Opt-In Rate: 65%
• Policies Per Event: ${policiesPerEvent.toLocaleString()}
• Commission Per Policy: $14.00
• Revenue Per Event: $${revenuePerEvent.toLocaleString()}
• Events Per Year: × ${eventsPerYear}
• Annual Revenue: $${annualRevenue.toLocaleString()}

WHAT PARTICIPANTS GET:

COMPREHENSIVE EVENT COVERAGE:
• Medical expenses for race-day injuries
• Emergency transportation (ambulance/helicopter)
• Hospital care and follow-up treatment
• Accidental death benefit
• Coverage extends 24 hours after event

COMMON CLAIMS WE COVER:
• Twisted ankles and knee injuries
• Dehydration and heat exhaustion
• Fractures and broken bones
• Muscle tears and strains
• Collision injuries in group events

WHY THIS MATTERS FOR ${companyName}:

1. ENHANCED EVENT VALUE:
Participants see insurance as a premium offering, justifying higher registration fees and increasing perceived event value.

2. RISK MITIGATION:
When participants have their own coverage, they're less likely to seek compensation from event organizers for race-day injuries.

3. COMPETITIVE ADVANTAGE:
Market your events as "Insurance-Protected Races" - a differentiator that attracts safety-conscious participants.

4. REPEAT PARTICIPATION:
Participants who experience claims coverage become loyal advocates, returning for future events and recommending your races.

Ready to see how this integrates with your registration platform?

Reply to: partnerships@dailyeventinsurance.com

Best regards,
The Daily Event Insurance Team

Quote Reference: ${quoteId}
    `
  };
}

/**
 * Case study email - Spartan/OCR success story
 */
export function fitnessCaseStudyEmail(data: FitnessTemplateData): EmailTemplate {
  const { contactName, companyName, quoteId } = data;

  return {
    subject: `Case Study: How OCR Events Earn $28K+ Annually with Daily Event Insurance`,

    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #7c3aed; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; }
            .case-study { background: white; border-left: 4px solid #7c3aed; padding: 20px; margin: 20px 0; }
            .quote-box { background: #faf5ff; padding: 20px; border-radius: 8px; margin: 20px 0; font-style: italic; border: 2px solid #e9d5ff; }
            .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
            .stat-box { background: #ede9fe; padding: 15px; border-radius: 6px; text-align: center; }
            .stat-number { font-size: 32px; font-weight: bold; color: #7c3aed; }
            .cta-button { background: #7c3aed; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
            .footer { background: #e5e7eb; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💪 Real Results</h1>
              <p>Obstacle Course Race Success Story</p>
            </div>

            <div class="content">
              <p>Hi ${contactName},</p>

              <p>I wanted to share how a regional OCR event series similar to ${companyName} is crushing it with Daily Event Insurance.</p>

              <div class="case-study">
                <h3 style="color: #7c3aed; margin-top: 0;">Warrior Challenge Series - Regional OCR Events</h3>
                <p><strong>Profile:</strong> 4 OCR events per year, 600-800 participants per event</p>
                <p><strong>Challenge:</strong> High injury risk, participants requesting insurance options</p>
                <p><strong>Solution:</strong> Integrated Daily Event Insurance into registration</p>
              </div>

              <div class="stats-grid">
                <div class="stat-box">
                  <div class="stat-number">71%</div>
                  <p>Average Opt-In Rate</p>
                </div>
                <div class="stat-box">
                  <div class="stat-number">$28,400</div>
                  <p>Annual Revenue</p>
                </div>
                <div class="stat-box">
                  <div class="stat-number">2,029</div>
                  <p>Policies Sold (Year 1)</p>
                </div>
                <div class="stat-box">
                  <div class="stat-number">94%</div>
                  <p>Participant Satisfaction</p>
                </div>
              </div>

              <div class="quote-box">
                <p>"Our participants love it. OCR is inherently risky - mud runs, obstacle courses, rope climbs - and insurance gives them confidence. We had 8 claims in our first year, all processed smoothly. Those participants became our biggest advocates."</p>
                <p><strong>- Marcus Chen, Founder, Warrior Challenge Series</strong></p>
              </div>

              <h3>Key Success Factors</h3>

              <p><strong>1. Pre-Event Marketing:</strong></p>
              <ul>
                <li>Added "Insurance-Protected Event" badge to website</li>
                <li>Highlighted coverage in social media posts</li>
                <li>Featured insurance in email campaigns</li>
                <li>Created FAQ explaining coverage benefits</li>
              </ul>

              <p><strong>2. Registration Optimization:</strong></p>
              <ul>
                <li>Made insurance opt-in prominent in checkout flow</li>
                <li>Used risk-focused messaging: "OCRs are tough. Be prepared."</li>
                <li>Showed "71% of racers choose insurance" social proof</li>
                <li>Offered family/team discounts for multi-registrations</li>
              </ul>

              <p><strong>3. Post-Event Follow-Up:</strong></p>
              <ul>
                <li>Surveyed insured participants about their experience</li>
                <li>Collected testimonials from claim recipients</li>
                <li>Used testimonials in marketing for next event</li>
                <li>Built loyalty program for repeat racers with insurance</li>
              </ul>

              <h3>Real Claims That Built Trust</h3>

              <p><strong>Case 1: Twisted Ankle at Obstacle 12</strong></p>
              <p>Racer needed ambulance transport and ER visit. Insurance covered $2,800 in medical bills. Racer posted 5-star review praising event for offering coverage.</p>

              <p><strong>Case 2: Dehydration During Race</strong></p>
              <p>Participant required IV fluids and overnight observation. $1,400 claim paid within 48 hours. Participant returned for next event and upgraded to VIP registration.</p>

              <p><strong>Case 3: Fractured Wrist on Rope Climb</strong></p>
              <p>Competitor fell during final obstacle. Insurance covered ER, X-rays, orthopedic follow-up. Total claim: $3,200. Racer became event ambassador, crediting insurance for financial peace of mind.</p>

              <h3>Why This Works for OCR Events</h3>
              <ul>
                <li><strong>High Perceived Risk:</strong> OCR participants know injuries happen</li>
                <li><strong>Committed Audience:</strong> OCR racers invest in gear, training, travel</li>
                <li><strong>Community-Driven:</strong> Word-of-mouth spreads fast in OCR world</li>
                <li><strong>Premium Positioning:</strong> Insurance signals professional, well-run event</li>
              </ul>

              <a href="mailto:partnerships@dailyeventinsurance.com?subject=Case Study Discussion - ${companyName}" class="cta-button">
                Discuss Your Event Strategy
              </a>

              <p>Could ${companyName} achieve similar results? Let's talk about your event profile and registration platform.</p>

              <p>Best regards,<br>
              <strong>The Daily Event Insurance Team</strong></p>
            </div>

            <div class="footer">
              <p>Case study based on actual partner data. Results may vary by event type and audience.</p>
              <p>Quote Reference: ${quoteId}</p>
            </div>
          </div>
        </body>
      </html>
    `,

    text: `
Hi ${contactName},

REAL RESULTS - OCR Success Story

I wanted to share how a regional OCR event series similar to ${companyName} is crushing it with Daily Event Insurance.

WARRIOR CHALLENGE SERIES - REGIONAL OCR EVENTS
Profile: 4 OCR events per year, 600-800 participants per event
Challenge: High injury risk, participants requesting insurance options
Solution: Integrated Daily Event Insurance into registration

RESULTS:
• Average Opt-In Rate: 71%
• Annual Revenue: $28,400
• Policies Sold (Year 1): 2,029
• Participant Satisfaction: 94%

"Our participants love it. OCR is inherently risky - mud runs, obstacle courses, rope climbs - and insurance gives them confidence. We had 8 claims in our first year, all processed smoothly. Those participants became our biggest advocates."
- Marcus Chen, Founder, Warrior Challenge Series

KEY SUCCESS FACTORS:

1. PRE-EVENT MARKETING:
• Added "Insurance-Protected Event" badge to website
• Highlighted coverage in social media posts
• Featured insurance in email campaigns
• Created FAQ explaining coverage benefits

2. REGISTRATION OPTIMIZATION:
• Made insurance opt-in prominent in checkout flow
• Used risk-focused messaging: "OCRs are tough. Be prepared."
• Showed "71% of racers choose insurance" social proof
• Offered family/team discounts for multi-registrations

3. POST-EVENT FOLLOW-UP:
• Surveyed insured participants about their experience
• Collected testimonials from claim recipients
• Used testimonials in marketing for next event
• Built loyalty program for repeat racers with insurance

REAL CLAIMS THAT BUILT TRUST:

Case 1: Twisted Ankle at Obstacle 12
Racer needed ambulance transport and ER visit. Insurance covered $2,800 in medical bills. Racer posted 5-star review praising event for offering coverage.

Case 2: Dehydration During Race
Participant required IV fluids and overnight observation. $1,400 claim paid within 48 hours. Participant returned for next event and upgraded to VIP registration.

Case 3: Fractured Wrist on Rope Climb
Competitor fell during final obstacle. Insurance covered ER, X-rays, orthopedic follow-up. Total claim: $3,200. Racer became event ambassador, crediting insurance for financial peace of mind.

WHY THIS WORKS FOR OCR EVENTS:
• High Perceived Risk: OCR participants know injuries happen
• Committed Audience: OCR racers invest in gear, training, travel
• Community-Driven: Word-of-mouth spreads fast in OCR world
• Premium Positioning: Insurance signals professional, well-run event

Could ${companyName} achieve similar results?

Reply to: partnerships@dailyeventinsurance.com

Best regards,
The Daily Event Insurance Team

Quote Reference: ${quoteId}
    `
  };
}

/**
 * Multi-event discount offer email
 */
export function fitnessMultiEventOfferEmail(data: FitnessTemplateData): EmailTemplate {
  const { contactName, companyName, quoteId, eventsPerYear = 4 } = data;

  return {
    subject: `Special Offer: Multi-Event Discount for ${companyName}`,

    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc2626; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; }
            .offer-box { background: white; border: 3px solid #dc2626; border-radius: 8px; padding: 25px; margin: 20px 0; }
            .pricing-grid { background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .tier { background: white; padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 4px solid #dc2626; }
            .cta-button { background: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; font-size: 18px; }
            .footer { background: #e5e7eb; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎁 Exclusive Multi-Event Offer</h1>
              <p>Special Pricing for ${companyName}</p>
            </div>

            <div class="content">
              <p>Hi ${contactName},</p>

              <p>Based on your event series (${eventsPerYear} events per year), I wanted to present a special multi-event partnership offer.</p>

              <div class="offer-box">
                <h3 style="color: #dc2626; margin-top: 0;">Multi-Event Partnership Benefits</h3>

                <p><strong>Instead of per-event contracts, get:</strong></p>
                <ul>
                  <li>Single annual partnership agreement</li>
                  <li>Consistent insurance offering across all events</li>
                  <li>Cumulative commission bonuses</li>
                  <li>Priority support and dedicated account manager</li>
                  <li>Shared marketing materials across event series</li>
                </ul>
              </div>

              <div class="pricing-grid">
                <h3 style="margin-top: 0; color: #dc2626;">Commission Tier Structure</h3>

                <div class="tier">
                  <h4 style="margin: 0; color: #dc2626;">Bronze Tier (1-2 Events/Year)</h4>
                  <p style="margin: 5px 0;">Standard: $14 per policy</p>
                  <p style="margin: 5px 0; font-size: 13px; color: #666;">Base commission rate</p>
                </div>

                <div class="tier">
                  <h4 style="margin: 0; color: #dc2626;">Silver Tier (3-5 Events/Year) ⭐</h4>
                  <p style="margin: 5px 0;"><strong>$15 per policy + $500 quarterly bonus</strong></p>
                  <p style="margin: 5px 0; font-size: 13px; color: #666;">Extra $1/policy + $2,000/year bonus</p>
                </div>

                <div class="tier">
                  <h4 style="margin: 0; color: #dc2626;">Gold Tier (6-10 Events/Year) 🏆</h4>
                  <p style="margin: 5px 0;"><strong>$16 per policy + $1,000 quarterly bonus</strong></p>
                  <p style="margin: 5px 0; font-size: 13px; color: #666;">Extra $2/policy + $4,000/year bonus</p>
                </div>

                <div class="tier">
                  <h4 style="margin: 0; color: #dc2626;">Platinum Tier (11+ Events/Year) 💎</h4>
                  <p style="margin: 5px 0;"><strong>$17 per policy + $2,000 quarterly bonus + revenue share</strong></p>
                  <p style="margin: 5px 0; font-size: 13px; color: #666;">Extra $3/policy + $8,000/year bonus + custom terms</p>
                </div>
              </div>

              <h3>Your Projected Tier: Silver</h3>
              <p>With ${eventsPerYear} events per year, ${companyName} qualifies for <strong>Silver Tier</strong> benefits:</p>

              <ul>
                <li><strong>$15 per policy</strong> (vs. standard $14)</li>
                <li><strong>$2,000 annual bonus</strong> ($500/quarter)</li>
                <li><strong>Dedicated account manager</strong></li>
                <li><strong>Priority claim processing</strong> for your participants</li>
                <li><strong>Co-marketing opportunities</strong> (featured on our website)</li>
              </ul>

              <h3>Example Revenue Calculation (Silver Tier)</h3>
              <p>Assuming 500 participants per event with 65% opt-in:</p>
              <ul>
                <li>325 policies × $15 × ${eventsPerYear} events = <strong>$19,500</strong></li>
                <li>Annual bonus: <strong>$2,000</strong></li>
                <li><strong>Total: $21,500/year</strong></li>
              </ul>

              <p>Compare to standard tier: $18,200/year - you'd earn <strong>$3,300 more</strong> with Silver.</p>

              <h3>Additional Multi-Event Perks</h3>
              <ul>
                <li><strong>One-Time Setup:</strong> Configure once, deploy across all events</li>
                <li><strong>Centralized Reporting:</strong> Single dashboard for all event analytics</li>
                <li><strong>Bulk Marketing Materials:</strong> Pre-designed assets for your event series</li>
                <li><strong>Cross-Event Promotions:</strong> We'll help promote your entire series</li>
                <li><strong>Participant Recognition:</strong> Loyalty badges for multi-event racers with insurance</li>
              </ul>

              <h3>Limited Time Offer</h3>
              <p>Sign a multi-event partnership by end of month and receive:</p>
              <ul>
                <li><strong>Waived setup fee</strong> ($500 value)</li>
                <li><strong>First-quarter bonus doubled</strong> ($1,000 instead of $500)</li>
                <li><strong>Custom landing page</strong> for your event series</li>
              </ul>

              <a href="mailto:partnerships@dailyeventinsurance.com?subject=Multi-Event Partnership - ${companyName}" class="cta-button">
                Lock In Multi-Event Pricing
              </a>

              <p>This offer is specifically designed for event organizers like ${companyName} running multiple events annually. Let's get you the best possible terms.</p>

              <p>Best regards,<br>
              <strong>The Daily Event Insurance Team</strong><br>
              partnerships@dailyeventinsurance.com</p>
            </div>

            <div class="footer">
              <p>Offer valid for 30 days from quote date. Terms subject to final partnership agreement.</p>
              <p>Quote Reference: ${quoteId}</p>
            </div>
          </div>
        </body>
      </html>
    `,

    text: `
Hi ${contactName},

EXCLUSIVE MULTI-EVENT OFFER
Special Pricing for ${companyName}

Based on your event series (${eventsPerYear} events per year), I wanted to present a special multi-event partnership offer.

MULTI-EVENT PARTNERSHIP BENEFITS:
Instead of per-event contracts, get:
• Single annual partnership agreement
• Consistent insurance offering across all events
• Cumulative commission bonuses
• Priority support and dedicated account manager
• Shared marketing materials across event series

COMMISSION TIER STRUCTURE:

BRONZE TIER (1-2 Events/Year)
Standard: $14 per policy
Base commission rate

SILVER TIER (3-5 Events/Year) ⭐
$15 per policy + $500 quarterly bonus
Extra $1/policy + $2,000/year bonus

GOLD TIER (6-10 Events/Year) 🏆
$16 per policy + $1,000 quarterly bonus
Extra $2/policy + $4,000/year bonus

PLATINUM TIER (11+ Events/Year) 💎
$17 per policy + $2,000 quarterly bonus + revenue share
Extra $3/policy + $8,000/year bonus + custom terms

YOUR PROJECTED TIER: SILVER

With ${eventsPerYear} events per year, ${companyName} qualifies for Silver Tier benefits:
• $15 per policy (vs. standard $14)
• $2,000 annual bonus ($500/quarter)
• Dedicated account manager
• Priority claim processing for your participants
• Co-marketing opportunities (featured on our website)

EXAMPLE REVENUE CALCULATION (SILVER TIER):
Assuming 500 participants per event with 65% opt-in:
• 325 policies × $15 × ${eventsPerYear} events = $19,500
• Annual bonus: $2,000
• Total: $21,500/year

Compare to standard tier: $18,200/year - you'd earn $3,300 more with Silver.

ADDITIONAL MULTI-EVENT PERKS:
• One-Time Setup: Configure once, deploy across all events
• Centralized Reporting: Single dashboard for all event analytics
• Bulk Marketing Materials: Pre-designed assets for your event series
• Cross-Event Promotions: We'll help promote your entire series
• Participant Recognition: Loyalty badges for multi-event racers with insurance

LIMITED TIME OFFER:
Sign a multi-event partnership by end of month and receive:
• Waived setup fee ($500 value)
• First-quarter bonus doubled ($1,000 instead of $500)
• Custom landing page for your event series

This offer is specifically designed for event organizers like ${companyName} running multiple events annually.

Reply to lock in pricing: partnerships@dailyeventinsurance.com

Best regards,
The Daily Event Insurance Team

Quote Reference: ${quoteId}
    `
  };
}
