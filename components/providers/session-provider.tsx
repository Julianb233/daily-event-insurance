"use client"

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User, Session } from "@supabase/supabase-js"

interface AuthSession {
  user: {
    id: string
    email: string | undefined
    name: string | undefined
    role: string | undefined
  } | null
}

interface SessionContextType {
  data: AuthSession | null
  status: "loading" | "authenticated" | "unauthenticated"
  signOut: () => Promise<void>
  refresh: () => Promise<void>
}

const SessionContext = createContext<SessionContextType>({
  data: null,
  status: "loading",
  signOut: async () => {},
  refresh: async () => {},
})

export function useSession() {
  return useContext(SessionContext)
}

interface SessionProviderProps {
  children: ReactNode
}

export function SessionProvider({ children }: SessionProviderProps) {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading")

  const supabase = createClient()

  const updateSession = useCallback((user: User | null) => {
    if (user) {
      setSession({
        user: {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name,
          role: user.user_metadata?.role,
        },
      })
      setStatus("authenticated")
    } else {
      setSession(null)
      setStatus("unauthenticated")
    }
  }, [])

  const refresh = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    updateSession(user)
  }, [supabase, updateSession])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setSession(null)
    setStatus("unauthenticated")
    window.location.href = "/"
  }, [supabase])

  useEffect(() => {
    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      updateSession(user)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      updateSession(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase, updateSession])

  return (
    <SessionContext.Provider value={{ data: session, status, signOut, refresh }}>
      {children}
    </SessionContext.Provider>
  )
}
