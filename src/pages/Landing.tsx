import { LandingNav } from '@/components/landing/LandingNav'
import { HeroSection } from '@/components/landing/HeroSection'
import { HowItWorksSection } from '@/components/landing/HowItWorksSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { NutsSection } from '@/components/landing/NutsSection'
import { FooterCTA } from '@/components/landing/FooterCTA'

export function Landing() {
  return (
    <div className="min-h-screen">
      <LandingNav />
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <NutsSection />
      <FooterCTA />
    </div>
  )
}
