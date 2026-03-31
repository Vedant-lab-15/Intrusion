import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useAppStore } from '@/store/useAppStore'
import type { SecurityAlert } from '@/types'

/**
 * Subscribes to Supabase Realtime for live alert inserts.
 * When Supabase is not configured, the demo alert cycle in App.tsx handles it.
 */
export function useRealtimeAlerts() {
  const queryClient = useQueryClient()
  const addLiveAlert = useAppStore((s) => s.addLiveAlert)

  useEffect(() => {
    if (!isSupabaseConfigured) return

    const channel = supabase
      .channel('security_alerts_realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'security_alerts' },
        (payload) => {
          const row = payload.new as {
            id: number
            created_at: string
            severity: SecurityAlert['severity']
            type: string
            message: string
            source: string
            status: SecurityAlert['status']
          }

          const alert: SecurityAlert = {
            id: row.id,
            severity: row.severity,
            type: row.type as SecurityAlert['type'],
            message: row.message,
            source: row.source,
            status: row.status,
            time: new Date(row.created_at).toLocaleTimeString(),
            timestamp: new Date(row.created_at),
          }

          addLiveAlert(alert)
          // Invalidate the alerts query so the table refreshes
          queryClient.invalidateQueries({ queryKey: ['alerts'] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient, addLiveAlert])
}
