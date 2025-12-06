import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowLeft, FileText, Scale, Shield, UserCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function TermsOfService() {
  const handleGoBack = () => {
    window.history.back()
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  }

  const sections = [
    {
      icon: FileText,
      title: '1. Aceptación de los Términos',
      content: `Al acceder y utilizar ISWO Academy, aceptas estar sujeto a estos Términos de Servicio. Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar nuestros servicios. Nos reservamos el derecho de actualizar estos términos en cualquier momento, y tu uso continuado del servicio constituye la aceptación de dichos cambios.`,
    },
    {
      icon: UserCheck,
      title: '2. Registro y Cuenta de Usuario',
      content: `Para acceder a ciertas funciones de la plataforma, debes crear una cuenta. Eres responsable de mantener la confidencialidad de tu contraseña y de todas las actividades que ocurran bajo tu cuenta. Debes proporcionar información precisa y actualizada durante el registro. ISWO Academy se reserva el derecho de suspender o terminar cuentas que violen estos términos.`,
    },
    {
      icon: Scale,
      title: '3. Uso del Servicio',
      content: `Te otorgamos una licencia limitada, no exclusiva e intransferible para acceder y usar ISWO Academy para fines educativos personales. No puedes: (a) copiar, modificar o distribuir el contenido sin autorización, (b) usar el servicio para actividades ilegales, (c) intentar acceder a áreas restringidas de la plataforma, (d) interferir con el funcionamiento del servicio, o (e) usar bots o sistemas automatizados sin permiso expreso.`,
    },
    {
      icon: Shield,
      title: '4. Propiedad Intelectual',
      content: `Todo el contenido de ISWO Academy, incluyendo textos, gráficos, logos, videos y software, está protegido por derechos de propiedad intelectual. Los instructores mantienen los derechos sobre el contenido que crean, pero otorgan a ISWO Academy una licencia para distribuirlo. Los estudiantes pueden ver el contenido para su uso personal y educativo, pero no pueden redistribuirlo comercialmente.`,
    },
    {
      icon: FileText,
      title: '5. Pagos y Suscripciones',
      content: `Algunos cursos y funcionalidades requieren pago. Los precios están sujetos a cambios con previo aviso. Las suscripciones se renuevan automáticamente hasta que las canceles. Puedes cancelar en cualquier momento desde tu panel de cuenta. Los reembolsos se procesarán según nuestra política de reembolsos, generalmente dentro de 14 días de la compra si no has consumido más del 20% del curso.`,
    },
    {
      icon: Shield,
      title: '6. Limitación de Responsabilidad',
      content: `ISWO Academy se proporciona "tal cual" sin garantías de ningún tipo. No garantizamos que el servicio esté libre de errores o sea ininterrumpido. No somos responsables de daños indirectos, incidentales o consecuentes que surjan del uso de la plataforma. Nuestra responsabilidad total está limitada al monto que hayas pagado por el servicio en los últimos 12 meses.`,
    },
  ]

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50'>
      {/* Header */}
      <motion.div
        className='border-b bg-white/80 backdrop-blur-sm'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className='container mx-auto px-4 py-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <Button variant='ghost' size='sm' onClick={handleGoBack}>
                <ArrowLeft className='mr-2 h-4 w-4' />
                Volver
              </Button>
            </div>
            <a
              href='/privacy'
              className='text-sm text-blue-600 hover:text-blue-800'
            >
              Ver Política de Privacidad
            </a>
          </div>
        </div>
      </motion.div>

      {/* Hero Section */}
      <div className='container mx-auto px-4 py-12 md:py-16'>
        <motion.div className='mx-auto max-w-3xl text-center' {...fadeInUp}>
          <div className='bg-primary/10 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full'>
            <Scale className='text-primary h-10 w-10' />
          </div>
          <h1 className='mb-4 text-4xl font-bold tracking-tight md:text-5xl'>
            Términos de Servicio
          </h1>
          <p className='text-muted-foreground text-lg'>
            Última actualización: 6 de diciembre de 2025
          </p>
          <p className='text-muted-foreground mt-4 text-base'>
            Por favor, lee estos términos cuidadosamente antes de usar ISWO
            Academy. Al utilizar nuestros servicios, aceptas estar legalmente
            vinculado por estos términos.
          </p>
        </motion.div>
      </div>

      {/* Content Sections */}
      <div className='container mx-auto px-4 pb-16'>
        <div className='mx-auto max-w-4xl space-y-6'>
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className='border-l-4 border-l-blue-500'>
                <CardHeader>
                  <div className='flex items-start space-x-4'>
                    <div className='bg-primary/10 rounded-lg p-2'>
                      <section.icon className='text-primary h-6 w-6' />
                    </div>
                    <div className='flex-1'>
                      <CardTitle className='text-xl font-semibold'>
                        {section.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className='text-muted-foreground leading-relaxed'>
                    {section.content}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {/* Additional Important Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className='bg-blue-50/50'>
              <CardHeader>
                <CardTitle className='text-xl font-semibold'>
                  Información de Contacto
                </CardTitle>
                <CardDescription>
                  ¿Tienes preguntas sobre estos términos?
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-3'>
                <p className='text-sm text-gray-700'>
                  Si tienes alguna pregunta sobre estos Términos de Servicio,
                  puedes contactarnos a través de:
                </p>
                <ul className='space-y-2 text-sm text-gray-700'>
                  <li>
                    <strong>Email:</strong>{' '}
                    <a
                      href='mailto:legal@iswoacademy.com'
                      className='text-blue-600 hover:text-blue-800'
                    >
                      legal@iswoacademy.com
                    </a>
                  </li>
                  <li>
                    <strong>Soporte:</strong>{' '}
                    <a
                      href='mailto:support@iswoacademy.com'
                      className='text-blue-600 hover:text-blue-800'
                    >
                      support@iswoacademy.com
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Footer CTA */}
      <motion.div
        className='border-t bg-white/80 backdrop-blur-sm'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <div className='container mx-auto px-4 py-8'>
          <div className='mx-auto flex max-w-3xl flex-col items-center justify-between space-y-4 text-center md:flex-row md:space-y-0 md:text-left'>
            <div>
              <h3 className='text-lg font-semibold'>¿Listo para comenzar?</h3>
              <p className='text-muted-foreground text-sm'>
                Únete a miles de estudiantes en ISWO Academy
              </p>
            </div>
            <div className='flex space-x-4'>
              <Button variant='outline' asChild>
                <Link to='/sign-in'>Iniciar Sesión</Link>
              </Button>
              <Button asChild>
                <Link to='/sign-up'>Registrarse</Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
