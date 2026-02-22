import type { ReactNode } from 'react'
import { Navbar } from './Navbar'
import { BottomNav } from './BottomNav'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-6">{children}</main>
      <BottomNav />
    </div>
  )
}
