/**
 * Home Page – Landing design following app design system
 */
import { Particles } from '@/components/ui/particles'
import { HeroSection } from './containers/hero-section'
import { AcademiesSection } from './containers/academies-section'
import { CoursesSection } from './containers/courses-section'
import { FeaturesSection } from './containers/features-section'
import { CTASection } from './containers/cta-section'
import { Navbar, Footer } from '@/components'

export function HomePage() {
  return (
    <div className='relative min-h-screen flex flex-col'>
      <Particles
        className='fixed inset-0 z-0 pointer-events-none'
        quantity={120}
        ease={80}
        size={0.4}
        staticity={50}
      />
      <div className='relative z-10 flex flex-col flex-1'>
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
