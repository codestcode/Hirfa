'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/lib/types'

interface AuthState {
  user: User | null
  profile: Profile | null
  loading: boolean
}

interface AuthContextValue extends AuthState {
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
  })
  const router = useRouter()
  const supabase = createClient()

  const fetchProfile = useCallback(async (userId: string) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    return profile
  }, [supabase])

  useEffect(() => {
    let mounted = true

    async function initialize() {
      const { data: { session } } = await supabase.auth.getSession()

      if (!mounted) return

      if (session?.user) {
        const profile = await fetchProfile(session.user.id)
        if (mounted) {
          setState({ user: session.user, profile, loading: false })
        }
      } else {
        setState({ user: null, profile: null, loading: false })
      }
    }

    initialize()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return

        if (session?.user) {
          const profile = await fetchProfile(session.user.id)
          if (mounted) {
            setState({ user: session.user, profile, loading: false })
          }
        } else {
          setState({ user: null, profile: null, loading: false })
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase, fetchProfile])

  const signOut = async () => {
    await supabase.auth.signOut()
    setState({ user: null, profile: null, loading: false })
    router.push('/login')
  }

  const refreshProfile = async () => {
    if (state.user) {
      const profile = await fetchProfile(state.user.id)
      setState((prev) => ({ ...prev, profile }))
    }
  }

  return (
    <AuthContext.Provider value={{ ...state, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
