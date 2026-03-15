import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export interface ActivityDay {
  date: string // YYYY-MM-DD
  count: number
}

export function useActivityHeatmap() {
  return useQuery({
    queryKey: ['activity-heatmap'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const oneYearAgo = new Date()
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

      const { data, error } = await supabase.rpc('get_activity_heatmap', {
        p_user_id: user.id,
        p_since: oneYearAgo.toISOString(),
      })

      if (error) {
        // Fallback to client-side aggregation if RPC doesn't exist yet
        const { data: rawData, error: rawError } = await supabase
          .from('audit_log')
          .select('created_at')
          .eq('user_id', user.id)
          .gte('created_at', oneYearAgo.toISOString())
          .order('created_at', { ascending: true })
          .limit(5000)

        if (rawError) throw rawError

        const counts = new Map<string, number>()
        for (const row of rawData ?? []) {
          const date = row.created_at.slice(0, 10)
          counts.set(date, (counts.get(date) ?? 0) + 1)
        }

        const days: ActivityDay[] = []
        let total = 0
        for (const [date, count] of counts) {
          days.push({ date, count })
          total += count
        }

        return { days, total }
      }

      const days = (data ?? []) as ActivityDay[]
      const total = days.reduce((sum, d) => sum + d.count, 0)
      return { days, total }
    },
  })
}
