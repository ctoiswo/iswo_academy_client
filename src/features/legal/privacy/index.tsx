import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Lock,
  Eye,
  Database,
  Shield,
  Bell,
  Globe,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function PrivacyPolicy() {
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
      icon: Database,
      title: '1. Información que Recopilamos',
      content: `Recopilamos información que nos proporcionas directamente, como tu nombre, dirección de correo electrónico, foto de perfil y preferencias de aprendizaje cuando creas una cuenta. También recopilamos automáticamente información sobre tu uso de la plataforma, incluyendo cursos visitados, progreso de aprendizaje, tiempo de estudio, y datos de tu dispositivo (dirección IP, tipo de navegador, sistema operativo). Utilizamos cookies y tecnologías similares para mejorar tu experiencia.`,
    },
    {
      icon: Eye,
      title: '2. Cómo Utilizamos tu Información',
      content: `Utilizamos tu información para: proporcionar y mejorar nuestros servicios educativos, personalizar tu experiencia de aprendizaje, procesar pagos y suscripciones, enviarte actualizaciones sobre tus cursos, comunicarnos contigo sobre tu cuenta, analizar el uso de la plataforma para mejorarla, cumplir con obligaciones legales y proteger la seguridad de nuestros usuarios. No vendemos tu información personal a terceros.`,
    },
    {
      icon: Shield,
      title: '3. Compartir tu Información',
      content: `Compartimos tu información solo en circunstancias limitadas: con instructores de los cursos en los que estás inscrito (nombre, progreso y actividad), con proveedores de servicios que nos ayudan a operar la plataforma (procesadores de pago, servicios de email, hosting), cuando lo requiera la ley o para proteger nuestros derechos, y con tu consentimiento explícito para otros fines específicos. Todos nuestros proveedores están obligados contractualmente a proteger tu información.`,
    },
    {
      icon: Lock,
      title: '4. Seguridad de los Datos',
      content: `Implementamos medidas de seguridad técnicas y organizativas para proteger tu información personal contra acceso no autorizado, alteración, divulgación o destrucción. Esto incluye encriptación de datos en tránsito (SSL/TLS), encriptación de contraseñas, firewalls, monitoreo de seguridad continuo, y acceso restringido a información personal solo para empleados autorizados. Sin embargo, ningún método de transmisión por internet es 100% seguro.`,
    },
    {
      icon: Bell,
      title: '5. Tus Derechos y Opciones',
      content: `Tienes derecho a: acceder a tu información personal, corregir datos inexactos, solicitar la eliminación de tu cuenta y datos asociados, exportar tus datos en un formato portable, oponerte al procesamiento de tu información, retirar tu consentimiento en cualquier momento, y optar por no recibir comunicaciones de marketing. Puedes ejercer estos derechos desde la configuración de tu cuenta o contactándonos directamente.`,
    },
    {
      icon: Globe,
      title: '6. Transferencias Internacionales',
      content: `ISWO Academy opera globalmente y puede transferir tu información a servidores ubicados en diferentes países. Al usar nuestros servicios, consientes estas transferencias. Nos aseguramos de que cualquier transferencia internacional cumpla con las leyes de protección de datos aplicables, incluyendo el uso de cláusulas contractuales estándar aprobadas y garantías adecuadas para proteger tu información.`,
    },
  ]

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50'>
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
              href='/terms'
              className='text-sm text-blue-600 hover:text-blue-800'
            >
              Ver Términos de Servicio
            </a>
          </div>
        </div>
      </motion.div>

      {/* Hero Section */}
      <div className='container mx-auto px-4 py-12 md:py-16'>
        <motion.div className='mx-auto max-w-3xl text-center' {...fadeInUp}>
          <div className='bg-primary/10 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full'>
            <Lock className='text-primary h-10 w-10' />
          </div>
          <h1 className='mb-4 text-4xl font-bold tracking-tight md:text-5xl'>
            Política de Privacidad
          </h1>
          <p className='text-muted-foreground text-lg'>
            Última actualización: 6 de diciembre de 2025
          </p>
          <p className='text-muted-foreground mt-4 text-base'>
            En ISWO Academy, valoramos tu privacidad y nos comprometemos a
            proteger tu información personal. Esta política explica cómo
            recopilamos, usamos y protegemos tus datos.
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
              <Card className='border-l-4 border-l-purple-500'>
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

          {/* Cookies Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className='border-l-4 border-l-amber-500'>
              <CardHeader>
                <CardTitle className='text-xl font-semibold'>
                  Uso de Cookies
                </CardTitle>
                <CardDescription>
                  Información sobre las cookies que utilizamos
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-3'>
                <p className='text-muted-foreground text-sm leading-relaxed'>
                  Utilizamos cookies y tecnologías similares para mejorar tu
                  experiencia. Las cookies son pequeños archivos de texto que se
                  almacenan en tu dispositivo.
                </p>
                <div className='space-y-2 text-sm text-gray-700'>
                  <p>
                    <strong>Cookies esenciales:</strong> Necesarias para el
                    funcionamiento básico de la plataforma
                  </p>
                  <p>
                    <strong>Cookies de rendimiento:</strong> Nos ayudan a
                    entender cómo usas el sitio
                  </p>
                  <p>
                    <strong>Cookies de funcionalidad:</strong> Recuerdan tus
                    preferencias
                  </p>
                  <p>
                    <strong>Cookies de marketing:</strong> Personalizan anuncios
                    (requieren tu consentimiento)
                  </p>
                </div>
                <p className='text-sm text-gray-700'>
                  Puedes gestionar tus preferencias de cookies en cualquier
                  momento desde la configuración de tu navegador.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Card className='bg-purple-50/50'>
              <CardHeader>
                <CardTitle className='text-xl font-semibold'>
                  Contacto y Preguntas
                </CardTitle>
                <CardDescription>
                  ¿Tienes preguntas sobre cómo manejamos tu información?
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-3'>
                <p className='text-sm text-gray-700'>
                  Si tienes preguntas sobre esta Política de Privacidad o deseas
                  ejercer tus derechos, contáctanos:
                </p>
                <ul className='space-y-2 text-sm text-gray-700'>
                  <li>
                    <strong>Oficial de Privacidad:</strong>{' '}
                    <a
                      href='mailto:privacy@iswoacademy.com'
                      className='text-blue-600 hover:text-blue-800'
                    >
                      privacy@iswoacademy.com
                    </a>
                  </li>
                  <li>
                    <strong>Soporte General:</strong>{' '}
                    <a
                      href='mailto:support@iswoacademy.com'
                      className='text-blue-600 hover:text-blue-800'
                    >
                      support@iswoacademy.com
                    </a>
                  </li>
                </ul>
                <p className='text-sm text-gray-700'>
                  Responderemos a tu solicitud dentro de 30 días hábiles.
                </p>
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
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <div className='container mx-auto px-4 py-8'>
          <div className='mx-auto flex max-w-3xl flex-col items-center justify-between space-y-4 text-center md:flex-row md:space-y-0 md:text-left'>
            <div>
              <h3 className='text-lg font-semibold'>
                Tu privacidad es nuestra prioridad
              </h3>
              <p className='text-muted-foreground text-sm'>
                Aprende con confianza en ISWO Academy
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
