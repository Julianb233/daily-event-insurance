# Initial Outreach Email Campaign

Cold outreach emails for prospecting new gym, climbing, and rental business partners.

---

## Target Audience Segments

| Segment | Description | Key Pain Points |
|---------|-------------|-----------------|
| **Gyms & Fitness** | CrossFit, boutique studios, traditional gyms | Liability concerns, member retention, revenue diversification |
| **Climbing Facilities** | Indoor climbing gyms, bouldering centers | High-risk activity coverage, waiver limitations |
| **Equipment Rentals** | Bike, kayak, ski rentals | Equipment damage, injury liability |
| **Adventure Sports** | Zip lines, obstacle courses, trampoline parks | Activity risk, insurance requirements |

---

## Email Sequence: Cold Outreach (5 emails over 14 days)

### Email 1: Introduction (Day 1)

**Subject Lines (A/B Test):**
- A: `Quick question about {{contact.company_name}}`
- B: `Protecting your members (and your bottom line)`
- C: `{{contact.first_name}}, gym owners are adding a new revenue stream`

**Email Body:**

```html
Hi {{contact.first_name}},

I noticed {{contact.company_name}} and had a quick question:

Do your members ever ask about insurance for their workouts, classes, or rentals?

We've been helping facilities like yours solve two problems at once:

1. **Members want protection** – Same-day insurance for activities
2. **You want revenue** – Earn commission on every policy sold

It's called Daily Event Insurance, and it takes 15 minutes to set up.

Interested in a quick chat? Here's my calendar:
[Schedule 15-Min Call →](https://calendly.com/dailyeventinsurance/intro)

If not the right fit, no worries at all!

Best,
**Sarah Thompson**
Partnership Manager | Daily Event Insurance

P.S. Facilities using our platform are averaging $800-2,000/month in new revenue.
```

---

### Email 2: Value Proposition (Day 3)

**Subject Lines:**
- A: `How {{similar_business}} earns $1,200/month extra`
- B: `Your members are already asking for this`
- C: `The math on embedded insurance`

**Email Body:**

```html
Hi {{contact.first_name}},

Following up on my last email. I wanted to share some quick numbers:

**For a facility with 100 daily check-ins:**
• ~15-20% of members add $5 daily insurance
• = 17 policies/day × $1 commission = $17/day
• = **$510/month** in new revenue

**For larger facilities (200+ check-ins):**
• Partners are seeing **$1,200-2,000/month**

The best part? Zero overhead. We handle everything:
✅ Underwriting and compliance
✅ Claims processing
✅ Member support

You just add our widget to checkout and earn.

Worth a 10-minute conversation?

[Schedule Quick Call →](https://calendly.com/dailyeventinsurance/intro)

Best,
**Sarah**
```

---

### Email 3: Social Proof (Day 6)

**Subject Lines:**
- A: `"We should've done this sooner" – Peak Performance Gym`
- B: `What other {{business_type}} owners are saying`
- C: `Real results from real facilities`

**Email Body:**

```html
Hi {{contact.first_name}},

I thought you'd appreciate hearing from other {{business_type}} owners:

---

> **"Our members love the peace of mind, and we love the extra revenue. Win-win."**
> — Mike R., Peak Performance Gym (Denver)
> *$1,847/month in commissions*

---

> **"I was skeptical about adding another step to checkout. But members actually thank us for offering it."**
> — Jessica L., Summit Climbing Co. (Austin)
> *$1,420/month in commissions*

---

> **"Setup took 10 minutes. First sale happened the same day."**
> — Carlos M., Coastal Bike Rentals (San Diego)
> *$892/month in commissions*

---

{{contact.first_name}}, I'd love to show you exactly how this works for {{contact.company_name}}.

No commitment – just a quick demo.

[See It In Action →](https://calendly.com/dailyeventinsurance/demo)

Best,
**Sarah**

P.S. If you're not the right person, could you point me to who handles partnerships? Thanks!
```

---

### Email 4: Problem/Solution (Day 10)

**Subject Lines:**
- A: `What happens when a member gets injured?`
- B: `The liability question every gym owner avoids`
- C: `{{contact.first_name}}, a quick liability thought`

**Email Body:**

```html
Hi {{contact.first_name}},

Let me paint a scenario:

**Current situation:**
- Member gets injured during a workout
- They don't have health insurance (or have high deductible)
- They look to your waiver... which may not hold up
- You're potentially exposed

**With Daily Event Insurance:**
- Member had purchased $5 same-day coverage
- Claim is processed directly with the carrier
- {{contact.company_name}} is protected
- You earned commission on that policy

Here's the thing: waivers have limits. Embedded insurance fills the gap.

Ready to protect your facility AND add revenue?

[Let's Talk →](https://calendly.com/dailyeventinsurance/demo)

No pressure – just information.

Best,
**Sarah**
Partnership Manager | Daily Event Insurance

---
*This is not legal advice. Consult with your attorney about liability coverage.*
```

---

### Email 5: Final Touch / Breakup (Day 14)

**Subject Lines:**
- A: `Should I close your file, {{contact.first_name}}?`
- B: `Last note from me`
- C: `Still interested in the extra revenue?`

**Email Body:**

```html
Hi {{contact.first_name}},

I've reached out a few times and haven't heard back – totally understand you're busy running {{contact.company_name}}.

I'll keep this simple:

**Reply A** – "Yes, let's talk" → I'll send calendar options
**Reply B** – "Not now, try later" → I'll follow up in 3 months
**Reply C** – "Not interested" → I'll remove you from outreach

No hard feelings either way. I just want to respect your time.

If you ever want to explore adding $500-2,000/month in new revenue with zero overhead, I'm here.

Wishing you success!

**Sarah**
Partnership Manager | Daily Event Insurance

---
P.S. You can also book directly anytime: 
[Calendar Link](https://calendly.com/dailyeventinsurance/demo)
```

---

## Sequence Timing

| Email | Day | Time (Business Hours) |
|-------|-----|----------------------|
| Email 1: Introduction | Day 1 | 10:00 AM (Tue-Thu) |
| Email 2: Value Prop | Day 3 | 2:00 PM |
| Email 3: Social Proof | Day 6 | 10:00 AM |
| Email 4: Problem/Solution | Day 10 | 11:00 AM |
| Email 5: Breakup | Day 14 | 9:00 AM |

---

## Exit Conditions

**Stop sequence if contact:**
- Replies to any email
- Books a call/demo
- Has tag "Meeting Scheduled"
- Has tag "Not Interested"
- Unsubscribes

---

## Personalization Tokens

| Token | Description | Fallback |
|-------|-------------|----------|
| `{{contact.first_name}}` | First name | "there" |
| `{{contact.company_name}}` | Business name | "your facility" |
| `{{business_type}}` | Gym/Climbing/Rental/Adventure | "fitness" |
| `{{similar_business}}` | Similar business example | "facilities like yours" |

---

## Follow-Up Tags

| Tag | Applied When |
|-----|--------------|
| `Outreach - Sent Email 1` | After Email 1 |
| `Outreach - Sent Email 5` | After final email |
| `Outreach - Replied` | When reply received |
| `Outreach - No Response` | After 7 days past Email 5 |
| `Outreach - Completed` | Sequence finished |

