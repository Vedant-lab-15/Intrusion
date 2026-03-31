import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { UserSession, UserRole } from '@/types'

// ─── Demo credentials (used when Supabase is not configured) ─────────────────

interface DemoCredential {
  username: string
  password: string
  role: UserRole
  displayName: string
}

const DEMO_CREDENTIALS: DemoCredential[] = [
  { username: 'admin', password: 'Admin@2024!', role: 'admin', displayName: 'Admin User' },
  { username: 'analyst', password: 'Analyst@2024!', role: 'analyst', displayName: 'Security Analyst' },
]

// ─── Session helpers ──────────────────────────────────────────────────────────

const SESSION_KEY = 'ids_session'
const SESSION_TIMEOUT_MS = 30 * 60 * 1000

function loadSession(): UserSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const session = JSON.parse(raw) as UserSession
    if (Date.now() > session.expiresAt) {
      sessionStorage.removeItem(SESSION_KEY)
      return null
    }
    return session
  } catch {
    return null
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface AuthContextValue {
  session: UserSession | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  loginError: string
  refreshSession: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const MAX_ATTEMPTS = 5
const LOCKOUT_MS = 5 * 60 * 1000

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<UserSession | null>(() => loadSession())
  const [loginError, setLoginError] = useState('')
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [lockedUntil, setLockedUntil] = useState<number | null>(null)

  // When Supabase is configured, sync its session on mount
  useEffect(() => {
    if (!isSupabaseConfigured) return

    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        const supaSession: UserSession = {
          username: data.session.user.email ?? 'user',
          displayName: data.session.user.user_metadata?.display_name ?? 'User',
          role: (data.session.user.user_metadata?.role as UserRole) ?? 'analyst',
          expiresAt: Date.now() + SESSION_TIMEOUT_MS,
        }
        setSession(supaSession)
      }
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, supaSession) => {
      if (supaSession?.user) {
        const s: UserSession = {
          username: supaSession.user.email ?? 'user',
          displayName: supaSession.user.user_metadata?.display_name ?? 'User',
          role: (supaSession.user.user_metadata?.role as UserRole) ?? 'analyst',
          expiresAt: Date.now() + SESSION_TIMEOUT_MS,
        }
        setSession(s)
      } else {
        setSession(null)
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const login = useCallback(
    async (username: string, password: string): Promise<boolean> => {
      // Check lockout
      if (lockedUntil && Date.now() < lockedUntil) {
        const remaining = Math.ceil((lockedUntil - Date.now()) / 1000)
        setLoginError(`Too many failed attempts. Try again in ${remaining}s.`)
        return false
      }

      const cleanUser = String(username).trim().slice(0, 64)
      const cleanPass = String(password).slice(0, 128)

      // ── Supabase auth path ──────────────────────────────────────────────────
      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanUser,
          password: cleanPass,
        })
        if (error) {
          const attempts = loginAttempts + 1
          setLoginAttempts(attempts)
          if (attempts >= MAX_ATTEMPTS) {
            setLockedUntil(Date.now() + LOCKOUT_MS)
            setLoginError(`Account locked for 5 minutes after ${MAX_ATTEMPTS} failed attempts.`)
          } else {
            setLoginError(`Invalid credentials. ${MAX_ATTEMPTS - attempts} attempt(s) remaining.`)
          }
          return false
        }
        setLoginError('')
        setLoginAttempts(0)
        setLockedUntil(null)
        return true
      }

      // ── Demo auth path ──────────────────────────────────────────────────────
      const match = DEMO_CREDENTIALS.find(
        (c) => c.username === cleanUser && c.password === cleanPass
      )
      if (!match) {
        const attempts = loginAttempts + 1
        setLoginAttempts(attempts)
        if (attempts >= MAX_ATTEMPTS) {
          setLockedUntil(Date.now() + LOCKOUT_MS)
          setLoginError(`Account locked for 5 minutes after ${MAX_ATTEMPTS} failed attempts.`)
        } else {
          setLoginError(`Invalid credentials. ${MAX_ATTEMPTS - attempts} attempt(s) remaining.`)
        }
        return false
      }

      const newSession: UserSession = {
        username: match.username,
        displayName: match.displayName,
        role: match.role,
        expiresAt: Date.now() + SESSION_TIMEOUT_MS,
      }
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(newSession))
      setSession(newSession)
      setLoginError('')
      setLoginAttempts(0)
      setLockedUntil(null)
      return true
    },
    [loginAttempts, lockedUntil]
  )

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY)
    setSession(null)
    if (isSupabaseConfigured) supabase.auth.signOut()
  }, [])

  const refreshSession = useCallback(() => {
    if (!session) return
    const updated: UserSession = { ...session, expiresAt: Date.now() + SESSION_TIMEOUT_MS }
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(updated))
    setSession(updated)
  }, [session])

  return (
    <AuthContext.Provider value={{ session, login, logout, loginError, refreshSession }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
