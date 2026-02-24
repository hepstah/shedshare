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

      const { data, error } = await supabase
        .from('audit_log')
        .select('created_at')
        .eq('user_id', user.id)
        .gte('created_at', oneYearAgo.toISOString())
        .order('created_at', { ascending: true })

      if (error) throw error

      // Group by date
      const counts = new Map<string, number>()
      for (const row of data ?? []) {
        const date = row.created_at.slice(0, 10) // YYYY-MM-DD
        counts.set(date, (counts.get(date) ?? 0) + 1)
      }

      const days: ActivityDay[] = []
      for (const [date, count] of counts) {
        days.push({ date, count })
      }

      return {
        days,
        total: data?.length ?? 0,
      }
    },
  })
}
