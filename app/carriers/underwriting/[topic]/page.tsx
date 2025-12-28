import { notFound } from "next/navigation"
import { getUnderwritingTopic, getAllUnderwritingSlugs } from "@/lib/underwriting-data"
import UnderwritingTopicContent from "./UnderwritingTopicContent"
import type { Metadata } from "next"

// Generate static params for all underwriting topics
export function generateStaticParams() {
  const slugs = getAllUnderwritingSlugs()
  return slugs.map((topic) => ({
    topic,
  }))
}

// Generate dynamic metadata for each topic
export async function generateMetadata(
  { params }: { params: Promise<{ topic: string }> }
): Promise<Metadata> {
  const { topic: topicSlug } = await params
  const topic = getUnderwritingTopic(topicSlug)

  if (!topic) {
    return {
      title: "Topic Not Found | Daily Event Insurance",
    }
  }

  return {
    title: `${topic.title} for Insurance Underwriting | Daily Event Insurance`,
    description: topic.description,
    openGraph: {
      title: `${topic.title} for Insurance Underwriting`,
      description: topic.tagline,
      type: "website",
    },
  }
}

export default async function UnderwritingTopicPage({
  params,
}: {
  params: Promise<{ topic: string }>
}) {
  const { topic: topicSlug } = await params
  const topic = getUnderwritingTopic(topicSlug)

  if (!topic) {
    notFound()
  }

  return <UnderwritingTopicContent topic={topic} />
}
