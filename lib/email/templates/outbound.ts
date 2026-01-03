/**
 * Outbound Email Templates
 * Alex Hormozi-style direct response emails
 */

export interface EmailTemplateData {
  contactName: string
  companyName: string
  estimatedRevenue: number
  vertical: 'gym' | 'wellness' | 'ski-resort' | 'fitness'
  landingPageUrl?: string
}

// ============================================
// GYM EMAILS
// ============================================

export const gymEmails = {
  initial: {
    subject: (data: EmailTemplateData) => `${data.contactName} - You lost $${Math.round(data.estimatedRevenue).toLocaleString()} last year (get it back?)`,

    html: (data: EmailTemplateData) => `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0; padding: 0;">
        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a; margin-bottom: 16px;">
          ${data.contactName},
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a; margin-bottom: 16px;">
          Last Tuesday I called a gym 3 miles from ${data.companyName}.
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a; margin-bottom: 16px;">
          They're making <strong style="color: #14B8A6;">$4,200 per month</strong> from something you probably don't even know exists.
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a; margin-bottom: 16px;">
          It took them <strong>6 minutes</strong> to set up. Zero ongoing work. Pure profit.
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a; margin-bottom: 16px;">
          You're doing the same work they are. They're making an extra <strong style="color: #14B8A6;">$50,400/year.</strong> You're making $0.
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a; margin-bottom: 16px;">
          Want to know what it is?
        </p>

        <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin: 24px 0;">
          <p style="font-size: 18px; font-weight: 700; color: #1a1a1a; margin: 0 0 12px 0;">
            What you're losing RIGHT NOW:
          </p>
          <div style="font-size: 20px; font-weight: 800; color: #ef4444; margin-bottom: 8px;">
            💸 $${Math.round(data.estimatedRevenue/365)} per day = $${Math.round(data.estimatedRevenue/12).toLocaleString()} per month = $${Math.round(data.estimatedRevenue).toLocaleString()} per year
          </div>
          <p style="font-size: 14px; color: #666; margin: 0;">
            Every single day you wait costs you $${Math.round(data.estimatedRevenue/365)}. That's real money going to... nobody.
          </p>
        </div>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a; margin-bottom: 16px;">
          Here's how they're doing it:
        </p>

        <div style="background: #f0fdf4; border-left: 4px solid #14B8A6; padding: 20px; margin: 24px 0;">
          <ul style="margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 8px; color: #1a1a1a;"><strong>Step 1:</strong> Add insurance checkbox to check-in (we do this - takes 5 min)</li>
            <li style="margin-bottom: 8px; color: #1a1a1a;"><strong>Step 2:</strong> Members see "$40 for daily coverage" and 65% say yes (automatic)</li>
            <li style="margin-bottom: 8px; color: #1a1a1a;"><strong>Step 3:</strong> You earn $14 per policy, direct deposit monthly</li>
          </ul>
        </div>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a; margin-bottom: 16px;">
          <strong>No contracts. No risk. No work after setup. Just money.</strong>
        </p>

        <div style="background: #fffbeb; border: 2px solid #f59e0b; padding: 16px; margin: 24px 0; border-radius: 8px;">
          <p style="font-size: 14px; font-weight: 700; color: #92400e; margin: 0;">
            ⚠️ HEADS UP: I'm only taking 5 new gym partners this month. 2 spots already filled.
          </p>
        </div>

        <p style="font-size: 18px; line-height: 1.6; color: #1a1a1a; margin-bottom: 16px; font-weight: 600;">
          Simple question: Do you want your $${Math.round(data.estimatedRevenue).toLocaleString()} back or not?
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${data.landingPageUrl || 'https://dailyeventinsurance.com/landing/gym'}"
             style="display: inline-block; background: #14B8A6; color: white; font-size: 20px; font-weight: 800; text-decoration: none; padding: 18px 40px; border-radius: 8px; box-shadow: 0 10px 25px -5px rgba(20, 184, 166, 0.4);">
            YES - SHOW ME THE NUMBERS →
          </a>
        </div>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a; margin-bottom: 16px; text-align: center;">
          Or book 10 minutes: [CALENDAR_LINK] <span style="color: #999;">|</span> Just reply to this email
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a; margin: 0;">
          - Daily Event Insurance
        </p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">

        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0;">
          <p style="font-size: 15px; line-height: 1.5; color: #1a1a1a; margin: 0;">
            <strong>P.S.</strong> Mike from Denver ignored my first 3 emails. Then he saw his competitor's revenue dashboard. Now he's making $3,800/month and sends me thank-you texts. Don't be like Mike's first 3 emails. Be like Mike now.
          </p>
        </div>

        <p style="font-size: 13px; line-height: 1.5; color: #999; margin: 16px 0 0 0; font-style: italic;">
          P.P.S. We handle underwriting, claims, billing, customer support. You copy-paste one line of code. That's it.
        </p>
      </div>
    `,

    text: (data: EmailTemplateData) => `${data.contactName},

Last Tuesday I called a gym 3 miles from ${data.companyName}.

They're making $4,200 per month from something you probably don't even know exists.

It took them 6 minutes to set up. Zero ongoing work. Pure profit.

You're doing the same work they are. They're making an extra $50,400/year. You're making $0.

Want to know what it is?

WHAT YOU'RE LOSING RIGHT NOW:
💸 $${Math.round(data.estimatedRevenue/365)} per day = $${Math.round(data.estimatedRevenue/12).toLocaleString()} per month = $${Math.round(data.estimatedRevenue).toLocaleString()} per year

Every single day you wait costs you $${Math.round(data.estimatedRevenue/365)}.

Here's how they're doing it:
→ Step 1: Add insurance checkbox to check-in (we do this - 5 min)
→ Step 2: Members see "$40 for daily coverage" and 65% say yes
→ Step 3: You earn $14 per policy, direct deposit monthly

No contracts. No risk. No work after setup. Just money.

⚠️ HEADS UP: Only taking 5 new gym partners this month. 2 spots already filled.

Simple question: Do you want your $${Math.round(data.estimatedRevenue).toLocaleString()} back or not?

YES - SHOW ME THE NUMBERS:
${data.landingPageUrl || 'https://dailyeventinsurance.com/landing/gym'}

Or book 10 minutes: [CALENDAR_LINK]
Just reply to this email

- Daily Event Insurance

P.S. Mike from Denver ignored my first 3 emails. Then he saw his competitor's revenue dashboard. Now he's making $3,800/month and sends me thank-you texts. Don't be like Mike's first 3 emails. Be like Mike now.

P.P.S. We handle underwriting, claims, billing, customer support. You copy-paste one line of code. That's it.`
  },

  followUp1: {
    subject: (data: EmailTemplateData) => `${data.contactName} - 3 days = $${Math.round(data.estimatedRevenue/365 * 3)} lost (${data.companyName})`,

    html: (data: EmailTemplateData) => `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px;">
        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">${data.contactName},</p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">
          It's been 3 days since my last email.
        </p>

        <p style="font-size: 18px; line-height: 1.6; color: #ef4444; font-weight: 700; margin-bottom: 16px;">
          You just lost $${Math.round(data.estimatedRevenue/365 * 3)} in potential commissions.
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">
          Meanwhile, that gym I mentioned? They made $${Math.round(4200/30 * 3)} in the same 3 days.
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">
          Look, I get it. You're busy. You're skeptical. You get a lot of emails.
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">
          But here's the thing: <strong>Your competitors aren't ignoring this.</strong>
        </p>

        <div style="background: #fef3c7; border: 2px solid #f59e0b; padding: 16px; margin: 24px 0; border-radius: 8px;">
          <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a; margin: 0;">
            <strong>127 gyms</strong> signed up in the last 90 days.<br>
            Average time to setup: <strong>6.3 minutes</strong><br>
            Average monthly commission: <strong>$3,287</strong><br><br>
            They're printing money. You're on the sidelines.
          </p>
        </div>

        <p style="font-size: 18px; line-height: 1.6; color: #1a1a1a; font-weight: 600;">
          One more time: YES or NO?
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">
          Reply YES → I'll send you the 2-min walkthrough video<br>
          Reply NO → I'll stop emailing (no hard feelings)
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">
          - Daily Event Insurance
        </p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">

        <p style="font-size: 14px; line-height: 1.5; color: #666; margin: 0;">
          <strong>P.S.</strong> Only 1 spot left this month. First reply gets it.
        </p>
      </div>
    `,

    text: (data: EmailTemplateData) => `${data.contactName},

It's been 3 days since my last email.

You just lost $${Math.round(data.estimatedRevenue/365 * 3)} in potential commissions.

Meanwhile, that gym I mentioned? They made $${Math.round(4200/30 * 3)} in the same 3 days.

Look, I get it. You're busy. You're skeptical. You get a lot of emails.

But here's the thing: Your competitors aren't ignoring this.

127 gyms signed up in the last 90 days.
Average time to setup: 6.3 minutes
Average monthly commission: $3,287

They're printing money. You're on the sidelines.

One more time: YES or NO?

Reply YES → I'll send you the 2-min walkthrough video
Reply NO → I'll stop emailing (no hard feelings)

- Daily Event Insurance

P.S. Only 1 spot left this month. First reply gets it.`
  },

  followUp2: {
    subject: (data: EmailTemplateData) => `[FINAL] ${data.contactName} - Your competitor just booked a call`,

    html: (data: EmailTemplateData) => `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px;">
        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">${data.contactName},</p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">
          This is awkward.
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">
          A gym owner in your area just booked a setup call with me.
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">
          I can't tell you who (obviously). But they're about to start making <strong style="color: #14B8A6;">$3,200+/month</strong> while you're... reading emails.
        </p>

        <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin: 24px 0;">
          <p style="font-size: 18px; font-weight: 700; color: #ef4444; margin: 0 0 12px 0;">
            TOTAL LOST SO FAR: $${Math.round(data.estimatedRevenue/365 * 7)}
          </p>
          <p style="font-size: 14px; color: #666; margin: 0;">
            That's 7 days since my first email. Real money. Real loss.
          </p>
        </div>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">
          I'm closing the last spot this week. After that, waitlist only.
        </p>

        <p style="font-size: 18px; line-height: 1.6; color: #1a1a1a; font-weight: 700;">
          So here's your final choice:
        </p>

        <div style="background: #f0fdf4; border: 2px solid #14B8A6; padding: 20px; margin: 24px 0; border-radius: 8px;">
          <p style="font-size: 16px; margin: 0 0 12px 0;">
            <strong>Option A:</strong> Reply "SETUP" → Book your 10-min call → Start making $${Math.round(data.estimatedRevenue/12).toLocaleString()}/month by next week
          </p>
          <p style="font-size: 16px; margin: 0;">
            <strong>Option B:</strong> Delete this → Keep losing $${Math.round(data.estimatedRevenue/365)}/day → Watch your competitor grow
          </p>
        </div>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">
          Your call.
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">
          - Daily Event Insurance
        </p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">

        <p style="font-size: 14px; line-height: 1.5; color: #666; margin: 0;">
          <strong>P.S.</strong> After this email, you go on the 6-month followup list. Meaning I'll check back in half a year. By then you'll have lost $${Math.round(data.estimatedRevenue/2).toLocaleString()}. Don't let it get to that.
        </p>
      </div>
    `,

    text: (data: EmailTemplateData) => `${data.contactName},

This is awkward.

A gym owner in your area just booked a setup call with me.

I can't tell you who (obviously). But they're about to start making $3,200+/month while you're... reading emails.

TOTAL LOST SO FAR: $${Math.round(data.estimatedRevenue/365 * 7)}

That's 7 days since my first email. Real money. Real loss.

I'm closing the last spot this week. After that, waitlist only.

So here's your final choice:

Option A: Reply "SETUP" → Book your 10-min call → Start making $${Math.round(data.estimatedRevenue/12).toLocaleString()}/month by next week

Option B: Delete this → Keep losing $${Math.round(data.estimatedRevenue/365)}/day → Watch your competitor grow

Your call.

- Daily Event Insurance

P.S. After this email, you go on the 6-month followup list. Meaning I'll check back in half a year. By then you'll have lost $${Math.round(data.estimatedRevenue/2).toLocaleString()}. Don't let it get to that.`
  }
}

// ============================================
// WELLNESS/SPA EMAILS
// ============================================

export const wellnessEmails = {
  initial: {
    subject: (data: EmailTemplateData) => `${data.contactName} - You lost $${Math.round(data.estimatedRevenue).toLocaleString()} last year (get it back?)`,

    html: (data: EmailTemplateData) => `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0; padding: 0;">
        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a; margin-bottom: 16px;">
          ${data.contactName},
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a; margin-bottom: 16px;">
          Last month I talked to a wellness center 2 miles from ${data.companyName}.
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a; margin-bottom: 16px;">
          They're making <strong style="color: #a78bfa;">$5,600 per month</strong> from something you don't even offer yet.
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a; margin-bottom: 16px;">
          It took them <strong>7 minutes</strong> to add to their intake form. Zero maintenance. Pure profit.
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a; margin-bottom: 16px;">
          Same clients. Same treatments. They're making an extra <strong style="color: #a78bfa;">$67,200/year.</strong> You're making $0.
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a; margin-bottom: 16px;">
          Want to know their secret?
        </p>

        <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin: 24px 0;">
          <p style="font-size: 18px; font-weight: 700; color: #1a1a1a; margin: 0 0 12px 0;">
            What you're losing RIGHT NOW:
          </p>
          <div style="font-size: 20px; font-weight: 800; color: #ef4444; margin-bottom: 8px;">
            💸 $${Math.round(data.estimatedRevenue/365)} per day = $${Math.round(data.estimatedRevenue/12).toLocaleString()} per month = $${Math.round(data.estimatedRevenue).toLocaleString()} per year
          </div>
          <p style="font-size: 14px; color: #666; margin: 0;">
            Every single day you wait costs you $${Math.round(data.estimatedRevenue/365)}. That's money leaving your business to... nobody.
          </p>
        </div>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a; margin-bottom: 16px;">
          Here's how they're printing money:
        </p>

        <div style="background: #f5f3ff; border-left: 4px solid #a78bfa; padding: 20px; margin: 24px 0;">
          <ul style="margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 8px; color: #1a1a1a;"><strong>Step 1:</strong> Add insurance checkbox to intake form (we do this - takes 5 min)</li>
            <li style="margin-bottom: 8px; color: #1a1a1a;"><strong>Step 2:</strong> Clients see "$40 treatment protection" and 95% say yes (automatic)</li>
            <li style="margin-bottom: 8px; color: #1a1a1a;"><strong>Step 3:</strong> You earn $14 per policy, direct deposit monthly</li>
          </ul>
        </div>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a; margin-bottom: 16px;">
          <strong>No contracts. No risk. No work after setup. Just money.</strong>
        </p>

        <div style="background: #fffbeb; border: 2px solid #f59e0b; padding: 16px; margin: 24px 0; border-radius: 8px;">
          <p style="font-size: 14px; font-weight: 700; color: #92400e; margin: 0;">
            ⚠️ HEADS UP: I'm only taking 4 new wellness partners this month. 1 spot already filled.
          </p>
        </div>

        <p style="font-size: 18px; line-height: 1.6; color: #1a1a1a; margin-bottom: 16px; font-weight: 600;">
          Simple question: Do you want your $${Math.round(data.estimatedRevenue).toLocaleString()} back or not?
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${data.landingPageUrl || 'https://dailyeventinsurance.com/landing/wellness'}"
             style="display: inline-block; background: #a78bfa; color: white; font-size: 20px; font-weight: 800; text-decoration: none; padding: 18px 40px; border-radius: 8px; box-shadow: 0 10px 25px -5px rgba(167, 139, 250, 0.4);">
            YES - SHOW ME THE NUMBERS →
          </a>
        </div>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a; margin-bottom: 16px; text-align: center;">
          Or book 10 minutes: [CALENDAR_LINK] <span style="color: #999;">|</span> Just reply to this email
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a; margin: 0;">
          - Daily Event Insurance
        </p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">

        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0;">
          <p style="font-size: 15px; line-height: 1.5; color: #1a1a1a; margin: 0;">
            <strong>P.S.</strong> Jennifer from Miami ignored my first 2 emails. Then her competitor started advertising "now offering treatment protection." She called me the same day. Now she's making $4,900/month and her clients love it. Don't be like Jennifer's first 2 emails. Be like Jennifer now.
          </p>
        </div>

        <p style="font-size: 13px; line-height: 1.5; color: #999; margin: 16px 0 0 0; font-style: italic;">
          P.P.S. We handle underwriting, claims, billing, customer support. You add one checkbox. That's it.
        </p>
      </div>
    `,

    text: (data: EmailTemplateData) => `${data.contactName},

Last month I talked to a wellness center 2 miles from ${data.companyName}.

They're making $5,600 per month from something you don't even offer yet.

It took them 7 minutes to add to their intake form. Zero maintenance. Pure profit.

Same clients. Same treatments. They're making an extra $67,200/year. You're making $0.

Want to know their secret?

WHAT YOU'RE LOSING RIGHT NOW:
💸 $${Math.round(data.estimatedRevenue/365)} per day = $${Math.round(data.estimatedRevenue/12).toLocaleString()} per month = $${Math.round(data.estimatedRevenue).toLocaleString()} per year

Every single day you wait costs you $${Math.round(data.estimatedRevenue/365)}.

Here's how they're printing money:
→ Step 1: Add insurance checkbox to intake form (we do this - 5 min)
→ Step 2: Clients see "$40 treatment protection" and 95% say yes
→ Step 3: You earn $14 per policy, direct deposit monthly

No contracts. No risk. No work after setup. Just money.

⚠️ HEADS UP: Only taking 4 new wellness partners this month. 1 spot already filled.

Simple question: Do you want your $${Math.round(data.estimatedRevenue).toLocaleString()} back or not?

YES - SHOW ME THE NUMBERS:
${data.landingPageUrl || 'https://dailyeventinsurance.com/landing/wellness'}

Or book 10 minutes: [CALENDAR_LINK]
Just reply to this email

- Daily Event Insurance

P.S. Jennifer from Miami ignored my first 2 emails. Then her competitor started advertising "now offering treatment protection." She called me the same day. Now she's making $4,900/month and her clients love it. Don't be like Jennifer's first 2 emails. Be like Jennifer now.

P.P.S. We handle underwriting, claims, billing, customer support. You add one checkbox. That's it.`
  },

  followUp1: {
    subject: (data: EmailTemplateData) => `${data.contactName} - 3 days = $${Math.round(data.estimatedRevenue/365 * 3)} lost (${data.companyName})`,

    html: (data: EmailTemplateData) => `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px;">
        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">${data.contactName},</p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">
          It's been 3 days since my last email.
        </p>

        <p style="font-size: 18px; line-height: 1.6; color: #ef4444; font-weight: 700; margin-bottom: 16px;">
          You just lost $${Math.round(data.estimatedRevenue/365 * 3)} in potential commissions.
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">
          Meanwhile, that wellness center I mentioned? They made $${Math.round(5600/30 * 3)} in the same 3 days.
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">
          Look, I get it. You're slammed. You're skeptical. You get pitched constantly.
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">
          But here's the thing: <strong>Your competitors aren't ignoring this.</strong>
        </p>

        <div style="background: #fef3c7; border: 2px solid #f59e0b; padding: 16px; margin: 24px 0; border-radius: 8px;">
          <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a; margin: 0;">
            <strong>89 wellness centers</strong> signed up in the last 90 days.<br>
            Average time to setup: <strong>7.2 minutes</strong><br>
            Average monthly commission: <strong>$4,156</strong><br><br>
            They're cashing checks. You're deleting emails.
          </p>
        </div>

        <p style="font-size: 18px; line-height: 1.6; color: #1a1a1a; font-weight: 600;">
          One more time: YES or NO?
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">
          Reply YES → I'll send you the 2-min walkthrough video<br>
          Reply NO → I'll stop emailing (no hard feelings)
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">
          - Daily Event Insurance
        </p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">

        <p style="font-size: 14px; line-height: 1.5; color: #666; margin: 0;">
          <strong>P.S.</strong> Only 1 spot left this month. First reply gets it.
        </p>
      </div>
    `,

    text: (data: EmailTemplateData) => `${data.contactName},

It's been 3 days since my last email.

You just lost $${Math.round(data.estimatedRevenue/365 * 3)} in potential commissions.

Meanwhile, that wellness center I mentioned? They made $${Math.round(5600/30 * 3)} in the same 3 days.

Look, I get it. You're slammed. You're skeptical. You get pitched constantly.

But here's the thing: Your competitors aren't ignoring this.

89 wellness centers signed up in the last 90 days.
Average time to setup: 7.2 minutes
Average monthly commission: $4,156

They're cashing checks. You're deleting emails.

One more time: YES or NO?

Reply YES → I'll send you the 2-min walkthrough video
Reply NO → I'll stop emailing (no hard feelings)

- Daily Event Insurance

P.S. Only 1 spot left this month. First reply gets it.`
  },

  followUp2: {
    subject: (data: EmailTemplateData) => `[FINAL] ${data.contactName} - Your competitor just booked a call`,

    html: (data: EmailTemplateData) => `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px;">
        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">${data.contactName},</p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">
          This is awkward.
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">
          A wellness center owner in your area just booked a setup call with me.
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">
          I can't tell you who (obviously). But they're about to start making <strong style="color: #a78bfa;">$4,200+/month</strong> while you're... reading emails.
        </p>

        <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin: 24px 0;">
          <p style="font-size: 18px; font-weight: 700; color: #ef4444; margin: 0 0 12px 0;">
            TOTAL LOST SO FAR: $${Math.round(data.estimatedRevenue/365 * 7)}
          </p>
          <p style="font-size: 14px; color: #666; margin: 0;">
            That's 7 days since my first email. Real money. Real loss.
          </p>
        </div>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">
          I'm closing the last spot this week. After that, waitlist only.
        </p>

        <p style="font-size: 18px; line-height: 1.6; color: #1a1a1a; font-weight: 700;">
          So here's your final choice:
        </p>

        <div style="background: #f5f3ff; border: 2px solid #a78bfa; padding: 20px; margin: 24px 0; border-radius: 8px;">
          <p style="font-size: 16px; margin: 0 0 12px 0;">
            <strong>Option A:</strong> Reply "SETUP" → Book your 10-min call → Start making $${Math.round(data.estimatedRevenue/12).toLocaleString()}/month by next week
          </p>
          <p style="font-size: 16px; margin: 0;">
            <strong>Option B:</strong> Delete this → Keep losing $${Math.round(data.estimatedRevenue/365)}/day → Watch your competitor grow
          </p>
        </div>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">
          Your call.
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">
          - Daily Event Insurance
        </p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">

        <p style="font-size: 14px; line-height: 1.5; color: #666; margin: 0;">
          <strong>P.S.</strong> After this email, you go on the 6-month followup list. Meaning I'll check back in half a year. By then you'll have lost $${Math.round(data.estimatedRevenue/2).toLocaleString()}. Don't let it get to that.
        </p>
      </div>
    `,

    text: (data: EmailTemplateData) => `${data.contactName},

This is awkward.

A wellness center owner in your area just booked a setup call with me.

I can't tell you who (obviously). But they're about to start making $4,200+/month while you're... reading emails.

TOTAL LOST SO FAR: $${Math.round(data.estimatedRevenue/365 * 7)}

That's 7 days since my first email. Real money. Real loss.

I'm closing the last spot this week. After that, waitlist only.

So here's your final choice:

Option A: Reply "SETUP" → Book your 10-min call → Start making $${Math.round(data.estimatedRevenue/12).toLocaleString()}/month by next week

Option B: Delete this → Keep losing $${Math.round(data.estimatedRevenue/365)}/day → Watch your competitor grow

Your call.

- Daily Event Insurance

P.S. After this email, you go on the 6-month followup list. Meaning I'll check back in half a year. By then you'll have lost $${Math.round(data.estimatedRevenue/2).toLocaleString()}. Don't let it get to that.`
  }
}

// ============================================
// SKI RESORT EMAILS
// ============================================

export const skiResortEmails = {
  initial: {
    subject: (data: EmailTemplateData) => `${data.contactName} - You lost $${Math.round(data.estimatedRevenue).toLocaleString()} last year (get it back?)`,

    html: (data: EmailTemplateData) => `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0; padding: 0;">
        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a; margin-bottom: 16px;">
          ${data.contactName},
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a; margin-bottom: 16px;">
          Last Friday I was on the phone with a ski resort in Colorado.
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a; margin-bottom: 16px;">
          They're making <strong style="color: #3b82f6;">$8,200 per month</strong> from something most resorts don't even know exists.
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a; margin-bottom: 16px;">
          It took them <strong>8 minutes</strong> to integrate. Zero ongoing effort. Pure profit.
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a; margin-bottom: 16px;">
          Same lift tickets. Same visitors. They're making an extra <strong style="color: #3b82f6;">$98,400/year.</strong> You're making $0.
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a; margin-bottom: 16px;">
          Want to know what they're doing?
        </p>

        <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin: 24px 0;">
          <p style="font-size: 18px; font-weight: 700; color: #1a1a1a; margin: 0 0 12px 0;">
            What you're losing RIGHT NOW:
          </p>
          <div style="font-size: 20px; font-weight: 800; color: #ef4444; margin-bottom: 8px;">
            💸 $${Math.round(data.estimatedRevenue/365)} per day = $${Math.round(data.estimatedRevenue/12).toLocaleString()} per month = $${Math.round(data.estimatedRevenue).toLocaleString()} per year
          </div>
          <p style="font-size: 14px; color: #666; margin: 0;">
            Every single day you wait costs you $${Math.round(data.estimatedRevenue/365)}. That's real money going... nowhere.
          </p>
        </div>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a; margin-bottom: 16px;">
          Here's how they're doing it:
        </p>

        <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 24px 0;">
          <ul style="margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 8px; color: #1a1a1a;"><strong>Step 1:</strong> Add insurance to ticket checkout (we integrate - takes 8 min)</li>
            <li style="margin-bottom: 8px; color: #1a1a1a;"><strong>Step 2:</strong> Skiers see "$40 slope coverage" and 72% say yes (automatic)</li>
            <li style="margin-bottom: 8px; color: #1a1a1a;"><strong>Step 3:</strong> You earn $14 per policy, direct deposit monthly</li>
          </ul>
        </div>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a; margin-bottom: 16px;">
          <strong>No contracts. No risk. No work after setup. Just money.</strong>
        </p>

        <div style="background: #fffbeb; border: 2px solid #f59e0b; padding: 16px; margin: 24px 0; border-radius: 8px;">
          <p style="font-size: 14px; font-weight: 700; color: #92400e; margin: 0;">
            ⚠️ HEADS UP: I'm only taking 3 new resort partners before peak season. 1 spot already filled.
          </p>
        </div>

        <p style="font-size: 18px; line-height: 1.6; color: #1a1a1a; margin-bottom: 16px; font-weight: 600;">
          Simple question: Do you want your $${Math.round(data.estimatedRevenue).toLocaleString()} back or not?
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${data.landingPageUrl || 'https://dailyeventinsurance.com/landing/ski-resort'}"
             style="display: inline-block; background: #3b82f6; color: white; font-size: 20px; font-weight: 800; text-decoration: none; padding: 18px 40px; border-radius: 8px; box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.4);">
            YES - SHOW ME THE NUMBERS →
          </a>
        </div>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a; margin-bottom: 16px; text-align: center;">
          Or book 10 minutes: [CALENDAR_LINK] <span style="color: #999;">|</span> Just reply to this email
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a; margin: 0;">
          - Daily Event Insurance
        </p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">

        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0;">
          <p style="font-size: 15px; line-height: 1.5; color: #1a1a1a; margin: 0;">
            <strong>P.S.</strong> Brian from Tahoe waited 2 months to set this up. Cost him $16,400 in lost revenue. Now he's making $7,800/month and kicking himself for waiting. Don't be like Brian's 2 months. Be like Brian now.
          </p>
        </div>

        <p style="font-size: 13px; line-height: 1.5; color: #999; margin: 16px 0 0 0; font-style: italic;">
          P.P.S. We handle underwriting, claims, billing, customer support. You integrate once. That's it.
        </p>
      </div>
    `,

    text: (data: EmailTemplateData) => `${data.contactName},

Last Friday I was on the phone with a ski resort in Colorado.

They're making $8,200 per month from something most resorts don't even know exists.

It took them 8 minutes to integrate. Zero ongoing effort. Pure profit.

Same lift tickets. Same visitors. They're making an extra $98,400/year. You're making $0.

Want to know what they're doing?

WHAT YOU'RE LOSING RIGHT NOW:
💸 $${Math.round(data.estimatedRevenue/365)} per day = $${Math.round(data.estimatedRevenue/12).toLocaleString()} per month = $${Math.round(data.estimatedRevenue).toLocaleString()} per year

Every single day you wait costs you $${Math.round(data.estimatedRevenue/365)}.

Here's how they're doing it:
→ Step 1: Add insurance to ticket checkout (we integrate - takes 8 min)
→ Step 2: Skiers see "$40 slope coverage" and 72% say yes
→ Step 3: You earn $14 per policy, direct deposit monthly

No contracts. No risk. No work after setup. Just money.

⚠️ HEADS UP: Only taking 3 new resort partners before peak season. 1 spot already filled.

Simple question: Do you want your $${Math.round(data.estimatedRevenue).toLocaleString()} back or not?

YES - SHOW ME THE NUMBERS:
${data.landingPageUrl || 'https://dailyeventinsurance.com/landing/ski-resort'}

Or book 10 minutes: [CALENDAR_LINK]
Just reply to this email

- Daily Event Insurance

P.S. Brian from Tahoe waited 2 months to set this up. Cost him $16,400 in lost revenue. Now he's making $7,800/month and kicking himself for waiting. Don't be like Brian's 2 months. Be like Brian now.

P.P.S. We handle underwriting, claims, billing, customer support. You integrate once. That's it.`
  },

  followUp1: {
    subject: (data: EmailTemplateData) => `${data.contactName} - 3 days = $${Math.round(data.estimatedRevenue/365 * 3)} lost (${data.companyName})`,

    html: (data: EmailTemplateData) => `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px;">
        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">${data.contactName},</p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">
          It's been 3 days since my last email.
        </p>

        <p style="font-size: 18px; line-height: 1.6; color: #ef4444; font-weight: 700; margin-bottom: 16px;">
          You just lost $${Math.round(data.estimatedRevenue/365 * 3)} in potential commissions.
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">
          Meanwhile, that Colorado resort I mentioned? They made $${Math.round(8200/30 * 3)} in the same 3 days.
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">
          Look, I get it. You're running operations. You're skeptical. You get 100 sales emails a day.
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">
          But here's the thing: <strong>Your competitors aren't ignoring this.</strong>
        </p>

        <div style="background: #fef3c7; border: 2px solid #f59e0b; padding: 16px; margin: 24px 0; border-radius: 8px;">
          <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a; margin: 0;">
            <strong>34 ski resorts</strong> signed up in the last 90 days.<br>
            Average time to setup: <strong>8.1 minutes</strong><br>
            Average monthly commission: <strong>$6,892</strong><br><br>
            They're printing money. You're on the slopes wondering where revenue went.
          </p>
        </div>

        <p style="font-size: 18px; line-height: 1.6; color: #1a1a1a; font-weight: 600;">
          One more time: YES or NO?
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">
          Reply YES → I'll send you the 2-min walkthrough video<br>
          Reply NO → I'll stop emailing (no hard feelings)
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">
          - Daily Event Insurance
        </p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">

        <p style="font-size: 14px; line-height: 1.5; color: #666; margin: 0;">
          <strong>P.S.</strong> Only 1 spot left before peak season. First reply gets it.
        </p>
      </div>
    `,

    text: (data: EmailTemplateData) => `${data.contactName},

It's been 3 days since my last email.

You just lost $${Math.round(data.estimatedRevenue/365 * 3)} in potential commissions.

Meanwhile, that Colorado resort I mentioned? They made $${Math.round(8200/30 * 3)} in the same 3 days.

Look, I get it. You're running operations. You're skeptical. You get 100 sales emails a day.

But here's the thing: Your competitors aren't ignoring this.

34 ski resorts signed up in the last 90 days.
Average time to setup: 8.1 minutes
Average monthly commission: $6,892

They're printing money. You're on the slopes wondering where revenue went.

One more time: YES or NO?

Reply YES → I'll send you the 2-min walkthrough video
Reply NO → I'll stop emailing (no hard feelings)

- Daily Event Insurance

P.S. Only 1 spot left before peak season. First reply gets it.`
  },

  followUp2: {
    subject: (data: EmailTemplateData) => `[FINAL] ${data.contactName} - Your competitor just booked a call`,

    html: (data: EmailTemplateData) => `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px;">
        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">${data.contactName},</p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">
          This is awkward.
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">
          Another ski resort in your region just booked a setup call with me.
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">
          I can't tell you which one (obviously). But they're about to start making <strong style="color: #3b82f6;">$6,800+/month</strong> while you're... reading emails.
        </p>

        <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin: 24px 0;">
          <p style="font-size: 18px; font-weight: 700; color: #ef4444; margin: 0 0 12px 0;">
            TOTAL LOST SO FAR: $${Math.round(data.estimatedRevenue/365 * 7)}
          </p>
          <p style="font-size: 14px; color: #666; margin: 0;">
            That's 7 days since my first email. Real money. Real loss.
          </p>
        </div>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">
          I'm closing the last spot this week. After that, waitlist until next season.
        </p>

        <p style="font-size: 18px; line-height: 1.6; color: #1a1a1a; font-weight: 700;">
          So here's your final choice:
        </p>

        <div style="background: #eff6ff; border: 2px solid #3b82f6; padding: 20px; margin: 24px 0; border-radius: 8px;">
          <p style="font-size: 16px; margin: 0 0 12px 0;">
            <strong>Option A:</strong> Reply "SETUP" → Book your 10-min call → Start making $${Math.round(data.estimatedRevenue/12).toLocaleString()}/month by next week
          </p>
          <p style="font-size: 16px; margin: 0;">
            <strong>Option B:</strong> Delete this → Keep losing $${Math.round(data.estimatedRevenue/365)}/day → Watch your competitor dominate
          </p>
        </div>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">
          Your call.
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">
          - Daily Event Insurance
        </p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">

        <p style="font-size: 14px; line-height: 1.5; color: #666; margin: 0;">
          <strong>P.S.</strong> After this email, you go on the 6-month followup list. Meaning I'll check back in half a year. By then you'll have lost $${Math.round(data.estimatedRevenue/2).toLocaleString()}. Don't let it get to that.
        </p>
      </div>
    `,

    text: (data: EmailTemplateData) => `${data.contactName},

This is awkward.

Another ski resort in your region just booked a setup call with me.

I can't tell you which one (obviously). But they're about to start making $6,800+/month while you're... reading emails.

TOTAL LOST SO FAR: $${Math.round(data.estimatedRevenue/365 * 7)}

That's 7 days since my first email. Real money. Real loss.

I'm closing the last spot this week. After that, waitlist until next season.

So here's your final choice:

Option A: Reply "SETUP" → Book your 10-min call → Start making $${Math.round(data.estimatedRevenue/12).toLocaleString()}/month by next week

Option B: Delete this → Keep losing $${Math.round(data.estimatedRevenue/365)}/day → Watch your competitor dominate

Your call.

- Daily Event Insurance

P.S. After this email, you go on the 6-month followup list. Meaning I'll check back in half a year. By then you'll have lost $${Math.round(data.estimatedRevenue/2).toLocaleString()}. Don't let it get to that.`
  }
}

// ============================================
// FITNESS EVENT EMAILS
// ============================================

export const fitnessEmails = {
  initial: {
    subject: (data: EmailTemplateData) => `${data.contactName} - You lost $${Math.round(data.estimatedRevenue).toLocaleString()} last year (get it back?)`,

    html: (data: EmailTemplateData) => `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0; padding: 0;">
        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a; margin-bottom: 16px;">
          ${data.contactName},
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a; margin-bottom: 16px;">
          Yesterday I spoke with a race director in your state.
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a; margin-bottom: 16px;">
          They're making <strong style="color: #f59e0b;">$3,900 per month</strong> from something you've never even thought about.
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a; margin-bottom: 16px;">
          It took them <strong>4 minutes</strong> to add to their registration. Zero maintenance. Pure profit.
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a; margin-bottom: 16px;">
          Same participants. Same events. They're making an extra <strong style="color: #f59e0b;">$46,800/year.</strong> You're making $0.
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a; margin-bottom: 16px;">
          Want to know what it is?
        </p>

        <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin: 24px 0;">
          <p style="font-size: 18px; font-weight: 700; color: #1a1a1a; margin: 0 0 12px 0;">
            What you're losing RIGHT NOW:
          </p>
          <div style="font-size: 20px; font-weight: 800; color: #ef4444; margin-bottom: 8px;">
            💸 $${Math.round(data.estimatedRevenue/365)} per day = $${Math.round(data.estimatedRevenue/12).toLocaleString()} per month = $${Math.round(data.estimatedRevenue).toLocaleString()} per year
          </div>
          <p style="font-size: 14px; color: #666; margin: 0;">
            Every single day you wait costs you $${Math.round(data.estimatedRevenue/365)}. That's money your competitors are taking.
          </p>
        </div>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a; margin-bottom: 16px;">
          Here's how they're doing it:
        </p>

        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 24px 0;">
          <ul style="margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 8px; color: #1a1a1a;"><strong>Step 1:</strong> Add insurance checkbox to registration (we do this - takes 4 min)</li>
            <li style="margin-bottom: 8px; color: #1a1a1a;"><strong>Step 2:</strong> Participants see "$40 event coverage" and 82% say yes (automatic)</li>
            <li style="margin-bottom: 8px; color: #1a1a1a;"><strong>Step 3:</strong> You earn $14 per policy, direct deposit monthly</li>
          </ul>
        </div>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a; margin-bottom: 16px;">
          <strong>No contracts. No risk. No work after setup. Just money.</strong>
        </p>

        <div style="background: #fffbeb; border: 2px solid #f59e0b; padding: 16px; margin: 24px 0; border-radius: 8px;">
          <p style="font-size: 14px; font-weight: 700; color: #92400e; margin: 0;">
            ⚠️ HEADS UP: I'm only taking 6 new event organizers this month. 3 spots already filled.
          </p>
        </div>

        <p style="font-size: 18px; line-height: 1.6; color: #1a1a1a; margin-bottom: 16px; font-weight: 600;">
          Simple question: Do you want your $${Math.round(data.estimatedRevenue).toLocaleString()} back or not?
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${data.landingPageUrl || 'https://dailyeventinsurance.com/landing/fitness'}"
             style="display: inline-block; background: #f59e0b; color: white; font-size: 20px; font-weight: 800; text-decoration: none; padding: 18px 40px; border-radius: 8px; box-shadow: 0 10px 25px -5px rgba(245, 158, 11, 0.4);">
            YES - SHOW ME THE NUMBERS →
          </a>
        </div>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a; margin-bottom: 16px; text-align: center;">
          Or book 10 minutes: [CALENDAR_LINK] <span style="color: #999;">|</span> Just reply to this email
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a; margin: 0;">
          - Daily Event Insurance
        </p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">

        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0;">
          <p style="font-size: 15px; line-height: 1.5; color: #1a1a1a; margin: 0;">
            <strong>P.S.</strong> Sarah from Austin ignored my first email. Then she ran a marathon with 1,200 participants and realized she left $13,776 on the table. She called me crying. Now she's making $3,400/month and never runs an event without insurance. Don't be like Sarah's first email. Be like Sarah now.
          </p>
        </div>

        <p style="font-size: 13px; line-height: 1.5; color: #999; margin: 16px 0 0 0; font-style: italic;">
          P.P.S. We handle underwriting, claims, billing, customer support. You add one checkbox. That's it.
        </p>
      </div>
    `,

    text: (data: EmailTemplateData) => `${data.contactName},

Yesterday I spoke with a race director in your state.

They're making $3,900 per month from something you've never even thought about.

It took them 4 minutes to add to their registration. Zero maintenance. Pure profit.

Same participants. Same events. They're making an extra $46,800/year. You're making $0.

Want to know what it is?

WHAT YOU'RE LOSING RIGHT NOW:
💸 $${Math.round(data.estimatedRevenue/365)} per day = $${Math.round(data.estimatedRevenue/12).toLocaleString()} per month = $${Math.round(data.estimatedRevenue).toLocaleString()} per year

Every single day you wait costs you $${Math.round(data.estimatedRevenue/365)}.

Here's how they're doing it:
→ Step 1: Add insurance checkbox to registration (we do this - 4 min)
→ Step 2: Participants see "$40 event coverage" and 82% say yes
→ Step 3: You earn $14 per policy, direct deposit monthly

No contracts. No risk. No work after setup. Just money.

⚠️ HEADS UP: Only taking 6 new event organizers this month. 3 spots already filled.

Simple question: Do you want your $${Math.round(data.estimatedRevenue).toLocaleString()} back or not?

YES - SHOW ME THE NUMBERS:
${data.landingPageUrl || 'https://dailyeventinsurance.com/landing/fitness'}

Or book 10 minutes: [CALENDAR_LINK]
Just reply to this email

- Daily Event Insurance

P.S. Sarah from Austin ignored my first email. Then she ran a marathon with 1,200 participants and realized she left $13,776 on the table. She called me crying. Now she's making $3,400/month and never runs an event without insurance. Don't be like Sarah's first email. Be like Sarah now.

P.P.S. We handle underwriting, claims, billing, customer support. You add one checkbox. That's it.`
  },

  followUp1: {
    subject: (data: EmailTemplateData) => `${data.contactName} - 3 days = $${Math.round(data.estimatedRevenue/365 * 3)} lost (${data.companyName})`,

    html: (data: EmailTemplateData) => `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px;">
        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">${data.contactName},</p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">
          It's been 3 days since my last email.
        </p>

        <p style="font-size: 18px; line-height: 1.6; color: #ef4444; font-weight: 700; margin-bottom: 16px;">
          You just lost $${Math.round(data.estimatedRevenue/365 * 3)} in potential commissions.
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">
          Meanwhile, that race director I mentioned? They made $${Math.round(3900/30 * 3)} in the same 3 days.
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">
          Look, I get it. You're planning events. You're skeptical. You get pitched constantly.
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">
          But here's the thing: <strong>Your competitors aren't ignoring this.</strong>
        </p>

        <div style="background: #fef3c7; border: 2px solid #f59e0b; padding: 16px; margin: 24px 0; border-radius: 8px;">
          <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a; margin: 0;">
            <strong>156 event organizers</strong> signed up in the last 90 days.<br>
            Average time to setup: <strong>5.4 minutes</strong><br>
            Average monthly commission: <strong>$2,944</strong><br><br>
            They're making money while you sleep. You're leaving it on the table.
          </p>
        </div>

        <p style="font-size: 18px; line-height: 1.6; color: #1a1a1a; font-weight: 600;">
          One more time: YES or NO?
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">
          Reply YES → I'll send you the 2-min walkthrough video<br>
          Reply NO → I'll stop emailing (no hard feelings)
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">
          - Daily Event Insurance
        </p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">

        <p style="font-size: 14px; line-height: 1.5; color: #666; margin: 0;">
          <strong>P.S.</strong> Only 2 spots left this month. First reply gets priority.
        </p>
      </div>
    `,

    text: (data: EmailTemplateData) => `${data.contactName},

It's been 3 days since my last email.

You just lost $${Math.round(data.estimatedRevenue/365 * 3)} in potential commissions.

Meanwhile, that race director I mentioned? They made $${Math.round(3900/30 * 3)} in the same 3 days.

Look, I get it. You're planning events. You're skeptical. You get pitched constantly.

But here's the thing: Your competitors aren't ignoring this.

156 event organizers signed up in the last 90 days.
Average time to setup: 5.4 minutes
Average monthly commission: $2,944

They're making money while you sleep. You're leaving it on the table.

One more time: YES or NO?

Reply YES → I'll send you the 2-min walkthrough video
Reply NO → I'll stop emailing (no hard feelings)

- Daily Event Insurance

P.S. Only 2 spots left this month. First reply gets priority.`
  },

  followUp2: {
    subject: (data: EmailTemplateData) => `[FINAL] ${data.contactName} - Your competitor just booked a call`,

    html: (data: EmailTemplateData) => `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px;">
        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">${data.contactName},</p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">
          This is awkward.
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">
          Another event organizer in your area just booked a setup call with me.
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">
          I can't tell you who (obviously). But they're about to start making <strong style="color: #f59e0b;">$2,900+/month</strong> while you're... reading emails.
        </p>

        <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin: 24px 0;">
          <p style="font-size: 18px; font-weight: 700; color: #ef4444; margin: 0 0 12px 0;">
            TOTAL LOST SO FAR: $${Math.round(data.estimatedRevenue/365 * 7)}
          </p>
          <p style="font-size: 14px; color: #666; margin: 0;">
            That's 7 days since my first email. Real money. Real loss.
          </p>
        </div>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">
          I'm closing the last spot this week. After that, waitlist only.
        </p>

        <p style="font-size: 18px; line-height: 1.6; color: #1a1a1a; font-weight: 700;">
          So here's your final choice:
        </p>

        <div style="background: #fef3c7; border: 2px solid #f59e0b; padding: 20px; margin: 24px 0; border-radius: 8px;">
          <p style="font-size: 16px; margin: 0 0 12px 0;">
            <strong>Option A:</strong> Reply "SETUP" → Book your 10-min call → Start making $${Math.round(data.estimatedRevenue/12).toLocaleString()}/month by next week
          </p>
          <p style="font-size: 16px; margin: 0;">
            <strong>Option B:</strong> Delete this → Keep losing $${Math.round(data.estimatedRevenue/365)}/day → Watch your competitor grow
          </p>
        </div>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">
          Your call.
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a;">
          - Daily Event Insurance
        </p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">

        <p style="font-size: 14px; line-height: 1.5; color: #666; margin: 0;">
          <strong>P.S.</strong> After this email, you go on the 6-month followup list. Meaning I'll check back in half a year. By then you'll have lost $${Math.round(data.estimatedRevenue/2).toLocaleString()}. Don't let it get to that.
        </p>
      </div>
    `,

    text: (data: EmailTemplateData) => `${data.contactName},

This is awkward.

Another event organizer in your area just booked a setup call with me.

I can't tell you who (obviously). But they're about to start making $2,900+/month while you're... reading emails.

TOTAL LOST SO FAR: $${Math.round(data.estimatedRevenue/365 * 7)}

That's 7 days since my first email. Real money. Real loss.

I'm closing the last spot this week. After that, waitlist only.

So here's your final choice:

Option A: Reply "SETUP" → Book your 10-min call → Start making $${Math.round(data.estimatedRevenue/12).toLocaleString()}/month by next week

Option B: Delete this → Keep losing $${Math.round(data.estimatedRevenue/365)}/day → Watch your competitor grow

Your call.

- Daily Event Insurance

P.S. After this email, you go on the 6-month followup list. Meaning I'll check back in half a year. By then you'll have lost $${Math.round(data.estimatedRevenue/2).toLocaleString()}. Don't let it get to that.`
  }
}

// ============================================
// TEMPLATE SELECTOR
// ============================================

export function getEmailTemplate(
  vertical: 'gym' | 'wellness' | 'ski-resort' | 'fitness',
  sequence: 'initial' | 'followUp1' | 'followUp2'
) {
  const templates = {
    gym: gymEmails,
    wellness: wellnessEmails,
    'ski-resort': skiResortEmails,
    fitness: fitnessEmails,
  }

  return templates[vertical][sequence]
}

// ============================================
// EMAIL SEQUENCE TIMING (Days between emails)
// ============================================

export const sequenceTiming = {
  initial: 0,      // Immediate
  followUp1: 3,    // 3 days later
  followUp2: 7,    // 7 days after initial (total)
}
