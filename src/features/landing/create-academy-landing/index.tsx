import { AcademyHero } from './containers/academy-hero'
import { BenefitsSection } from './containers/benefits-section'
import { HowItWorks } from './containers/how-it-works'
import { PricingSection } from './containers/pricing-section'
import { TestimonialsSection } from './containers/testimonials-section'
import { AcademyFaq } from './containers/academy-faq'
import { AcademyCta } from './containers/academy-cta'
import { Footer, Navbar } from '@/components'
import { Particles } from '@/components/ui/particles'

export function CreateAcademyLandingPage() {
  return (
    <div className='min-h-screen flex flex-col bg-background'>
      <Particles
        className='fixed inset-0 z-0 pointer-events-none'
        quantity={120}
        ease={80}
        size={0.4}
        staticity={50}
      />
      <Navbar />
      <main>
        <AcademyHero />
        <BenefitsSection />
        <HowItWorks />
        <PricingSection />
        <TestimonialsSection />
        <AcademyFaq />
        <AcademyCta />
      </main>
      <Footer />
    </div>
  )
}
