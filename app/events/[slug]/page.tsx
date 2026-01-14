import { notFound } from "next/navigation"
import { db, microsites } from "@/lib/db"
import { eq } from "drizzle-orm"
import { MicroSiteForm } from "./_components/MicroSiteForm"
import { Metadata } from "next"

// Force dynamic rendering to ensure fresh data from DB
export const dynamic = "force-dynamic"

interface PageProps {
    params: Promise<{
        slug: string
    }>
}

// Generate metadata for the microsite
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params

    const [microsite] = await db
        .select()
        .from(microsites)
        .where(eq(microsites.slug, slug))
        .limit(1)

    if (!microsite) {
        return {
            title: "Page Not Found",
        }
    }

    return {
        title: `${microsite.businessName} - Daily Event Insurance`,
        description: `Get event insurance for ${microsite.businessName}. Instant coverage, zero deductible, 100% compliant.`,
    }
}

export default async function MicrositePage({ params }: PageProps) {
    const { slug } = await params
    console.log("🔍 MicrositePage hit with slug:", slug)

    const [microsite] = await db
        .select()
        .from(microsites)
        .where(eq(microsites.slug, slug))
        .limit(1)

    console.log("🔍 Microsite DB Result:", microsite ? `Found (Active: ${microsite.isActive})` : "Not Found")

    if (!microsite || !microsite.isActive) {
        console.log("❌ Microsite 404 triggered")
        notFound()
    }

    // Determine colors from DB or default
    const primaryColor = microsite.primaryColor || "#14B8A6" // Default teal

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header with Business Branding */}
            <header className="bg-white border-b border-slate-200">
                <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {microsite.logoUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={microsite.logoUrl} alt={microsite.businessName || "Business Logo"} className="h-10 w-auto object-contain" />
                        ) : (
                            <div className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold text-xl" style={{ backgroundColor: primaryColor }}>
                                {microsite.businessName?.charAt(0) || "B"}
                            </div>
                        )}
                        <span className="font-bold text-xl text-slate-900">{microsite.businessName}</span>
                    </div>
                    <div className="hidden md:flex items-center gap-2 text-sm text-slate-500">
                        <span>Powered by</span>
                        <span className="font-bold text-slate-700">Daily Event Insurance</span>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                        {/* Hero Banner Area */}
                        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-8 md:p-12 text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>

                            <h1 className="text-3xl md:text-5xl font-black mb-4 relative z-10">
                                Official Event Insurance
                            </h1>
                            <p className="text-lg text-slate-300 max-w-2xl mx-auto relative z-10">
                                Required coverage for events at <span className="text-white font-bold border-b-2 border-dashed" style={{ borderColor: primaryColor }}>{microsite.businessName}</span>
                            </p>
                        </div>

                        {/* Form Section */}
                        <div className="p-8 md:p-12">
                            <div className="text-center mb-10">
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">Get Your Certificate Instantly</h2>
                                <p className="text-slate-600">Select your activity type to verify coverage requirements</p>
                            </div>

                            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                                <MicroSiteForm primaryColor={primaryColor} businessName={microsite.businessName || "Our Facility"} />
                            </div>
                        </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center opacity-60 grayscale hover:grayscale-0 transition-all">
                        {/* Placeholders for trust badges */}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 py-8 mt-12">
                <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} Daily Event Insurance. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}
