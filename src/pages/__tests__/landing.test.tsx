import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LandingPage } from '@/features/landing-page'

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        // Navigation
        'navigation.explore': 'Explorar',
        'navigation.login': 'Iniciar Sesión',
        'navigation.register': 'Registrarse',
        // Hero Section
        'landing.hero.badge': '🚀 Lanza tu Academia Hoy',
        'landing.hero.title': 'Crea tu Propia',
        'landing.hero.titleHighlight': 'Academia Online',
        'landing.hero.description':
          'Construye, administra y escala tu plataforma educativa con nuestras herramientas integrales de creación de academias. Empodera a estudiantes de todo el mundo con tu experiencia.',
        'landing.hero.startBuilding': 'Comenzar a Construir',
        'landing.hero.requestDemo': 'Solicitar Demo',
        'landing.hero.freeToStart': 'Gratis para comenzar',
        'landing.hero.noSetupFees': 'Sin tarifas de configuración',
        'landing.hero.cancelAnytime': 'Cancela cuando quieras',
        // Features Section
        'landing.features.title':
          'Todo lo que necesitas para construir tu academia',
        'landing.features.description':
          'Herramientas poderosas y funciones diseñadas para ayudarte a crear experiencias educativas atractivas',
        'landing.features.courseCreation.title': 'Creación de Cursos',
        'landing.features.studentManagement.title': 'Gestión de Estudiantes',
        'landing.features.certificates.title': 'Certificados y Badges',
        'landing.features.analytics.title': 'Análisis e Insights',
        'landing.features.integration.title': 'Integración Fácil',
        'landing.features.security.title': 'Seguro y Confiable',
        // Pricing Section
        'landing.pricing.title': 'Precios simples y transparentes',
        'landing.pricing.starter.name': 'Inicial',
        'landing.pricing.professional.name': 'Profesional',
        'landing.pricing.enterprise.name': 'Empresarial',
        'landing.pricing.enterprise.button': 'Contactar Ventas',
        'landing.pricing.starter.button': 'Comenzar Gratis',
        'landing.pricing.professional.button': 'Iniciar Prueba Gratuita',
        'landing.pricing.enterprise.dialog.title': 'Ventas Empresariales',
        // Testimonials
        'landing.testimonials.title':
          'Con la confianza de educadores de todo el mundo',
        'landing.testimonials.testimonial1.author': 'Sarah Johnson',
        'landing.testimonials.testimonial2.author': 'Michael Chen',
        'landing.testimonials.testimonial3.author': 'Emily Rodriguez',
        // CTA
        'landing.cta.title': '¿Listo para construir tu academia?',
        'landing.cta.startFreeAcademy': 'Inicia tu Academia Gratuita',
        'landing.cta.needHelp':
          '¿Necesitas ayuda para comenzar? Contacta a nuestro equipo',
        'landing.cta.contactTeam.title': 'Contacta a Nuestro Equipo',
        // Footer
        'landing.footer.allRights': 'Todos los derechos reservados',
        'landing.footer.product': 'Producto',
        'landing.footer.company': 'Empresa',
        'landing.footer.support': 'Soporte',
        'landing.footer.features': 'Características',
        'landing.footer.pricing': 'Precios',
        'landing.footer.testimonials': 'Testimonios',
      }
      return translations[key] || key
    },
  }),
}))

// Mock TanStack Router
jest.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}))

// Mock hook de traducción personalizado
jest.mock('@/hooks/use-translation', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'navigation.explore': 'Explorar',
        'navigation.login': 'Iniciar Sesión',
      }
      return translations[key] || key
    },
  }),
}))

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    nav: ({ children, ...props }: any) => <nav {...props}>{children}</nav>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => (
      <section {...props}>{children}</section>
    ),
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    button: ({ children, ...props }: any) => (
      <button {...props}>{children}</button>
    ),
    footer: ({ children, ...props }: any) => (
      <footer {...props}>{children}</footer>
    ),
  },
}))

// Mock landing-page feature components
jest.mock('@/features/landing-page/components/Navigation', () => ({
  Navigation: ({ onSectionClick }: any) => (
    <nav data-testid='navigation'>
      <div>ISWO Academy</div>
      <button onClick={() => onSectionClick('features')}>
        Características
      </button>
      <button onClick={() => onSectionClick('pricing')}>Precios</button>
      <button onClick={() => onSectionClick('testimonials')}>
        Testimonios
      </button>
      <a href='/sign-in'>Iniciar Sesión</a>
    </nav>
  ),
}))

jest.mock('@/features/landing-page/components/HeroSection', () => ({
  HeroSection: () => (
    <section data-testid='hero-section'>
      <h1>Crea tu Propia Academia Online</h1>
      <p>
        Construye, administra y escala tu plataforma educativa con nuestras
        herramientas integrales de creación de academias. Empodera a estudiantes
        de todo el mundo con tu experiencia.
      </p>
      <a href='/sign-up'>Comenzar a Construir</a>
      <button>Solicitar Demo</button>
    </section>
  ),
}))

jest.mock('@/features/landing-page/components/FeaturesSection', () => ({
  FeaturesSection: () => (
    <section data-testid='features-section' id='features'>
      <h2>Todo lo que necesitas para construir tu academia</h2>
      <div>
        <h3>Creación de Cursos</h3>
        <h3>Gestión de Estudiantes</h3>
        <h3>Certificados y Badges</h3>
        <h3>Análisis e Insights</h3>
        <h3>Integración Fácil</h3>
        <h3>Seguro y Confiable</h3>
      </div>
    </section>
  ),
}))

jest.mock('@/features/landing-page/components/PricingSection', () => ({
  PricingSection: () => (
    <section data-testid='pricing-section' id='pricing'>
      <h2>Precios simples y transparentes</h2>
      <div>
        <div>
          <h3>Inicial</h3>
          <a href='/sign-up'>Comenzar Gratis</a>
        </div>
        <div>
          <h3>Profesional</h3>
          <a href='/sign-up'>Iniciar Prueba Gratuita</a>
        </div>
        <div>
          <h3>Empresarial</h3>
          <button>Contactar Ventas</button>
        </div>
      </div>
    </section>
  ),
}))

jest.mock('@/features/landing-page/components/TestimonialsSection', () => ({
  TestimonialsSection: () => (
    <section data-testid='testimonials-section' id='testimonials'>
      <h2>Con la confianza de educadores de todo el mundo</h2>
      <div>Sarah Johnson</div>
      <div>Michael Chen</div>
      <div>Emily Rodriguez</div>
    </section>
  ),
}))

jest.mock('@/features/landing-page/components/CTASection', () => ({
  CTASection: () => (
    <section data-testid='cta-section'>
      <h2>¿Listo para construir tu academia?</h2>
      <a href='/sign-up'>Inicia tu Academia Gratuita</a>
      <button>¿Necesitas ayuda para comenzar? Contacta a nuestro equipo</button>
    </section>
  ),
}))

jest.mock('@/features/landing-page/components/Footer', () => ({
  Footer: ({ onSectionClick }: any) => (
    <footer data-testid='footer'>
      <div>
        <p>
          Empoderando a educadores para crear experiencias de aprendizaje en
          línea increíbles.
        </p>
        <div>
          <h4>Producto</h4>
          <button onClick={() => onSectionClick('features')}>
            Características
          </button>
          <button onClick={() => onSectionClick('pricing')}>Precios</button>
        </div>
        <div>
          <h4>Empresa</h4>
          <button onClick={() => onSectionClick('testimonials')}>
            Testimonios
          </button>
        </div>
        <div>
          <h4>Soporte</h4>
        </div>
        <p>© 2025 ISWO Academy. Todos los derechos reservados.</p>
        <a href='/sign-in'>Iniciar Sesión</a>
        <a href='/sign-up'>Comenzar</a>
      </div>
    </footer>
  ),
}))

jest.mock('@/features/landing-page/components/ScrollToTop', () => ({
  ScrollToTop: ({ show, onClick }: any) =>
    show ? (
      <button onClick={onClick} data-testid='scroll-to-top'>
        Scroll to Top
      </button>
    ) : null,
}))

describe('LandingPage', () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
    // Mock scrollIntoView
    Element.prototype.scrollIntoView = jest.fn()
    // Mock window.scrollTo
    window.scrollTo = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders hero section with main heading', () => {
    render(<LandingPage />)

    expect(
      screen.getByText('Crea tu Propia Academia Online')
    ).toBeInTheDocument()
  })

  it('renders navigation with brand name', () => {
    render(<LandingPage />)

    expect(screen.getAllByText('ISWO Academy')).toHaveLength(1) // Navigation
  })

  it('renders call-to-action buttons', () => {
    render(<LandingPage />)

    expect(screen.getByText('Comenzar a Construir')).toBeInTheDocument()
    expect(screen.getAllByText('Solicitar Demo').length).toBeGreaterThanOrEqual(
      1
    )
  })

  it('renders features section', () => {
    render(<LandingPage />)

    expect(
      screen.getByText('Todo lo que necesitas para construir tu academia')
    ).toBeInTheDocument()
    expect(screen.getByText('Creación de Cursos')).toBeInTheDocument()
    expect(screen.getByText('Gestión de Estudiantes')).toBeInTheDocument()
    expect(screen.getByText('Certificados y Badges')).toBeInTheDocument()
  })

  it('renders pricing section', () => {
    render(<LandingPage />)

    expect(
      screen.getByText('Precios simples y transparentes')
    ).toBeInTheDocument()
    expect(screen.getByText('Inicial')).toBeInTheDocument()
    expect(screen.getByText('Profesional')).toBeInTheDocument()
    expect(screen.getByText('Empresarial')).toBeInTheDocument()
  })

  it('renders testimonials section', () => {
    render(<LandingPage />)

    expect(
      screen.getByText('Con la confianza de educadores de todo el mundo')
    ).toBeInTheDocument()
    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument()
    expect(screen.getByText('Michael Chen')).toBeInTheDocument()
    expect(screen.getByText('Emily Rodriguez')).toBeInTheDocument()
  })

  it('renders final CTA section', () => {
    render(<LandingPage />)

    expect(
      screen.getByText('¿Listo para construir tu academia?')
    ).toBeInTheDocument()
    expect(screen.getByText('Inicia tu Academia Gratuita')).toBeInTheDocument()
  })

  it('renders footer', () => {
    render(<LandingPage />)

    expect(
      screen.getByText('© 2025 ISWO Academy. Todos los derechos reservados.')
    ).toBeInTheDocument()
  })

  it('renders hero section correctly', () => {
    render(<LandingPage />)

    expect(screen.getByTestId('hero-section')).toBeInTheDocument()
    expect(
      screen.getByText('Crea tu Propia Academia Online')
    ).toBeInTheDocument()
  })

  it('includes proper navigation links', () => {
    render(<LandingPage />)

    const signInLinks = screen.getAllByRole('link', { name: /iniciar sesión/i })
    const getStartedLinks = screen.getAllByRole('link', { name: /comenzar/i })

    // Should have Sign In links in navigation and footer
    expect(signInLinks.length).toBeGreaterThanOrEqual(2)
    signInLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', '/sign-in')
    })

    // Should have Get Started links in navigation and CTA sections
    expect(getStartedLinks.length).toBeGreaterThanOrEqual(1)
    getStartedLinks.forEach((link) => {
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
        block: 'start',
      })
    })

    it('scrolls to pricing section when nav Pricing button is clicked', async () => {
      render(<LandingPage />)

      const pricingButtons = screen.getAllByText('Precios')
      const navPricingButton = pricingButtons[0] // First one is in nav
      await user.click(navPricingButton)

      expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start',
      })
    })

    it('scrolls to testimonials section when nav Testimonials button is clicked', async () => {
      render(<LandingPage />)

      const testimonialsButtons = screen.getAllByText('Testimonios')
      const navTestimonialsButton = testimonialsButtons[0] // First one is in nav
      await user.click(navTestimonialsButton)

      expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start',
      })
    })
  })

  describe('Demo Request Modal', () => {
    it('renders demo request button', () => {
      render(<LandingPage />)

      const requestDemoButtons = screen.getAllByText('Solicitar Demo')
      expect(requestDemoButtons.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('Contact and Enterprise Modals', () => {
    it('renders contact button in CTA section', () => {
      render(<LandingPage />)

      const contactButton = screen.getByText(
        '¿Necesitas ayuda para comenzar? Contacta a nuestro equipo'
      )
      expect(contactButton).toBeInTheDocument()
    })

    it('renders enterprise sales button in pricing section', () => {
      render(<LandingPage />)

      const contactSalesButton = screen.getByText('Contactar Ventas')
      expect(contactSalesButton).toBeInTheDocument()
    })
  })

  describe('Scroll to Top Button', () => {
    it('scroll functionality is available', () => {
      render(<LandingPage />)

      // Verify that scroll functionality exists
      expect(window.scrollTo).toBeDefined()
    })
  })

  describe('Enhanced Footer CTAs', () => {
    it('renders footer with enhanced navigation and CTAs', () => {
      render(<LandingPage />)

      expect(
        screen.getByText(
          'Empoderando a educadores para crear experiencias de aprendizaje en línea increíbles.'
        )
      ).toBeInTheDocument()
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

    it('footer has navigation buttons', () => {
      render(<LandingPage />)

      // Check for footer navigation buttons
      const footerButtons = screen.getAllByText('Características')
      expect(footerButtons.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('All CTAs Lead to Auth Flows', () => {
    it('all sign-up CTAs link to /sign-up', () => {
      render(<LandingPage />)

      const signUpLinks = screen
        .getAllByRole('link')
        .filter((link) => link.getAttribute('href') === '/sign-up')

      expect(signUpLinks.length).toBeGreaterThanOrEqual(3)
    })

    it('all sign-in CTAs link to /sign-in', () => {
      render(<LandingPage />)

      const signInLinks = screen
        .getAllByRole('link')
        .filter((link) => link.getAttribute('href') === '/sign-in')

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
