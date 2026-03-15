import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Circle, CircleMember, Profile } from '@/types'

export type CircleWithCount = Circle & { memberCount: number }
export type MemberWithProfile = CircleMember & { profiles: Profile }

export function useCircles() {
  return useQuery({
    queryKey: ['circles'],
    queryFn: async (): Promise<CircleWithCount[]> => {
      const { data, error } = await supabase
        .from('circles')
        .select('*, circle_members(count)')
        .order('created_at', { ascending: false })

      if (error) throw error

      return (data ?? []).map((c) => ({
        ...c,
        circle_members: undefined,
        memberCount: (c.circle_members as unknown as { count: number }[])?.[0]?.count ?? 0,
      })) as CircleWithCount[]
    },
  })
}

export function useCircle(circleId: string | undefined) {
  const circleQuery = useQuery({
    queryKey: ['circles', circleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('circles')
        .select('*')
        .eq('id', circleId!)
        .single()

      if (error) throw error
      return data as Circle
    },
    enabled: !!circleId,
  })

  const membersQuery = useQuery({
    queryKey: ['circles', circleId, 'members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('circle_members')
        .select('*, profiles(*)')
        .eq('circle_id', circleId!)
        .order('joined_at', { ascending: true })

      if (error) throw error
      return data as MemberWithProfile[]
    },
    enabled: !!circleId,
  })

  return {
    circle: circleQuery.data ?? null,
    members: membersQuery.data ?? [],
    isLoading: circleQuery.isLoading || membersQuery.isLoading,
    error: circleQuery.error || membersQuery.error,
  }
}

export function useCircleByInviteCode(code: string | undefined) {
  return useQuery({
    queryKey: ['circle-by-invite', code],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_circle_by_invite_code', {
        code: code!,
      })

      if (error) throw error
      return data as Circle | null
    },
    enabled: !!code,
    retry: false,
  })
}

export function useCreateCircle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      name,
      description,
    }: {
      name: string
      description?: string
    }) => {
      const { data, error } = await supabase.rpc('create_circle', {
        p_name: name,
        p_description: description ?? null,
      })

      if (error) throw error
      return data as Circle
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['circles'] })
    },
  })
}

export function useJoinCircle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ circleId }: { circleId: string }) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('circle_members')
        .insert({ circle_id: circleId, user_id: user.id })

      if (error) {
        // Unique constraint violation — already a member
        if (error.code === '23505') {
          throw new Error('You are already a member of this circle.')
        }
        throw error
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['circles'] })
    },
  })
}

export function useLeaveCircle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ circleId }: { circleId: string }) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('circle_members')
        .delete()
        .eq('circle_id', circleId)
        .eq('user_id', user.id)

      if (error) throw error
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['circles'] })
      void queryClient.invalidateQueries({ queryKey: ['circles', variables.circleId, 'members'] })
    },
  })
}
