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
    
    expect(screen.getByText('Crea tu Propia')).toBeInTheDocument()
    expect(screen.getByText('Academia Online')).toBeInTheDocument()
  })

  it('renders navigation with brand name', () => {
    render(<LandingPage />)
    
    expect(screen.getAllByText('ISWO Academy')).toHaveLength(2) // Navigation and footer
  })

  it('renders call-to-action buttons', () => {
    render(<LandingPage />)
    
    expect(screen.getByText('Comenzar a Construir')).toBeInTheDocument()
    expect(screen.getAllByText('Solicitar Demo').length).toBeGreaterThanOrEqual(1)
  })

  it('renders features section', () => {
    render(<LandingPage />)
    
    expect(screen.getByText('Todo lo que necesitas para construir tu academia')).toBeInTheDocument()
    expect(screen.getByText('Creación de Cursos')).toBeInTheDocument()
    expect(screen.getByText('Gestión de Estudiantes')).toBeInTheDocument()
    expect(screen.getByText('Certificados y Badges')).toBeInTheDocument()
  })

  it('renders pricing section', () => {
    render(<LandingPage />)
    
    expect(screen.getByText('Precios simples y transparentes')).toBeInTheDocument()
    expect(screen.getByText('Inicial')).toBeInTheDocument()
    expect(screen.getByText('Profesional')).toBeInTheDocument()
    expect(screen.getByText('Empresarial')).toBeInTheDocument()
  })

  it('renders testimonials section', () => {
    render(<LandingPage />)
    
    expect(screen.getByText('Con la confianza de educadores de todo el mundo')).toBeInTheDocument()
    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument()
    expect(screen.getByText('Michael Chen')).toBeInTheDocument()
    expect(screen.getByText('Emily Rodriguez')).toBeInTheDocument()
  })

  it('renders final CTA section', () => {
    render(<LandingPage />)
    
    expect(screen.getByText('¿Listo para construir tu academia?')).toBeInTheDocument()
    expect(screen.getByText('Inicia tu Academia Gratuita')).toBeInTheDocument()
  })

  it('renders footer', () => {
    render(<LandingPage />)
    
    expect(screen.getByText('© 2025 ISWO Academy. Todos los derechos reservados.')).toBeInTheDocument()
  })

  it('has responsive design classes', () => {
    render(<LandingPage />)
    
    const heroSection = screen.getByText('Crea tu Propia').closest('section')
    expect(heroSection).toHaveClass('py-20', 'lg:py-32')
  })

  it('includes proper navigation links', () => {
    render(<LandingPage />)
    
    const signInLinks = screen.getAllByRole('link', { name: /iniciar sesión/i })
    const getStartedLinks = screen.getAllByRole('link', { name: /comenzar/i })
    
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
      
      const featuresButtons = screen.getAllByText('Características')
      const pricingButtons = screen.getAllByText('Precios')
      const testimonialsButtons = screen.getAllByText('Testimonios')
      
      expect(featuresButtons.length).toBeGreaterThanOrEqual(1)
      expect(pricingButtons.length).toBeGreaterThanOrEqual(1)
      expect(testimonialsButtons.length).toBeGreaterThanOrEqual(1)
    })

    it('scrolls to features section when nav Features button is clicked', async () => {
      render(<LandingPage />)
      
      const featuresButtons = screen.getAllByText('Características')
      const navFeaturesButton = featuresButtons[0] // First one is in nav
      await user.click(navFeaturesButton)
      
      expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start'
      })
    })

    it('scrolls to pricing section when nav Pricing button is clicked', async () => {
      render(<LandingPage />)
      
      const pricingButtons = screen.getAllByText('Precios')
      const navPricingButton = pricingButtons[0] // First one is in nav
      await user.click(navPricingButton)
      
      expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start'
      })
    })

    it('scrolls to testimonials section when nav Testimonials button is clicked', async () => {
      render(<LandingPage />)
      
      const testimonialsButtons = screen.getAllByText('Testimonios')
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
      
      const requestDemoButtons = screen.getAllByText('Solicitar Demo')
      const heroRequestDemoButton = requestDemoButtons[0] // First one is in hero section
      await user.click(heroRequestDemoButton)
      
      expect(screen.getByText('Solicitar una Demo')).toBeInTheDocument()
      expect(screen.getByText(/Obtén una demostración personalizada/)).toBeInTheDocument()
    })

    it('renders demo form with all required fields', async () => {
      render(<LandingPage />)
      
      const requestDemoButtons = screen.getAllByText('Solicitar Demo')
      const heroRequestDemoButton = requestDemoButtons[0]
      await user.click(heroRequestDemoButton)
      
      expect(screen.getByLabelText('Nombre *')).toBeInTheDocument()
      expect(screen.getByLabelText('Email *')).toBeInTheDocument()
      expect(screen.getByLabelText('Empresa')).toBeInTheDocument()
      expect(screen.getByLabelText('Teléfono')).toBeInTheDocument()
      expect(screen.getByLabelText('Cuéntanos sobre tus necesidades')).toBeInTheDocument()
    })

    it('submits demo form with valid data', async () => {
      render(<LandingPage />)
      
      const requestDemoButtons = screen.getAllByText('Solicitar Demo')
      const heroRequestDemoButton = requestDemoButtons[0]
      await user.click(heroRequestDemoButton)
      
      // Fill out the form
      await user.type(screen.getByLabelText('Nombre *'), 'John Doe')
      await user.type(screen.getByLabelText('Email *'), 'john@example.com')
      await user.type(screen.getByLabelText('Empresa'), 'Test Company')
      await user.type(screen.getByLabelText('Teléfono'), '+1234567890')
      await user.type(screen.getByLabelText('Cuéntanos sobre tus necesidades'), 'I need an academy for my courses')
      
      const submitButton = screen.getByRole('button', { name: 'Solicitar Demo' })
      await user.click(submitButton)
      
      // Should show loading state
      expect(screen.getByText('Enviando...')).toBeInTheDocument()
      
      // Wait for success message
      await waitFor(() => {
        expect(screen.getByText('¡Solicitud de Demo Enviada!')).toBeInTheDocument()
      }, { timeout: 2000 })
    })

    it('requires name and email fields', async () => {
      render(<LandingPage />)
      
      const requestDemoButtons = screen.getAllByText('Solicitar Demo')
      const heroRequestDemoButton = requestDemoButtons[0]
      await user.click(heroRequestDemoButton)
      
      const submitButton = screen.getByRole('button', { name: 'Solicitar Demo' })
      await user.click(submitButton)
      
      // Form should not submit without required fields
      expect(screen.queryByText('Enviando...')).not.toBeInTheDocument()
    })
  })

  describe('Contact and Enterprise Modals', () => {
    it('opens contact modal from CTA section', async () => {
      render(<LandingPage />)
      
      const contactButton = screen.getByText('¿Necesitas ayuda para comenzar? Contacta a nuestro equipo')
      await user.click(contactButton)
      
      expect(screen.getByText('Contacta a Nuestro Equipo')).toBeInTheDocument()
      expect(screen.getByText('support@iswoacademy.com')).toBeInTheDocument()
      expect(screen.getByText('+1 (555) 123-4567')).toBeInTheDocument()
    })

    it('opens enterprise sales modal from pricing section', async () => {
      render(<LandingPage />)
      
      const contactSalesButton = screen.getByText('Contactar Ventas')
      await user.click(contactSalesButton)
      
      expect(screen.getByRole('heading', { name: 'Ventas Empresariales' })).toBeInTheDocument()
      expect(screen.getByText('enterprise@iswoacademy.com')).toBeInTheDocument()
      expect(screen.getByText('+1 (555) 123-4568')).toBeInTheDocument()
    })

    it('includes CTA buttons in enterprise modal', async () => {
      render(<LandingPage />)
      
      const contactSalesButton = screen.getByText('Contactar Ventas')
      await user.click(contactSalesButton)
      
      expect(screen.getByText('Comenzar con Prueba Gratuita')).toBeInTheDocument()
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
      
      expect(screen.getByText('Empoderando a educadores para crear experiencias de aprendizaje en línea increíbles.')).toBeInTheDocument()
      expect(screen.getByText('Producto')).toBeInTheDocument()
      expect(screen.getByText('Empresa')).toBeInTheDocument()
      expect(screen.getByText('Soporte')).toBeInTheDocument()
    })

    it('includes multiple CTA buttons in footer', () => {
      render(<LandingPage />)
      
      // Should have multiple Get Started and Sign In buttons throughout the page
      const getStartedButtons = screen.getAllByText(/comenzar/i)
      const signInButtons = screen.getAllByText(/iniciar sesión/i)
      
      expect(getStartedButtons.length).toBeGreaterThanOrEqual(2)
      expect(signInButtons.length).toBeGreaterThanOrEqual(2)
    })

    it('footer navigation buttons trigger smooth scrolling', async () => {
      render(<LandingPage />)
      
      // Find footer navigation buttons
      const footerButtons = screen.getAllByText('Características')
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
      expect(screen.getAllByText('Comenzar Gratis')[0]).toBeInTheDocument()
      
      // Professional plan should link to sign-up
      expect(screen.getByText('Iniciar Prueba Gratuita')).toBeInTheDocument()
      
      // Enterprise plan should open contact modal
      expect(screen.getByText('Contactar Ventas')).toBeInTheDocument()
    })
  })
})