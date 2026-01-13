import postgres from "postgres"
import { drizzle } from "drizzle-orm/postgres-js"
import { partnerResources } from "../lib/db/schema"
import { config } from "dotenv"

config({ path: ".env.local" })

const client = postgres(process.env.DATABASE_URL!, { prepare: false })
const db = drizzle(client)

const resources = [
  // Marketing
  {
    title: "Partner Logo Pack",
    description: "High-resolution logos in various formats (PNG, SVG, PDF) for use in your marketing materials.",
    category: "marketing",
    resourceType: "image",
    fileUrl: "/resources/logo-pack.zip",
    thumbnailUrl: "/images/resources/logo-pack-thumb.png",
    sortOrder: 1,
  },
  {
    title: "Social Media Templates",
    description: "Ready-to-use social media post templates for Instagram, Facebook, and Twitter.",
    category: "marketing",
    resourceType: "image",
    fileUrl: "/resources/social-templates.zip",
    thumbnailUrl: "/images/resources/social-thumb.png",
    sortOrder: 2,
  },
  {
    title: "Email Templates",
    description: "Professional email templates to announce insurance offerings to your members.",
    category: "marketing",
    resourceType: "pdf",
    fileUrl: "/resources/email-templates.pdf",
    thumbnailUrl: "/images/resources/email-thumb.png",
    sortOrder: 3,
  },
  {
    title: "Promotional Flyer",
    description: "Print-ready flyer to display at your facility or include in welcome packets.",
    category: "marketing",
    resourceType: "pdf",
    fileUrl: "/resources/promo-flyer.pdf",
    thumbnailUrl: "/images/resources/flyer-thumb.png",
    sortOrder: 4,
  },
  // Training
  {
    title: "Integration Walkthrough",
    description: "Step-by-step video guide on setting up the insurance widget on your website.",
    category: "training",
    resourceType: "video",
    fileUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl: "/images/resources/video-thumb.png",
    sortOrder: 1,
  },
  {
    title: "Staff Training Guide",
    description: "Training materials to help your staff explain insurance options to members.",
    category: "training",
    resourceType: "pdf",
    fileUrl: "/resources/staff-training.pdf",
    thumbnailUrl: "/images/resources/training-thumb.png",
    sortOrder: 2,
  },
  {
    title: "Best Practices Webinar",
    description: "Recording of our monthly partner best practices webinar.",
    category: "training",
    resourceType: "video",
    fileUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl: "/images/resources/webinar-thumb.png",
    sortOrder: 3,
  },
  // Documentation
  {
    title: "Partner Handbook",
    description: "Comprehensive guide to the partner program, policies, and procedures.",
    category: "documentation",
    resourceType: "pdf",
    fileUrl: "/resources/partner-handbook.pdf",
    thumbnailUrl: "/images/resources/handbook-thumb.png",
    sortOrder: 1,
  },
  {
    title: "API Documentation",
    description: "Technical documentation for API integration partners.",
    category: "documentation",
    resourceType: "link",
    fileUrl: "https://docs.dailyeventinsurance.com/api",
    thumbnailUrl: "/images/resources/api-thumb.png",
    sortOrder: 2,
  },
  {
    title: "FAQ Document",
    description: "Frequently asked questions about the partner program and insurance products.",
    category: "documentation",
    resourceType: "pdf",
    fileUrl: "/resources/faq.pdf",
    thumbnailUrl: "/images/resources/faq-thumb.png",
    sortOrder: 3,
  },
]

async function seed() {
  console.log("Seeding partner resources...")

  try {
    // Clear existing resources
    await db.delete(partnerResources)

    // Insert new resources
    await db.insert(partnerResources).values(resources)

    console.log(`Seeded ${resources.length} partner resources`)
  } catch (error) {
    console.error("Error seeding resources:", error)
    process.exit(1)
  }
}

seed().then(async () => {
  console.log("Done!")
  await client.end()
  process.exit(0)
})
