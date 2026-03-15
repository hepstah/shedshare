import { useRef, useState } from 'react'
import { ImagePlus, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToolCategories, useCreateTool, useUpdateTool, useUploadToolPhoto } from '@/hooks/useTools'
import { useCircles } from '@/hooks/useCircles'
import type { ToolWithDetails } from '@/types'

interface ToolFormProps {
  mode?: 'add' | 'edit'
  initialData?: ToolWithDetails
  onSuccess?: () => void
}

export function ToolForm({ mode = 'add', initialData, onSuccess }: ToolFormProps) {
  const { data: categories, isLoading: categoriesLoading } = useToolCategories()
  const { data: circles, isLoading: circlesLoading } = useCircles()
  const createTool = useCreateTool()
  const updateTool = useUpdateTool()
  const uploadPhoto = useUploadToolPhoto()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState(initialData?.name ?? '')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [categoryId, setCategoryId] = useState(initialData?.category_id ?? '')
  const [nutsCost, setNutsCost] = useState(initialData?.nuts_cost ?? 1)
  const [selectedCircleIds, setSelectedCircleIds] = useState<string[]>(
    initialData?.tool_circle_listings?.map((l) => l.circle_id) ?? [],
  )
  const [photoUrl, setPhotoUrl] = useState(initialData?.photo_url ?? '')
  const [photoPreview, setPhotoPreview] = useState(initialData?.photo_url ?? '')

  const isSubmitting = createTool.isPending || updateTool.isPending || uploadPhoto.isPending

  const toggleCircle = (circleId: string) => {
    setSelectedCircleIds((prev) =>
      prev.includes(circleId)
        ? prev.filter((id) => id !== circleId)
        : [...prev, circleId],
    )
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5 MB.')
      return
    }

    // Show local preview immediately
    setPhotoPreview(URL.createObjectURL(file))

    try {
      const url = await uploadPhoto.mutateAsync(file)
      setPhotoUrl(url)
      setPhotoPreview(url)
    } catch {
      toast.error('Failed to upload photo.')
      setPhotoPreview(photoUrl) // revert preview
    }
  }

  const removePhoto = () => {
    setPhotoUrl('')
    setPhotoPreview('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error('Tool name is required.')
      return
    }

    if (nutsCost < 1) {
      toast.error('Nuts cost must be at least 1.')
      return
    }

    if (selectedCircleIds.length === 0) {
      toast.error('Select at least one circle to list your tool in.')
      return
    }

    const payload = {
      name: name.trim(),
      description: description.trim() || undefined,
      category_id: categoryId || undefined,
      nuts_cost: nutsCost,
      circle_ids: selectedCircleIds,
      photo_url: photoUrl || undefined,
    }

    const options = {
      onSuccess: () => {
        toast.success(mode === 'add' ? 'Tool added!' : 'Tool updated!')
        onSuccess?.()
      },
      onError: (err: Error) => {
        toast.error(err.message)
      },
    }

    if (mode === 'edit' && initialData) {
      updateTool.mutate({ id: initialData.id, ...payload }, options)
    } else {
      createTool.mutate(payload, options)
    }
  }

  if (categoriesLoading || circlesLoading) {
    return <p className="text-muted-foreground">Loading form...</p>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Photo upload */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Photo</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        {photoPreview ? (
          <div className="relative w-fit">
            <img
              src={photoPreview}
              alt="Tool preview"
              className="h-40 w-40 rounded-lg border object-cover"
            />
            <button
              type="button"
              onClick={removePhoto}
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-sm"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-40 w-40 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 text-muted-foreground transition-colors hover:border-muted-foreground/50 hover:text-foreground"
          >
            <ImagePlus className="h-8 w-8" />
            <span className="text-xs">Add photo</span>
          </button>
        )}
        {uploadPhoto.isPending && (
          <p className="text-xs text-muted-foreground">Uploading...</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="tool-name" className="text-sm font-medium">
          Name
        </label>
        <Input
          id="tool-name"
          placeholder="e.g. Circular Saw"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="tool-description" className="text-sm font-medium">
          Description
        </label>
        <Textarea
          id="tool-description"
          placeholder="Describe your tool, condition, any accessories included..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Category</label>
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories?.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor="tool-nuts" className="text-sm font-medium">
          Cost (nuts per borrow)
        </label>
        <Input
          id="tool-nuts"
          type="number"
          min={1}
          value={nutsCost}
          onChange={(e) => setNutsCost(Number(e.target.value))}
        />
      </div>

      {circles && circles.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium">List in Circles</label>
          <div className="space-y-2">
            {circles.map((circle) => (
              <label
                key={circle.id}
                className="flex items-center gap-2 text-sm"
              >
                <Checkbox
                  checked={selectedCircleIds.includes(circle.id)}
                  onCheckedChange={() => toggleCircle(circle.id)}
                />
                {circle.name}
              </label>
            ))}
          </div>
        </div>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? mode === 'add'
            ? 'Adding...'
            : 'Saving...'
          : mode === 'add'
            ? 'Add Tool'
            : 'Save Changes'}
      </Button>
    </form>
  )
}
