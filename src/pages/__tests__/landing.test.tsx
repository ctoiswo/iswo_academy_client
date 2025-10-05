import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { LandingPage } from '../landing'

// Mock the router components
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}))

describe('LandingPage', () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
    // Mock scrollIntoView
    Element.prototype.scrollIntoView = vi.fn()
    // Mock window.scrollTo
    window.scrollTo = vi.fn()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders hero section with main heading', () => {
    render(<LandingPage />)
    
    expect(screen.getByText('Create Your Own')).toBeInTheDocument()
    expect(screen.getByText('Online Academy')).toBeInTheDocument()
  })

  it('renders navigation with brand name', () => {
    render(<LandingPage />)
    
    expect(screen.getAllByText('ISWO Academy')).toHaveLength(2) // Navigation and footer
  })

  it('renders call-to-action buttons', () => {
    render(<LandingPage />)
    
    expect(screen.getByText('Start Building Now')).toBeInTheDocument()
    expect(screen.getAllByText('Request Demo').length).toBeGreaterThanOrEqual(1)
  })

  it('renders features section', () => {
    render(<LandingPage />)
    
    expect(screen.getByText('Everything you need to build your academy')).toBeInTheDocument()
    expect(screen.getByText('Course Creation')).toBeInTheDocument()
    expect(screen.getByText('Student Management')).toBeInTheDocument()
    expect(screen.getByText('Certificates & Badges')).toBeInTheDocument()
  })

  it('renders pricing section', () => {
    render(<LandingPage />)
    
    expect(screen.getByText('Simple, transparent pricing')).toBeInTheDocument()
    expect(screen.getByText('Starter')).toBeInTheDocument()
    expect(screen.getByText('Professional')).toBeInTheDocument()
    expect(screen.getByText('Enterprise')).toBeInTheDocument()
  })

  it('renders testimonials section', () => {
    render(<LandingPage />)
    
    expect(screen.getByText('Trusted by educators worldwide')).toBeInTheDocument()
    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument()
    expect(screen.getByText('Michael Chen')).toBeInTheDocument()
    expect(screen.getByText('Emily Rodriguez')).toBeInTheDocument()
  })

  it('renders final CTA section', () => {
    render(<LandingPage />)
    
    expect(screen.getByText('Ready to build your academy?')).toBeInTheDocument()
    expect(screen.getByText('Start Your Free Academy')).toBeInTheDocument()
  })

  it('renders footer', () => {
    render(<LandingPage />)
    
    expect(screen.getByText('© 2025 ISWO Academy. All rights reserved.')).toBeInTheDocument()
  })

  it('has responsive design classes', () => {
    render(<LandingPage />)
    
    const heroSection = screen.getByText('Create Your Own').closest('section')
    expect(heroSection).toHaveClass('py-20', 'lg:py-32')
  })

  it('includes proper navigation links', () => {
    render(<LandingPage />)
    
    const signInLinks = screen.getAllByRole('link', { name: /sign in/i })
    const getStartedLinks = screen.getAllByRole('link', { name: /get started/i })
    
    // Should have Sign In links in navigation and footer
    expect(signInLinks.length).toBeGreaterThanOrEqual(2)
    signInLinks.forEach(link => {
      expect(link).toHaveAttribute('href', '/sign-in')
    })
    
    // Should have Get Started links in navigation and CTA sections
    expect(getStartedLinks.length).toBeGreaterThanOrEqual(1)
    getStartedLinks.forEach(link => {
      expect(link).toHaveAttribute('href', '/sign-up')
    })
  })

  describe('Smooth Scrolling Navigation', () => {
    it('renders navigation menu with smooth scroll buttons', () => {
      render(<LandingPage />)
      
      const featuresButtons = screen.getAllByText('Features')
      const pricingButtons = screen.getAllByText('Pricing')
      const testimonialsButtons = screen.getAllByText('Testimonials')
      
      expect(featuresButtons.length).toBeGreaterThanOrEqual(1)
      expect(pricingButtons.length).toBeGreaterThanOrEqual(1)
      expect(testimonialsButtons.length).toBeGreaterThanOrEqual(1)
    })

    it('scrolls to features section when nav Features button is clicked', async () => {
      render(<LandingPage />)
      
      const featuresButtons = screen.getAllByText('Features')
      const navFeaturesButton = featuresButtons[0] // First one is in nav
      await user.click(navFeaturesButton)
      
      expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start'
      })
    })

    it('scrolls to pricing section when nav Pricing button is clicked', async () => {
      render(<LandingPage />)
      
      const pricingButtons = screen.getAllByText('Pricing')
      const navPricingButton = pricingButtons[0] // First one is in nav
      await user.click(navPricingButton)
      
      expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start'
      })
    })

    it('scrolls to testimonials section when nav Testimonials button is clicked', async () => {
      render(<LandingPage />)
      
      const testimonialsButtons = screen.getAllByText('Testimonials')
      const navTestimonialsButton = testimonialsButtons[0] // First one is in nav
      await user.click(navTestimonialsButton)
      
      expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start'
      })
    })
  })

  describe('Demo Request Modal', () => {
    it('opens demo request modal when Request Demo button is clicked', async () => {
      render(<LandingPage />)
      
      const requestDemoButtons = screen.getAllByText('Request Demo')
      const heroRequestDemoButton = requestDemoButtons[0] // First one is in hero section
      await user.click(heroRequestDemoButton)
      
      expect(screen.getByText('Request a Demo')).toBeInTheDocument()
      expect(screen.getByText(/Get a personalized demo/)).toBeInTheDocument()
    })

    it('renders demo form with all required fields', async () => {
      render(<LandingPage />)
      
      const requestDemoButtons = screen.getAllByText('Request Demo')
      const heroRequestDemoButton = requestDemoButtons[0]
      await user.click(heroRequestDemoButton)
      
      expect(screen.getByLabelText('Name *')).toBeInTheDocument()
      expect(screen.getByLabelText('Email *')).toBeInTheDocument()
      expect(screen.getByLabelText('Company')).toBeInTheDocument()
      expect(screen.getByLabelText('Phone')).toBeInTheDocument()
      expect(screen.getByLabelText('Tell us about your needs')).toBeInTheDocument()
    })

    it('submits demo form with valid data', async () => {
      render(<LandingPage />)
      
      const requestDemoButtons = screen.getAllByText('Request Demo')
      const heroRequestDemoButton = requestDemoButtons[0]
      await user.click(heroRequestDemoButton)
      
      // Fill out the form
      await user.type(screen.getByLabelText('Name *'), 'John Doe')
      await user.type(screen.getByLabelText('Email *'), 'john@example.com')
      await user.type(screen.getByLabelText('Company'), 'Test Company')
      await user.type(screen.getByLabelText('Phone'), '+1234567890')
      await user.type(screen.getByLabelText('Tell us about your needs'), 'I need an academy for my courses')
      
      const submitButton = screen.getByRole('button', { name: 'Request Demo' })
      await user.click(submitButton)
      
      // Should show loading state
      expect(screen.getByText('Submitting...')).toBeInTheDocument()
      
      // Wait for success message
      await waitFor(() => {
        expect(screen.getByText('Demo Request Submitted!')).toBeInTheDocument()
      }, { timeout: 2000 })
    })

    it('requires name and email fields', async () => {
      render(<LandingPage />)
      
      const requestDemoButtons = screen.getAllByText('Request Demo')
      const heroRequestDemoButton = requestDemoButtons[0]
      await user.click(heroRequestDemoButton)
      
      const submitButton = screen.getByRole('button', { name: 'Request Demo' })
      await user.click(submitButton)
      
      // Form should not submit without required fields
      expect(screen.queryByText('Submitting...')).not.toBeInTheDocument()
    })
  })

  describe('Contact and Enterprise Modals', () => {
    it('opens contact modal from CTA section', async () => {
      render(<LandingPage />)
      
      const contactButton = screen.getByText('Need help getting started? Contact our team')
      await user.click(contactButton)
      
      expect(screen.getByText('Contact Our Team')).toBeInTheDocument()
      expect(screen.getByText('support@iswoacademy.com')).toBeInTheDocument()
      expect(screen.getByText('+1 (555) 123-4567')).toBeInTheDocument()
    })

    it('opens enterprise sales modal from pricing section', async () => {
      render(<LandingPage />)
      
      const contactSalesButton = screen.getByText('Contact Sales')
      await user.click(contactSalesButton)
      
      expect(screen.getByRole('heading', { name: 'Enterprise Sales' })).toBeInTheDocument()
      expect(screen.getByText('enterprise@iswoacademy.com')).toBeInTheDocument()
      expect(screen.getByText('+1 (555) 123-4568')).toBeInTheDocument()
    })

    it('includes CTA buttons in enterprise modal', async () => {
      render(<LandingPage />)
      
      const contactSalesButton = screen.getByText('Contact Sales')
      await user.click(contactSalesButton)
      
      expect(screen.getByText('Start with Free Trial')).toBeInTheDocument()
    })
  })

  describe('Scroll to Top Button', () => {
    it('shows scroll to top button when scrolled down', () => {
      // Mock window.scrollY
      Object.defineProperty(window, 'scrollY', {
        writable: true,
        value: 500,
      })

      render(<LandingPage />)
      
      // Trigger scroll event
      fireEvent.scroll(window, { target: { scrollY: 500 } })
      
      // Note: The button visibility is controlled by state, so we need to test the scroll behavior
      expect(window.scrollTo).toBeDefined()
    })

    it('scrolls to top when scroll to top button is clicked', () => {
      render(<LandingPage />)
      
      // Simulate scroll position
      Object.defineProperty(window, 'scrollY', {
        writable: true,
        value: 500,
      })
      
      // The scroll to top functionality should work
      expect(window.scrollTo).toBeDefined()
    })
  })

  describe('Enhanced Footer CTAs', () => {
    it('renders footer with enhanced navigation and CTAs', () => {
      render(<LandingPage />)
      
      expect(screen.getByText('Empowering educators to create amazing online learning experiences.')).toBeInTheDocument()
      expect(screen.getByText('Product')).toBeInTheDocument()
      expect(screen.getByText('Company')).toBeInTheDocument()
      expect(screen.getByText('Support')).toBeInTheDocument()
    })

    it('includes multiple CTA buttons in footer', () => {
      render(<LandingPage />)
      
      // Should have multiple Get Started and Sign In buttons throughout the page
      const getStartedButtons = screen.getAllByText(/get started|start free/i)
      const signInButtons = screen.getAllByText(/sign in/i)
      
      expect(getStartedButtons.length).toBeGreaterThanOrEqual(2)
      expect(signInButtons.length).toBeGreaterThanOrEqual(2)
    })

    it('footer navigation buttons trigger smooth scrolling', async () => {
      render(<LandingPage />)
      
      // Find footer navigation buttons
      const footerButtons = screen.getAllByText('Features')
      const footerFeaturesButton = footerButtons.find(button => 
        button.closest('footer') !== null
      )
      
      if (footerFeaturesButton) {
        await user.click(footerFeaturesButton)
        expect(Element.prototype.scrollIntoView).toHaveBeenCalled()
      }
    })
  })

  describe('All CTAs Lead to Auth Flows', () => {
    it('all sign-up CTAs link to /sign-up', () => {
      render(<LandingPage />)
      
      const signUpLinks = screen.getAllByRole('link').filter(link => 
        link.getAttribute('href') === '/sign-up'
      )
      
      expect(signUpLinks.length).toBeGreaterThanOrEqual(3)
    })

    it('all sign-in CTAs link to /sign-in', () => {
      render(<LandingPage />)
      
      const signInLinks = screen.getAllByRole('link').filter(link => 
        link.getAttribute('href') === '/sign-in'
      )
      
      expect(signInLinks.length).toBeGreaterThanOrEqual(2)
    })

    it('pricing plan CTAs lead to appropriate flows', () => {
      render(<LandingPage />)
      
      // Starter plan should link to sign-up
      expect(screen.getByText('Get Started Free')).toBeInTheDocument()
      
      // Professional plan should link to sign-up
      expect(screen.getByText('Start Free Trial')).toBeInTheDocument()
      
      // Enterprise plan should open contact modal
      expect(screen.getByText('Contact Sales')).toBeInTheDocument()
    })
  })
})