import { Navigate } from 'react-router-dom'
import { LandingNav } from '@/components/landing/LandingNav'
import { HeroSection } from '@/components/landing/HeroSection'
import { HowItWorksSection } from '@/components/landing/HowItWorksSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { NutsSection } from '@/components/landing/NutsSection'
import { FooterCTA } from '@/components/landing/FooterCTA'
import { useAuth } from '@/hooks/useAuth'

export function Landing() {
  const { user, loading } = useAuth()

  if (!loading && user) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <LandingNav />
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <NutsSection />
      <FooterCTA />
    </div>
  )
}
