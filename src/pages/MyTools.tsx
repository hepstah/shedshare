import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ToolGrid } from '@/components/tools/ToolGrid'
import { useMyTools, useToolCategories } from '@/hooks/useTools'
import type { ToolStatus, ToolWithCategory } from '@/types'

type SortOption = 'newest' | 'oldest' | 'name-asc' | 'name-desc'

function filterAndSort(
  tools: ToolWithCategory[],
  status: string,
  categoryId: string,
  sort: SortOption,
) {
  let filtered = tools

  if (status !== 'all') {
    filtered = filtered.filter((t) => t.status === status)
  }
  if (categoryId !== 'all') {
    filtered = filtered.filter((t) => t.category_id === categoryId)
  }

  const sorted = [...filtered]
  switch (sort) {
    case 'newest':
      sorted.sort((a, b) => b.created_at.localeCompare(a.created_at))
      break
    case 'oldest':
      sorted.sort((a, b) => a.created_at.localeCompare(b.created_at))
      break
    case 'name-asc':
      sorted.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'name-desc':
      sorted.sort((a, b) => b.name.localeCompare(a.name))
      break
  }

  return sorted
}

const statusOptions: { value: string; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'available' as ToolStatus, label: 'Available' },
  { value: 'lent_out' as ToolStatus, label: 'Lent Out' },
  { value: 'not_available' as ToolStatus, label: 'Not Available' },
]

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'name-asc', label: 'Name A-Z' },
  { value: 'name-desc', label: 'Name Z-A' },
]

export function MyTools() {
  const { data: tools, isLoading, error } = useMyTools()
  const { data: categories } = useToolCategories()

  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sort, setSort] = useState<SortOption>('newest')

  const filteredTools = useMemo(
    () => (tools ? filterAndSort(tools, statusFilter, categoryFilter, sort) : []),
    [tools, statusFilter, categoryFilter, sort],
  )

  const hasTools = tools && tools.length > 0
  const hasFilters = statusFilter !== 'all' || categoryFilter !== 'all'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Tools</h1>
        <Button asChild>
          <Link to="/tools/add">Add Tool</Link>
        </Button>
      </div>

      {isLoading && <p className="text-muted-foreground">Loading tools...</p>}

      {error && (
        <p className="text-sm text-destructive">
          Failed to load tools: {error.message}
        </p>
      )}

      {!isLoading && !error && !hasTools && (
        <div className="flex flex-col items-center gap-6 py-12 text-center">
          <Package className="h-16 w-16 text-muted-foreground/40" />
          <div>
            <h2 className="text-lg font-semibold">No tools yet</h2>
            <p className="text-sm text-muted-foreground">
              Add your first tool to start lending to your circles.
            </p>
          </div>
          <Button asChild>
            <Link to="/tools/add">Add Your First Tool</Link>
          </Button>
        </div>
      )}

      {hasTools && (
        <>
          {/* Filter / Sort bar */}
          <div className="flex flex-wrap gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filteredTools.length === 0 && hasFilters ? (
            <p className="py-8 text-center text-muted-foreground">
              No tools match your filters.
            </p>
          ) : (
            <ToolGrid tools={filteredTools} />
          )}
        </>
      )}
    </div>
  )
}
