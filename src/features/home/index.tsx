/**
 * Home Page – Landing design following app design system
 */
import { Navbar, Footer } from '@/components'
import { Particles } from '@/components/ui/particles'
import { AcademiesSection } from './containers/academies-section'
import { CoursesSection } from './containers/courses-section'
import { CTASection } from './containers/cta-section'
import { FeaturesSection } from './containers/features-section'
import { HeroSection } from './containers/hero-section'

export function HomePage() {
  return (
    <div className='relative flex min-h-screen flex-col'>
      <Particles
        className='pointer-events-none fixed inset-0 z-0'
        quantity={120}
        ease={80}
        size={0.4}
        staticity={50}
      />
      <div className='relative z-10 flex flex-1 flex-col'>
        <Navbar />
        <main>
          <HeroSection />
          <AcademiesSection />
          <CoursesSection />
          <FeaturesSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </div>
  )
}
