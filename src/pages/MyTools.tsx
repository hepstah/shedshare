import { Link } from 'react-router-dom'

export function MyTools() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Tools</h1>
        <Link
          to="/tools/add"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Add Tool
        </Link>
      </div>
      <p className="text-muted-foreground">Your tool inventory will appear here.</p>
    </div>
  )
}
