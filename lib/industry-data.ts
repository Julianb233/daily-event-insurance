// Industry sector data configuration for Daily Event Insurance

export interface IndustrySector {
  slug: string
  title: string
  shortTitle: string
  metaTitle: string
  metaDescription: string
  heroTitle: string
  heroSubtitle: string
  icon: string
  benefits: {
    title: string
    description: string
    icon: string
  }[]
  howItWorks: {
    title: string
    description: string
  }[]
  faqs: {
    question: string
    answer: string
  }[]
  stats: {
    label: string
    value: string
  }[]
  testimonial?: {
    quote: string
    author: string
    role: string
    company: string
  }
}

export const industrySectors: Record<string, IndustrySector> = {
  "race-directors": {
    slug: "race-directors",
    title: "Running Event Insurance",
    shortTitle: "Race Directors",
    metaTitle: "Race Director Event Insurance | Same Day Coverage for Running Events",
    metaDescription: "Protect your running events with same-day insurance coverage. Offer instant participant protection, reduce liability, and earn revenue on every race registration.",
    heroTitle: "Event Insurance Built for Race Directors",
    heroSubtitle: "Protect participants, reduce your liability exposure, and create a new revenue stream with every race registration.",
    icon: "Activity",
    benefits: [
      {
        title: "Participant Protection",
        description: "Offer instant coverage at registration for 5Ks, 10Ks, half marathons, and full marathons. Give your runners peace of mind before race day.",
        icon: "Shield"
      },
      {
        title: "Revenue Per Registration",
        description: "Earn 20-30% commission on every insurance policy sold. Turn each race entry into multiple revenue streams.",
        icon: "DollarSign"
      },
      {
        title: "Reduced Liability Risk",
        description: "Lower your exposure when participants carry their own coverage. Demonstrate due diligence to sponsors and venues.",
        icon: "TrendingDown"
      },
      {
        title: "Seamless Integration",
        description: "Works with RunSignup, Race Roster, Chronotrack, and all major registration platforms. 5-minute setup.",
        icon: "Zap"
      }
    ],
    howItWorks: [
      {
        title: "Add to Registration",
        description: "Integrate Daily Event Insurance as an optional add-on during race registration. Participants opt-in with one click."
      },
      {
        title: "Instant Coverage",
        description: "Runners receive immediate confirmation and digital proof of coverage via email. Active from registration through race completion."
      },
      {
        title: "You Earn Commission",
        description: "Automatic commission payout on every policy sold. No management, no overhead, just passive revenue."
      }
    ],
    faqs: [
      {
        question: "What types of running events can offer this insurance?",
        answer: "All running events including 5Ks, 10Ks, half marathons, full marathons, ultra races, trail runs, obstacle races, and fun runs. Coverage adapts to your event type and distance."
      },
      {
        question: "How much commission do race directors earn?",
        answer: "Race directors typically earn 20-30% commission on every insurance policy sold. For a race with 500 participants and a 40% insurance take rate, that's $500-$750 in additional revenue per event."
      },
      {
        question: "Does this replace my event liability insurance?",
        answer: "No, participant insurance is complementary to your event liability coverage. It protects individual participants for medical costs and trip cancellation, while your event insurance covers organizational liability."
      },
      {
        question: "Which registration platforms do you integrate with?",
        answer: "We integrate with RunSignup, Race Roster, Chronotrack, Active.com, Let's Do This, Eventbrite, and can work with custom registration systems via API."
      },
      {
        question: "How quickly can I add this to my next race?",
        answer: "Most race directors are live within 24 hours. Setup takes 5-10 minutes, and we handle all technical integration with your registration platform."
      }
    ],
    stats: [
      { label: "Avg. Commission Per Race", value: "$620" },
      { label: "Participant Take Rate", value: "38%" },
      { label: "Setup Time", value: "5 min" }
    ],
    testimonial: {
      quote: "We added Daily Event Insurance to our half marathon series and earned an extra $2,400 across three events. Participants love having the option, and it's completely hands-off for us.",
      author: "Marcus Rodriguez",
      role: "Race Director",
      company: "Pacific Northwest Trail Series"
    }
  },

  "cycling-events": {
    slug: "cycling-events",
    title: "Cycling Event Insurance",
    shortTitle: "Bike Races",
    metaTitle: "Cycling Event Insurance | Same Day Coverage for Bike Races & Gran Fondos",
    metaDescription: "Instant participant insurance for road races, criteriums, gran fondos, and gravel events. Protect your cyclists and earn commission on every registration.",
    heroTitle: "Insurance for Cycling Event Organizers",
    heroSubtitle: "Protect your riders with same-day coverage for road races, criteriums, gran fondos, and gravel events while earning revenue.",
    icon: "Bike",
    benefits: [
      {
        title: "Multi-Discipline Coverage",
        description: "Road racing, criteriums, time trials, gran fondos, gravel races, and cyclocross events. Comprehensive protection for all cycling disciplines.",
        icon: "Shield"
      },
      {
        title: "High-Risk Coverage",
        description: "Cycling events carry inherent risk. Give your participants professional-grade coverage that addresses crashes, injuries, and equipment damage.",
        icon: "AlertTriangle"
      },
      {
        title: "Event Series Revenue",
        description: "For race series and recurring events, insurance becomes a significant recurring revenue stream. Earn commission on every event in your calendar.",
        icon: "TrendingUp"
      },
      {
        title: "Sponsor Confidence",
        description: "Demonstrate professionalism to sponsors and venues by offering participant insurance. Shows you take safety and risk management seriously.",
        icon: "Award"
      }
    ],
    howItWorks: [
      {
        title: "Registration Integration",
        description: "Add insurance as an optional line item during event registration. Works with BikeReg, USA Cycling, and all major platforms."
      },
      {
        title: "Rider Protection",
        description: "Participants get instant coverage for medical expenses, emergency transportation, and trip cancellation. Active from registration through race completion."
      },
      {
        title: "Passive Income",
        description: "Earn 20-30% commission automatically. For a 200-rider criterium with 45% take rate, that's $225-$340 per event."
      }
    ],
    faqs: [
      {
        question: "What cycling events can offer this insurance?",
        answer: "All competitive and recreational cycling events: road races, criteriums, circuit races, time trials, gran fondos, gravel races, cyclocross, stage races, and charity rides."
      },
      {
        question: "Does coverage include equipment damage?",
        answer: "Our standard participant coverage focuses on medical protection and trip cancellation. Equipment coverage can be added as an optional upgrade depending on your event type."
      },
      {
        question: "How does this work for USA Cycling licensed events?",
        answer: "This participant insurance is complementary to USA Cycling's event permit requirements. It provides additional protection for riders beyond the basic event insurance."
      },
      {
        question: "What about international participants in gran fondos?",
        answer: "Coverage extends to international participants riding in U.S.-based events. We can also support events in select international markets."
      },
      {
        question: "Can I offer this for a race series?",
        answer: "Absolutely. Race series see the highest commission totals. We can create series packages and season pass insurance options for your regular participants."
      }
    ],
    stats: [
      { label: "Avg. Revenue Per Event", value: "$480" },
      { label: "Cyclist Take Rate", value: "42%" },
      { label: "Platform Integration", value: "< 1 day" }
    ]
  },

  "triathlons": {
    slug: "triathlons",
    title: "Triathlon Event Insurance",
    shortTitle: "Multi-Sport Events",
    metaTitle: "Triathlon Insurance | Multi-Sport Event Coverage for Race Directors",
    metaDescription: "Same-day insurance for triathlons, duathlons, and multi-sport events. Protect participants across swim, bike, and run with integrated coverage.",
    heroTitle: "Multi-Sport Event Insurance",
    heroSubtitle: "Comprehensive coverage for triathlons, duathlons, aquathlons, and adventure races. Protect participants across all disciplines.",
    icon: "Waves",
    benefits: [
      {
        title: "Multi-Discipline Protection",
        description: "Coverage spans swimming, cycling, and running segments. One policy protects participants through all event phases including transitions.",
        icon: "Shield"
      },
      {
        title: "Open Water Coverage",
        description: "Specialized protection for open water swim starts. Critical coverage that addresses the highest-risk segment of triathlon events.",
        icon: "Droplet"
      },
      {
        title: "Higher Policy Values",
        description: "Triathletes expect comprehensive coverage given the event investment. Premium policies mean higher commission potential per participant.",
        icon: "DollarSign"
      },
      {
        title: "USAT Integration",
        description: "Seamless integration with USA Triathlon sanctioned events and registration platforms including Athlinks and TriRegistration.",
        icon: "Zap"
      }
    ],
    howItWorks: [
      {
        title: "Add to Registration Flow",
        description: "Insurance offered during race registration with clear explanation of coverage across all disciplines. One-click opt-in."
      },
      {
        title: "Comprehensive Protection",
        description: "Participants covered from race start through finish line. Includes medical, emergency evacuation, trip cancellation, and race abandonment."
      },
      {
        title: "Commission on Every Sale",
        description: "Earn 25-30% on each policy. For a 300-athlete Ironman 70.3 with 50% take rate, that's $1,125-$1,350 per event."
      }
    ],
    faqs: [
      {
        question: "Does coverage include the open water swim?",
        answer: "Yes, full coverage includes the swim segment with specialized open water protection. This is one of the primary benefits athletes look for in triathlon insurance."
      },
      {
        question: "What distances are covered?",
        answer: "All triathlon distances: sprint, Olympic, half Ironman (70.3), full Ironman, and ultra-distance events. Also covers duathlons, aquathlons, and other multi-sport formats."
      },
      {
        question: "How does this work with USAT-sanctioned events?",
        answer: "Participant insurance is complementary to your USAT event sanction and required liability coverage. It provides additional protection for individual athletes."
      },
      {
        question: "Can athletes get coverage for just a race series?",
        answer: "Yes, we can create series passes for athletes competing in multiple events. This increases athlete value and creates recurring commission revenue."
      },
      {
        question: "What about relay team coverage?",
        answer: "Relay participants can each purchase individual coverage, or we can create team policies depending on your event structure and relay format."
      }
    ],
    stats: [
      { label: "Avg. Per Event Revenue", value: "$1,150" },
      { label: "Athlete Take Rate", value: "48%" },
      { label: "Policy Premium Avg.", value: "$15" }
    ]
  },

  "obstacle-courses": {
    slug: "obstacle-courses",
    title: "Obstacle Course Race Insurance",
    shortTitle: "OCR Events",
    metaTitle: "OCR Insurance | Obstacle Course Race Coverage for Event Organizers",
    metaDescription: "Same-day insurance for Spartan races, Tough Mudder events, and obstacle course competitions. Protect participants on high-risk obstacles while earning revenue.",
    heroTitle: "OCR Event Insurance",
    heroSubtitle: "Specialized coverage for obstacle course races, mud runs, and extreme endurance events. Protection built for high-risk activities.",
    icon: "Mountain",
    benefits: [
      {
        title: "High-Risk Activity Coverage",
        description: "Specialized protection for walls, rope climbs, monkey bars, water obstacles, electricity, fire, and extreme challenges that standard insurance won't cover.",
        icon: "AlertTriangle"
      },
      {
        title: "Venue Requirement Compliance",
        description: "Many obstacle course venues now require participant insurance. Daily Event Insurance satisfies venue requirements while generating revenue.",
        icon: "CheckCircle"
      },
      {
        title: "Premium Policy Pricing",
        description: "OCR events command higher insurance premiums due to risk level. Higher premiums mean higher commission potential for race organizers.",
        icon: "TrendingUp"
      },
      {
        title: "Waiver Enhancement",
        description: "Participant insurance strengthens your waiver process and demonstrates comprehensive risk management to stakeholders.",
        icon: "FileText"
      }
    ],
    howItWorks: [
      {
        title: "Registration Add-On",
        description: "Offer insurance during registration with clear explanation of OCR-specific coverage. Participants understand the value given event risk."
      },
      {
        title: "Obstacle-Specific Protection",
        description: "Coverage includes medical expenses, ambulance transport, hospital treatment, and emergency evacuation from remote obstacle locations."
      },
      {
        title: "Substantial Commission",
        description: "Earn 25-35% on premium policies. For a 500-participant OCR with 55% take rate, that's $1,375-$1,925 per event."
      }
    ],
    faqs: [
      {
        question: "Does coverage include all obstacle types?",
        answer: "Yes, coverage extends to all standard OCR obstacles including walls, cargo nets, monkey bars, tire drags, water crossings, mud pits, and specialty obstacles like fire jumps and electrical wires."
      },
      {
        question: "What if a venue requires participant insurance?",
        answer: "Daily Event Insurance provides certificates of coverage that satisfy venue requirements. We can coordinate directly with venue management for proof of participant coverage."
      },
      {
        question: "How does pricing compare to standard race insurance?",
        answer: "OCR insurance is typically $10-20 per participant due to elevated risk, compared to $5-10 for road races. Higher premiums mean higher commission for race organizers."
      },
      {
        question: "Can we offer this for kids' obstacle races?",
        answer: "Yes, we offer specialized coverage for youth OCR events with appropriate risk assessment and pricing for participants under 18."
      },
      {
        question: "What about multi-day adventure races?",
        answer: "Multi-day events are covered. We can structure policies for 24-hour challenges, weekend events, and multi-day adventure races with overnight camping."
      }
    ],
    stats: [
      { label: "Event Revenue Avg.", value: "$1,640" },
      { label: "OCR Take Rate", value: "53%" },
      { label: "Premium Per Policy", value: "$14" }
    ]
  },

  "marathons": {
    slug: "marathons",
    title: "Marathon Event Insurance",
    shortTitle: "Marathons & Fun Runs",
    metaTitle: "Marathon Insurance | Same Day Coverage for 26.2 Mile Events & Fun Runs",
    metaDescription: "Protect your marathon, half marathon, and fun run participants with instant insurance coverage. Reduce liability and create new revenue from race registrations.",
    heroTitle: "Marathon & Fun Run Insurance",
    heroSubtitle: "Comprehensive participant protection for full marathons, half marathons, 10Ks, 5Ks, and charity fun runs.",
    icon: "Award",
    benefits: [
      {
        title: "Distance Event Protection",
        description: "Specialized coverage for endurance events with elevated medical risk. Protection for heat illness, dehydration, cardiac events, and overuse injuries.",
        icon: "Heart"
      },
      {
        title: "Charity Run Partner Value",
        description: "Add value for charity partners and fundraising participants. Insurance becomes an additional benefit for major fundraisers and VIP runners.",
        icon: "Users"
      },
      {
        title: "International Runner Coverage",
        description: "Covers international participants traveling to your event. Critical for destination marathons and major city events attracting global runners.",
        icon: "Globe"
      },
      {
        title: "Travel Protection Add-On",
        description: "Optional trip cancellation coverage for destination marathons. Protects runners' investment in travel, hotels, and race fees.",
        icon: "Plane"
      }
    ],
    howItWorks: [
      {
        title: "Registration Integration",
        description: "Add insurance at checkout with clear value proposition. Many runners actively seek protection for their marathon investment."
      },
      {
        title: "Race Day Protection",
        description: "Coverage active from gun start through finish line. Includes medical expenses, emergency transport, and post-race treatment."
      },
      {
        title: "Steady Revenue Stream",
        description: "For annual marathons, insurance revenue becomes a predictable line item. Larger events generate $3,000-$8,000 per year."
      }
    ],
    faqs: [
      {
        question: "What makes marathon insurance different from other race insurance?",
        answer: "Marathon insurance includes higher medical limits ($50,000+) and addresses endurance-specific risks like heat stroke, cardiac events, and severe dehydration that are more common in 26.2-mile events."
      },
      {
        question: "Can runners add trip cancellation coverage?",
        answer: "Yes, for destination marathons we offer trip cancellation coverage that protects runners' investment in race fees, hotels, and travel if they can't participate due to injury or illness."
      },
      {
        question: "How much revenue can a marathon generate from insurance?",
        answer: "A marathon with 2,000 finishers and 40% insurance take rate generates $4,000-$6,000 in commission revenue. Larger marathons with 10,000+ runners can exceed $20,000."
      },
      {
        question: "Do virtual marathons qualify for coverage?",
        answer: "Yes, virtual and hybrid marathon formats are covered. Runners can purchase protection for their virtual race completion regardless of location."
      },
      {
        question: "What about relay marathon teams?",
        answer: "Relay team members can each purchase individual coverage, or we can create team policies with appropriate pricing based on distance per runner."
      }
    ],
    stats: [
      { label: "Large Event Revenue", value: "$5,200" },
      { label: "Marathon Take Rate", value: "41%" },
      { label: "Avg. Policy Value", value: "$12" }
    ]
  },

  "corporate-wellness": {
    slug: "corporate-wellness",
    title: "Corporate Wellness Event Insurance",
    shortTitle: "Corporate Wellness",
    metaTitle: "Corporate Wellness Insurance | Coverage for Company Fitness Events",
    metaDescription: "Instant insurance for corporate 5Ks, company fitness challenges, and wellness programs. Protect employees and create revenue from corporate event partnerships.",
    heroTitle: "Corporate Wellness Event Insurance",
    heroSubtitle: "Protection for company 5Ks, wellness challenges, charity runs, and corporate fitness events. Serve the growing B2B wellness market.",
    icon: "Building",
    benefits: [
      {
        title: "B2B Event Opportunities",
        description: "Corporate wellness events represent high-volume, recurring business. Companies host quarterly or annual events with guaranteed participation.",
        icon: "Briefcase"
      },
      {
        title: "Employee Benefit Positioning",
        description: "Companies appreciate offering insurance as an employee benefit. Positions your event as a premium corporate wellness solution.",
        icon: "Award"
      },
      {
        title: "Bulk Policy Pricing",
        description: "Volume discounts for corporate groups make insurance accessible. Companies often cover the cost as part of event sponsorship.",
        icon: "Users"
      },
      {
        title: "Annual Contract Revenue",
        description: "Corporate clients often commit to annual event series. Creates predictable, recurring commission revenue throughout the year.",
        icon: "Calendar"
      }
    ],
    howItWorks: [
      {
        title: "Corporate Sales Integration",
        description: "Position insurance as a value-add when pitching corporate event packages. Differentiates your offering from competitors."
      },
      {
        title: "Employee Coverage",
        description: "Company provides insurance for all participating employees. Demonstrates investment in employee safety and wellness."
      },
      {
        title: "Recurring Commission",
        description: "Earn commission on corporate events throughout the year. A single corporate client can generate $2,000-$5,000 annually."
      }
    ],
    faqs: [
      {
        question: "How do companies typically purchase insurance for employees?",
        answer: "Most companies add insurance as a line item to the event package and cover the cost. Some offer it as an optional add-on during employee registration."
      },
      {
        question: "What types of corporate events does this cover?",
        answer: "Company 5Ks, corporate fitness challenges, charity team runs, employee wellness races, executive retreats with fitness components, and team building athletic events."
      },
      {
        question: "Can we offer volume discounts for large companies?",
        answer: "Yes, bulk pricing is available for companies registering 50+ employees. Volume discounts make insurance accessible while still generating significant commission."
      },
      {
        question: "How does this help win corporate event contracts?",
        answer: "Many companies now expect participant insurance as part of professional event management. Offering it proactively demonstrates sophistication and risk management."
      },
      {
        question: "Do we need special licensing to sell to corporations?",
        answer: "No, you're offering the insurance through Daily Event Insurance's platform. We handle all licensing and regulatory requirements."
      }
    ],
    stats: [
      { label: "Annual Client Value", value: "$3,200" },
      { label: "Corporate Take Rate", value: "78%" },
      { label: "Avg. Event Size", value: "180" }
    ]
  },

  "schools-universities": {
    slug: "schools-universities",
    title: "School & University Athletics Insurance",
    shortTitle: "Schools & Universities",
    metaTitle: "School Athletics Insurance | Coverage for University Running Events",
    metaDescription: "Same-day insurance for college fun runs, alumni races, homecoming 5Ks, and university athletic events. Protect students and generate revenue for athletic programs.",
    heroTitle: "School & University Event Insurance",
    heroSubtitle: "Coverage for college fun runs, alumni races, student recreation events, and university athletic fundraisers.",
    icon: "GraduationCap",
    benefits: [
      {
        title: "Student Safety Priority",
        description: "Universities prioritize student safety and risk management. Participant insurance demonstrates institutional commitment to protecting students.",
        icon: "Shield"
      },
      {
        title: "Alumni Engagement Revenue",
        description: "Homecoming runs and alumni races generate strong insurance take rates. Alumni are willing to pay for comprehensive coverage.",
        icon: "Users"
      },
      {
        title: "Athletics Department Revenue",
        description: "Provides additional revenue stream for athletic programs facing budget pressures. Passive income with no administrative overhead.",
        icon: "DollarSign"
      },
      {
        title: "Greek Life Events",
        description: "Fraternity and sorority charity runs, Greek Week competitions, and philanthropic athletic events all benefit from participant protection.",
        icon: "Award"
      }
    ],
    howItWorks: [
      {
        title: "Campus Event Integration",
        description: "Add insurance to student recreation events, intramural races, and campus-wide challenges. Simple integration with campus registration systems."
      },
      {
        title: "Student & Alumni Coverage",
        description: "Protect current students, alumni, faculty, staff, and community participants. Comprehensive coverage for all participant categories."
      },
      {
        title: "Department Revenue",
        description: "Commission flows to athletic department, student recreation, or event organizing body. Supports program funding and student opportunities."
      }
    ],
    faqs: [
      {
        question: "Can we offer insurance for student recreation events?",
        answer: "Yes, all campus athletic events qualify including fun runs, charity races, Greek life competitions, club sports events, and student organization fundraisers."
      },
      {
        question: "How does this work with university insurance requirements?",
        answer: "Participant insurance is supplemental to university liability coverage. It provides additional protection for individual students beyond institutional policies."
      },
      {
        question: "What about liability for student-organized events?",
        answer: "Student organizations can offer participant insurance for their events. It demonstrates professionalism and helps secure university approval for athletic fundraisers."
      },
      {
        question: "Can alumni associations use this for reunions?",
        answer: "Absolutely. Alumni weekend 5Ks and homecoming runs see strong insurance uptake. Alumni appreciate the option given they're often traveling to campus."
      },
      {
        question: "How do we handle parent permission for student events?",
        answer: "For participants under 18, we can integrate parental consent into the registration and insurance purchase flow, ensuring compliance with university policies."
      }
    ],
    stats: [
      { label: "Alumni Event Revenue", value: "$840" },
      { label: "Student Take Rate", value: "35%" },
      { label: "Greek Event Take Rate", value: "52%" }
    ]
  }
}

export const industrySectorsList = Object.values(industrySectors)

// Helper function to get sector by slug
export function getSectorBySlug(slug: string): IndustrySector | undefined {
  return industrySectors[slug]
}

// Generate all valid sector slugs for static generation
export function getAllSectorSlugs(): string[] {
  return Object.keys(industrySectors)
}
