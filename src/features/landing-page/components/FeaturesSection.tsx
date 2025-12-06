import { motion } from 'framer-motion'
import { BookOpen, Users, Trophy, BarChart3, Zap, Shield } from 'lucide-react'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const features = [
  {
    icon: BookOpen,
    title: 'Creación de Cursos',
    description:
      'Construye cursos integrales con lecciones, cuestionarios y contenido multimedia',
    delay: 0.1,
  },
  {
    icon: Users,
    title: 'Gestión de Estudiantes',
    description:
      'Rastrea el progreso de los estudiantes, administra inscripciones e interactúa con tu comunidad',
    delay: 0.2,
  },
  {
    icon: Trophy,
    title: 'Certificados y Badges',
    description:
      'Recompensa logros con certificados personalizados y insignias digitales',
    delay: 0.3,
  },
  {
    icon: BarChart3,
    title: 'Análisis e Insights',
    description:
      'Obtén análisis detallados sobre el rendimiento de los estudiantes y la efectividad de los cursos',
    delay: 0.4,
  },
  {
    icon: Zap,
    title: 'Integración Fácil',
    description:
      'Integra sin problemas con tus herramientas y flujos de trabajo existentes',
    delay: 0.5,
  },
  {
    icon: Shield,
    title: 'Seguro y Confiable',
    description:
      'Seguridad de nivel empresarial con garantía de tiempo de actividad del 99.9%',
    delay: 0.6,
  },
]

export function FeaturesSection() {
  return (
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
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: feature.delay }}
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
                      <feature.icon className='text-primary h-6 w-6' />
                    </motion.div>
                    <CardTitle>{feature.title}</CardTitle>
                  </div>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
