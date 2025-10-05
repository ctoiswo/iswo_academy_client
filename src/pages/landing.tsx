import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import {
  GraduationCap,
  Users,
  BookOpen,
  Trophy,
  Star,
  Check,
  ArrowRight,
  Play,
  Zap,
  Shield,
  BarChart3,
  Mail,
  Phone,
  Building,
  ChevronUp,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function LandingPage() {
  const [demoFormData, setDemoFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
  })
  const [isSubmittingDemo, setIsSubmittingDemo] = useState(false)
  const [demoSubmitted, setDemoSubmitted] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleDemoFormChange = (field: string, value: string) => {
    setDemoFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingDemo(true)

    // Simulate API call - in real implementation, this would call the backend
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setDemoSubmitted(true)
    setIsSubmittingDemo(false)

    // Reset form after 3 seconds
    setTimeout(() => {
      setDemoSubmitted(false)
      setDemoFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        message: '',
      })
    }, 3000)
  }

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
      {/* Navigation */}
      <motion.nav
        className='bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur'
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className='container flex h-16 items-center justify-between'>
          <motion.div
            className='flex items-center space-x-2'
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <GraduationCap className='text-primary h-8 w-8' />
            <span className='text-xl font-bold'>ISWO Academy</span>
          </motion.div>
          <div className='hidden items-center space-x-6 md:flex'>
            <Link
              to='/'
              className='hover:text-primary text-sm font-medium transition-colors'
            >
              Explorar Cursos
            </Link>
            <button
              onClick={() => scrollToSection('features')}
              className='hover:text-primary text-sm font-medium transition-colors'
            >
              Características
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className='hover:text-primary text-sm font-medium transition-colors'
            >
              Precios
            </button>
            <button
              onClick={() => scrollToSection('testimonials')}
              className='hover:text-primary text-sm font-medium transition-colors'
            >
              Testimonios
            </button>
          </div>
          <div className='flex items-center space-x-4'>
            <Button variant='ghost' asChild>
              <Link to='/sign-in'>Iniciar Sesión</Link>
            </Button>
            <Button asChild>
              <Link to='/sign-up'>Comenzar</Link>
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section id='hero' className='relative overflow-hidden py-20 lg:py-32'>
        {/* Background Image from Pexels */}
        <div className='absolute inset-0 z-0'>
          <img
            src='https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
            alt='Estudiantes aprendiendo'
            className='h-full w-full object-cover opacity-10'
          />
          <div className='from-background/80 to-background/60 absolute inset-0 bg-gradient-to-br' />
        </div>

        <div className='relative z-10 container'>
          <div className='mx-auto max-w-4xl text-center'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant='outline' className='mb-6'>
                🚀 Lanza tu Academia Hoy
              </Badge>
            </motion.div>

            <motion.h1
              className='text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Crea tu Propia
              <span className='text-primary'> Academia Online</span>
            </motion.h1>

            <motion.p
              className='text-muted-foreground mt-6 text-lg leading-8 sm:text-xl'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Construye, administra y escala tu plataforma educativa con
              nuestras herramientas integrales de creación de academias.
              Empodera a estudiantes de todo el mundo con tu experiencia.
            </motion.p>

            <motion.div
              className='mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size='lg' asChild>
                  <Link to='/sign-up'>
                    Comenzar a Construir
                    <ArrowRight className='ml-2 h-4 w-4' />
                  </Link>
                </Button>
              </motion.div>
              <Dialog>
                <DialogTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant='outline' size='lg'>
                      <Play className='mr-2 h-4 w-4' />
                      Solicitar Demo
                    </Button>
                  </motion.div>
                </DialogTrigger>
                <DialogContent className='sm:max-w-[425px]'>
                  <DialogHeader>
                    <DialogTitle>Solicitar una Demo</DialogTitle>
                    <DialogDescription>
                      Obtén una demostración personalizada de ISWO Academy y
                      descubre cómo puede transformar tu negocio educativo.
                    </DialogDescription>
                  </DialogHeader>
                  {demoSubmitted ? (
                    <div className='py-6 text-center'>
                      <Check className='mx-auto mb-4 h-12 w-12 text-green-500' />
                      <h3 className='mb-2 text-lg font-semibold'>
                        ¡Solicitud de Demo Enviada!
                      </h3>
                      <p className='text-muted-foreground'>
                        Gracias por tu interés. Nuestro equipo se pondrá en
                        contacto contigo en las próximas 24 horas para programar
                        tu demostración personalizada.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleDemoSubmit} className='space-y-4'>
                      <div className='grid grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                          <Label htmlFor='demo-name'>Nombre *</Label>
                          <Input
                            id='demo-name'
                            value={demoFormData.name}
                            onChange={(e) =>
                              handleDemoFormChange('name', e.target.value)
                            }
                            required
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='demo-email'>Email *</Label>
                          <Input
                            id='demo-email'
                            type='email'
                            value={demoFormData.email}
                            onChange={(e) =>
                              handleDemoFormChange('email', e.target.value)
                            }
                            required
                          />
                        </div>
                      </div>
                      <div className='grid grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                          <Label htmlFor='demo-company'>Empresa</Label>
                          <Input
                            id='demo-company'
                            value={demoFormData.company}
                            onChange={(e) =>
                              handleDemoFormChange('company', e.target.value)
                            }
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='demo-phone'>Teléfono</Label>
                          <Input
                            id='demo-phone'
                            type='tel'
                            value={demoFormData.phone}
                            onChange={(e) =>
                              handleDemoFormChange('phone', e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='demo-message'>
                          Cuéntanos sobre tus necesidades
                        </Label>
                        <Textarea
                          id='demo-message'
                          placeholder='¿Qué tipo de academia buscas crear? ¿Cuántos estudiantes esperas?'
                          value={demoFormData.message}
                          onChange={(e) =>
                            handleDemoFormChange('message', e.target.value)
                          }
                          rows={3}
                        />
                      </div>
                      <Button
                        type='submit'
                        className='w-full'
                        disabled={isSubmittingDemo}
                      >
                        {isSubmittingDemo ? 'Enviando...' : 'Solicitar Demo'}
                      </Button>
                    </form>
                  )}
                </DialogContent>
              </Dialog>
            </motion.div>

            <motion.div
              className='text-muted-foreground mt-8 flex items-center justify-center space-x-6 text-sm'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className='flex items-center'>
                <Check className='mr-2 h-4 w-4 text-green-500' />
                Gratis para comenzar
              </div>
              <div className='flex items-center'>
                <Check className='mr-2 h-4 w-4 text-green-500' />
                Sin tarifas de configuración
              </div>
              <div className='flex items-center'>
                <Check className='mr-2 h-4 w-4 text-green-500' />
                Cancela cuando quieras
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id='features'
        className='bg-muted/50 relative overflow-hidden py-20'
      >
        {/* Background Image from Pexels */}
        <div className='absolute inset-0 z-0'>
          <img
            src='https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
            alt='Libros y aprendizaje'
            className='h-full w-full object-cover opacity-5'
          />
        </div>

        <div className='relative z-10 container'>
          <motion.div
            className='mx-auto max-w-2xl text-center'
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>
              Todo lo que necesitas para construir tu academia
            </h2>
            <p className='text-muted-foreground mt-4 text-lg'>
              Herramientas poderosas y funciones diseñadas para ayudarte a crear
              experiencias educativas atractivas
            </p>
          </motion.div>

          <div className='mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3'>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -10 }}
            >
              <Card className='h-full'>
                <CardHeader>
                  <div className='flex items-center space-x-2'>
                    <motion.div
                      className='bg-primary/10 rounded-lg p-2'
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <BookOpen className='text-primary h-6 w-6' />
                    </motion.div>
                    <CardTitle>Creación de Cursos</CardTitle>
                  </div>
                  <CardDescription>
                    Construye cursos integrales con lecciones, cuestionarios y
                    contenido multimedia
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -10 }}
            >
              <Card className='h-full'>
                <CardHeader>
                  <div className='flex items-center space-x-2'>
                    <motion.div
                      className='bg-primary/10 rounded-lg p-2'
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Users className='text-primary h-6 w-6' />
                    </motion.div>
                    <CardTitle>Gestión de Estudiantes</CardTitle>
                  </div>
                  <CardDescription>
                    Rastrea el progreso de los estudiantes, administra
                    inscripciones e interactúa con tu comunidad
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -10 }}
            >
              <Card className='h-full'>
                <CardHeader>
                  <div className='flex items-center space-x-2'>
                    <motion.div
                      className='bg-primary/10 rounded-lg p-2'
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Trophy className='text-primary h-6 w-6' />
                    </motion.div>
                    <CardTitle>Certificados y Badges</CardTitle>
                  </div>
                  <CardDescription>
                    Recompensa logros con certificados personalizados y
                    insignias digitales
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ y: -10 }}
            >
              <Card className='h-full'>
                <CardHeader>
                  <div className='flex items-center space-x-2'>
                    <motion.div
                      className='bg-primary/10 rounded-lg p-2'
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <BarChart3 className='text-primary h-6 w-6' />
                    </motion.div>
                    <CardTitle>Análisis e Insights</CardTitle>
                  </div>
                  <CardDescription>
                    Obtén análisis detallados sobre el rendimiento de los
                    estudiantes y la efectividad de los cursos
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              whileHover={{ y: -10 }}
            >
              <Card className='h-full'>
                <CardHeader>
                  <div className='flex items-center space-x-2'>
                    <motion.div
                      className='bg-primary/10 rounded-lg p-2'
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Zap className='text-primary h-6 w-6' />
                    </motion.div>
                    <CardTitle>Integración Fácil</CardTitle>
                  </div>
                  <CardDescription>
                    Integra sin problemas con tus herramientas y flujos de
                    trabajo existentes
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              whileHover={{ y: -10 }}
            >
              <Card className='h-full'>
                <CardHeader>
                  <div className='flex items-center space-x-2'>
                    <motion.div
                      className='bg-primary/10 rounded-lg p-2'
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Shield className='text-primary h-6 w-6' />
                    </motion.div>
                    <CardTitle>Seguro y Confiable</CardTitle>
                  </div>
                  <CardDescription>
                    Seguridad de nivel empresarial con garantía de tiempo de
                    actividad del 99.9%
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id='pricing' className='relative overflow-hidden py-20'>
        {/* Background Image from Pexels */}
        <div className='absolute inset-0 z-0'>
          <img
            src='https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
            alt='Oficina moderna'
            className='h-full w-full object-cover opacity-5'
          />
        </div>

        <div className='relative z-10 container'>
          <motion.div
            className='mx-auto max-w-2xl text-center'
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>
              Precios simples y transparentes
            </h2>
            <p className='text-muted-foreground mt-4 text-lg'>
              Elige el plan que se adapte a las necesidades de tu academia
            </p>
          </motion.div>

          <div className='mt-16 grid gap-8 lg:grid-cols-3'>
            {/* Starter Plan */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <Card className='h-full'>
                <CardHeader>
                  <CardTitle>Inicial</CardTitle>
                  <CardDescription>Perfecto para comenzar</CardDescription>
                  <div className='mt-4'>
                    <span className='text-4xl font-bold'>Gratis</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className='space-y-3'>
                    <li className='flex items-center'>
                      <Check className='mr-2 h-4 w-4 text-green-500' />
                      Hasta 3 cursos
                    </li>
                    <li className='flex items-center'>
                      <Check className='mr-2 h-4 w-4 text-green-500' />
                      Máximo 50 estudiantes
                    </li>
                    <li className='flex items-center'>
                      <Check className='mr-2 h-4 w-4 text-green-500' />
                      Análisis básicos
                    </li>
                    <li className='flex items-center'>
                      <Check className='mr-2 h-4 w-4 text-green-500' />
                      Soporte por email
                    </li>
                  </ul>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button className='mt-6 w-full' variant='outline' asChild>
                      <Link to='/sign-up'>Comenzar Gratis</Link>
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Professional Plan */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -15, scale: 1.05 }}
            >
              <Card className='border-primary relative h-full overflow-hidden'>
                <div className='from-primary/5 to-primary/10 absolute inset-0 bg-gradient-to-br' />
                <CardHeader className='relative z-10'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <CardTitle>Profesional</CardTitle>
                      <CardDescription>La opción más popular</CardDescription>
                    </div>
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: 'reverse',
                      }}
                    >
                      <Badge>Popular</Badge>
                    </motion.div>
                  </div>
                  <div className='mt-4'>
                    <span className='text-4xl font-bold'>$29</span>
                    <span className='text-muted-foreground'>/mes</span>
                  </div>
                </CardHeader>
                <CardContent className='relative z-10'>
                  <ul className='space-y-3'>
                    <li className='flex items-center'>
                      <Check className='mr-2 h-4 w-4 text-green-500' />
                      Cursos ilimitados
                    </li>
                    <li className='flex items-center'>
                      <Check className='mr-2 h-4 w-4 text-green-500' />
                      Máximo 500 estudiantes
                    </li>
                    <li className='flex items-center'>
                      <Check className='mr-2 h-4 w-4 text-green-500' />
                      Análisis avanzados
                    </li>
                    <li className='flex items-center'>
                      <Check className='mr-2 h-4 w-4 text-green-500' />
                      Certificados personalizados
                    </li>
                    <li className='flex items-center'>
                      <Check className='mr-2 h-4 w-4 text-green-500' />
                      Soporte prioritario
                    </li>
                  </ul>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button className='mt-6 w-full' asChild>
                      <Link to='/sign-up'>Iniciar Prueba Gratuita</Link>
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <Card className='h-full'>
                <CardHeader>
                  <CardTitle>Empresarial</CardTitle>
                  <CardDescription>Para organizaciones grandes</CardDescription>
                  <div className='mt-4'>
                    <span className='text-4xl font-bold'>$99</span>
                    <span className='text-muted-foreground'>/mes</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className='space-y-3'>
                    <li className='flex items-center'>
                      <Check className='mr-2 h-4 w-4 text-green-500' />
                      Todo ilimitado
                    </li>
                    <li className='flex items-center'>
                      <Check className='mr-2 h-4 w-4 text-green-500' />
                      Solución de marca blanca
                    </li>
                    <li className='flex items-center'>
                      <Check className='mr-2 h-4 w-4 text-green-500' />
                      Acceso a API
                    </li>
                    <li className='flex items-center'>
                      <Check className='mr-2 h-4 w-4 text-green-500' />
                      Integraciones personalizadas
                    </li>
                    <li className='flex items-center'>
                      <Check className='mr-2 h-4 w-4 text-green-500' />
                      Soporte telefónico 24/7
                    </li>
                  </ul>
                  <Dialog>
                    <DialogTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button className='mt-6 w-full' variant='outline'>
                          Contactar Ventas
                        </Button>
                      </motion.div>
                    </DialogTrigger>
                    <DialogContent className='sm:max-w-[425px]'>
                      <DialogHeader>
                        <DialogTitle>Ventas Empresariales</DialogTitle>
                        <DialogDescription>
                          Hablemos sobre cómo ISWO Academy Enterprise puede
                          satisfacer las necesidades de tu organización.
                        </DialogDescription>
                      </DialogHeader>
                      <div className='space-y-4'>
                        <div className='py-4 text-center'>
                          <Building className='text-primary mx-auto mb-4 h-12 w-12' />
                          <h3 className='mb-2 text-lg font-semibold'>
                            Soluciones Empresariales
                          </h3>
                          <p className='text-muted-foreground mb-4'>
                            Precios personalizados, soluciones de marca blanca y
                            soporte dedicado para organizaciones grandes.
                          </p>
                        </div>
                        <div className='space-y-3'>
                          <div className='bg-muted/50 flex items-center space-x-3 rounded-lg p-3'>
                            <Mail className='text-primary h-5 w-5' />
                            <div>
                              <p className='font-medium'>
                                Ventas Empresariales
                              </p>
                              <p className='text-muted-foreground text-sm'>
                                enterprise@iswoacademy.com
                              </p>
                            </div>
                          </div>
                          <div className='bg-muted/50 flex items-center space-x-3 rounded-lg p-3'>
                            <Phone className='text-primary h-5 w-5' />
                            <div>
                              <p className='font-medium'>Equipo de Ventas</p>
                              <p className='text-muted-foreground text-sm'>
                                +1 (555) 123-4568
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className='space-y-2 pt-4'>
                          <Button asChild className='w-full'>
                            <Link to='/sign-up'>
                              Comenzar con Prueba Gratuita
                              <ArrowRight className='ml-2 h-4 w-4' />
                            </Link>
                          </Button>
                          <p className='text-muted-foreground text-center text-xs'>
                            O comienza con nuestro plan gratuito y actualiza
                            después
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id='testimonials'
        className='bg-muted/50 relative overflow-hidden py-20'
      >
        {/* Background Image from Pexels */}
        <div className='absolute inset-0 z-0'>
          <img
            src='https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
            alt='Personas colaborando'
            className='h-full w-full object-cover opacity-5'
          />
        </div>

        <div className='relative z-10 container'>
          <motion.div
            className='mx-auto max-w-2xl text-center'
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>
              Con la confianza de educadores de todo el mundo
            </h2>
            <p className='text-muted-foreground mt-4 text-lg'>
              Mira lo que dicen nuestros creadores de academias
            </p>
          </motion.div>

          <div className='mt-16 grid gap-8 lg:grid-cols-3'>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -10, rotateY: 5 }}
            >
              <Card className='h-full'>
                <CardHeader>
                  <motion.div
                    className='flex items-center space-x-1'
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 + 0.4 }}
                      >
                        <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                      </motion.div>
                    ))}
                  </motion.div>
                  <CardDescription>
                    "ISWO Academy transformó la forma en que imparto mis cursos.
                    La plataforma es intuitiva y a mis estudiantes les encantan
                    las funciones interactivas."
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='flex items-center space-x-3'>
                    <motion.div
                      className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full'
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <span className='text-sm font-medium'>SJ</span>
                    </motion.div>
                    <div>
                      <p className='font-medium'>Sarah Johnson</p>
                      <p className='text-muted-foreground text-sm'>
                        Experta en Marketing Digital
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -10, rotateY: 5 }}
            >
              <Card className='h-full'>
                <CardHeader>
                  <motion.div
                    className='flex items-center space-x-1'
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 + 0.5 }}
                      >
                        <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                      </motion.div>
                    ))}
                  </motion.div>
                  <CardDescription>
                    "El panel de análisis me da perspectivas increíbles sobre el
                    progreso de los estudiantes. Ahora puedo optimizar mis
                    cursos para obtener mejores resultados."
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='flex items-center space-x-3'>
                    <motion.div
                      className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full'
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <span className='text-sm font-medium'>MC</span>
                    </motion.div>
                    <div>
                      <p className='font-medium'>Michael Chen</p>
                      <p className='text-muted-foreground text-sm'>
                        Instructor de Programación
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -10, rotateY: 5 }}
            >
              <Card className='h-full'>
                <CardHeader>
                  <motion.div
                    className='flex items-center space-x-1'
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 + 0.6 }}
                      >
                        <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                      </motion.div>
                    ))}
                  </motion.div>
                  <CardDescription>
                    "Configurar mi academia fue increíblemente fácil. En
                    cuestión de horas, tenía mi primer curso en vivo y los
                    estudiantes ya se estaban inscribiendo."
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='flex items-center space-x-3'>
                    <motion.div
                      className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full'
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <span className='text-sm font-medium'>ER</span>
                    </motion.div>
                    <div>
                      <p className='font-medium'>Emily Rodriguez</p>
                      <p className='text-muted-foreground text-sm'>
                        Profesora de Idiomas
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id='cta' className='relative overflow-hidden py-20'>
        {/* Background Image from Pexels */}
        <div className='absolute inset-0 z-0'>
          <img
            src='https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
            alt='Equipo trabajando juntos'
            className='h-full w-full object-cover opacity-10'
          />
          <div className='from-background/80 to-background/60 absolute inset-0 bg-gradient-to-br' />
        </div>

        <div className='relative z-10 container'>
          <motion.div
            className='mx-auto max-w-2xl text-center'
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>
              ¿Listo para construir tu academia?
            </h2>
            <p className='text-muted-foreground mt-4 text-lg'>
              Únete a miles de educadores que ya están creando experiencias de
              aprendizaje increíbles
            </p>

            <motion.div
              className='mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row'
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size='lg' asChild>
                  <Link to='/sign-up'>
                    Inicia tu Academia Gratuita
                    <ArrowRight className='ml-2 h-4 w-4' />
                  </Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant='outline' size='lg' asChild>
                  <Link to='/sign-in'>Iniciar Sesión</Link>
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              className='mt-6'
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant='link' className='text-muted-foreground'>
                    ¿Necesitas ayuda para comenzar? Contacta a nuestro equipo
                  </Button>
                </DialogTrigger>
                <DialogContent className='sm:max-w-[425px]'>
                  <DialogHeader>
                    <DialogTitle>Contacta a Nuestro Equipo</DialogTitle>
                    <DialogDescription>
                      ¿Tienes preguntas? Nuestro equipo está aquí para ayudarte
                      a comenzar con tu academia.
                    </DialogDescription>
                  </DialogHeader>
                  <div className='space-y-4'>
                    <div className='bg-muted/50 flex items-center space-x-3 rounded-lg p-3'>
                      <Mail className='text-primary h-5 w-5' />
                      <div>
                        <p className='font-medium'>Soporte por Email</p>
                        <p className='text-muted-foreground text-sm'>
                          support@iswoacademy.com
                        </p>
                      </div>
                    </div>
                    <div className='bg-muted/50 flex items-center space-x-3 rounded-lg p-3'>
                      <Phone className='text-primary h-5 w-5' />
                      <div>
                        <p className='font-medium'>Soporte Telefónico</p>
                        <p className='text-muted-foreground text-sm'>
                          +1 (555) 123-4567
                        </p>
                      </div>
                    </div>
                    <div className='bg-muted/50 flex items-center space-x-3 rounded-lg p-3'>
                      <Building className='text-primary h-5 w-5' />
                      <div>
                        <p className='font-medium'>Horario de Atención</p>
                        <p className='text-muted-foreground text-sm'>
                          Lun-Vie, 9AM-6PM EST
                        </p>
                      </div>
                    </div>
                    <div className='pt-4'>
                      <Button asChild className='w-full'>
                        <Link to='/sign-up'>
                          Comenzar Ahora
                          <ArrowRight className='ml-2 h-4 w-4' />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-muted/50 relative overflow-hidden border-t'>
        {/* Background Image from Pexels */}
        <div className='absolute inset-0 z-0'>
          <img
            src='https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
            alt='Biblioteca moderna'
            className='h-full w-full object-cover opacity-5'
          />
        </div>

        <div className='relative z-10 container py-12'>
          <div className='grid gap-8 md:grid-cols-4'>
            <motion.div
              className='space-y-4'
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className='flex items-center space-x-2'
                whileHover={{ scale: 1.05 }}
              >
                <GraduationCap className='text-primary h-6 w-6' />
                <span className='font-bold'>ISWO Academy</span>
              </motion.div>
              <p className='text-muted-foreground text-sm'>
                Empoderando a educadores para crear experiencias de aprendizaje
                en línea increíbles.
              </p>
              <div className='flex space-x-4'>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size='sm' asChild>
                    <Link to='/sign-up'>Comenzar</Link>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size='sm' variant='outline' asChild>
                    <Link to='/sign-in'>Iniciar Sesión</Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              className='space-y-4'
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h4 className='font-semibold'>Producto</h4>
              <div className='space-y-2 text-sm'>
                <button
                  onClick={() => scrollToSection('features')}
                  className='text-muted-foreground hover:text-primary block transition-colors'
                >
                  Características
                </button>
                <button
                  onClick={() => scrollToSection('pricing')}
                  className='text-muted-foreground hover:text-primary block transition-colors'
                >
                  Precios
                </button>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className='text-muted-foreground hover:text-primary block transition-colors'>
                      Solicitar Demo
                    </button>
                  </DialogTrigger>
                  <DialogContent className='sm:max-w-[425px]'>
                    <DialogHeader>
                      <DialogTitle>Solicitar una Demo</DialogTitle>
                      <DialogDescription>
                        Obtén una demostración personalizada de ISWO Academy y
                        descubre cómo puede transformar tu negocio educativo.
                      </DialogDescription>
                    </DialogHeader>
                    {demoSubmitted ? (
                      <div className='py-6 text-center'>
                        <Check className='mx-auto mb-4 h-12 w-12 text-green-500' />
                        <h3 className='mb-2 text-lg font-semibold'>
                          ¡Solicitud de Demo Enviada!
                        </h3>
                        <p className='text-muted-foreground'>
                          Gracias por tu interés. Nuestro equipo se pondrá en
                          contacto contigo en las próximas 24 horas para
                          programar tu demostración personalizada.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleDemoSubmit} className='space-y-4'>
                        <div className='grid grid-cols-2 gap-4'>
                          <div className='space-y-2'>
                            <Label htmlFor='footer-demo-name'>Nombre *</Label>
                            <Input
                              id='footer-demo-name'
                              value={demoFormData.name}
                              onChange={(e) =>
                                handleDemoFormChange('name', e.target.value)
                              }
                              required
                            />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='footer-demo-email'>Email *</Label>
                            <Input
                              id='footer-demo-email'
                              type='email'
                              value={demoFormData.email}
                              onChange={(e) =>
                                handleDemoFormChange('email', e.target.value)
                              }
                              required
                            />
                          </div>
                        </div>
                        <div className='grid grid-cols-2 gap-4'>
                          <div className='space-y-2'>
                            <Label htmlFor='footer-demo-company'>Empresa</Label>
                            <Input
                              id='footer-demo-company'
                              value={demoFormData.company}
                              onChange={(e) =>
                                handleDemoFormChange('company', e.target.value)
                              }
                            />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='footer-demo-phone'>Teléfono</Label>
                            <Input
                              id='footer-demo-phone'
                              type='tel'
                              value={demoFormData.phone}
                              onChange={(e) =>
                                handleDemoFormChange('phone', e.target.value)
                              }
                            />
                          </div>
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='footer-demo-message'>
                            Cuéntanos sobre tus necesidades
                          </Label>
                          <Textarea
                            id='footer-demo-message'
                            placeholder='¿Qué tipo de academia buscas crear? ¿Cuántos estudiantes esperas?'
                            value={demoFormData.message}
                            onChange={(e) =>
                              handleDemoFormChange('message', e.target.value)
                            }
                            rows={3}
                          />
                        </div>
                        <Button
                          type='submit'
                          className='w-full'
                          disabled={isSubmittingDemo}
                        >
                          {isSubmittingDemo ? 'Enviando...' : 'Solicitar Demo'}
                        </Button>
                      </form>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </motion.div>

            <motion.div
              className='space-y-4'
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className='font-semibold'>Empresa</h4>
              <div className='space-y-2 text-sm'>
                <button
                  onClick={() => scrollToSection('testimonials')}
                  className='text-muted-foreground hover:text-primary block transition-colors'
                >
                  Testimonios
                </button>
                <a
                  href='#'
                  className='text-muted-foreground hover:text-primary block transition-colors'
                >
                  Acerca de Nosotros
                </a>
                <a
                  href='#'
                  className='text-muted-foreground hover:text-primary block transition-colors'
                >
                  Blog
                </a>
              </div>
            </motion.div>

            <motion.div
              className='space-y-4'
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h4 className='font-semibold'>Soporte</h4>
              <div className='space-y-2 text-sm'>
                <a
                  href='#'
                  className='text-muted-foreground hover:text-primary block transition-colors'
                >
                  Centro de Ayuda
                </a>
                <a
                  href='#'
                  className='text-muted-foreground hover:text-primary block transition-colors'
                >
                  Contáctanos
                </a>
                <a
                  href='#'
                  className='text-muted-foreground hover:text-primary block transition-colors'
                >
                  Política de Privacidad
                </a>
              </div>
            </motion.div>
          </div>

          <motion.div
            className='mt-8 flex flex-col items-center justify-between space-y-4 border-t pt-8 md:flex-row md:space-y-0'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p className='text-muted-foreground text-sm'>
              © 2025 ISWO Academy. Todos los derechos reservados.
            </p>
            <div className='flex items-center space-x-4'>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size='sm' variant='ghost' asChild>
                  <Link to='/sign-in'>Iniciar Sesión</Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size='sm' asChild>
                  <Link to='/sign-up'>Comenzar Gratis</Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <motion.button
          onClick={scrollToTop}
          className='bg-primary text-primary-foreground hover:bg-primary/90 fixed right-8 bottom-8 z-50 rounded-full p-3 shadow-lg transition-all duration-200'
          aria-label='Volver arriba'
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          whileHover={{ scale: 1.1, y: -5 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronUp className='h-5 w-5' />
        </motion.button>
      )}
    </div>
  )
}
