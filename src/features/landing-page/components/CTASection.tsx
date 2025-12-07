import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Mail, Phone, Building } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export function CTASection() {
  const { t } = useTranslation()
  return (
    <section id='cta' className='relative overflow-hidden py-20'>
      {/* Background Image from Pexels */}
      <div className='absolute inset-0 z-0'>
        <img
          src='https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
          alt={t('landing.cta.imageAlt')}
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
            {t('landing.cta.title')}
          </h2>
          <p className='text-muted-foreground mt-4 text-lg'>
            {t('landing.cta.description')}
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
                  {t('landing.cta.startFreeAcademy')}
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Link>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button variant='outline' size='lg' asChild>
                <Link to='/sign-in'>{t('landing.cta.signIn')}</Link>
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
                  {t('landing.cta.needHelp')}
                </Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                  <DialogTitle>
                    {t('landing.cta.contactTeam.title')}
                  </DialogTitle>
                  <DialogDescription>
                    {t('landing.cta.contactTeam.description')}
                  </DialogDescription>
                </DialogHeader>
                <div className='space-y-4'>
                  <div className='bg-muted/50 flex items-center space-x-3 rounded-lg p-3'>
                    <Mail className='text-primary h-5 w-5' />
                    <div>
                      <p className='font-medium'>
                        {t('landing.cta.contactTeam.emailSupport')}
                      </p>
                      <p className='text-muted-foreground text-sm'>
                        support@iswoacademy.com
                      </p>
                    </div>
                  </div>
                  <div className='bg-muted/50 flex items-center space-x-3 rounded-lg p-3'>
                    <Phone className='text-primary h-5 w-5' />
                    <div>
                      <p className='font-medium'>
                        {t('landing.cta.contactTeam.phoneSupport')}
                      </p>
                      <p className='text-muted-foreground text-sm'>
                        +1 (555) 123-4567
                      </p>
                    </div>
                  </div>
                  <div className='bg-muted/50 flex items-center space-x-3 rounded-lg p-3'>
                    <Building className='text-primary h-5 w-5' />
                    <div>
                      <p className='font-medium'>
                        {t('landing.cta.contactTeam.businessHours')}
                      </p>
                      <p className='text-muted-foreground text-sm'>
                        {t('landing.cta.contactTeam.hoursText')}
                      </p>
                    </div>
                  </div>
                  <div className='pt-4'>
                    <Button asChild className='w-full'>
                      <Link to='/sign-up'>
                        {t('landing.cta.contactTeam.startNow')}
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
  )
}
