import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Mountain Trail Challenge 2026 - Event Coverage',
    description: 'Activate your required event insurance coverage.',
}

export default function MicrositeV2Layout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
            {children}
        </div>
    )
}
