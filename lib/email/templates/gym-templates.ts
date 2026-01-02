/**
 * Email templates for gym/fitness facility owners
 * Commission formula: $40 × 35% = $14 per policy, 65% opt-in rate
 */

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

interface GymTemplateData {
  contactName: string;
  companyName: string;
  estimatedRevenue?: number;
  vertical: string;
  quoteId: string;
  memberCount?: number;
  monthlyRevenue?: number;
}

/**
 * Welcome email - sent immediately after quote request
 */
export function gymWelcomeEmail(data: GymTemplateData): EmailTemplate {
  const { contactName, companyName, quoteId } = data;

  return {
    subject: `Daily Event Insurance Quote for ${companyName} - Quote #${quoteId}`,

    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; }
            .cta-button { background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
            .footer { background: #e5e7eb; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
            .highlight { background: #dbeafe; padding: 15px; border-left: 4px solid #2563eb; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You for Your Interest!</h1>
              <p>Quote #${quoteId}</p>
            </div>

            <div class="content">
              <p>Hi ${contactName},</p>

              <p>Thank you for requesting a Daily Event Insurance quote for <strong>${companyName}</strong>. We're excited to help you unlock a new revenue stream while protecting your members.</p>

              <div class="highlight">
                <h3>💰 New Revenue Opportunity</h3>
                <p>Our gym partners typically earn <strong>$14 in commission per policy sold</strong>, with an average opt-in rate of 65%.</p>
                <p>This means you could generate significant monthly recurring revenue while providing valuable protection to your members.</p>
              </div>

              <h3>What's Next?</h3>
              <ol>
                <li><strong>Revenue Calculator:</strong> We'll send you personalized projections based on your membership size</li>
                <li><strong>Case Study:</strong> See how Summit Fitness earned $54,000 annually with Daily Event Insurance</li>
                <li><strong>Demo Call:</strong> Schedule a quick call to see the platform in action</li>
              </ol>

              <a href="mailto:partnerships@dailyeventinsurance.com?subject=Quote ${quoteId} - ${companyName}" class="cta-button">
                Reply to This Email
              </a>

              <p>Looking forward to partnering with ${companyName}!</p>

              <p>Best regards,<br>
              <strong>The Daily Event Insurance Team</strong><br>
              partnerships@dailyeventinsurance.com</p>
            </div>

            <div class="footer">
              <p>Daily Event Insurance - Protecting Athletes, One Day at a Time</p>
              <p>Quote Reference: ${quoteId}</p>
            </div>
          </div>
        </body>
      </html>
    `,

    text: `
Hi ${contactName},

Thank you for requesting a Daily Event Insurance quote for ${companyName}. Quote #${quoteId}

NEW REVENUE OPPORTUNITY
Our gym partners typically earn $14 in commission per policy sold, with an average opt-in rate of 65%. This means you could generate significant monthly recurring revenue while providing valuable protection to your members.

WHAT'S NEXT?
1. Revenue Calculator: We'll send you personalized projections based on your membership size
2. Case Study: See how Summit Fitness earned $54,000 annually with Daily Event Insurance
3. Demo Call: Schedule a quick call to see the platform in action

Reply to this email or contact us at partnerships@dailyeventinsurance.com

Looking forward to partnering with ${companyName}!

Best regards,
The Daily Event Insurance Team
partnerships@dailyeventinsurance.com

Quote Reference: ${quoteId}
    `
  };
}

/**
 * Follow-up email with revenue calculator results
 */
export function gymRevenueCalculatorEmail(data: GymTemplateData): EmailTemplate {
  const { contactName, companyName, estimatedRevenue = 0, memberCount = 500, quoteId } = data;

  const monthlyPolicies = Math.floor(memberCount * 0.65); // 65% opt-in rate
  const monthlyRevenue = monthlyPolicies * 14; // $14 commission per policy
  const annualRevenue = monthlyRevenue * 12;

  return {
    subject: `💰 ${companyName} Could Earn $${annualRevenue.toLocaleString()}/Year - Revenue Calculator`,

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
            .calculator { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #10b981; }
            .calc-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
            .calc-total { font-size: 24px; font-weight: bold; color: #059669; padding: 20px 0; border-top: 3px solid #059669; }
            .cta-button { background: #059669; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
            .footer { background: #e5e7eb; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💰 Revenue Calculator Results</h1>
              <p>${companyName} - Quote #${quoteId}</p>
            </div>

            <div class="content">
              <p>Hi ${contactName},</p>

              <p>Based on your gym's profile, here's your personalized revenue projection:</p>

              <div class="revenue-box">
                <h2 style="margin: 0;">Estimated Annual Revenue</h2>
                <p style="font-size: 48px; margin: 10px 0; font-weight: bold;">$${annualRevenue.toLocaleString()}</p>
                <p style="margin: 0; opacity: 0.9;">New recurring revenue stream for ${companyName}</p>
              </div>

              <div class="calculator">
                <h3 style="color: #059669; margin-top: 0;">Revenue Breakdown</h3>

                <div class="calc-row">
                  <span>Active Members</span>
                  <strong>${memberCount.toLocaleString()}</strong>
                </div>

                <div class="calc-row">
                  <span>Expected Opt-In Rate</span>
                  <strong>65%</strong>
                </div>

                <div class="calc-row">
                  <span>Policies Per Month</span>
                  <strong>${monthlyPolicies.toLocaleString()}</strong>
                </div>

                <div class="calc-row">
                  <span>Commission Per Policy</span>
                  <strong>$14.00</strong>
                </div>

                <div class="calc-total">
                  <div class="calc-row" style="border: none;">
                    <span>Monthly Revenue</span>
                    <span>$${monthlyRevenue.toLocaleString()}</span>
                  </div>
                  <div class="calc-row" style="border: none;">
                    <span>Annual Revenue</span>
                    <span>$${annualRevenue.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <h3>Why This Works</h3>
              <ul>
                <li><strong>Zero Setup Costs:</strong> No upfront investment required</li>
                <li><strong>Automatic Processing:</strong> Members opt-in during registration/renewal</li>
                <li><strong>Monthly Recurring:</strong> Commissions paid monthly like clockwork</li>
                <li><strong>Member Value:</strong> Daily accident coverage for just $40/month</li>
              </ul>

              <a href="mailto:partnerships@dailyeventinsurance.com?subject=Schedule Demo - ${companyName}" class="cta-button">
                Schedule Your Demo Call
              </a>

              <p>Ready to see this in action? Let's schedule a 15-minute call to show you exactly how this works.</p>

              <p>Best regards,<br>
              <strong>The Daily Event Insurance Team</strong></p>
            </div>

            <div class="footer">
              <p>These projections are based on industry averages and your gym profile.</p>
              <p>Quote Reference: ${quoteId}</p>
            </div>
          </div>
        </body>
      </html>
    `,

    text: `
Hi ${contactName},

REVENUE CALCULATOR RESULTS - ${companyName} (Quote #${quoteId})

ESTIMATED ANNUAL REVENUE: $${annualRevenue.toLocaleString()}

REVENUE BREAKDOWN:
• Active Members: ${memberCount.toLocaleString()}
• Expected Opt-In Rate: 65%
• Policies Per Month: ${monthlyPolicies.toLocaleString()}
• Commission Per Policy: $14.00
• Monthly Revenue: $${monthlyRevenue.toLocaleString()}
• Annual Revenue: $${annualRevenue.toLocaleString()}

WHY THIS WORKS:
• Zero Setup Costs: No upfront investment required
• Automatic Processing: Members opt-in during registration/renewal
• Monthly Recurring: Commissions paid monthly like clockwork
• Member Value: Daily accident coverage for just $40/month

Ready to see this in action? Let's schedule a 15-minute call.

Reply to this email or contact: partnerships@dailyeventinsurance.com

Best regards,
The Daily Event Insurance Team

Quote Reference: ${quoteId}
    `
  };
}

/**
 * Case study email - Summit Fitness success story
 */
export function gymCaseStudyEmail(data: GymTemplateData): EmailTemplate {
  const { contactName, companyName, quoteId } = data;

  return {
    subject: `Case Study: How Summit Fitness Earned $54K/Year with Daily Event Insurance`,

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
            .quote-box { background: #faf5ff; padding: 20px; border-radius: 8px; margin: 20px 0; font-style: italic; }
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
              <h1>📊 Success Story</h1>
              <p>How Summit Fitness Generated $54,000 in Year One</p>
            </div>

            <div class="content">
              <p>Hi ${contactName},</p>

              <p>I wanted to share a real success story from one of our gym partners that mirrors ${companyName}'s profile.</p>

              <div class="case-study">
                <h3 style="color: #7c3aed; margin-top: 0;">Summit Fitness - Denver, CO</h3>
                <p><strong>Profile:</strong> 320 active members, CrossFit-style training facility</p>
                <p><strong>Challenge:</strong> Looking for additional revenue without raising membership fees</p>
                <p><strong>Solution:</strong> Implemented Daily Event Insurance as optional member benefit</p>
              </div>

              <div class="stats-grid">
                <div class="stat-box">
                  <div class="stat-number">72%</div>
                  <p>Member Opt-In Rate</p>
                </div>
                <div class="stat-box">
                  <div class="stat-number">$54K</div>
                  <p>First Year Revenue</p>
                </div>
                <div class="stat-box">
                  <div class="stat-number">230</div>
                  <p>Active Policies</p>
                </div>
                <div class="stat-box">
                  <div class="stat-number">$4,500</div>
                  <p>Monthly Commission</p>
                </div>
              </div>

              <div class="quote-box">
                <p>"We were skeptical at first, but the numbers speak for themselves. Our members love the peace of mind, and we love the recurring revenue. It's been a complete win-win."</p>
                <p><strong>- Sarah Mitchell, Owner, Summit Fitness</strong></p>
              </div>

              <h3>Key Takeaways</h3>
              <ul>
                <li><strong>Higher Than Expected Opt-In:</strong> 72% vs. industry average of 65%</li>
                <li><strong>Member Satisfaction:</strong> 94% renewal rate on insurance policies</li>
                <li><strong>Zero Overhead:</strong> Automated system requires no staff time</li>
                <li><strong>Member Claims:</strong> 12 claims paid out in year one, strengthening member loyalty</li>
              </ul>

              <h3>What Made It Work</h3>
              <ol>
                <li><strong>Clear Communication:</strong> Explained benefits during onboarding</li>
                <li><strong>Easy Enrollment:</strong> One-click opt-in during registration</li>
                <li><strong>Visible Value:</strong> Promoted member testimonials from claim recipients</li>
                <li><strong>Staff Buy-In:</strong> Trainers understood and advocated for the coverage</li>
              </ol>

              <p>The best part? Summit Fitness implemented this in under 2 weeks.</p>

              <a href="mailto:partnerships@dailyeventinsurance.com?subject=Demo Request - ${companyName}" class="cta-button">
                See How This Works for ${companyName}
              </a>

              <p>Want to discuss how we can replicate this success at ${companyName}? Let's talk.</p>

              <p>Best regards,<br>
              <strong>The Daily Event Insurance Team</strong></p>
            </div>

            <div class="footer">
              <p>Results based on actual partner data. Individual results may vary.</p>
              <p>Quote Reference: ${quoteId}</p>
            </div>
          </div>
        </body>
      </html>
    `,

    text: `
Hi ${contactName},

CASE STUDY: How Summit Fitness Earned $54,000 in Year One

I wanted to share a real success story from one of our gym partners that mirrors ${companyName}'s profile.

SUMMIT FITNESS - DENVER, CO
Profile: 320 active members, CrossFit-style training facility
Challenge: Looking for additional revenue without raising membership fees
Solution: Implemented Daily Event Insurance as optional member benefit

RESULTS:
• Member Opt-In Rate: 72%
• First Year Revenue: $54,000
• Active Policies: 230
• Monthly Commission: $4,500

"We were skeptical at first, but the numbers speak for themselves. Our members love the peace of mind, and we love the recurring revenue. It's been a complete win-win."
- Sarah Mitchell, Owner, Summit Fitness

KEY TAKEAWAYS:
• Higher Than Expected Opt-In: 72% vs. industry average of 65%
• Member Satisfaction: 94% renewal rate on insurance policies
• Zero Overhead: Automated system requires no staff time
• Member Claims: 12 claims paid out in year one, strengthening member loyalty

WHAT MADE IT WORK:
1. Clear Communication: Explained benefits during onboarding
2. Easy Enrollment: One-click opt-in during registration
3. Visible Value: Promoted member testimonials from claim recipients
4. Staff Buy-In: Trainers understood and advocated for the coverage

The best part? Summit Fitness implemented this in under 2 weeks.

Want to discuss how we can replicate this success at ${companyName}?

Reply to schedule a demo: partnerships@dailyeventinsurance.com

Best regards,
The Daily Event Insurance Team

Quote Reference: ${quoteId}
    `
  };
}

/**
 * Final outreach email with demo offer
 */
export function gymFinalOutreachEmail(data: GymTemplateData): EmailTemplate {
  const { contactName, companyName, quoteId } = data;

  return {
    subject: `Last Call: Demo Offer for ${companyName} - Quote #${quoteId}`,

    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc2626; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; }
            .urgency-box { background: #fee2e2; border-left: 4px solid #dc2626; padding: 20px; margin: 20px 0; }
            .benefits-list { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .cta-button { background: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; font-size: 18px; }
            .footer { background: #e5e7eb; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⏰ Final Call</h1>
              <p>Don't Miss This Opportunity</p>
            </div>

            <div class="content">
              <p>Hi ${contactName},</p>

              <p>I wanted to reach out one last time about the Daily Event Insurance opportunity for ${companyName}.</p>

              <div class="urgency-box">
                <h3 style="margin-top: 0; color: #dc2626;">Time-Sensitive Offer</h3>
                <p>We're offering <strong>waived setup fees</strong> for gyms that schedule a demo this month. This saves you $500 and gets you earning commissions faster.</p>
              </div>

              <h3>Quick Recap: What You're Missing</h3>

              <div class="benefits-list">
                <ul style="margin: 0; padding-left: 20px;">
                  <li><strong>New Revenue Stream:</strong> $14 commission per policy, 65% avg opt-in rate</li>
                  <li><strong>Zero Risk:</strong> No upfront costs, no ongoing overhead</li>
                  <li><strong>Member Value:</strong> Daily accident coverage they actually want</li>
                  <li><strong>Proven Results:</strong> Gyms like yours earning $40K-60K annually</li>
                  <li><strong>Fast Implementation:</strong> Live in under 2 weeks</li>
                </ul>
              </div>

              <h3>Why Schedule a Demo?</h3>
              <ul>
                <li>See the exact enrollment flow your members would experience</li>
                <li>Get personalized revenue projections for ${companyName}</li>
                <li>Ask questions about integration and implementation</li>
                <li>No pressure - just information to help you decide</li>
              </ul>

              <p><strong>It's just 15 minutes.</strong> I'll show you:</p>
              <ol>
                <li>How the opt-in process works</li>
                <li>Your estimated monthly/annual revenue</li>
                <li>Real case studies from similar gyms</li>
                <li>Answers to any questions you have</li>
              </ol>

              <a href="mailto:partnerships@dailyeventinsurance.com?subject=Demo Request - ${companyName} - ${quoteId}" class="cta-button">
                Schedule My Free Demo
              </a>

              <p>If this isn't a fit, no worries - I'll stop following up. But I'd hate for you to miss out on this revenue opportunity because we didn't connect.</p>

              <p>Looking forward to hearing from you!</p>

              <p>Best regards,<br>
              <strong>The Daily Event Insurance Team</strong><br>
              partnerships@dailyeventinsurance.com</p>
            </div>

            <div class="footer">
              <p>This is our final outreach. Reply to keep the conversation going.</p>
              <p>Quote Reference: ${quoteId}</p>
            </div>
          </div>
        </body>
      </html>
    `,

    text: `
Hi ${contactName},

FINAL CALL - Demo Offer for ${companyName}

I wanted to reach out one last time about the Daily Event Insurance opportunity for ${companyName}.

⏰ TIME-SENSITIVE OFFER
We're offering waived setup fees for gyms that schedule a demo this month. This saves you $500 and gets you earning commissions faster.

QUICK RECAP: WHAT YOU'RE MISSING
• New Revenue Stream: $14 commission per policy, 65% avg opt-in rate
• Zero Risk: No upfront costs, no ongoing overhead
• Member Value: Daily accident coverage they actually want
• Proven Results: Gyms like yours earning $40K-60K annually
• Fast Implementation: Live in under 2 weeks

WHY SCHEDULE A DEMO?
• See the exact enrollment flow your members would experience
• Get personalized revenue projections for ${companyName}
• Ask questions about integration and implementation
• No pressure - just information to help you decide

IT'S JUST 15 MINUTES. I'll show you:
1. How the opt-in process works
2. Your estimated monthly/annual revenue
3. Real case studies from similar gyms
4. Answers to any questions you have

Reply to schedule: partnerships@dailyeventinsurance.com

If this isn't a fit, no worries - I'll stop following up. But I'd hate for you to miss out on this revenue opportunity because we didn't connect.

Looking forward to hearing from you!

Best regards,
The Daily Event Insurance Team
partnerships@dailyeventinsurance.com

Quote Reference: ${quoteId}
    `
  };
}
