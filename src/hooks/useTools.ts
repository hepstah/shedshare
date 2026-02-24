import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type {
  Tool,
  ToolCategory,
  ToolWithCategory,
  ToolWithDetails,
  ToolStatus,
} from '@/types'

// ── Queries ──────────────────────────────────────────────

export function useMyTools() {
  return useQuery({
    queryKey: ['my-tools'],
    queryFn: async (): Promise<ToolWithCategory[]> => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('tools')
        .select('*, tool_categories(*)')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as ToolWithCategory[]
    },
  })
}

export function useTool(toolId: string | undefined) {
  return useQuery({
    queryKey: ['tools', toolId],
    queryFn: async (): Promise<ToolWithDetails> => {
      const { data, error } = await supabase
        .from('tools')
        .select('*, tool_categories(*), profiles!tools_owner_id_fkey(id, display_name, avatar_url), tool_circle_listings(*)')
        .eq('id', toolId!)
        .single()

      if (error) throw error
      return data as unknown as ToolWithDetails
    },
    enabled: !!toolId,
  })
}

export function useCircleTools(circleId: string | undefined) {
  return useQuery({
    queryKey: ['circle-tools', circleId],
    queryFn: async (): Promise<ToolWithCategory[]> => {
      const { data, error } = await supabase
        .from('tool_circle_listings')
        .select('tool_id, tools(*, tool_categories(*))')
        .eq('circle_id', circleId!)

      if (error) throw error

      return (data ?? [])
        .map((row) => (row as unknown as { tools: ToolWithCategory }).tools)
        .filter(Boolean)
    },
    enabled: !!circleId,
  })
}

export function useSearchTools(query: string) {
  return useQuery({
    queryKey: ['search-tools', query],
    queryFn: async (): Promise<ToolWithCategory[]> => {
      const { data, error } = await supabase
        .from('tools')
        .select('*, tool_categories(*)')
        .ilike('name', `%${query}%`)
        .order('name')
        .limit(50)

      if (error) throw error
      return data as ToolWithCategory[]
    },
    enabled: query.length >= 2,
  })
}

export function useToolCategories() {
  return useQuery({
    queryKey: ['tool-categories'],
    queryFn: async (): Promise<ToolCategory[]> => {
      const { data, error } = await supabase
        .from('tool_categories')
        .select('*')
        .order('sort_order')

      if (error) throw error
      return data as ToolCategory[]
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}

// ── Upload ───────────────────────────────────────────────

export function useUploadToolPhoto() {
  return useMutation({
    mutationFn: async (file: File): Promise<string> => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const ext = file.name.split('.').pop() ?? 'jpg'
      const path = `${user.id}/${crypto.randomUUID()}.${ext}`

      const { error } = await supabase.storage
        .from('tool-photos')
        .upload(path, file, { upsert: true })

      if (error) throw error

      const { data: urlData } = supabase.storage
        .from('tool-photos')
        .getPublicUrl(path)

      return urlData.publicUrl
    },
  })
}

// ── Mutations ────────────────────────────────────────────

interface CreateToolInput {
  name: string
  description?: string
  category_id?: string
  photo_url?: string
  nuts_cost: number
  circle_ids: string[]
}

export function useCreateTool() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateToolInput) => {
      const { data, error } = await supabase.rpc('create_tool_with_listings', {
        p_name: input.name,
        p_description: input.description ?? null,
        p_category_id: input.category_id ?? null,
        p_photo_url: input.photo_url ?? null,
        p_nuts_cost: input.nuts_cost,
        p_circle_ids: input.circle_ids,
      })

      if (error) throw error
      return data as unknown as Tool
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['my-tools'] })
      void queryClient.invalidateQueries({ queryKey: ['circle-tools'] })
    },
  })
}

interface UpdateToolInput {
  id: string
  name: string
  description?: string
  category_id?: string
  photo_url?: string
  nuts_cost: number
  circle_ids: string[]
}

export function useUpdateTool() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: UpdateToolInput) => {
      const { data, error } = await supabase.rpc('update_tool_with_listings', {
        p_tool_id: input.id,
        p_name: input.name,
        p_description: input.description ?? null,
        p_category_id: input.category_id ?? null,
        p_photo_url: input.photo_url ?? null,
        p_nuts_cost: input.nuts_cost,
        p_circle_ids: input.circle_ids,
      })

      if (error) throw error
      return data as unknown as Tool
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['my-tools'] })
      void queryClient.invalidateQueries({ queryKey: ['tools', variables.id] })
      void queryClient.invalidateQueries({ queryKey: ['circle-tools'] })
    },
  })
}

export function useDeleteTool() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (toolId: string) => {
      const { error } = await supabase
        .from('tools')
        .delete()
        .eq('id', toolId)

      if (error) throw error
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['my-tools'] })
      void queryClient.invalidateQueries({ queryKey: ['circle-tools'] })
      void queryClient.invalidateQueries({ queryKey: ['search-tools'] })
    },
  })
}

export function useUpdateToolStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ toolId, status }: { toolId: string; status: ToolStatus }) => {
      const { error } = await supabase
        .from('tools')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', toolId)

      if (error) throw error
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['my-tools'] })
      void queryClient.invalidateQueries({ queryKey: ['tools', variables.toolId] })
      void queryClient.invalidateQueries({ queryKey: ['circle-tools'] })
    },
  })
}
