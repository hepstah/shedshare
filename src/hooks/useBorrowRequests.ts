import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { BorrowRequest } from '@/types'

// Extended type with tool name and user display names
export interface BorrowRequestWithDetails extends BorrowRequest {
  tools: { name: string } | null
  borrower: { display_name: string; avatar_url: string | null } | null
  lender: { display_name: string; avatar_url: string | null } | null
}

const requestSelect = '*, tools(name), borrower:profiles!borrow_requests_borrower_id_fkey(display_name, avatar_url), lender:profiles!borrow_requests_lender_id_fkey(display_name, avatar_url)'

export function useIncomingRequests() {
  return useQuery({
    queryKey: ['requests', 'incoming'],
    queryFn: async (): Promise<BorrowRequestWithDetails[]> => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('borrow_requests')
        .select(requestSelect)
        .eq('lender_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as unknown as BorrowRequestWithDetails[]
    },
  })
}

export function useOutgoingRequests() {
  return useQuery({
    queryKey: ['requests', 'outgoing'],
    queryFn: async (): Promise<BorrowRequestWithDetails[]> => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('borrow_requests')
        .select(requestSelect)
        .eq('borrower_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as unknown as BorrowRequestWithDetails[]
    },
  })
}

interface CreateBorrowRequestInput {
  tool_id: string
  lender_id: string
  circle_id: string
  message?: string
  due_date?: string
  nuts_amount: number
}

export function useCreateBorrowRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateBorrowRequestInput) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('borrow_requests')
        .insert({
          tool_id: input.tool_id,
          borrower_id: user.id,
          lender_id: input.lender_id,
          circle_id: input.circle_id,
          message: input.message ?? null,
          due_date: input.due_date ?? null,
          nuts_amount: input.nuts_amount,
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['requests'] })
    },
  })
}

export function useBorrowRequestAction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ requestId, action }: { requestId: string; action: string }) => {
      const { data, error } = await supabase.rpc('process_borrow_action', {
        p_request_id: requestId,
        p_action: action,
      })

      if (error) throw error
      return data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['requests'] })
      void queryClient.invalidateQueries({ queryKey: ['my-tools'] })
      void queryClient.invalidateQueries({ queryKey: ['tools'] })
      void queryClient.invalidateQueries({ queryKey: ['circle-tools'] })
      void queryClient.invalidateQueries({ queryKey: ['nuts-balance'] })
      void queryClient.invalidateQueries({ queryKey: ['nuts-transactions'] })
    },
  })
}
