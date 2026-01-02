/**
 * Email templates for ski resort and winter sports venue operators
 * Commission formula: $40 × 35% = $14 per policy, 65% opt-in rate
 */

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

interface SkiResortTemplateData {
  contactName: string;
  companyName: string;
  estimatedRevenue?: number;
  vertical: string;
  quoteId: string;
  seasonPassHolders?: number;
  dailyVisitors?: number;
  seasonLength?: number;
}

/**
 * Welcome email for ski resort operators
 */
export function skiResortWelcomeEmail(data: SkiResortTemplateData): EmailTemplate {
  const { contactName, companyName, quoteId } = data;

  return {
    subject: `Season Coverage Quote for ${companyName} - Quote #${quoteId}`,

    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #0ea5e9; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; }
            .cta-button { background: #0ea5e9; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
            .footer { background: #e5e7eb; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
            .highlight { background: #e0f2fe; padding: 15px; border-left: 4px solid #0ea5e9; margin: 20px 0; }
            .coverage-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 15px 0; }
            .coverage-item { background: white; padding: 15px; border-radius: 6px; text-align: center; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⛷️ Season Coverage Solution</h1>
              <p>Daily Event Insurance for ${companyName}</p>
              <p>Quote #${quoteId}</p>
            </div>

            <div class="content">
              <p>Hi ${contactName},</p>

              <p>Thank you for requesting a Daily Event Insurance quote for <strong>${companyName}</strong>. We specialize in providing comprehensive daily coverage for ski resorts and winter sports venues.</p>

              <div class="highlight">
                <h3>🎿 Season-Long Protection</h3>
                <p><strong>Daily Coverage for Every Visit:</strong></p>
                <ul>
                  <li>Season pass holders covered on every visit</li>
                  <li>Day ticket purchasers can opt-in at checkout</li>
                  <li>Comprehensive accident and injury protection</li>
                  <li>Volume-based commission structure</li>
                </ul>
              </div>

              <h3>Perfect Coverage For:</h3>
              <div class="coverage-grid">
                <div class="coverage-item">⛷️ Alpine Skiing</div>
                <div class="coverage-item">🏂 Snowboarding</div>
                <div class="coverage-item">🎿 Cross-Country Skiing</div>
                <div class="coverage-item">🛷 Tubing & Sledding</div>
                <div class="coverage-item">🏔️ Terrain Parks</div>
                <div class="coverage-item">🚡 Lift Operations</div>
              </div>

              <h3>Revenue Opportunity</h3>
              <p>Our ski resort partners earn <strong>$14 commission per policy</strong> with an average opt-in rate of 65% among season pass holders and 45% among day visitors.</p>

              <p><strong>Example (Mid-Size Resort):</strong></p>
              <ul>
                <li>2,000 season pass holders × 65% opt-in = 1,300 policies</li>
                <li>Average daily visitors (100) × 45% × 120 days = 5,400 policies</li>
                <li>Total season revenue: <strong>$93,800</strong></li>
              </ul>

              <h3>What's Next?</h3>
              <ol>
                <li><strong>Volume Calculator:</strong> Custom projections based on your visitor numbers</li>
                <li><strong>Risk Mitigation:</strong> How coverage protects your resort</li>
                <li><strong>Partnership Details:</strong> Integration with your ticketing system</li>
              </ol>

              <a href="mailto:partnerships@dailyeventinsurance.com?subject=Quote ${quoteId} - ${companyName}" class="cta-button">
                Discuss Your Resort's Needs
              </a>

              <p>Looking forward to partnering with ${companyName} for a successful season!</p>

              <p>Best regards,<br>
              <strong>The Daily Event Insurance Team</strong><br>
              partnerships@dailyeventinsurance.com</p>
            </div>

            <div class="footer">
              <p>Daily Event Insurance - Protecting Winter Sports Enthusiasts</p>
              <p>Quote Reference: ${quoteId}</p>
            </div>
          </div>
        </body>
      </html>
    `,

    text: `
Hi ${contactName},

SEASON COVERAGE SOLUTION
Daily Event Insurance for ${companyName}
Quote #${quoteId}

Thank you for requesting a Daily Event Insurance quote for ${companyName}. We specialize in providing comprehensive daily coverage for ski resorts and winter sports venues.

SEASON-LONG PROTECTION:
• Season pass holders covered on every visit
• Day ticket purchasers can opt-in at checkout
• Comprehensive accident and injury protection
• Volume-based commission structure

PERFECT COVERAGE FOR:
⛷️ Alpine Skiing
🏂 Snowboarding
🎿 Cross-Country Skiing
🛷 Tubing & Sledding
🏔️ Terrain Parks
🚡 Lift Operations

REVENUE OPPORTUNITY:
Our ski resort partners earn $14 commission per policy with an average opt-in rate of 65% among season pass holders and 45% among day visitors.

EXAMPLE (MID-SIZE RESORT):
• 2,000 season pass holders × 65% opt-in = 1,300 policies
• Average daily visitors (100) × 45% × 120 days = 5,400 policies
• Total season revenue: $93,800

WHAT'S NEXT?
1. Volume Calculator: Custom projections based on your visitor numbers
2. Risk Mitigation: How coverage protects your resort
3. Partnership Details: Integration with your ticketing system

Reply to this email: partnerships@dailyeventinsurance.com

Looking forward to partnering with ${companyName} for a successful season!

Best regards,
The Daily Event Insurance Team

Quote Reference: ${quoteId}
    `
  };
}

/**
 * Volume-based pricing calculator email
 */
export function skiResortVolumeCalculatorEmail(data: SkiResortTemplateData): EmailTemplate {
  const { contactName, companyName, quoteId, seasonPassHolders = 2000, dailyVisitors = 100, seasonLength = 120 } = data;

  const seasonPassPolicies = Math.floor(seasonPassHolders * 0.65);
  const dailyVisitorPolicies = Math.floor(dailyVisitors * 0.45 * seasonLength);
  const totalPolicies = seasonPassPolicies + dailyVisitorPolicies;
  const seasonRevenue = totalPolicies * 14;

  return {
    subject: `💰 ${companyName} Season Revenue Projection: $${seasonRevenue.toLocaleString()}`,

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
            .calc-section { background: #f0fdf4; padding: 15px; margin: 10px 0; border-radius: 6px; }
            .cta-button { background: #059669; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
            .footer { background: #e5e7eb; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💰 Season Revenue Calculator</h1>
              <p>${companyName} - Quote #${quoteId}</p>
            </div>

            <div class="content">
              <p>Hi ${contactName},</p>

              <p>Based on ${companyName}'s visitor profile, here's your personalized season revenue projection:</p>

              <div class="revenue-box">
                <h2 style="margin: 0;">Estimated Season Revenue</h2>
                <p style="font-size: 48px; margin: 10px 0; font-weight: bold;">$${seasonRevenue.toLocaleString()}</p>
                <p style="margin: 0; opacity: 0.9;">Commission from Daily Event Insurance</p>
              </div>

              <div class="calculator">
                <h3 style="color: #059669; margin-top: 0;">Revenue Breakdown</h3>

                <div class="calc-section">
                  <h4 style="margin-top: 0;">Season Pass Holders</h4>
                  <div class="calc-row">
                    <span>Total Season Pass Holders</span>
                    <strong>${seasonPassHolders.toLocaleString()}</strong>
                  </div>
                  <div class="calc-row">
                    <span>Expected Opt-In Rate</span>
                    <strong>65%</strong>
                  </div>
                  <div class="calc-row">
                    <span>Season Pass Policies</span>
                    <strong>${seasonPassPolicies.toLocaleString()}</strong>
                  </div>
                  <div class="calc-row" style="border: none;">
                    <span>Season Pass Revenue</span>
                    <strong>$${(seasonPassPolicies * 14).toLocaleString()}</strong>
                  </div>
                </div>

                <div class="calc-section">
                  <h4 style="margin-top: 0;">Daily Visitors</h4>
                  <div class="calc-row">
                    <span>Average Daily Visitors</span>
                    <strong>${dailyVisitors.toLocaleString()}</strong>
                  </div>
                  <div class="calc-row">
                    <span>Expected Opt-In Rate</span>
                    <strong>45%</strong>
                  </div>
                  <div class="calc-row">
                    <span>Season Length (Days)</span>
                    <strong>${seasonLength}</strong>
                  </div>
                  <div class="calc-row">
                    <span>Daily Visitor Policies</span>
                    <strong>${dailyVisitorPolicies.toLocaleString()}</strong>
                  </div>
                  <div class="calc-row" style="border: none;">
                    <span>Daily Visitor Revenue</span>
                    <strong>$${(dailyVisitorPolicies * 14).toLocaleString()}</strong>
                  </div>
                </div>

                <div style="background: #059669; color: white; padding: 20px; border-radius: 6px; margin-top: 20px;">
                  <div class="calc-row" style="border-color: rgba(255,255,255,0.2);">
                    <span style="font-size: 18px;">Total Season Policies</span>
                    <strong style="font-size: 18px;">${totalPolicies.toLocaleString()}</strong>
                  </div>
                  <div class="calc-row" style="border: none;">
                    <span style="font-size: 20px; font-weight: bold;">Total Season Revenue</span>
                    <strong style="font-size: 24px;">$${seasonRevenue.toLocaleString()}</strong>
                  </div>
                </div>
              </div>

              <h3>Volume Advantage</h3>
              <p>As a ski resort, you have a unique advantage:</p>
              <ul>
                <li><strong>Recurring Season Pass Revenue:</strong> Same customers covered all season</li>
                <li><strong>High-Volume Daily Sales:</strong> Hundreds of potential policies per day</li>
                <li><strong>Peak Season Optimization:</strong> Maximize revenue during busy periods</li>
                <li><strong>Built-In Touchpoints:</strong> Ticket purchase and season pass renewal</li>
              </ul>

              <h3>Integration Options</h3>
              <ul>
                <li>Seamless integration with your ticketing system</li>
                <li>One-click opt-in at online checkout</li>
                <li>Kiosk integration for day-of purchases</li>
                <li>Season pass renewal automation</li>
              </ul>

              <a href="mailto:partnerships@dailyeventinsurance.com?subject=Schedule Demo - ${companyName}" class="cta-button">
                See the Integration Demo
              </a>

              <p>Ready to discuss how we can integrate this into your operations? Let's schedule a call.</p>

              <p>Best regards,<br>
              <strong>The Daily Event Insurance Team</strong></p>
            </div>

            <div class="footer">
              <p>Projections based on your resort profile and industry averages.</p>
              <p>Quote Reference: ${quoteId}</p>
            </div>
          </div>
        </body>
      </html>
    `,

    text: `
Hi ${contactName},

SEASON REVENUE CALCULATOR - ${companyName} (Quote #${quoteId})

ESTIMATED SEASON REVENUE: $${seasonRevenue.toLocaleString()}

REVENUE BREAKDOWN:

SEASON PASS HOLDERS:
• Total Season Pass Holders: ${seasonPassHolders.toLocaleString()}
• Expected Opt-In Rate: 65%
• Season Pass Policies: ${seasonPassPolicies.toLocaleString()}
• Season Pass Revenue: $${(seasonPassPolicies * 14).toLocaleString()}

DAILY VISITORS:
• Average Daily Visitors: ${dailyVisitors.toLocaleString()}
• Expected Opt-In Rate: 45%
• Season Length (Days): ${seasonLength}
• Daily Visitor Policies: ${dailyVisitorPolicies.toLocaleString()}
• Daily Visitor Revenue: $${(dailyVisitorPolicies * 14).toLocaleString()}

TOTAL:
• Total Season Policies: ${totalPolicies.toLocaleString()}
• Total Season Revenue: $${seasonRevenue.toLocaleString()}

VOLUME ADVANTAGE:
As a ski resort, you have a unique advantage:
• Recurring Season Pass Revenue: Same customers covered all season
• High-Volume Daily Sales: Hundreds of potential policies per day
• Peak Season Optimization: Maximize revenue during busy periods
• Built-In Touchpoints: Ticket purchase and season pass renewal

INTEGRATION OPTIONS:
• Seamless integration with your ticketing system
• One-click opt-in at online checkout
• Kiosk integration for day-of purchases
• Season pass renewal automation

Ready to discuss integration? Reply to schedule a demo.

Best regards,
The Daily Event Insurance Team
partnerships@dailyeventinsurance.com

Quote Reference: ${quoteId}
    `
  };
}

/**
 * Risk mitigation benefits email
 */
export function skiResortRiskMitigationEmail(data: SkiResortTemplateData): EmailTemplate {
  const { contactName, companyName, quoteId } = data;

  return {
    subject: `How Daily Event Insurance Reduces Liability Risk for ${companyName}`,

    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #7c3aed; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; }
            .risk-box { background: white; border-left: 4px solid #7c3aed; padding: 20px; margin: 20px 0; }
            .benefits-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
            .benefit-card { background: #faf5ff; padding: 15px; border-radius: 6px; }
            .cta-button { background: #7c3aed; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
            .footer { background: #e5e7eb; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🛡️ Risk Mitigation Strategy</h1>
              <p>Protecting ${companyName} and Your Guests</p>
            </div>

            <div class="content">
              <p>Hi ${contactName},</p>

              <p>Beyond revenue generation, Daily Event Insurance provides crucial risk mitigation benefits for ${companyName}.</p>

              <div class="risk-box">
                <h3 style="color: #7c3aed; margin-top: 0;">The Liability Challenge</h3>
                <p>Ski resorts face unique liability exposure:</p>
                <ul>
                  <li>High-risk activities with inherent injury potential</li>
                  <li>Thousands of visitors with varying skill levels</li>
                  <li>Weather and terrain variability</li>
                  <li>Equipment-related incidents</li>
                  <li>Lift and facility operations</li>
                </ul>
              </div>

              <h3>How Daily Event Insurance Helps</h3>

              <div class="benefits-grid">
                <div class="benefit-card">
                  <h4 style="margin-top: 0; color: #7c3aed;">Guest Protection</h4>
                  <p>Visitors have their own coverage for accidents, reducing pressure on resort liability.</p>
                </div>

                <div class="benefit-card">
                  <h4 style="margin-top: 0; color: #7c3aed;">Risk Transfer</h4>
                  <p>Personal injury costs covered by insurance rather than resort operations.</p>
                </div>

                <div class="benefit-card">
                  <h4 style="margin-top: 0; color: #7c3aed;">Legal Clarity</h4>
                  <p>Clear documentation of guest coverage in case of incidents.</p>
                </div>

                <div class="benefit-card">
                  <h4 style="margin-top: 0; color: #7c3aed;">Guest Confidence</h4>
                  <p>Visitors ski with peace of mind, enhancing their experience.</p>
                </div>
              </div>

              <h3>Coverage Includes</h3>
              <ul>
                <li><strong>Medical Expenses:</strong> Emergency treatment and hospital care</li>
                <li><strong>Ambulance Services:</strong> Ground and air transport if needed</li>
                <li><strong>Equipment Damage:</strong> Personal gear and rental equipment</li>
                <li><strong>Trip Interruption:</strong> Season pass refunds for extended injuries</li>
                <li><strong>Accidental Death:</strong> Benefit for fatal accidents</li>
              </ul>

              <h3>Real-World Scenario</h3>
              <p><strong>Case Study: Mountain Peak Resort</strong></p>
              <p>A season pass holder suffered a serious injury in the terrain park, requiring helicopter evacuation and multiple surgeries.</p>

              <p><strong>Before Daily Event Insurance:</strong></p>
              <ul>
                <li>Guest threatened lawsuit against resort</li>
                <li>Legal fees and settlement discussions</li>
                <li>Negative publicity and social media backlash</li>
                <li>Estimated resort cost: $75,000+</li>
              </ul>

              <p><strong>After Daily Event Insurance:</strong></p>
              <ul>
                <li>Guest's insurance covered all medical expenses</li>
                <li>No legal action or liability claims</li>
                <li>Guest praised resort for offering coverage</li>
                <li>5-star review mentioning insurance protection</li>
              </ul>

              <h3>Additional Benefits</h3>
              <ul>
                <li><strong>Marketing Advantage:</strong> "Insurance-Protected Skiing" positioning</li>
                <li><strong>Premium Perception:</strong> Shows commitment to guest safety</li>
                <li><strong>Competitive Edge:</strong> Differentiator vs. resorts without coverage</li>
                <li><strong>Guest Loyalty:</strong> Season pass holders appreciate the value-add</li>
              </ul>

              <a href="mailto:partnerships@dailyeventinsurance.com?subject=Risk Discussion - ${companyName}" class="cta-button">
                Discuss Risk Strategy
              </a>

              <p>Want to explore how this fits into ${companyName}'s overall risk management? Let's talk.</p>

              <p>Best regards,<br>
              <strong>The Daily Event Insurance Team</strong></p>
            </div>

            <div class="footer">
              <p>This email is for informational purposes and does not constitute legal advice.</p>
              <p>Quote Reference: ${quoteId}</p>
            </div>
          </div>
        </body>
      </html>
    `,

    text: `
Hi ${contactName},

RISK MITIGATION STRATEGY
Protecting ${companyName} and Your Guests

Beyond revenue generation, Daily Event Insurance provides crucial risk mitigation benefits for ${companyName}.

THE LIABILITY CHALLENGE:
Ski resorts face unique liability exposure:
• High-risk activities with inherent injury potential
• Thousands of visitors with varying skill levels
• Weather and terrain variability
• Equipment-related incidents
• Lift and facility operations

HOW DAILY EVENT INSURANCE HELPS:

Guest Protection: Visitors have their own coverage for accidents, reducing pressure on resort liability.

Risk Transfer: Personal injury costs covered by insurance rather than resort operations.

Legal Clarity: Clear documentation of guest coverage in case of incidents.

Guest Confidence: Visitors ski with peace of mind, enhancing their experience.

COVERAGE INCLUDES:
• Medical Expenses: Emergency treatment and hospital care
• Ambulance Services: Ground and air transport if needed
• Equipment Damage: Personal gear and rental equipment
• Trip Interruption: Season pass refunds for extended injuries
• Accidental Death: Benefit for fatal accidents

REAL-WORLD SCENARIO: Mountain Peak Resort
A season pass holder suffered a serious injury in the terrain park, requiring helicopter evacuation and multiple surgeries.

BEFORE DAILY EVENT INSURANCE:
• Guest threatened lawsuit against resort
• Legal fees and settlement discussions
• Negative publicity and social media backlash
• Estimated resort cost: $75,000+

AFTER DAILY EVENT INSURANCE:
• Guest's insurance covered all medical expenses
• No legal action or liability claims
• Guest praised resort for offering coverage
• 5-star review mentioning insurance protection

ADDITIONAL BENEFITS:
• Marketing Advantage: "Insurance-Protected Skiing" positioning
• Premium Perception: Shows commitment to guest safety
• Competitive Edge: Differentiator vs. resorts without coverage
• Guest Loyalty: Season pass holders appreciate the value-add

Want to explore how this fits into ${companyName}'s overall risk management?

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
export function skiResortPartnershipEmail(data: SkiResortTemplateData): EmailTemplate {
  const { contactName, companyName, quoteId } = data;

  return {
    subject: `Partnership Proposal: Season-Long Coverage for ${companyName} Guests`,

    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc2626; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; }
            .proposal-box { background: white; border: 3px solid #dc2626; border-radius: 8px; padding: 25px; margin: 20px 0; }
            .timeline { background: #fee2e2; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .cta-button { background: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; font-size: 18px; }
            .footer { background: #e5e7eb; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🤝 Season Partnership Proposal</h1>
              <p>${companyName} × Daily Event Insurance</p>
            </div>

            <div class="content">
              <p>Hi ${contactName},</p>

              <p>I'd like to present a formal partnership proposal to integrate Daily Event Insurance into ${companyName}'s operations for the upcoming season.</p>

              <div class="proposal-box">
                <h3 style="color: #dc2626; margin-top: 0;">Partnership Structure</h3>

                <p><strong>Season Pass Integration:</strong></p>
                <ul>
                  <li>Optional insurance add-on during season pass purchase/renewal</li>
                  <li>One-time opt-in covers entire season</li>
                  <li>Automatic renewal option for returning pass holders</li>
                </ul>

                <p><strong>Day Ticket Integration:</strong></p>
                <ul>
                  <li>Optional coverage at online checkout</li>
                  <li>Kiosk opt-in for walk-up purchases</li>
                  <li>Staff training for ticket window sales</li>
                </ul>

                <p><strong>Commission Structure:</strong></p>
                <ul>
                  <li>$14 per policy sold (35% of premium)</li>
                  <li>Monthly commission payments</li>
                  <li>Volume bonuses for 1,000+ policies per season</li>
                </ul>
              </div>

              <div class="timeline">
                <h3 style="margin-top: 0;">Pre-Season Implementation Timeline</h3>

                <p><strong>6-8 Weeks Before Season:</strong></p>
                <ul>
                  <li>Integrate with ticketing/POS system</li>
                  <li>Set up season pass renewal flow</li>
                  <li>Create marketing materials</li>
                </ul>

                <p><strong>4 Weeks Before Season:</strong></p>
                <ul>
                  <li>Train ticket staff and customer service</li>
                  <li>Test integration with dummy transactions</li>
                  <li>Prepare website and kiosk messaging</li>
                </ul>

                <p><strong>2 Weeks Before Season:</strong></p>
                <ul>
                  <li>Soft launch to season pass renewals</li>
                  <li>Refine messaging based on feedback</li>
                  <li>Finalize day-of-purchase workflow</li>
                </ul>

                <p><strong>Season Opening:</strong></p>
                <ul>
                  <li>Full launch across all channels</li>
                  <li>Monitor opt-in rates and optimize</li>
                  <li>Begin earning commissions immediately</li>
                </ul>
              </div>

              <h3>What We Provide</h3>
              <ul>
                <li><strong>Technical Integration:</strong> API docs and developer support</li>
                <li><strong>Marketing Assets:</strong> Website copy, signage, social media templates</li>
                <li><strong>Staff Training:</strong> On-site or virtual training sessions</li>
                <li><strong>Customer Support:</strong> 24/7 support for guest inquiries</li>
                <li><strong>Claims Processing:</strong> Handle all claims and payouts</li>
                <li><strong>Reporting Dashboard:</strong> Real-time sales and commission tracking</li>
              </ul>

              <h3>Investment Required</h3>
              <p><strong>Zero upfront costs.</strong> Your investment is limited to:</p>
              <ul>
                <li>2-3 hours for technical integration setup</li>
                <li>1-2 hours for staff training sessions</li>
                <li>Ongoing: 30 seconds per transaction to present option</li>
              </ul>

              <h3>Success Metrics</h3>
              <p>We'll track and optimize together:</p>
              <ul>
                <li>Season pass opt-in rate (target: 65%)</li>
                <li>Day ticket opt-in rate (target: 45%)</li>
                <li>Monthly commission revenue</li>
                <li>Guest satisfaction with coverage</li>
                <li>Claims processing speed and satisfaction</li>
              </ul>

              <a href="mailto:partnerships@dailyeventinsurance.com?subject=Partnership Agreement - ${companyName}" class="cta-button">
                Let's Finalize the Partnership
              </a>

              <p>Ready to move forward? We can have you live before season opening.</p>

              <p>Best regards,<br>
              <strong>The Daily Event Insurance Team</strong><br>
              partnerships@dailyeventinsurance.com</p>
            </div>

            <div class="footer">
              <p>Partnership terms subject to final agreement. Technical requirements provided upon agreement.</p>
              <p>Quote Reference: ${quoteId}</p>
            </div>
          </div>
        </body>
      </html>
    `,

    text: `
Hi ${contactName},

SEASON PARTNERSHIP PROPOSAL
${companyName} × Daily Event Insurance

I'd like to present a formal partnership proposal to integrate Daily Event Insurance into ${companyName}'s operations for the upcoming season.

PARTNERSHIP STRUCTURE:

SEASON PASS INTEGRATION:
• Optional insurance add-on during season pass purchase/renewal
• One-time opt-in covers entire season
• Automatic renewal option for returning pass holders

DAY TICKET INTEGRATION:
• Optional coverage at online checkout
• Kiosk opt-in for walk-up purchases
• Staff training for ticket window sales

COMMISSION STRUCTURE:
• $14 per policy sold (35% of premium)
• Monthly commission payments
• Volume bonuses for 1,000+ policies per season

PRE-SEASON IMPLEMENTATION TIMELINE:

6-8 WEEKS BEFORE SEASON:
• Integrate with ticketing/POS system
• Set up season pass renewal flow
• Create marketing materials

4 WEEKS BEFORE SEASON:
• Train ticket staff and customer service
• Test integration with dummy transactions
• Prepare website and kiosk messaging

2 WEEKS BEFORE SEASON:
• Soft launch to season pass renewals
• Refine messaging based on feedback
• Finalize day-of-purchase workflow

SEASON OPENING:
• Full launch across all channels
• Monitor opt-in rates and optimize
• Begin earning commissions immediately

WHAT WE PROVIDE:
• Technical Integration: API docs and developer support
• Marketing Assets: Website copy, signage, social media templates
• Staff Training: On-site or virtual training sessions
• Customer Support: 24/7 support for guest inquiries
• Claims Processing: Handle all claims and payouts
• Reporting Dashboard: Real-time sales and commission tracking

INVESTMENT REQUIRED:
Zero upfront costs. Your investment is limited to:
• 2-3 hours for technical integration setup
• 1-2 hours for staff training sessions
• Ongoing: 30 seconds per transaction to present option

SUCCESS METRICS:
We'll track and optimize together:
• Season pass opt-in rate (target: 65%)
• Day ticket opt-in rate (target: 45%)
• Monthly commission revenue
• Guest satisfaction with coverage
• Claims processing speed and satisfaction

Ready to move forward? We can have you live before season opening.

Reply to finalize: partnerships@dailyeventinsurance.com

Best regards,
The Daily Event Insurance Team

Quote Reference: ${quoteId}
    `
  };
}
