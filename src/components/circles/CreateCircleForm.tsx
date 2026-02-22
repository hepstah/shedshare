import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useCreateCircle } from '@/hooks/useCircles'

export function CreateCircleForm() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const navigate = useNavigate()
  const createCircle = useCreateCircle()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createCircle.mutate(
      { name, description: description || undefined },
      {
        onSuccess: (circle) => {
          toast.success(`"${circle.name}" created!`)
          setOpen(false)
          setName('')
          setDescription('')
          navigate(`/circles/${circle.id}`)
        },
        onError: (err) => {
          toast.error(err.message)
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          New Circle
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create a Circle</DialogTitle>
            <DialogDescription>
              A circle is a group of friends who share tools with each other.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="circle-name">Name</Label>
              <Input
                id="circle-name"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                placeholder="e.g. Neighborhood Tool Library"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="circle-desc">Description (optional)</Label>
              <Textarea
                id="circle-desc"
                value={description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                placeholder="What is this circle for?"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={createCircle.isPending}>
              {createCircle.isPending ? 'Creating...' : 'Create Circle'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
