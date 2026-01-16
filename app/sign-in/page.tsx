"use client";

import dynamic from 'next/dynamic';
const Descope = dynamic(() => import('@descope/react-sdk').then((mod) => mod.Descope), { ssr: false });
import { useRouter } from 'next/navigation';
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function SignInPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white relative">
      <Header />

      <main className="flex-1 flex items-center justify-center pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative Orbs - Sea Green Theme */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-teal-300/20 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-gray-100 relative z-10 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Demo Mode Access</h1>
          <p className="text-gray-600 mb-6">Redirecting you to the dashboard...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-6"></div>

          <button
            onClick={() => window.location.href = '/partner/dashboard'}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Go to Dashboard Now
          </button>
        </div>
      </main>

      <script dangerouslySetInnerHTML={{
        __html: `window.location.href = "/partner/dashboard"`
      }} />

      <Footer />
    </div>
  );
}
