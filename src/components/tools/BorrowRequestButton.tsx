// Button to initiate a borrow request
// TODO: Implement with modal/dialog for message and confirmation

interface BorrowRequestButtonProps {
  toolId: string
  lenderId: string
}

export function BorrowRequestButton({ toolId: _toolId, lenderId: _lenderId }: BorrowRequestButtonProps) {
  return (
    <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
      Borrow This Tool
    </button>
  )
}
