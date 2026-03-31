import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { recentAlertsData } from '@/data/mockData'
import type { SecurityAlert } from '@/types'

const ALERTS_KEY = ['alerts'] as const

// Fetch alerts — falls back to mock data when Supabase is not configured
async function fetchAlerts(): Promise<SecurityAlert[]> {
  if (!isSupabaseConfigured) return recentAlertsData as SecurityAlert[]

  const { data, error } = await supabase
    .from('security_alerts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) throw new Error(error.message)

  return (data ?? []).map((row) => ({
    id: row.id,
    severity: row.severity,
    type: row.type as SecurityAlert['type'],
    message: row.message,
    source: row.source,
    status: row.status,
    time: new Date(row.created_at).toLocaleTimeString(),
  }))
}

export function useAlerts() {
  return useQuery({
    queryKey: ALERTS_KEY,
    queryFn: fetchAlerts,
    staleTime: 30_000,
    refetchInterval: 60_000,
  })
}

export function useResolveAlert() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (alertId: number) => {
      if (!isSupabaseConfigured) return
      const { error } = await supabase
        .from('security_alerts')
        .update({ status: 'resolved' })
        .eq('id', alertId)
      if (error) throw new Error(error.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ALERTS_KEY })
    },
  })
}
