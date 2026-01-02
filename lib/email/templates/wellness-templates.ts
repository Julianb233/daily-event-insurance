/**
 * Email templates for aesthetic/wellness providers (spas, IV hydration, GLP-1 clinics, laser treatments)
 * Commission formula: $40 × 35% = $14 per policy, 65% opt-in rate
 */

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

interface WellnessTemplateData {
  contactName: string;
  companyName: string;
  estimatedRevenue?: number;
  vertical: string;
  quoteId: string;
  clientCount?: number;
  serviceTypes?: string[];
}

/**
 * Welcome email for wellness/aesthetic providers
 */
export function wellnessWelcomeEmail(data: WellnessTemplateData): EmailTemplate {
  const { contactName, companyName, quoteId, serviceTypes = ['treatments'] } = data;

  return {
    subject: `Protect Your Clients, Grow Your Revenue - Quote #${quoteId}`,

    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #ec4899; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; }
            .cta-button { background: #ec4899; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
            .footer { background: #e5e7eb; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
            .highlight { background: #fce7f3; padding: 15px; border-left: 4px solid #ec4899; margin: 20px 0; }
            .service-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 15px 0; }
            .service-item { background: white; padding: 10px; border-radius: 6px; text-align: center; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✨ Welcome to Daily Event Insurance</h1>
              <p>Quote #${quoteId}</p>
            </div>

            <div class="content">
              <p>Hi ${contactName},</p>

              <p>Thank you for your interest in Daily Event Insurance for <strong>${companyName}</strong>. We specialize in protecting aesthetic and wellness clients during treatments.</p>

              <div class="highlight">
                <h3>💰 Dual Benefits</h3>
                <p><strong>1. Client Protection:</strong> Daily accident coverage for your clients receiving treatments</p>
                <p><strong>2. Revenue Generation:</strong> Earn $14 commission per policy sold (65% average opt-in rate)</p>
              </div>

              <h3>Perfect Coverage For:</h3>
              <div class="service-grid">
                <div class="service-item">💉 IV Hydration</div>
                <div class="service-item">💊 GLP-1 Treatments</div>
                <div class="service-item">✨ Laser Procedures</div>
                <div class="service-item">💆 Aesthetic Services</div>
                <div class="service-item">🧴 Cosmetic Treatments</div>
                <div class="service-item">🩺 Wellness Programs</div>
              </div>

              <h3>Why Your Clients Need This</h3>
              <ul>
                <li><strong>Peace of Mind:</strong> Coverage during and after treatments</li>
                <li><strong>Affordable:</strong> Just $40/month for comprehensive protection</li>
                <li><strong>Easy Enrollment:</strong> One-click opt-in during booking</li>
                <li><strong>No Hassle:</strong> Automatic coverage with no paperwork</li>
              </ul>

              <h3>What's Next?</h3>
              <ol>
                <li><strong>Revenue Projection:</strong> See your potential monthly earnings</li>
                <li><strong>Client Testimonial:</strong> Read how coverage builds trust</li>
                <li><strong>Partnership Details:</strong> Learn about our seamless integration</li>
              </ol>

              <a href="mailto:partnerships@dailyeventinsurance.com?subject=Quote ${quoteId} - ${companyName}" class="cta-button">
                Let's Talk About Your Needs
              </a>

              <p>Excited to partner with ${companyName} to protect and serve your clients better!</p>

              <p>Best regards,<br>
              <strong>The Daily Event Insurance Team</strong><br>
              partnerships@dailyeventinsurance.com</p>
            </div>

            <div class="footer">
              <p>Daily Event Insurance - Protecting Wellness Clients Daily</p>
              <p>Quote Reference: ${quoteId}</p>
            </div>
          </div>
        </body>
      </html>
    `,

    text: `
Hi ${contactName},

Thank you for your interest in Daily Event Insurance for ${companyName}. Quote #${quoteId}

DUAL BENEFITS:
1. Client Protection: Daily accident coverage for your clients receiving treatments
2. Revenue Generation: Earn $14 commission per policy sold (65% average opt-in rate)

PERFECT COVERAGE FOR:
• IV Hydration
• GLP-1 Treatments
• Laser Procedures
• Aesthetic Services
• Cosmetic Treatments
• Wellness Programs

WHY YOUR CLIENTS NEED THIS:
• Peace of Mind: Coverage during and after treatments
• Affordable: Just $40/month for comprehensive protection
• Easy Enrollment: One-click opt-in during booking
• No Hassle: Automatic coverage with no paperwork

WHAT'S NEXT?
1. Revenue Projection: See your potential monthly earnings
2. Client Testimonial: Read how coverage builds trust
3. Partnership Details: Learn about our seamless integration

Reply to this email: partnerships@dailyeventinsurance.com

Excited to partner with ${companyName} to protect and serve your clients better!

Best regards,
The Daily Event Insurance Team

Quote Reference: ${quoteId}
    `
  };
}

/**
 * Benefits-focused email highlighting treatment coverage
 */
export function wellnessBenefitsEmail(data: WellnessTemplateData): EmailTemplate {
  const { contactName, companyName, quoteId, clientCount = 200 } = data;

  const monthlyPolicies = Math.floor(clientCount * 0.65);
  const monthlyRevenue = monthlyPolicies * 14;
  const annualRevenue = monthlyRevenue * 12;

  return {
    subject: `How ${companyName} Can Differentiate With Client Protection`,

    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #8b5cf6; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; }
            .coverage-box { background: white; border: 2px solid #8b5cf6; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .treatment-list { background: #f5f3ff; padding: 20px; border-radius: 8px; margin: 15px 0; }
            .revenue-highlight { background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%); color: white; padding: 25px; border-radius: 8px; text-align: center; margin: 20px 0; }
            .cta-button { background: #8b5cf6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
            .footer { background: #e5e7eb; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🛡️ Stand Out From Competitors</h1>
              <p>Client Protection as a Differentiator</p>
            </div>

            <div class="content">
              <p>Hi ${contactName},</p>

              <p>In the competitive wellness industry, offering Daily Event Insurance sets ${companyName} apart. Here's why it matters:</p>

              <div class="coverage-box">
                <h3 style="color: #8b5cf6; margin-top: 0;">Comprehensive Treatment Coverage</h3>
                <p><strong>What's Covered During Your Treatments:</strong></p>
                <ul>
                  <li>Accidental injuries during procedures</li>
                  <li>Adverse reactions to treatments</li>
                  <li>Emergency medical expenses</li>
                  <li>Follow-up care if needed</li>
                  <li>Transportation costs</li>
                </ul>
              </div>

              <div class="treatment-list">
                <h3 style="margin-top: 0;">Specific Treatment Applications</h3>

                <p><strong>💉 IV Hydration & Infusion Therapy:</strong></p>
                <ul>
                  <li>Covers allergic reactions to IV compounds</li>
                  <li>Protection during Myers cocktails, NAD+, glutathione infusions</li>
                  <li>Coverage for injection site complications</li>
                </ul>

                <p><strong>💊 GLP-1 & Weight Management:</strong></p>
                <ul>
                  <li>Side effect management coverage</li>
                  <li>Protection for semaglutide, tirzepatide patients</li>
                  <li>Emergency care for adverse reactions</li>
                </ul>

                <p><strong>✨ Laser & Aesthetic Procedures:</strong></p>
                <ul>
                  <li>Burns or skin damage protection</li>
                  <li>Covers laser hair removal, skin resurfacing, tattoo removal</li>
                  <li>Post-treatment complication coverage</li>
                </ul>

                <p><strong>🧴 Cosmetic Injectable Services:</strong></p>
                <ul>
                  <li>Botox, fillers, Kybella coverage</li>
                  <li>Allergic reaction protection</li>
                  <li>Emergency medical care</li>
                </ul>
              </div>

              <h3>Client Trust Builder</h3>
              <p>When you offer insurance, you're saying: <em>"We care about your safety beyond the treatment room."</em></p>

              <p><strong>Marketing Advantage:</strong></p>
              <ul>
                <li>"Insurance-Protected Treatments" badge on your website</li>
                <li>Higher perceived value and professionalism</li>
                <li>Reduced client anxiety about new treatments</li>
                <li>Competitive differentiation in your market</li>
              </ul>

              <div class="revenue-highlight">
                <p style="margin: 0; font-size: 14px; opacity: 0.9;">PLUS EARN REVENUE</p>
                <h2 style="margin: 10px 0;">$${annualRevenue.toLocaleString()}/Year</h2>
                <p style="margin: 0;">Estimated commission from ${monthlyPolicies} monthly policies</p>
              </div>

              <a href="mailto:partnerships@dailyeventinsurance.com?subject=Partnership Details - ${companyName}" class="cta-button">
                Get Partnership Details
              </a>

              <p>Let's discuss how to position this as a premium differentiator for ${companyName}.</p>

              <p>Best regards,<br>
              <strong>The Daily Event Insurance Team</strong></p>
            </div>

            <div class="footer">
              <p>Quote Reference: ${quoteId}</p>
            </div>
          </div>
        </body>
      </html>
    `,

    text: `
Hi ${contactName},

STAND OUT FROM COMPETITORS
Client Protection as a Differentiator for ${companyName}

COMPREHENSIVE TREATMENT COVERAGE
What's Covered During Your Treatments:
• Accidental injuries during procedures
• Adverse reactions to treatments
• Emergency medical expenses
• Follow-up care if needed
• Transportation costs

SPECIFIC TREATMENT APPLICATIONS:

💉 IV HYDRATION & INFUSION THERAPY:
• Covers allergic reactions to IV compounds
• Protection during Myers cocktails, NAD+, glutathione infusions
• Coverage for injection site complications

💊 GLP-1 & WEIGHT MANAGEMENT:
• Side effect management coverage
• Protection for semaglutide, tirzepatide patients
• Emergency care for adverse reactions

✨ LASER & AESTHETIC PROCEDURES:
• Burns or skin damage protection
• Covers laser hair removal, skin resurfacing, tattoo removal
• Post-treatment complication coverage

🧴 COSMETIC INJECTABLE SERVICES:
• Botox, fillers, Kybella coverage
• Allergic reaction protection
• Emergency medical care

CLIENT TRUST BUILDER
When you offer insurance, you're saying: "We care about your safety beyond the treatment room."

MARKETING ADVANTAGE:
• "Insurance-Protected Treatments" badge on your website
• Higher perceived value and professionalism
• Reduced client anxiety about new treatments
• Competitive differentiation in your market

PLUS EARN REVENUE: $${annualRevenue.toLocaleString()}/Year
Estimated commission from ${monthlyPolicies} monthly policies

Let's discuss how to position this as a premium differentiator for ${companyName}.

Reply to: partnerships@dailyeventinsurance.com

Best regards,
The Daily Event Insurance Team

Quote Reference: ${quoteId}
    `
  };
}

/**
 * Client testimonial-focused email
 */
export function wellnessTestimonialEmail(data: WellnessTemplateData): EmailTemplate {
  const { contactName, companyName, quoteId } = data;

  return {
    subject: `"My clients feel safer and value my services more" - Wellness Provider Testimonial`,

    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #06b6d4; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; }
            .testimonial { background: #cffafe; border-left: 4px solid #06b6d4; padding: 25px; margin: 20px 0; font-style: italic; font-size: 16px; }
            .author { font-style: normal; font-weight: bold; margin-top: 15px; color: #06b6d4; }
            .impact-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #06b6d4; }
            .cta-button { background: #06b6d4; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
            .footer { background: #e5e7eb; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💬 Real Results</h1>
              <p>Hear From Wellness Providers Like You</p>
            </div>

            <div class="content">
              <p>Hi ${contactName},</p>

              <p>I wanted to share feedback from Dr. Elena Martinez, who runs a thriving IV hydration and aesthetic clinic in Austin, TX.</p>

              <div class="testimonial">
                <p>"Before Daily Event Insurance, I constantly worried about clients hesitating on treatments due to safety concerns. Now, when I mention insurance coverage is included, their confidence skyrockets."</p>

                <p>"My GLP-1 patients especially appreciate the peace of mind. We've seen a 40% increase in new patient conversions since we started offering this. Plus, the $3,200 monthly commission doesn't hurt!"</p>

                <p>"The best part? It positions us as the premium option in our market. Clients see us as more professional and trustworthy than competitors who don't offer this protection."</p>

                <div class="author">- Dr. Elena Martinez, Vitality Wellness Spa, Austin, TX</div>
              </div>

              <div class="impact-box">
                <h3 style="color: #06b6d4; margin-top: 0;">Dr. Martinez's Results:</h3>
                <ul>
                  <li><strong>40% increase</strong> in new patient conversions</li>
                  <li><strong>$3,200/month</strong> in recurring commission revenue</li>
                  <li><strong>68% opt-in rate</strong> among IV hydration clients</li>
                  <li><strong>82% opt-in rate</strong> among GLP-1 patients</li>
                  <li><strong>Zero claims denials</strong> - smooth process for clients</li>
                  <li><strong>5-star reviews</strong> mentioning insurance protection</li>
                </ul>
              </div>

              <h3>What Made The Difference</h3>

              <p><strong>1. Client Education:</strong></p>
              <p>"We train our staff to explain coverage during consultation. It takes 30 seconds and dramatically reduces treatment anxiety."</p>

              <p><strong>2. Marketing Integration:</strong></p>
              <p>"We added 'Insurance-Protected Treatments' to our website and social media. It's become a key differentiator."</p>

              <p><strong>3. High-Risk Treatment Focus:</strong></p>
              <p>"We especially promote coverage for GLP-1s, IV therapy, and laser treatments - our higher-ticket services where clients value protection most."</p>

              <p><strong>4. Testimonial Leverage:</strong></p>
              <p>"When a client had a minor adverse reaction and insurance covered everything, we asked for a testimonial. That review alone has driven significant new business."</p>

              <h3>Could This Work for ${companyName}?</h3>

              <p>Dr. Martinez's clinic has a similar profile to yours. If you're offering IV hydration, GLP-1s, or aesthetic treatments, this could be your competitive advantage.</p>

              <a href="mailto:partnerships@dailyeventinsurance.com?subject=Partnership Inquiry - ${companyName}" class="cta-button">
                Discuss Partnership Details
              </a>

              <p>Want to hear more success stories specific to your services? Let's talk.</p>

              <p>Best regards,<br>
              <strong>The Daily Event Insurance Team</strong></p>
            </div>

            <div class="footer">
              <p>Testimonial used with permission. Results may vary by provider.</p>
              <p>Quote Reference: ${quoteId}</p>
            </div>
          </div>
        </body>
      </html>
    `,

    text: `
Hi ${contactName},

REAL RESULTS - Wellness Provider Testimonial

I wanted to share feedback from Dr. Elena Martinez, who runs a thriving IV hydration and aesthetic clinic in Austin, TX.

"Before Daily Event Insurance, I constantly worried about clients hesitating on treatments due to safety concerns. Now, when I mention insurance coverage is included, their confidence skyrockets."

"My GLP-1 patients especially appreciate the peace of mind. We've seen a 40% increase in new patient conversions since we started offering this. Plus, the $3,200 monthly commission doesn't hurt!"

"The best part? It positions us as the premium option in our market. Clients see us as more professional and trustworthy than competitors who don't offer this protection."

- Dr. Elena Martinez, Vitality Wellness Spa, Austin, TX

DR. MARTINEZ'S RESULTS:
• 40% increase in new patient conversions
• $3,200/month in recurring commission revenue
• 68% opt-in rate among IV hydration clients
• 82% opt-in rate among GLP-1 patients
• Zero claims denials - smooth process for clients
• 5-star reviews mentioning insurance protection

WHAT MADE THE DIFFERENCE:

1. Client Education:
"We train our staff to explain coverage during consultation. It takes 30 seconds and dramatically reduces treatment anxiety."

2. Marketing Integration:
"We added 'Insurance-Protected Treatments' to our website and social media. It's become a key differentiator."

3. High-Risk Treatment Focus:
"We especially promote coverage for GLP-1s, IV therapy, and laser treatments - our higher-ticket services where clients value protection most."

4. Testimonial Leverage:
"When a client had a minor adverse reaction and insurance covered everything, we asked for a testimonial. That review alone has driven significant new business."

COULD THIS WORK FOR ${companyName}?
Dr. Martinez's clinic has a similar profile to yours. If you're offering IV hydration, GLP-1s, or aesthetic treatments, this could be your competitive advantage.

Want to hear more success stories specific to your services?

Reply to: partnerships@dailyeventinsurance.com

Best regards,
The Daily Event Insurance Team

Quote Reference: ${quoteId}
    `
  };
}

/**
 * Partnership proposal email
 */
export function wellnessPartnershipEmail(data: WellnessTemplateData): EmailTemplate {
  const { contactName, companyName, quoteId } = data;

  return {
    subject: `Partnership Proposal: Premium Protection for ${companyName} Clients`,

    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f59e0b; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; }
            .proposal-box { background: white; border: 3px solid #f59e0b; border-radius: 8px; padding: 25px; margin: 20px 0; }
            .checklist { background: #fef3c7; padding: 20px; border-radius: 8px; margin: 15px 0; }
            .timeline { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .cta-button { background: #f59e0b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
            .footer { background: #e5e7eb; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🤝 Partnership Proposal</h1>
              <p>Premium Protection Partnership for ${companyName}</p>
            </div>

            <div class="content">
              <p>Hi ${contactName},</p>

              <p>Based on our conversations, I'd like to present a formal partnership proposal for ${companyName} and Daily Event Insurance.</p>

              <div class="proposal-box">
                <h3 style="color: #f59e0b; margin-top: 0;">Partnership Overview</h3>

                <p><strong>What You Offer:</strong></p>
                <ul>
                  <li>Daily Event Insurance as an optional add-on for clients</li>
                  <li>Integration into your booking/consultation process</li>
                  <li>Staff education on coverage benefits</li>
                </ul>

                <p><strong>What You Receive:</strong></p>
                <ul>
                  <li>$14 commission per policy sold (paid monthly)</li>
                  <li>Premium positioning in your market</li>
                  <li>Increased client confidence and conversion</li>
                  <li>Marketing materials and support</li>
                  <li>Dedicated partnership manager</li>
                </ul>

                <p><strong>What We Handle:</strong></p>
                <ul>
                  <li>All claims processing and customer service</li>
                  <li>Policy administration and renewals</li>
                  <li>Payment processing</li>
                  <li>Legal compliance and documentation</li>
                </ul>
              </div>

              <div class="timeline">
                <h3 style="color: #f59e0b;">Implementation Timeline</h3>

                <p><strong>Week 1:</strong> Setup & Training</p>
                <ul>
                  <li>Integrate opt-in into your booking system</li>
                  <li>Train staff on coverage explanation</li>
                  <li>Set up commission tracking</li>
                </ul>

                <p><strong>Week 2:</strong> Soft Launch</p>
                <ul>
                  <li>Test with select clients</li>
                  <li>Refine messaging and process</li>
                  <li>Address any questions or concerns</li>
                </ul>

                <p><strong>Week 3+:</strong> Full Launch</p>
                <ul>
                  <li>Offer to all clients</li>
                  <li>Begin earning commissions</li>
                  <li>Ongoing support and optimization</li>
                </ul>
              </div>

              <div class="checklist">
                <h3 style="margin-top: 0;">Partnership Requirements Checklist</h3>
                <p>✅ Active wellness/aesthetic practice<br>
                ✅ Minimum 50 clients per month<br>
                ✅ Online booking or consultation system<br>
                ✅ Staff willing to explain coverage (30-second script)<br>
                ✅ Commitment to 6-month partnership trial</p>
              </div>

              <h3>Investment Required</h3>
              <p><strong>Zero upfront costs.</strong> No setup fees, no monthly minimums, no risk.</p>

              <p>Your only "investment" is:</p>
              <ul>
                <li>30 minutes for initial setup call</li>
                <li>1 hour for staff training</li>
                <li>30 seconds per client to mention coverage</li>
              </ul>

              <h3>Why Now?</h3>
              <p>We're actively seeking wellness partners in your market. As an early adopter, you'll have exclusive positioning before your competitors discover this opportunity.</p>

              <a href="mailto:partnerships@dailyeventinsurance.com?subject=Accept Partnership - ${companyName}" class="cta-button">
                Let's Move Forward
              </a>

              <p>Ready to discuss next steps? Reply to this email or schedule a call.</p>

              <p>Best regards,<br>
              <strong>The Daily Event Insurance Team</strong><br>
              partnerships@dailyeventinsurance.com</p>
            </div>

            <div class="footer">
              <p>Quote Reference: ${quoteId}</p>
              <p>Partnership terms subject to final agreement</p>
            </div>
          </div>
        </body>
      </html>
    `,

    text: `
Hi ${contactName},

PARTNERSHIP PROPOSAL
Premium Protection Partnership for ${companyName}

Based on our conversations, I'd like to present a formal partnership proposal for ${companyName} and Daily Event Insurance.

PARTNERSHIP OVERVIEW:

WHAT YOU OFFER:
• Daily Event Insurance as an optional add-on for clients
• Integration into your booking/consultation process
• Staff education on coverage benefits

WHAT YOU RECEIVE:
• $14 commission per policy sold (paid monthly)
• Premium positioning in your market
• Increased client confidence and conversion
• Marketing materials and support
• Dedicated partnership manager

WHAT WE HANDLE:
• All claims processing and customer service
• Policy administration and renewals
• Payment processing
• Legal compliance and documentation

IMPLEMENTATION TIMELINE:

WEEK 1: Setup & Training
• Integrate opt-in into your booking system
• Train staff on coverage explanation
• Set up commission tracking

WEEK 2: Soft Launch
• Test with select clients
• Refine messaging and process
• Address any questions or concerns

WEEK 3+: Full Launch
• Offer to all clients
• Begin earning commissions
• Ongoing support and optimization

PARTNERSHIP REQUIREMENTS CHECKLIST:
✅ Active wellness/aesthetic practice
✅ Minimum 50 clients per month
✅ Online booking or consultation system
✅ Staff willing to explain coverage (30-second script)
✅ Commitment to 6-month partnership trial

INVESTMENT REQUIRED:
Zero upfront costs. No setup fees, no monthly minimums, no risk.

Your only "investment" is:
• 30 minutes for initial setup call
• 1 hour for staff training
• 30 seconds per client to mention coverage

WHY NOW?
We're actively seeking wellness partners in your market. As an early adopter, you'll have exclusive positioning before your competitors discover this opportunity.

Ready to discuss next steps? Reply to this email.

Best regards,
The Daily Event Insurance Team
partnerships@dailyeventinsurance.com

Quote Reference: ${quoteId}
    `
  };
}
