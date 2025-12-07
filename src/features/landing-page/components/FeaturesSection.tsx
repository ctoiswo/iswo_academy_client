import { motion } from 'framer-motion'
import { BookOpen, Users, Trophy, BarChart3, Zap, Shield } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function FeaturesSection() {
  const { t } = useTranslation()

  const features = [
    {
      icon: BookOpen,
      title: t('landing.features.courseCreation.title'),
      description: t('landing.features.courseCreation.description'),
      delay: 0.1,
    },
    {
      icon: Users,
      title: t('landing.features.studentManagement.title'),
      description: t('landing.features.studentManagement.description'),
      delay: 0.2,
    },
    {
      icon: Trophy,
      title: t('landing.features.certificates.title'),
      description: t('landing.features.certificates.description'),
      delay: 0.3,
    },
    {
      icon: BarChart3,
      title: t('landing.features.analytics.title'),
      description: t('landing.features.analytics.description'),
      delay: 0.4,
    },
    {
      icon: Zap,
      title: t('landing.features.integration.title'),
      description: t('landing.features.integration.description'),
      delay: 0.5,
    },
    {
      icon: Shield,
      title: t('landing.features.security.title'),
      description: t('landing.features.security.description'),
      delay: 0.6,
    },
  ]
  return (
    <section
      id='features'
      className='bg-muted/50 relative overflow-hidden py-20'
    >
      {/* Background Image from Pexels */}
      <div className='absolute inset-0 z-0'>
        <img
          src='https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
          alt={t('landing.features.imageAlt')}
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
            {t('landing.features.title')}
          </h2>
          <p className='text-muted-foreground mt-4 text-lg'>
            {t('landing.features.description')}
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
