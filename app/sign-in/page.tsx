"use client"

import { Suspense, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

// ... (existing code)

{/* Header */ }
<div className="text-center mb-8">
  <motion.div
    className="flex justify-center mb-6"
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ delay: 0.2, type: "spring" }}
  >
    <Image
      src="/images/logo-color.png"
      alt="Daily Event Insurance"
      width={200}
      height={60}
      className="h-12 w-auto"
      priority
    />
  </motion.div>
  <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
  <p className="mt-2 text-gray-600">Sign in to your partner account</p>
</div>

// ... (existing code)

function SignInFormFallback() {
  return (
    <div className="max-w-md w-full">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-6">
          <div className="h-12 w-48 bg-gray-200 rounded animate-pulse" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
        <p className="mt-2 text-gray-600">Sign in to your partner account</p>
      </div>
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="space-y-6">
          <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
          <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
          <div className="h-12 bg-gray-200 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <main className="flex-1 flex items-center justify-center pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<SignInFormFallback />}>
          <SignInForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  )
}
