// Auto-generated Supabase database types.
// Run: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/database.types.ts
// to regenerate after schema changes.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      security_alerts: {
        Row: {
          id: number
          created_at: string
          severity: 'low' | 'medium' | 'high' | 'critical'
          type: string
          message: string
          source: string
          status: 'active' | 'resolved'
        }
        Insert: Omit<Database['public']['Tables']['security_alerts']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['security_alerts']['Insert']>
      }
      audit_logs: {
        Row: {
          id: string
          created_at: string
          user_id: string
          username: string
          action: string
          detail: string
          ip_address: string
        }
        Insert: Omit<Database['public']['Tables']['audit_logs']['Row'], 'id' | 'created_at'>
        Update: never
      }
      security_rules: {
        Row: {
          id: number
          name: string
          description: string
          status: 'active' | 'inactive'
          severity: 'low' | 'medium' | 'high' | 'critical'
          last_triggered: string
          action_type: string
        }
        Insert: Omit<Database['public']['Tables']['security_rules']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['security_rules']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
