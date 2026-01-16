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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Select Dashboard</h1>
          <p className="text-gray-600 mb-6">Choose a platform to demo access:</p>

          <div className="space-y-3">
            <a href="/admin/dashboard" className="block w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-4 rounded-lg transition-colors border border-slate-700">
              Admin Platform
            </a>
            <a href="/hiqor/dashboard" className="block w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-lg transition-colors border border-teal-500">
              HiQor Platform
            </a>
            <a href="/partner/dashboard" className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors border border-blue-500">
              Partner Platform
            </a>
            <a href="/sures/dashboard" className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors border border-indigo-500">
              Insurance Broker Portal
            </a>
            <a href="/admin/dashboard" className="block w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg transition-colors border border-orange-500">
              DEI Sales Rep Portal
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
