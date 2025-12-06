import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Check, ArrowRight, Mail, Phone, Building } from 'lucide-react'
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

const plans = [
  {
    name: 'Inicial',
    description: 'Perfecto para comenzar',
    price: 'Gratis',
    features: [
      'Hasta 3 cursos',
      'Máximo 50 estudiantes',
      'Análisis básicos',
      'Soporte por email',
    ],
    buttonText: 'Comenzar Gratis',
    buttonVariant: 'outline' as const,
    buttonLink: '/sign-up',
    delay: 0.1,
  },
  {
    name: 'Profesional',
    description: 'La opción más popular',
    price: '$29',
    priceUnit: '/mes',
    features: [
      'Cursos ilimitados',
      'Máximo 500 estudiantes',
      'Análisis avanzados',
      'Certificados personalizados',
      'Soporte prioritario',
    ],
    buttonText: 'Iniciar Prueba Gratuita',
    buttonVariant: 'default' as const,
    buttonLink: '/sign-up',
    isPopular: true,
    delay: 0.2,
  },
  {
    name: 'Empresarial',
    description: 'Para organizaciones grandes',
    price: '$99',
    priceUnit: '/mes',
    features: [
      'Todo ilimitado',
      'Solución de marca blanca',
      'Acceso a API',
      'Integraciones personalizadas',
      'Soporte telefónico 24/7',
    ],
    buttonText: 'Contactar Ventas',
    buttonVariant: 'outline' as const,
    isDialog: true,
    delay: 0.3,
  },
]

export function PricingSection() {
  return (
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
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: plan.delay }}
              whileHover={{
                y: plan.isPopular ? -15 : -10,
                scale: plan.isPopular ? 1.05 : 1.02,
              }}
            >
              <Card
                className={`h-full ${plan.isPopular ? 'border-primary relative overflow-hidden' : ''}`}
              >
                {plan.isPopular && (
                  <div className='from-primary/5 to-primary/10 absolute inset-0 bg-gradient-to-br' />
                )}
                <CardHeader className='relative z-10'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <CardTitle>{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </div>
                    {plan.isPopular && (
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
                    )}
                  </div>
                  <div className='mt-4'>
                    <span className='text-4xl font-bold'>{plan.price}</span>
                    {plan.priceUnit && (
                      <span className='text-muted-foreground'>
                        {plan.priceUnit}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className='relative z-10'>
                  <ul className='space-y-3'>
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className='flex items-center'>
                        <Check className='mr-2 h-4 w-4 text-green-500' />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {plan.isDialog ? (
                    <Dialog>
                      <DialogTrigger asChild>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            className='mt-6 w-full'
                            variant={plan.buttonVariant}
                          >
                            {plan.buttonText}
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
                              Precios personalizados, soluciones de marca blanca
                              y soporte dedicado para organizaciones grandes.
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
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        className='mt-6 w-full'
                        variant={plan.buttonVariant}
                        asChild
                      >
                        <Link to={plan.buttonLink}>{plan.buttonText}</Link>
                      </Button>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
