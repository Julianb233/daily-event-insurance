
import { notFound } from "next/navigation"
import { db, microsites, partners } from "@/lib/db"
import { eq } from "drizzle-orm"
import { Metadata } from "next"

// Force dynamic rendering since we depend on params
export const dynamic = "force-dynamic"

interface PageProps {
    params: {
        slug: string
    }
}

// Helper to generate color palette from primary color
function generatePalette(primaryColor: string) {
    // Simple hex processing helper
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
        gradient: `linear-gradient(135deg, ${primaryColor}20 0%, ${primaryColor}05 50%, #ffffff 100%)`
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const microsite = await db
        .select()
        .from(microsites)
        .where(eq(microsites.subdomain, params.slug))
        .limit(1)

    if (!microsite.length) {
        return {
            title: "Page Not Found",
        }
    }

    return {
        title: `${microsite[0].siteName} | Event Insurance`,
        description: "Get instant accident and medical coverage for your activity.",
    }
}

export default async function MicrositePage({ params }: PageProps) {
    // Fetch microsite data
    const result = await db
        .select({
            microsite: microsites,
            partner: partners,
        })
        .from(microsites)
        .innerJoin(partners, eq(microsites.partnerId, partners.id))
        .where(eq(microsites.subdomain, params.slug))
        .limit(1)

    if (!result.length) {
        notFound()
    }

    const { microsite, partner } = result[0]
    const colors = generatePalette(microsite.primaryColor || "#14B8A6")
    const qrCodeUrl = microsite.qrCodeUrl || "/placeholder-qr.png"
    const logoUrl = microsite.logoUrl || partner.logoUrl || "/placeholder-logo.png"

    return (
        <div className="min-h-screen relative overflow-hidden text-slate-900 font-sans" style={{ background: colors.gradient }}>

            {/* Background Orbs */}
            <div
                className="fixed rounded-full blur-[80px] opacity-40 animate-float pointer-events-none"
                style={{ width: 600, height: 600, background: `${colors.primary}40`, top: -200, right: -200 }}
            />
            <div
                className="fixed rounded-full blur-[80px] opacity-40 animate-float pointer-events-none"
                style={{ width: 400, height: 400, background: `${colors.secondary}60`, bottom: -100, left: -100, animationDelay: '-7s' }}
            />
            <div
                className="fixed rounded-full blur-[80px] opacity-30 animate-float pointer-events-none"
                style={{ width: 300, height: 300, background: `${colors.accent}30`, top: '50%', left: '50%', animationDelay: '-14s', transform: 'translate(-50%, -50%)' }}
            />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Header */}
                <header className="text-center mb-12">
                    <div className="glass-card inline-block p-8 rounded-3xl mb-8">
                        <div className="w-32 h-32 mx-auto bg-white rounded-2xl flex items-center justify-center shadow-lg mb-6 overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={logoUrl} alt={microsite.siteName} className="max-w-[80%] max-h-[80%] object-contain" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 mb-2"
                            style={{ backgroundImage: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)` }}>
                            {microsite.siteName}
                        </h1>
                        <p className="text-lg text-slate-500 font-medium">Partnered with Daily Event Insurance</p>
                    </div>
                </header>

                {/* Hero */}
                <div className="glass-card rounded-[32px] p-8 md:p-16 text-center mb-12 relative overflow-hidden backdrop-blur-xl bg-white/70 border border-white/50 shadow-xl">
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Protect Your Activity Today</h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
                            Get instant accident and medical coverage for your next adventure.
                        </p>

                        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold text-lg mb-10 shadow-lg"
                            style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)` }}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                            Starting at just $4.99
                        </div>

                        <br />

                        <a href={`/${params.slug}/quote`}
                            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-white font-bold text-xl shadow-xl hover:-translate-y-1 transition-transform duration-300"
                            style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)` }}>
                            Get Covered Now
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7"></path></svg>
                        </a>
                    </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {[
                        { title: "Instant Coverage", desc: "Get your policy in under 2 minutes. Coverage starts immediately.", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path> },
                        { title: "Full Protection", desc: "Comprehensive accident and medical coverage for accidents and injuries.", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path> },
                        { title: "Easy Claims", desc: "Simple online claims process if you ever need it.", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path> }
                    ].map((feature, i) => (
                        <div key={i} className="glass-card rounded-[24px] p-8 text-center backdrop-blur-xl bg-white/70 border border-white/50 shadow-lg hover:-translate-y-1 transition-transform duration-300">
                            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center"
                                style={{ background: `linear-gradient(135deg, ${colors.primary}20 0%, ${colors.secondary}30 100%)`, color: colors.primary }}>
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">{feature.icon}</svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                            <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>

                {/* QR Code */}
                <div className="glass-card max-w-2xl mx-auto rounded-[32px] p-12 text-center backdrop-blur-xl bg-white/80 border border-white/50 shadow-xl">
                    <h3 className="text-2xl font-bold text-slate-900 mb-6">Scan to Get Started</h3>
                    <div className="w-[240px] h-[240px] mx-auto mb-6 p-4 bg-white rounded-3xl shadow-inner border border-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={qrCodeUrl} alt="QR Code" className="w-full h-full object-contain" />
                    </div>
                    <p className="text-slate-500">Scan using your mobile phone camera</p>
                </div>

                <footer className="text-center mt-16 text-slate-400 text-sm">
                    <p>Powered by <a href="https://dailyeventinsurance.com" className="hover:text-teal-500 transition-colors">Daily Event Insurance</a></p>
                </footer>

            </div>

            <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
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
