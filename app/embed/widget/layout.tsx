/**
 * Widget Embed Layout
 *
 * Minimal layout for the embeddable insurance widget iframe.
 * No navigation, headers, or other chrome - just the widget content.
 */

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Daily Event Insurance Widget",
  description: "Embedded insurance quote widget",
  robots: "noindex, nofollow", // Don't index widget iframe
}

export default function WidgetLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-transparent m-0 p-0 overflow-hidden">
        {children}
      </body>
    </html>
  )
}
