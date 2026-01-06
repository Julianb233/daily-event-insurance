
import { notFound } from "next/navigation"
import { db, microsites, partners, partnerProducts } from "@/lib/db"
import { eq } from "drizzle-orm"
import { Metadata } from "next"
import MicroSiteForm from "./_components/MicroSiteForm"

// Force dynamic rendering since we depend on params
export const dynamic = "force-dynamic"

interface PageProps {
    params: Promise<{
        slug: string
    }>
}

// Helper to generate color palette from primary color
function generatePalette(primaryColor: string) {
    const hex = primaryColor.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)

    const lighten = (value: number, amount: number) => Math.min(255, Math.round(value + (255 - value) * amount))
    const darken = (value: number, amount: number) => Math.round(value * (1 - amount))

    const lightR = lighten(r, 0.3)
    const lightG = lighten(g, 0.3)
    const lightB = lighten(b, 0.3)

    const darkR = darken(r, 0.2)
    const darkG = darken(g, 0.2)
    const darkB = darken(b, 0.2)

    return {
        primary: primaryColor,
        secondary: `#${lightR.toString(16).padStart(2, '0')}${lightG.toString(16).padStart(2, '0')}${lightB.toString(16).padStart(2, '0')}`,
        accent: `#${darkR.toString(16).padStart(2, '0')}${darkG.toString(16).padStart(2, '0')}${darkB.toString(16).padStart(2, '0')}`,
        gradient: `linear-gradient(135deg, ${primaryColor}15 0%, ${primaryColor}05 50%, #f8fafc 100%)`
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params
    const microsite = await db!
        .select()
        .from(microsites)
        .where(eq(microsites.subdomain, slug))
        .limit(1)

    if (!microsite.length) {
        return {
            title: "Page Not Found",
        }
    }

    return {
        title: `${microsite[0].siteName} | Member Check-In`,
        description: "Activate your included accident and medical coverage.",
    }
}

export default async function MicrositePage({ params }: PageProps) {
    const { slug } = await params
    // Fetch microsite data
    const result = await db!
        .select({
            microsite: microsites,
            partner: partners,
        })
        .from(microsites)
        .innerJoin(partners, eq(microsites.partnerId, partners.id))
        .where(eq(microsites.subdomain, slug))
        .limit(1)

    if (!result.length) {
        notFound()
    }

    const { microsite, partner } = result[0]
    const colors = generatePalette(microsite.primaryColor || "#14B8A6")
    const qrCodeUrl = microsite.qrCodeUrl || "/placeholder-qr.png" // Safe default or handle null
    const logoUrl = microsite.logoUrl || partner.logoUrl || "/placeholder-logo.png"

    // Business specific copy
    const businessCopy: Record<string, { headline: string; subtitle: string }> = {
        gym: { headline: 'Protect Your Workout', subtitle: 'Get accident and medical coverage for your gym session today' },
        climbing: { headline: 'Climb With Confidence', subtitle: 'Instant accident and medical coverage for your climbing session' },
        yoga: { headline: 'Practice Peace of Mind', subtitle: 'Accident and medical protection for your yoga session' },
        rental: { headline: 'Rent With Protection', subtitle: 'Coverage for your equipment rental today' },
        fitness: { headline: 'Train With Confidence', subtitle: 'Same-day accident and medical coverage for your activity' },
        other: { headline: 'Get Protected Today', subtitle: 'Instant event accident and medical coverage' }
    }

    const copy = businessCopy[partner.businessType] || businessCopy.other

    return (
        <div className="min-h-screen relative overflow-hidden text-slate-900 font-sans flex items-center justify-center p-4"
            style={{ background: colors.gradient }}>

            {/* Background Orbs */}
            <div
                className="fixed rounded-full blur-[80px] opacity-40 animate-float pointer-events-none"
                style={{ width: 600, height: 600, background: `${colors.primary}40`, top: -200, right: -200 }}
            />
            <div
                className="fixed rounded-full blur-[80px] opacity-40 animate-float pointer-events-none"
                style={{ width: 400, height: 400, background: `${colors.secondary}60`, bottom: -100, left: -100, animationDelay: '-7s' }}
            />

            <div className="w-full max-w-[480px] relative z-10">
                <div className="glass-card rounded-[32px] overflow-hidden shadow-2xl border border-white/50 backdrop-blur-xl bg-white/80">

                    <div className="text-center pt-10 pb-8 px-8 bg-gradient-to-b from-white/50 to-transparent">
                        <div className="w-[100px] h-[100px] mx-auto bg-white rounded-3xl flex items-center justify-center shadow-md mb-6 p-4">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={logoUrl} alt={microsite.siteName} className="w-full h-full object-contain" />
                        </div>
                        <h1 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-700"
                            style={{ backgroundImage: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)` }}>
                            {copy.headline}
                        </h1>
                        <p className="text-slate-500">{copy.subtitle}</p>

                        <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full text-white font-semibold text-sm shadow-sm"
                            style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)` }}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            Included with Membership
                        </div>
                    </div>

                    <div className="p-8 pt-0">
                        <MicroSiteForm
                            partnerId={partner.id}
                            micrositeUrl={`https://dailyeventinsurance.com/${slug}`}
                            colors={colors}
                        />
                    </div>

                    <div className="text-center pb-8 px-8">
                        <div className="relative flex items-center py-4">
                            <div className="flex-grow border-t border-slate-200"></div>
                            <span className="flex-shrink-0 mx-4 text-slate-400 text-sm">or scan QR code</span>
                            <div className="flex-grow border-t border-slate-200"></div>
                        </div>

                        <div className="bg-white p-3 rounded-2xl shadow-sm inline-block border border-slate-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={qrCodeUrl} alt="QR Code" className="w-24 h-24 object-contain" />
                        </div>
                    </div>

                    <div className="py-4 text-center bg-slate-50 border-t border-slate-100">
                        <p className="text-xs text-slate-400">Powered by <a href="https://dailyeventinsurance.com" className="hover:text-teal-600 transition-colors">Daily Event Insurance</a></p>
                    </div>

                </div>
            </div>

            <style>{`
        .glass-card {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
      `}</style>
        </div>
    )
}
