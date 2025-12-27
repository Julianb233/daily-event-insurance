import { Dumbbell, Mountain, Trophy, Sparkles, Bike, Waves, Snowflake, Tent, Package } from "lucide-react"

export interface CarrierCategoryData {
  id: string
  slug: string
  title: string
  shortTitle: string
  tagline: string
  description: string
  heroImage: string
  icon: string
  color: "teal" | "sky" | "purple" | "orange"

  // Market stats for carriers
  marketStats: {
    marketSize: string
    annualGrowth: string
    optInRate: string
    avgPremium: string
    claimsFrequency: string
  }

  // Policy advantages
  policyAdvantages: {
    title: string
    description: string
    icon: string
  }[]

  // Data insights carriers receive
  dataInsights: {
    title: string
    description: string
  }[]

  // Platform integrations in this vertical
  platforms: string[]

  // Underwriting benefits
  underwritingBenefits: string[]

  // Risk profile
  riskProfile: {
    category: string
    description: string
    mitigationFactors: string[]
  }
}

export const carrierCategories: CarrierCategoryData[] = [
  {
    id: "fitness-gyms",
    slug: "fitness-gyms",
    title: "Fitness & Gyms",
    shortTitle: "Fitness",
    tagline: "Tap into the $96B fitness industry with real-time workout data",
    description: "Access the massive fitness market with unprecedented visibility into member activity, class attendance, and equipment usage. Our gym integrations provide real-time data that enables precise underwriting and risk-appropriate pricing.",
    heroImage: "/images/categories/fitness-gyms-hero.jpg",
    icon: "Dumbbell",
    color: "teal",
    marketStats: {
      marketSize: "$96.7B",
      annualGrowth: "8.7%",
      optInRate: "68%",
      avgPremium: "$4.50/day",
      claimsFrequency: "0.3%"
    },
    policyAdvantages: [
      {
        title: "Pre-Underwritten Policies",
        description: "Policies are pre-approved based on facility safety ratings and equipment maintenance records.",
        icon: "Shield"
      },
      {
        title: "Activity-Based Pricing",
        description: "Price policies based on actual workout type, duration, and intensity level.",
        icon: "Activity"
      },
      {
        title: "Real-Time Risk Assessment",
        description: "Monitor class sizes, trainer certifications, and equipment status in real-time.",
        icon: "Eye"
      },
      {
        title: "Automated Claims Prevention",
        description: "Waiver verification and safety protocol compliance checked before coverage activates.",
        icon: "CheckCircle"
      }
    ],
    dataInsights: [
      {
        title: "Member Demographics",
        description: "Age, fitness level, workout history, and injury risk profiles"
      },
      {
        title: "Facility Metrics",
        description: "Equipment age, maintenance records, safety certifications, staff training"
      },
      {
        title: "Activity Patterns",
        description: "Class attendance, peak hours, equipment usage, workout intensity"
      },
      {
        title: "Historical Claims",
        description: "Injury types, causes, frequency, and resolution outcomes by activity type"
      }
    ],
    platforms: ["Mindbody", "ClubReady", "ABC Fitness", "Zen Planner", "Wodify", "PushPress"],
    underwritingBenefits: [
      "Lower claims frequency than traditional liability (0.3% vs 2.1%)",
      "Pre-verified waiver completion before coverage activation",
      "Real-time facility safety compliance monitoring",
      "Trainer certification and CPR status verification",
      "Equipment maintenance and inspection records"
    ],
    riskProfile: {
      category: "Low-Medium",
      description: "Controlled indoor environment with trained staff and safety protocols",
      mitigationFactors: [
        "Mandatory waiver completion",
        "Certified trainers on-site",
        "Regular equipment inspections",
        "Emergency response protocols"
      ]
    }
  },
  {
    id: "race-events",
    slug: "race-events",
    title: "Running & Race Events",
    shortTitle: "Races",
    tagline: "Cover 35M+ annual race participants with event-specific policies",
    description: "The running and race event industry represents a massive, underserved market. Our race registration integrations enable per-participant, per-event coverage with complete visibility into course conditions, medical support, and participant fitness levels.",
    heroImage: "/images/categories/race-events-hero.jpg",
    icon: "Trophy",
    color: "orange",
    marketStats: {
      marketSize: "$14.8B",
      annualGrowth: "12.3%",
      optInRate: "72%",
      avgPremium: "$8.50/event",
      claimsFrequency: "0.8%"
    },
    policyAdvantages: [
      {
        title: "Per-Participant Pricing",
        description: "Individual coverage priced by race distance, terrain difficulty, and participant experience.",
        icon: "Users"
      },
      {
        title: "Event-Specific Underwriting",
        description: "Policies tailored to marathon, 5K, trail run, or obstacle course risk profiles.",
        icon: "Map"
      },
      {
        title: "Weather-Adjusted Rates",
        description: "Real-time weather monitoring enables dynamic pricing for heat, cold, or storm conditions.",
        icon: "Cloud"
      },
      {
        title: "Medical Support Verification",
        description: "Coverage tied to verified on-course medical stations and emergency response plans.",
        icon: "Heart"
      }
    ],
    dataInsights: [
      {
        title: "Participant Profiles",
        description: "Age, experience level, prior race history, training data from connected apps"
      },
      {
        title: "Course Analytics",
        description: "Terrain difficulty, elevation changes, hazard points, historical incident locations"
      },
      {
        title: "Event Infrastructure",
        description: "Medical stations, hydration points, communication systems, evacuation routes"
      },
      {
        title: "Environmental Factors",
        description: "Real-time weather, air quality, temperature, and humidity monitoring"
      }
    ],
    platforms: ["RunSignUp", "Active.com", "Athlinks", "Chronotrack", "RaceRoster", "Ultrasignup"],
    underwritingBenefits: [
      "Complete participant roster with emergency contacts pre-event",
      "Course permit and safety inspection documentation",
      "Medical staff credentials and emergency protocols",
      "Historical incident data by course segment",
      "Real-time GPS tracking of all participants"
    ],
    riskProfile: {
      category: "Medium",
      description: "Outdoor events with variable conditions but structured safety protocols",
      mitigationFactors: [
        "Required medical stations every 2 miles",
        "Mandatory check-in/check-out systems",
        "Course marshals and communication systems",
        "Participant health attestations"
      ]
    }
  },
  {
    id: "activity-based",
    slug: "activity-based",
    title: "Outdoor & Adventure",
    shortTitle: "Adventure",
    tagline: "Underwrite adventure activities with real-time safety data",
    description: "From climbing gyms to ski resorts, kayak rentals to guided tours - outdoor adventure represents high-value premium opportunities. Our integrations provide equipment status, weather conditions, guide certifications, and participant skill levels for precise risk assessment.",
    heroImage: "/images/categories/activity-based-hero.jpg",
    icon: "Mountain",
    color: "sky",
    marketStats: {
      marketSize: "$683B",
      annualGrowth: "15.2%",
      optInRate: "74%",
      avgPremium: "$12.50/day",
      claimsFrequency: "1.2%"
    },
    policyAdvantages: [
      {
        title: "Equipment-Verified Coverage",
        description: "Policies activated only after equipment inspection and safety gear verification.",
        icon: "Wrench"
      },
      {
        title: "Guide-Certified Rates",
        description: "Lower premiums for activities led by certified, experienced guides with safety records.",
        icon: "Award"
      },
      {
        title: "Skill-Based Underwriting",
        description: "Price policies based on participant skill level, certifications, and experience history.",
        icon: "TrendingUp"
      },
      {
        title: "Condition-Responsive Pricing",
        description: "Dynamic rates based on real-time weather, water levels, snow conditions, and visibility.",
        icon: "Thermometer"
      }
    ],
    dataInsights: [
      {
        title: "Equipment Telemetry",
        description: "Rental equipment age, maintenance history, inspection records, usage hours"
      },
      {
        title: "Guide Credentials",
        description: "Certifications, first-aid training, years of experience, incident history"
      },
      {
        title: "Participant Skills",
        description: "Skill assessments, lesson history, prior activity experience, certifications"
      },
      {
        title: "Environmental Conditions",
        description: "Weather forecasts, water levels, avalanche risk, trail conditions, visibility"
      }
    ],
    platforms: ["FareHarbor", "Peek", "Rezdy", "Checkfront", "Xola", "BookingBoss"],
    underwritingBenefits: [
      "Real-time equipment inspection and maintenance verification",
      "Guide certification and safety training documentation",
      "Participant skill assessments and lesson completion records",
      "Weather and condition monitoring with auto-policy adjustments",
      "GPS tracking and emergency beacon integration"
    ],
    riskProfile: {
      category: "Medium-High",
      description: "Inherently riskier activities mitigated by professional oversight and safety systems",
      mitigationFactors: [
        "Professional guide supervision",
        "Required safety equipment and training",
        "Real-time condition monitoring",
        "Emergency response protocols and equipment"
      ]
    }
  },
  {
    id: "aesthetic-wellness",
    slug: "aesthetic-wellness",
    title: "Wellness & MedSpa",
    shortTitle: "Wellness",
    tagline: "Cover the $1.8T wellness industry with practitioner-verified policies",
    description: "The wellness and medical spa industry is booming, with consumers seeking everything from massage to aesthetic treatments. Our integrations verify practitioner credentials, treatment protocols, and facility certifications for accurate risk assessment.",
    heroImage: "/images/categories/aesthetic-wellness-hero.jpg",
    icon: "Sparkles",
    color: "purple",
    marketStats: {
      marketSize: "$1.8T",
      annualGrowth: "9.9%",
      optInRate: "61%",
      avgPremium: "$6.50/treatment",
      claimsFrequency: "0.5%"
    },
    policyAdvantages: [
      {
        title: "Practitioner-Verified Coverage",
        description: "Policies linked to verified practitioner licenses, certifications, and malpractice records.",
        icon: "BadgeCheck"
      },
      {
        title: "Treatment-Specific Pricing",
        description: "Rates calibrated to specific treatment types, from massage to injectable aesthetics.",
        icon: "Syringe"
      },
      {
        title: "Facility Compliance Monitoring",
        description: "Real-time verification of health department inspections and equipment sterilization.",
        icon: "Building"
      },
      {
        title: "Client Health Screening",
        description: "Pre-treatment health questionnaires and contraindication checks before coverage activates.",
        icon: "FileCheck"
      }
    ],
    dataInsights: [
      {
        title: "Practitioner Credentials",
        description: "Licenses, certifications, specializations, malpractice history, continuing education"
      },
      {
        title: "Treatment Protocols",
        description: "Procedure types, equipment used, product ingredients, contraindications"
      },
      {
        title: "Facility Compliance",
        description: "Health inspections, sterilization logs, equipment maintenance, staff certifications"
      },
      {
        title: "Client Profiles",
        description: "Health history, allergies, prior treatments, consent documentation"
      }
    ],
    platforms: ["Vagaro", "Booker", "Boulevard", "Meevo", "Phorest", "Zenoti"],
    underwritingBenefits: [
      "Real-time practitioner license verification",
      "Treatment protocol and product documentation",
      "Health department inspection records",
      "Client health screening and consent verification",
      "Equipment calibration and sterilization logs"
    ],
    riskProfile: {
      category: "Low-Medium",
      description: "Professional services with licensed practitioners and controlled environments",
      mitigationFactors: [
        "Licensed and insured practitioners",
        "Regulated treatment protocols",
        "Mandatory health screenings",
        "Sterilization and safety compliance"
      ]
    }
  }
]

export function getCarrierCategory(slug: string): CarrierCategoryData | undefined {
  return carrierCategories.find(cat => cat.slug === slug)
}

export function getAllCarrierCategorySlugs(): string[] {
  return carrierCategories.map(cat => cat.slug)
}

export const carrierCategoryIconMap: Record<string, React.ElementType> = {
  Dumbbell,
  Mountain,
  Trophy,
  Sparkles,
  Bike,
  Waves,
  Snowflake,
  Tent,
  Package
}
