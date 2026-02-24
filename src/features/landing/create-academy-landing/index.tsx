import { AcademyHero } from './components/academy-hero'
import { BenefitsSection } from './components/benefits-section'
import { HowItWorks } from './components/how-it-works'
import { PricingSection } from './components/pricing-section'
import { TestimonialsSection } from './components/testimonials-section'
import { AcademyFaq } from './components/academy-faq'
import { AcademyCta } from './components/academy-cta'
import { Footer, Navbar } from '@/components'

export function CreateAcademyLandingPage() {
  return (
    <div className='min-h-screen flex flex-col bg-background'>
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
