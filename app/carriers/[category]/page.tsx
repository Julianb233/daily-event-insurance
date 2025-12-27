import { notFound } from "next/navigation"
import { getCarrierCategory, getAllCarrierCategorySlugs } from "@/lib/carrier-category-data"
import CategoryPageContent from "./CategoryPageContent"
import type { Metadata } from "next"

// Generate static params for all carrier categories
export function generateStaticParams() {
  const slugs = getAllCarrierCategorySlugs()
  return slugs.map((category) => ({
    category,
  }))
}

// Generate dynamic metadata for each category
export async function generateMetadata(
  { params }: { params: Promise<{ category: string }> }
): Promise<Metadata> {
  const { category: categorySlug } = await params
  const category = getCarrierCategory(categorySlug)

  if (!category) {
    return {
      title: "Category Not Found | Daily Event Insurance",
    }
  }

  return {
    title: `${category.title} Insurance for Carriers | Daily Event Insurance`,
    description: category.description,
    openGraph: {
      title: `${category.title} Insurance for Carriers`,
      description: category.tagline,
      type: "website",
    },
  }
}

export default async function CarrierCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category: categorySlug } = await params
  const category = getCarrierCategory(categorySlug)

  if (!category) {
    notFound()
  }

  return <CategoryPageContent category={category} />
}
