import { Activity, Clock, Brain, ShieldCheck, Zap, Target, TrendingUp, LineChart, Users, Lock, CheckCircle, BarChart3 } from "lucide-react"

export interface UnderwritingTopicData {
  id: string
  slug: string
  title: string
  shortTitle: string
  tagline: string
  description: string
  heroImage: string
  icon: string
  color: "teal" | "orange" | "sky" | "purple"

  // Market comparison stats
  marketStats: {
    traditionalMethod: string
    ourMethod: string
    improvement: string
    annualSavings: string
  }

  // Key benefits for carriers
  keyBenefits: {
    title: string
    description: string
    icon: string
  }[]

  // Data points captured
  dataPoints: {
    title: string
    description: string
  }[]

  // Use cases by vertical
  useCases: {
    vertical: string
    example: string
    benefit: string
  }[]

  // Comparison table
  comparisonTable: {
    feature: string
    traditional: string
    eventTriggered: string
  }[]
}

export const underwritingTopics: UnderwritingTopicData[] = [
  {
    id: "real-time-activity-signals",
    slug: "real-time-activity-signals",
    title: "Real-Time Activity Signals",
    shortTitle: "Activity Signals",
    tagline: "Know when participants are active, what they're doing, and how often",
    description: "Access live activity data from integrated platforms to understand exactly when and how participants engage. Our real-time signals provide unprecedented visibility into actual behavior, enabling precise risk assessment and dynamic pricing that traditional underwriting simply cannot match.",
    heroImage: "/images/underwriting/activity-signals-hero.jpg",
    icon: "Activity",
    color: "teal",
    marketStats: {
      traditionalMethod: "Annual self-reported estimates",
      ourMethod: "Verified real-time activity data",
      improvement: "94% more accurate risk assessment",
      annualSavings: "$2.3M average for mid-size carriers"
    },
    keyBenefits: [
      {
        title: "Instant Activity Verification",
        description: "Know exactly when coverage is needed with real-time check-ins and activity triggers from integrated platforms.",
        icon: "Zap"
      },
      {
        title: "Activity Type Classification",
        description: "Automatically classify activity types (yoga vs CrossFit, 5K vs marathon) for accurate risk profiling.",
        icon: "Target"
      },
      {
        title: "Frequency Pattern Analysis",
        description: "Distinguish between regular participants and occasional users to price risk appropriately.",
        icon: "TrendingUp"
      },
      {
        title: "Duration Tracking",
        description: "Precise exposure windows based on actual activity duration, not estimated time blocks.",
        icon: "Clock"
      }
    ],
    dataPoints: [
      {
        title: "Check-In Timestamps",
        description: "Exact time of arrival, activity start, and departure from facilities or events"
      },
      {
        title: "Activity Classification",
        description: "Type of workout, class, race, treatment, or adventure activity being performed"
      },
      {
        title: "Duration Metrics",
        description: "Time spent actively engaged in the covered activity with start/end precision"
      },
      {
        title: "Intensity Indicators",
        description: "Workout intensity levels, race pace data, difficulty ratings for adventures"
      },
      {
        title: "Frequency Patterns",
        description: "Weekly/monthly activity frequency, consistency scores, attendance patterns"
      },
      {
        title: "Location Verification",
        description: "GPS confirmation of activity location matching covered venues or routes"
      }
    ],
    useCases: [
      {
        vertical: "Fitness & Gyms",
        example: "Mindbody check-in triggers coverage; class type determines risk tier; duration caps exposure",
        benefit: "73% reduction in coverage disputes due to verified attendance"
      },
      {
        vertical: "Running & Race Events",
        example: "Bib activation at start line, GPS tracking throughout race, finish line deactivation",
        benefit: "Real-time participant location for emergency response and claims verification"
      },
      {
        vertical: "Outdoor & Adventure",
        example: "Equipment rental checkout triggers coverage; guide assignment verified; return ends coverage",
        benefit: "Equipment-linked coverage ensures only active rentals are covered"
      },
      {
        vertical: "Wellness & MedSpa",
        example: "Appointment check-in starts coverage; treatment type logged; checkout ends coverage",
        benefit: "Treatment-specific risk assessment with practitioner verification"
      }
    ],
    comparisonTable: [
      {
        feature: "Activity Verification",
        traditional: "Self-reported or assumed",
        eventTriggered: "Platform-verified in real-time"
      },
      {
        feature: "Data Freshness",
        traditional: "Annual renewal questionnaire",
        eventTriggered: "Instant, per-activity"
      },
      {
        feature: "Risk Assessment Accuracy",
        traditional: "~40% based on assumptions",
        eventTriggered: "94% based on actual behavior"
      },
      {
        feature: "Fraud Detection",
        traditional: "Post-claim investigation",
        eventTriggered: "Pre-claim verification"
      },
      {
        feature: "Pricing Precision",
        traditional: "Broad risk categories",
        eventTriggered: "Individual activity pricing"
      }
    ]
  },
  {
    id: "risk-window-precision",
    slug: "risk-window-precision",
    title: "Risk Window Precision",
    shortTitle: "Risk Windows",
    tagline: "Coverage aligned to actual exposure windows, not estimated time periods",
    description: "Traditional policies cover broad time periods regardless of actual activity. Our event-triggered approach activates coverage precisely when exposure begins and deactivates when it ends—eliminating idle coverage costs and enabling granular, per-activity pricing that benefits both carriers and policyholders.",
    heroImage: "/images/underwriting/risk-window-hero.jpg",
    icon: "Clock",
    color: "orange",
    marketStats: {
      traditionalMethod: "95%+ of premium covers idle time",
      ourMethod: "100% of premium covers actual exposure",
      improvement: "20x improvement in premium efficiency",
      annualSavings: "$4.1M in eliminated idle coverage costs"
    },
    keyBenefits: [
      {
        title: "Zero Idle Coverage",
        description: "Never pay for periods without actual exposure. Coverage exists only during verified activity.",
        icon: "Target"
      },
      {
        title: "Automatic Activation",
        description: "Coverage starts the moment activity begins—check-in, equipment rental, or race start.",
        icon: "Zap"
      },
      {
        title: "Real-Time Deactivation",
        description: "Coverage ends precisely when activity ends—checkout, return, or finish line.",
        icon: "CheckCircle"
      },
      {
        title: "Condition-Responsive Windows",
        description: "Adjust coverage windows based on weather, facility conditions, or event modifications.",
        icon: "TrendingUp"
      }
    ],
    dataPoints: [
      {
        title: "Activation Triggers",
        description: "Platform events that start coverage: check-ins, bookings, equipment pickups, race starts"
      },
      {
        title: "Deactivation Signals",
        description: "Platform events that end coverage: checkouts, returns, race finishes, appointment completions"
      },
      {
        title: "Grace Periods",
        description: "Configurable buffer times for transitions, warmups, and cooldowns"
      },
      {
        title: "Override Conditions",
        description: "Weather cancellations, facility closures, or event modifications that affect windows"
      },
      {
        title: "Historical Window Data",
        description: "Average activity durations by type for predictive window optimization"
      },
      {
        title: "Real-Time Adjustments",
        description: "Live modifications to coverage windows based on activity extensions or early endings"
      }
    ],
    useCases: [
      {
        vertical: "Fitness & Gyms",
        example: "Member checks in at 6:00 AM, coverage activates; checks out at 7:15 AM, coverage ends",
        benefit: "75-minute coverage window vs 24-hour traditional policy"
      },
      {
        vertical: "Running & Race Events",
        example: "Coverage activates at race start gun; deactivates when participant crosses finish or DNFs",
        benefit: "3-6 hour event window vs weekend-long traditional coverage"
      },
      {
        vertical: "Outdoor & Adventure",
        example: "Kayak rental checkout at 10 AM starts coverage; return at 2 PM ends it",
        benefit: "4-hour rental window vs all-day traditional coverage"
      },
      {
        vertical: "Wellness & MedSpa",
        example: "Client arrives for 90-minute treatment; coverage spans check-in to departure",
        benefit: "2-hour appointment window vs annual policy"
      }
    ],
    comparisonTable: [
      {
        feature: "Coverage Period",
        traditional: "Annual or monthly",
        eventTriggered: "Per-activity (minutes to hours)"
      },
      {
        feature: "Idle Time Covered",
        traditional: "95%+ of policy period",
        eventTriggered: "0%"
      },
      {
        feature: "Premium Utilization",
        traditional: "~5% applied to actual risk",
        eventTriggered: "100% applied to actual risk"
      },
      {
        feature: "Window Adjustment Speed",
        traditional: "Next renewal cycle",
        eventTriggered: "Real-time"
      },
      {
        feature: "Cancellation Handling",
        traditional: "Complex pro-rata refunds",
        eventTriggered: "No coverage = no charge"
      }
    ]
  },
  {
    id: "behavioral-underwriting",
    slug: "behavioral-underwriting",
    title: "Behavioral Underwriting",
    shortTitle: "Behavioral Data",
    tagline: "Participant history, frequency, and activity type inform risk profiles",
    description: "Move beyond demographics to behavior-based risk assessment. Our platform builds comprehensive participant profiles from actual activity patterns, experience levels, and historical engagement—enabling truly personalized pricing that rewards safe behavior and accurately prices higher-risk participants.",
    heroImage: "/images/underwriting/behavioral-hero.jpg",
    icon: "Brain",
    color: "sky",
    marketStats: {
      traditionalMethod: "Age and location-based pricing",
      ourMethod: "Behavior and experience-based pricing",
      improvement: "3.2x more predictive of claims",
      annualSavings: "$1.8M from accurate risk segmentation"
    },
    keyBenefits: [
      {
        title: "Experience-Based Pricing",
        description: "Lower rates for experienced participants with proven track records across activities.",
        icon: "TrendingUp"
      },
      {
        title: "Pattern Recognition",
        description: "Identify high-risk behavior patterns before claims occur through activity analysis.",
        icon: "BarChart3"
      },
      {
        title: "Skill Verification",
        description: "Integrate certifications, training completion, and skill assessments into risk profiles.",
        icon: "CheckCircle"
      },
      {
        title: "Loyalty Rewards",
        description: "Better rates for consistently safe participants with clean activity histories.",
        icon: "Users"
      }
    ],
    dataPoints: [
      {
        title: "Activity Frequency",
        description: "How often participants engage in covered activities across all integrated platforms"
      },
      {
        title: "Experience Progression",
        description: "Advancement through skill levels, class progressions, and difficulty tiers"
      },
      {
        title: "Incident History",
        description: "Prior claims, near-misses, or safety incidents across the participant's activity history"
      },
      {
        title: "Certification Status",
        description: "Current certifications, training completions, and skill verifications"
      },
      {
        title: "Equipment Preferences",
        description: "Familiarity with specific equipment types, rental vs owned, maintenance awareness"
      },
      {
        title: "Time-of-Day Patterns",
        description: "When participants typically engage—peak hours vs off-peak, weekday vs weekend"
      }
    ],
    useCases: [
      {
        vertical: "Fitness & Gyms",
        example: "Regular member (3x/week for 2 years) vs new member; 40% lower premium for proven safe behavior",
        benefit: "Retain low-risk members with competitive pricing while accurately pricing newcomers"
      },
      {
        vertical: "Running & Race Events",
        example: "First-time marathon runner vs experienced runner with 10+ completions; experience-adjusted rates",
        benefit: "First-timers priced for higher medical incident risk; veterans get loyalty discounts"
      },
      {
        vertical: "Outdoor & Adventure",
        example: "Certified climber with 100+ climbs vs beginner; skill-verified pricing tiers",
        benefit: "Guide-supervised beginners priced appropriately; solo experts get self-guided rates"
      },
      {
        vertical: "Wellness & MedSpa",
        example: "Regular client with documented history vs new client; known allergies and preferences tracked",
        benefit: "Returning clients with health profiles priced lower than unknown new clients"
      }
    ],
    comparisonTable: [
      {
        feature: "Risk Factors",
        traditional: "Age, gender, location",
        eventTriggered: "Behavior, experience, history"
      },
      {
        feature: "Pricing Model",
        traditional: "Demographic buckets",
        eventTriggered: "Individual risk scores"
      },
      {
        feature: "Claims Prediction",
        traditional: "~30% accuracy",
        eventTriggered: "~85% accuracy"
      },
      {
        feature: "Profile Updates",
        traditional: "Annual renewal",
        eventTriggered: "Continuous, per-activity"
      },
      {
        feature: "Safe Behavior Incentives",
        traditional: "Generic discounts",
        eventTriggered: "Personalized rewards"
      }
    ]
  },
  {
    id: "verified-participation",
    slug: "verified-participation",
    title: "Verified Participation",
    shortTitle: "Verification",
    tagline: "Biometric check-ins and event triggers eliminate fraud and false claims",
    description: "End the era of fraudulent claims and disputed coverage. Our platform provides cryptographic proof of participation through platform integrations, biometric verification, and event triggers—giving carriers instant claims verification and dramatically reducing investigation costs.",
    heroImage: "/images/underwriting/verified-hero.jpg",
    icon: "ShieldCheck",
    color: "purple",
    marketStats: {
      traditionalMethod: "Trust-based with post-claim investigation",
      ourMethod: "Pre-verified with instant documentation",
      improvement: "87% reduction in fraudulent claims",
      annualSavings: "$3.2M in eliminated fraud and investigation costs"
    },
    keyBenefits: [
      {
        title: "Fraud Elimination",
        description: "Can't claim for activities never attended—every covered activity has verification proof.",
        icon: "Lock"
      },
      {
        title: "Instant Claims Data",
        description: "All activity records available immediately upon claim submission for rapid processing.",
        icon: "Zap"
      },
      {
        title: "Reduced Investigation",
        description: "Automatic verification reduces adjuster time by 80% on average claims.",
        icon: "CheckCircle"
      },
      {
        title: "Lower Reserves",
        description: "Confidence in claim validity allows for optimized reserve requirements.",
        icon: "TrendingUp"
      }
    ],
    dataPoints: [
      {
        title: "Platform Check-Ins",
        description: "Verified arrivals through booking system integrations (Mindbody, FareHarbor, etc.)"
      },
      {
        title: "Biometric Verification",
        description: "Fingerprint, facial recognition, or wearable device confirmation where available"
      },
      {
        title: "GPS Confirmation",
        description: "Location verification matching covered venues, race courses, or activity areas"
      },
      {
        title: "Transaction Records",
        description: "Payment confirmations, rental agreements, and booking receipts"
      },
      {
        title: "Timestamped Photos",
        description: "Race photos, activity images, and event documentation with metadata"
      },
      {
        title: "Third-Party Verification",
        description: "Guide confirmations, instructor sign-offs, and facility staff attestations"
      }
    ],
    useCases: [
      {
        vertical: "Fitness & Gyms",
        example: "Claim for gym injury verified against Mindbody check-in, class roster, and facility camera timestamps",
        benefit: "Instant verification of presence, activity type, and timing—no investigation needed"
      },
      {
        vertical: "Running & Race Events",
        example: "Claim verified against bib activation, GPS tracking, split times, and finish photos",
        benefit: "Complete race participation record available within seconds of claim"
      },
      {
        vertical: "Outdoor & Adventure",
        example: "Claim verified against equipment rental, guide assignment, waiver signature, and return time",
        benefit: "Multi-point verification from booking through activity completion"
      },
      {
        vertical: "Wellness & MedSpa",
        example: "Treatment injury claim verified against appointment, practitioner records, and consent forms",
        benefit: "Complete treatment documentation including practitioner credentials"
      }
    ],
    comparisonTable: [
      {
        feature: "Participation Proof",
        traditional: "Claimant attestation",
        eventTriggered: "Platform-verified records"
      },
      {
        feature: "Fraud Rate",
        traditional: "5-10% of claims",
        eventTriggered: "<0.5% of claims"
      },
      {
        feature: "Investigation Time",
        traditional: "Days to weeks",
        eventTriggered: "Minutes to hours"
      },
      {
        feature: "Investigation Cost",
        traditional: "$500-2,000 per claim",
        eventTriggered: "<$50 per claim"
      },
      {
        feature: "Claim Confidence",
        traditional: "Requires verification",
        eventTriggered: "Pre-verified"
      }
    ]
  }
]

export function getUnderwritingTopic(slug: string): UnderwritingTopicData | undefined {
  return underwritingTopics.find(topic => topic.slug === slug)
}

export function getAllUnderwritingSlugs(): string[] {
  return underwritingTopics.map(topic => topic.slug)
}

export const underwritingIconMap: Record<string, React.ElementType> = {
  Activity,
  Clock,
  Brain,
  ShieldCheck,
  Zap,
  Target,
  TrendingUp,
  LineChart,
  Users,
  Lock,
  CheckCircle,
  BarChart3
}
