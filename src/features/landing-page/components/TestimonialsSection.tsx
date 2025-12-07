import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card'

export function TestimonialsSection() {
  const { t } = useTranslation()

  const testimonials = [
    {
      quote: t('landing.testimonials.testimonial1.quote'),
      author: t('landing.testimonials.testimonial1.author'),
      role: t('landing.testimonials.testimonial1.role'),
      initials: 'SJ',
      delay: 0.1,
    },
    {
      quote: t('landing.testimonials.testimonial2.quote'),
      author: t('landing.testimonials.testimonial2.author'),
      role: t('landing.testimonials.testimonial2.role'),
      initials: 'MC',
      delay: 0.2,
    },
    {
      quote: t('landing.testimonials.testimonial3.quote'),
      author: t('landing.testimonials.testimonial3.author'),
      role: t('landing.testimonials.testimonial3.role'),
      initials: 'ER',
      delay: 0.3,
    },
  ]
  return (
    <section
      id='testimonials'
      className='bg-muted/50 relative overflow-hidden py-20'
    >
      {/* Background Image from Pexels */}
      <div className='absolute inset-0 z-0'>
        <img
          src='https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
          alt={t('landing.testimonials.imageAlt')}
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
            {t('landing.testimonials.title')}
          </h2>
          <p className='text-muted-foreground mt-4 text-lg'>
            {t('landing.testimonials.description')}
          </p>
        </motion.div>

        <div className='mt-16 grid gap-8 lg:grid-cols-3'>
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: testimonial.delay }}
              whileHover={{ y: -10, rotateY: 5 }}
            >
              <Card className='h-full'>
                <CardHeader>
                  <motion.div
                    className='flex items-center space-x-1'
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  >
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 + 0.4 + index * 0.1 }}
                      >
                        <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                      </motion.div>
                    ))}
                  </motion.div>
                  <CardDescription>{testimonial.quote}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='flex items-center space-x-3'>
                    <motion.div
                      className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full'
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <span className='text-sm font-medium'>
                        {testimonial.initials}
                      </span>
                    </motion.div>
                    <div>
                      <p className='font-medium'>{testimonial.author}</p>
                      <p className='text-muted-foreground text-sm'>
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
