import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import {
  FileText,
  Scale,
  Shield,
  UserCheck,
  CreditCard,
  AlertCircle,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AnimatedAuthLayout } from '@/features/auth/containers/animated-auth-layout'

export function TermsOfService() {
  const { t } = useTranslation()

  const sections = [
    {
      icon: FileText,
      titleKey: 'legal.terms.sections.acceptance.title',
      contentKey: 'legal.terms.sections.acceptance.content',
    },
    {
      icon: UserCheck,
      titleKey: 'legal.terms.sections.userAccount.title',
      contentKey: 'legal.terms.sections.userAccount.content',
    },
    {
      icon: Scale,
      titleKey: 'legal.terms.sections.serviceUse.title',
      contentKey: 'legal.terms.sections.serviceUse.content',
    },
    {
      icon: Shield,
      titleKey: 'legal.terms.sections.intellectualProperty.title',
      contentKey: 'legal.terms.sections.intellectualProperty.content',
    },
    {
      icon: CreditCard,
      titleKey: 'legal.terms.sections.payments.title',
      contentKey: 'legal.terms.sections.payments.content',
    },
    {
      icon: AlertCircle,
      titleKey: 'legal.terms.sections.liability.title',
      contentKey: 'legal.terms.sections.liability.content',
    },
  ]

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  }

  return (
    <AnimatedAuthLayout
      title={t('legal.terms.layoutTitle')}
      subtitle={t('legal.terms.layoutSubtitle')}
      singleColumn={true}
    >
      <div className='mx-auto w-full max-w-4xl space-y-6'>
        {/* Header Card */}
        <motion.div
          variants={cardVariants}
          initial='hidden'
          animate='visible'
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader className='text-center'>
              <div className='bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
                <Scale className='text-primary h-8 w-8' />
              </div>
              <CardTitle className='text-3xl font-bold'>
                {t('legal.terms.title')}
              </CardTitle>
              <CardDescription className='text-base'>
                {t('legal.terms.lastUpdated')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground text-center leading-relaxed'>
                {t('legal.terms.intro')}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Content Sections */}
        {sections.map((section, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            initial='hidden'
            animate='visible'
            transition={{ duration: 0.5, delay: (index + 1) * 0.1 }}
          >
            <Card className='border-l-primary border-l-4'>
              <CardHeader>
                <div className='flex items-start space-x-4'>
                  <div className='bg-primary/10 rounded-lg p-2'>
                    <section.icon className='text-primary h-6 w-6' />
                  </div>
                  <div className='flex-1'>
                    <CardTitle className='text-xl font-semibold'>
                      {t(section.titleKey)}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className='text-muted-foreground leading-relaxed'>
                  {t(section.contentKey)}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* Contact Information */}
        <motion.div
          variants={cardVariants}
          initial='hidden'
          animate='visible'
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card className='bg-primary/5'>
            <CardHeader>
              <CardTitle className='text-xl font-semibold'>
                {t('legal.terms.contact.title')}
              </CardTitle>
              <CardDescription>
                {t('legal.terms.contact.subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-3'>
              <p className='text-muted-foreground text-sm'>
                {t('legal.terms.contact.description')}
              </p>
              <ul className='text-muted-foreground space-y-2 text-sm'>
                <li>
                  <strong>{t('legal.terms.contact.email')}</strong>{' '}
                  <a
                    href='mailto:legal@iswoacademy.com'
                    className='text-primary hover:underline'
                  >
                    legal@iswoacademy.com
                  </a>
                </li>
                <li>
                  <strong>{t('legal.terms.contact.support')}</strong>{' '}
                  <a
                    href='mailto:support@iswoacademy.com'
                    className='text-primary hover:underline'
                  >
                    support@iswoacademy.com
                  </a>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA Footer */}
        <motion.div
          variants={cardVariants}
          initial='hidden'
          animate='visible'
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card className='border-primary/20 from-primary/5 to-primary/10 bg-gradient-to-r'>
            <CardContent className='py-6'>
              <div className='flex flex-col items-center justify-between space-y-4 text-center md:flex-row md:space-y-0 md:text-left'>
                <div>
                  <h3 className='text-lg font-semibold'>
                    {t('legal.terms.cta.title')}
                  </h3>
                  <p className='text-muted-foreground text-sm'>
                    {t('legal.terms.cta.subtitle')}
                  </p>
                </div>
                <div className='flex space-x-4'>
                  <Button variant='outline' asChild>
                    <Link to='/sign-in'>{t('legal.terms.cta.signIn')}</Link>
                  </Button>
                  <Button asChild>
                    <Link to='/sign-up'>{t('legal.terms.cta.signUp')}</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatedAuthLayout>
  )
}
