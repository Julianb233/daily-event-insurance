"use client";

import dynamic from 'next/dynamic';
const Descope = dynamic(() => import('@descope/react-sdk').then((mod) => mod.Descope), { ssr: false });
import { useRouter } from 'next/navigation';
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function SignUpPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <main className="flex-1 flex items-center justify-center pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-gray-100">
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">Create Account</h1>
          <Descope
            flowId="sign-up-or-in"
            theme="light"
            onSuccess={(e) => {
              console.log("Signed up!", e.detail.user);
              window.location.href = '/partner/dashboard';
            }}
            onError={(e) => console.log("Error!", e)}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
