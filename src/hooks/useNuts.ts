import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { NutsTransaction } from '@/types'

export function useNutsBalance() {
  return useQuery({
    queryKey: ['nuts-balance'],
    queryFn: async (): Promise<number> => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('profiles')
        .select('nuts_balance')
        .eq('id', user.id)
        .single()

      if (error) throw error
      return data.nuts_balance
    },
  })
}

export function useNutsTransactions() {
  return useQuery({
    queryKey: ['nuts-transactions'],
    queryFn: async (): Promise<NutsTransaction[]> => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('nuts_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      return data as NutsTransaction[]
    },
  })
}
