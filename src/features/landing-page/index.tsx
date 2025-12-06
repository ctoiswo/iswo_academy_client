import { useState, useEffect } from 'react'
import { CTASection } from './components/CTASection'
import { FeaturesSection } from './components/FeaturesSection'
import { Footer } from './components/Footer'
import { HeroSection } from './components/HeroSection'
import { Navigation } from './components/Navigation'
import { PricingSection } from './components/PricingSection'
import { ScrollToTop } from './components/ScrollToTop'
import { TestimonialsSection } from './components/TestimonialsSection'

export function LandingPage() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <div className='bg-background min-h-screen'>
      <Navigation onSectionClick={scrollToSection} />
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <TestimonialsSection />
      <CTASection />
      <Footer onSectionClick={scrollToSection} />
      <ScrollToTop show={showScrollTop} onClick={scrollToTop} />
    </div>
  )
}
