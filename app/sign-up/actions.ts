'use server'

import { createClient, createAdminClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function signUp(formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const name = formData.get("name") as string

    if (!email || !password || !name) {
        return { error: "Missing required fields" }
    }

    // 1. Create Verified User via Admin Client (Bypasses verification email)
    const supabaseAdmin = createAdminClient()

    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // AUTO-VERIFY
        user_metadata: {
            name,
            role: 'user'
        }
    })

    if (createError) {
        console.error("Auto-verify signup failed:", createError)
        return { error: createError.message }
    }

    if (!userData.user) {
        return { error: "Failed to create user" }
    }

    // 2. Sign in as the new user to set the session cookies
    const supabase = await createClient()

    const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
    })

    if (signInError) {
        console.error("Auto-login failed:", signInError)
        return { error: "Account created but failed to sign in. Please try logging in." }
    }

    // 3. Redirect to onboarding
    redirect("/onboarding")
}
