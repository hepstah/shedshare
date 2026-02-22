import { Routes, Route } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { Landing } from '@/pages/Landing'
import { Login } from '@/pages/Login'
import { Dashboard } from '@/pages/Dashboard'
import { MyTools } from '@/pages/MyTools'
import { AddTool } from '@/pages/AddTool'
import { ToolDetailPage } from '@/pages/ToolDetailPage'
import { CirclesPage } from '@/pages/CirclesPage'
import { CircleDetailPage } from '@/pages/CircleDetailPage'
import { SearchPage } from '@/pages/SearchPage'
import { RequestsPage } from '@/pages/RequestsPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { JoinCirclePage } from '@/pages/JoinCirclePage'

export function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/join/:inviteCode" element={<JoinCirclePage />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <AuthGuard>
            <AppShell>
              <Dashboard />
            </AppShell>
          </AuthGuard>
        }
      />
      <Route
        path="/tools"
        element={
          <AuthGuard>
            <AppShell>
              <MyTools />
            </AppShell>
          </AuthGuard>
        }
      />
      <Route
        path="/tools/add"
        element={
          <AuthGuard>
            <AppShell>
              <AddTool />
            </AppShell>
          </AuthGuard>
        }
      />
      <Route
        path="/tools/:toolId"
        element={
          <AuthGuard>
            <AppShell>
              <ToolDetailPage />
            </AppShell>
          </AuthGuard>
        }
      />
      <Route
        path="/circles"
        element={
          <AuthGuard>
            <AppShell>
              <CirclesPage />
            </AppShell>
          </AuthGuard>
        }
      />
      <Route
        path="/circles/:circleId"
        element={
          <AuthGuard>
            <AppShell>
              <CircleDetailPage />
            </AppShell>
          </AuthGuard>
        }
      />
      <Route
        path="/search"
        element={
          <AuthGuard>
            <AppShell>
              <SearchPage />
            </AppShell>
          </AuthGuard>
        }
      />
      <Route
        path="/requests"
        element={
          <AuthGuard>
            <AppShell>
              <RequestsPage />
            </AppShell>
          </AuthGuard>
        }
      />
      <Route
        path="/profile"
        element={
          <AuthGuard>
            <AppShell>
              <ProfilePage />
            </AppShell>
          </AuthGuard>
        }
      />
    </Routes>
  )
}
