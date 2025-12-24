import type React from "react"
import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Roboto, Libre_Baskerville, Alex_Brush, Oswald } from "next/font/google"
import SmoothScroll from "@/components/smooth-scroll"
import "./globals.css"

const roboto = Roboto({
  weight: ["300", "400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
})

const alexBrush = Alex_Brush({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-alex-brush",
  display: "swap",
})

const libreBaskerville = Libre_Baskerville({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-libre-baskerville",
  display: "swap",
})

const oswald = Oswald({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://dailyeventinsurance.com"),
  title: "Daily Event Insurance | Same-Day Coverage for Business Members",
  description:
    "Enable your gym, climbing facility, or rental business to offer instant insurance protection to members. New revenue stream, reduced liability, member convenience.",
  keywords: [
    "event insurance",
    "same-day insurance",
    "gym insurance",
    "climbing facility insurance",
    "rental insurance",
    "member coverage",
    "business insurance",
    "HiQOR",
    "instant insurance",
    "liability coverage",
    "member benefits",
    "revenue stream"
  ],
  authors: [{ name: "HiQOR" }],
  creator: "HiQOR",
  publisher: "Daily Event Insurance",
  openGraph: {
    title: "Daily Event Insurance | Same-Day Coverage for Business Members",
    description: "Enable your gym, climbing facility, or rental business to offer instant insurance protection to members. New revenue stream, reduced liability, member convenience.",
    url: "https://dailyeventinsurance.com",
    siteName: "Daily Event Insurance",
    images: [
      {
        url: "/images/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Daily Event Insurance - Same-Day Coverage for Active Businesses",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daily Event Insurance | Same-Day Coverage",
    description: "Enable your business to offer instant insurance protection to members. New revenue stream, reduced liability.",
    images: ["/images/og-image.svg"],
  },
  icons: {
    icon: [
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/images/dei-logo-icon.svg",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "InsuranceAgency",
    "name": "Daily Event Insurance",
    "description": "Same-day event insurance for gyms, climbing facilities, and rental businesses. Enable your business to offer instant insurance protection to members.",
    "url": "https://dailyeventinsurance.com",
    "logo": "https://dailyeventinsurance.com/images/dei-logo.svg",
    "image": "https://dailyeventinsurance.com/images/og-image.svg",
    "provider": {
      "@type": "Organization",
      "name": "HiQOR",
      "description": "Insurance technology platform enabling businesses to offer same-day coverage to members"
    },
    "areaServed": {
      "@type": "Country",
      "name": "United States"
    },
    "serviceType": [
      "Event Insurance",
      "Same-Day Insurance",
      "Gym Insurance",
      "Climbing Facility Insurance",
      "Rental Insurance",
      "Member Liability Coverage",
      "Business Insurance Solutions"
    ],
    "offers": {
      "@type": "Offer",
      "description": "Instant same-day insurance coverage for gym members, climbing facility users, and rental customers. White-label solution for businesses to offer insurance protection and generate new revenue.",
      "areaServed": "United States",
      "availability": "https://schema.org/InStock",
      "businessFunction": "https://schema.org/ProvideService"
    },
    "audience": {
      "@type": "BusinessAudience",
      "audienceType": "Gyms, Climbing Facilities, Rental Businesses"
    }
  }

  return (
    <html lang="en" className="bg-white overflow-x-hidden">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`font-sans antialiased overflow-x-hidden bg-white ${roboto.variable} ${libreBaskerville.variable} ${alexBrush.variable} ${oswald.variable}`}
      >
        <SmoothScroll>{children}</SmoothScroll>
        <Analytics />
      </body>
    </html>
  )
}
