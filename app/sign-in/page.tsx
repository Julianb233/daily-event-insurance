"use client"

import { Suspense, useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Mail, Lock, Loader2, ArrowRight, Chrome } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/partner/dashboard"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      })

      if (result?.error) {
        if (result.error === "CredentialsSignin") {
          setError("Invalid email or password")
        } else {
          setError(result.error)
        }
        setIsLoading(false)
        return
      }

      if (result?.ok) {
        // Force a hard navigation to ensure session is properly loaded
        window.location.href = callbackUrl
      }
    } catch (err) {
      console.error("Sign-in error:", err)
      setError("An error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  const handleSocialSignIn = async (provider: string) => {
    setSocialLoading(provider)
    setError("")
    try {
      await signIn(provider, { callbackUrl })
    } catch (err) {
      console.error(`${provider} sign-in error:`, err)
      setError(`Failed to sign in with ${provider}. Please try again.`)
      setSocialLoading(null)
    }
  }

  return (
    <motion.div
      className="max-w-md w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          className="mx-auto mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <Image
            src="/images/logo-color.png"
            alt="Daily Event Insurance"
            width={540}
            height={120}
            className="h-auto w-auto mx-auto max-h-[120px]"
          />
        </motion.div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
        <p className="mt-2 text-gray-600">Sign in to your partner account</p>
      </div>

      {/* Form */}
      <motion.div
        className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <motion.div
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
            >
              {error}
            </motion.div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent transition-all"
                placeholder="you@company.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#14B8A6] to-[#0D9488] text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign in
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => handleSocialSignIn("google")}
            disabled={isLoading || socialLoading !== null}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {socialLoading === "google" ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            <span>Continue with Google</span>
          </button>

          <button
            type="button"
            onClick={() => handleSocialSignIn("github")}
            disabled={isLoading || socialLoading !== null}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {socialLoading === "github" ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span>Continue with GitHub</span>
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="text-[#14B8A6] hover:text-[#0D9488] font-semibold transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

function SignInFormFallback() {
  return (
    <div className="max-w-md w-full">
      <div className="text-center mb-8">
        <div className="mx-auto mb-6">
          <Image
            src="/images/logo-color.png"
            alt="Daily Event Insurance"
            width={540}
            height={120}
            className="h-auto w-auto mx-auto max-h-[120px]"
          />
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

      <main className="flex-1 flex items-center justify-center pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<SignInFormFallback />}>
          <SignInForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  )
}
