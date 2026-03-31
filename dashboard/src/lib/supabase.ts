import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

// These are read from environment variables.
// Create a .env.local file with your Supabase project URL and anon key.
// The anon key is safe to expose client-side — RLS policies enforce access control.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not set. ' +
    'Running in demo mode with mock data.'
  )
}

export const supabase = createClient<Database>(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseAnonKey ?? 'placeholder',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  }
)

export const isSupabaseConfigured =
  Boolean(supabaseUrl) && Boolean(supabaseAnonKey) &&
  !supabaseUrl.includes('placeholder')
