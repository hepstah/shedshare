import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { ToolGrid } from '@/components/tools/ToolGrid'
import { useSearchTools } from '@/hooks/useTools'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'

export function SearchPage() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebouncedValue(query, 300)
  const { data: tools, isLoading } = useSearchTools(debouncedQuery)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Search Tools</h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search tools across your circles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {debouncedQuery.length < 2 && (
        <p className="text-sm text-muted-foreground">
          Type at least 2 characters to search.
        </p>
      )}

      {isLoading && debouncedQuery.length >= 2 && (
        <p className="text-muted-foreground">Searching...</p>
      )}

      {!isLoading && debouncedQuery.length >= 2 && tools?.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No tools found for &ldquo;{debouncedQuery}&rdquo;.
        </p>
      )}

      {tools && tools.length > 0 && <ToolGrid tools={tools} />}
    </div>
  )
}
