/**
 * CTA Section Component
 * Call-to-action for creators
 */
import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

export function CTASection() {
  const { t } = useTranslation()
  return (
    <section className='bg-primary/5 border-t py-20'>
      <div className='container'>
        <motion.div
          className='mx-auto max-w-4xl text-center'
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>
            {t('home.cta.title')}
          </h2>
          <p className='text-muted-foreground mt-6 text-lg leading-8'>
            {t('home.cta.description')}
          </p>
          <div className='mt-10'>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size='lg' asChild>
                <Link to='/landing'>
                  {t('home.cta.button')}
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
