import { notFound } from "next/navigation"
import { db, microsites } from "@/lib/db"
import { eq } from "drizzle-orm"
import { MicroSiteForm } from "./_components/MicroSiteForm"
import { Metadata } from "next"

export const dynamic = "force-dynamic"

interface PageProps {
    params: Promise<{
        slug: string
    }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params
    const [microsite] = await db.select().from(microsites).where(eq(microsites.slug, slug)).limit(1)

    if (!microsite) return { title: "Page Not Found" }

    return {
        title: `${microsite.businessName} - Daily Event Insurance`,
        description: `Get event insurance for ${microsite.businessName}. Instant coverage.`,
    }
}

export default async function MicrositePage({ params }: PageProps) {
    const { slug } = await params
    const [microsite] = await db.select().from(microsites).where(eq(microsites.slug, slug)).limit(1)

    if (!microsite || !microsite.isActive) {
        notFound()
    }

    const primaryColor = microsite.primaryColor || "#14B8A6"
    // Use the first branding image as background
    const bgImage = microsite.brandingImages && microsite.brandingImages.length > 0 ? microsite.brandingImages[0] : null

    return (
        <div className="min-h-screen flex flex-col font-sans text-slate-900 relative selection:bg-blue-100 selection:text-blue-900">

            {/* Background Image Layer */}
            <div className="fixed inset-0 z-0">
                {bgImage ? (
                    <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={bgImage} alt="Background" className="w-full h-full object-cover scale-[1.02]" />
                        {/* Refined Gradient: Subtle white vignette to keep focus but allow image to shine */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/40 to-white/20 backdrop-blur-[2px]"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-transparent to-white/40"></div>
                    </>
                ) : (
                    <div className="w-full h-full bg-slate-50"></div>
                )}
            </div>

            {/* Header - Transparent/Minimal */}
            <header className="relative z-10 container mx-auto px-6 py-6 flex items-center justify-between">
                {/* Partner Logo - Left Aligned */}
                <div className="flex items-center gap-4">
                    {microsite.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={microsite.logoUrl}
                            alt={microsite.businessName || "Partner"}
                            className="h-12 md:h-20 w-auto object-contain drop-shadow-lg"
                        />
                    ) : (
                        <span className="text-2xl font-bold tracking-tight">{microsite.businessName}</span>
                    )}
                </div>

                {/* Trust/Powered By - Right Aligned (Subtle) */}
                <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400 bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/40 shadow-sm">
                    Powered by Daily Event Insurance
                </div>
            </header>


            {/* Main Content - Centered Split */}
            <main className="relative z-10 flex-grow container mx-auto px-6 py-8 md:py-16 flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-24">

                {/* Left Column: Welcoming Marketing Copy with Background Blur for readability */}
                <div className="max-w-xl text-center md:text-left">
                    <div className="inline-block px-4 py-1.5 mb-8 text-sm font-bold tracking-wide text-blue-900 bg-white/60 backdrop-blur-md rounded-full border border-white/50 shadow-sm uppercase">
                        Event Coverage Check-In
                    </div>

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-[1] mb-8 drop-shadow-xl filter">
                        Enjoy your day at <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-700 to-indigo-600">
                            {microsite.businessName}
                        </span>
                    </h1>

                    <div className="bg-white/40 backdrop-blur-md p-6 rounded-2xl border border-white/30 shadow-sm mb-10">
                        <p className="text-xl md:text-2xl text-slate-800 font-medium leading-relaxed drop-shadow-sm">
                            We've partnered with Daily Event Insurance to keep you safe. Please take a moment to activate your coverage below.
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-4 text-sm font-bold text-slate-700">
                        <div className="flex items-center gap-2 bg-white/70 px-4 py-2 rounded-xl shadow-sm border border-white/50">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse"></div>
                            Active Coverage
                        </div>
                        <div className="flex items-center gap-2 bg-white/70 px-4 py-2 rounded-xl shadow-sm border border-white/50">
                            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                            Instant Approval
                        </div>
                    </div>
                </div>


                {/* Right Column: Activation Form */}
                <div className="w-full max-w-md relative">
                    <div className="absolute inset-0 bg-white/40 blur-3xl rounded-full transform scale-110"></div>

                    <div className="relative bg-white/80 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/60 overflow-hidden">
                        <div className="px-8 py-6 border-b border-gray-100/50 bg-white/50 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">Guest Check-In</h2>
                                <p className="text-sm text-slate-500 font-medium">Activate your visitor coverage</p>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs ring-4 ring-white">
                                1
                            </div>
                        </div>

                        <div className="p-8">
                            <MicroSiteForm primaryColor={primaryColor} businessName={microsite.businessName || "our facility"} />
                        </div>
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-2 opacity-60">
                        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest bg-white/50 px-3 py-1 rounded-full">
                            Secure 256-bit SSL
                        </div>
                    </div>
                </div>

            </main>

        </div>
    )
}
