import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'

const Landing = lazy(() => import('@/pages/Landing').then(m => ({ default: m.Landing })))
const Login = lazy(() => import('@/pages/Login').then(m => ({ default: m.Login })))
const JoinCirclePage = lazy(() => import('@/pages/JoinCirclePage').then(m => ({ default: m.JoinCirclePage })))
const Dashboard = lazy(() => import('@/pages/Dashboard').then(m => ({ default: m.Dashboard })))
const MyTools = lazy(() => import('@/pages/MyTools').then(m => ({ default: m.MyTools })))
const AddTool = lazy(() => import('@/pages/AddTool').then(m => ({ default: m.AddTool })))
const ToolDetailPage = lazy(() => import('@/pages/ToolDetailPage').then(m => ({ default: m.ToolDetailPage })))
const EditTool = lazy(() => import('@/pages/EditTool').then(m => ({ default: m.EditTool })))
const CirclesPage = lazy(() => import('@/pages/CirclesPage').then(m => ({ default: m.CirclesPage })))
const CircleDetailPage = lazy(() => import('@/pages/CircleDetailPage').then(m => ({ default: m.CircleDetailPage })))
const SearchPage = lazy(() => import('@/pages/SearchPage').then(m => ({ default: m.SearchPage })))
const RequestsPage = lazy(() => import('@/pages/RequestsPage').then(m => ({ default: m.RequestsPage })))
const ProfilePage = lazy(() => import('@/pages/ProfilePage').then(m => ({ default: m.ProfilePage })))

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-muted-foreground">Loading...</div>
    </div>
  )
}

export function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/join/:inviteCode" element={<JoinCirclePage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tools" element={<MyTools />} />
          <Route path="/tools/add" element={<AddTool />} />
          <Route path="/tools/:toolId" element={<ToolDetailPage />} />
          <Route path="/tools/:toolId/edit" element={<EditTool />} />
          <Route path="/circles" element={<CirclesPage />} />
          <Route path="/circles/:circleId" element={<CircleDetailPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/requests" element={<RequestsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* 404 catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
