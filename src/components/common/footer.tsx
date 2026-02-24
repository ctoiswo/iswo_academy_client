import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { GraduationCap } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { DemoDialog } from './demo-dialog'

export function Footer() {
  const { t } = useTranslation()
  return (
    <footer className='bg-muted/50 relative overflow-hidden border-t'>
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
              {t('landing.footer.description')}
            </p>
            <div className='flex space-x-4'>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size='sm' asChild>
                  <Link to='/sign-up'>{t('landing.footer.getStarted')}</Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size='sm' variant='outline' asChild>
                  <Link to='/sign-in'>{t('navigation.login')}</Link>
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
            <h4 className='font-semibold'>{t('landing.footer.product')}</h4>
            <div className='space-y-2 text-sm'>
              <button
                className='text-muted-foreground hover:text-primary block transition-colors'
              >
                {t('landing.footer.features')}
              </button>
              <button
                className='text-muted-foreground hover:text-primary block transition-colors'
              >
                {t('landing.footer.pricing')}
              </button>
              <DemoDialog
                trigger={
                  <button className='text-muted-foreground hover:text-primary block transition-colors'>
                    {t('landing.footer.requestDemo')}
                  </button>
                }
                idPrefix='footer-'
              />
            </div>
          </motion.div>

          <motion.div
            className='space-y-4'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className='font-semibold'>{t('landing.footer.company')}</h4>
            <div className='space-y-2 text-sm'>
              <button
                className='text-muted-foreground hover:text-primary block transition-colors'
              >
                {t('landing.footer.testimonials')}
              </button>
              <a
                href='#'
                className='text-muted-foreground hover:text-primary block transition-colors'
              >
                {t('landing.footer.aboutUs')}
              </a>
              <a
                href='#'
                className='text-muted-foreground hover:text-primary block transition-colors'
              >
                {t('landing.footer.blog')}
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
            <h4 className='font-semibold'>{t('landing.footer.support')}</h4>
            <div className='space-y-2 text-sm'>
              <a
                href='#'
                className='text-muted-foreground hover:text-primary block transition-colors'
              >
                {t('landing.footer.helpCenter')}
              </a>
              <a
                href='#'
                className='text-muted-foreground hover:text-primary block transition-colors'
              >
                {t('landing.footer.contactUs')}
              </a>
              <a
                href='#'
                className='text-muted-foreground hover:text-primary block transition-colors'
              >
                {t('landing.footer.privacy')}
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
            © 2026 ISWO Academy. {t('landing.footer.allRights')}.
          </p>
          <div className='flex items-center space-x-4'>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size='sm' asChild>
                <Link to='/sign-in'>{t('navigation.login')}</Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
