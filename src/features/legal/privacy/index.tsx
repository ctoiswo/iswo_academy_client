import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Lock, Eye, Database, Shield, Bell, Globe, Cookie } from 'lucide-react'
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

export function PrivacyPolicy() {
  const { t } = useTranslation()

  const sections = [
    {
      icon: Database,
      titleKey: 'legal.privacy.sections.dataCollection.title',
      contentKey: 'legal.privacy.sections.dataCollection.content',
    },
    {
      icon: Eye,
      titleKey: 'legal.privacy.sections.dataUsage.title',
      contentKey: 'legal.privacy.sections.dataUsage.content',
    },
    {
      icon: Shield,
      titleKey: 'legal.privacy.sections.dataSharing.title',
      contentKey: 'legal.privacy.sections.dataSharing.content',
    },
    {
      icon: Lock,
      titleKey: 'legal.privacy.sections.dataSecurity.title',
      contentKey: 'legal.privacy.sections.dataSecurity.content',
    },
    {
      icon: Bell,
      titleKey: 'legal.privacy.sections.userRights.title',
      contentKey: 'legal.privacy.sections.userRights.content',
    },
    {
      icon: Globe,
      titleKey: 'legal.privacy.sections.internationalTransfers.title',
      contentKey: 'legal.privacy.sections.internationalTransfers.content',
    },
  ]

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  }

  return (
    <AnimatedAuthLayout
      title={t('legal.privacy.layoutTitle')}
      subtitle={t('legal.privacy.layoutSubtitle')}
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
                <Lock className='text-primary h-8 w-8' />
              </div>
              <CardTitle className='text-3xl font-bold'>
                {t('legal.privacy.title')}
              </CardTitle>
              <CardDescription className='text-base'>
                {t('legal.privacy.lastUpdated')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground text-center leading-relaxed'>
                {t('legal.privacy.intro')}
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

        {/* Cookies Information */}
        <motion.div
          variants={cardVariants}
          initial='hidden'
          animate='visible'
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card className='border-l-4 border-l-amber-500'>
            <CardHeader>
              <div className='flex items-start space-x-4'>
                <div className='rounded-lg bg-amber-500/10 p-2'>
                  <Cookie className='h-6 w-6 text-amber-600' />
                </div>
                <div className='flex-1'>
                  <CardTitle className='text-xl font-semibold'>
                    {t('legal.privacy.cookies.title')}
                  </CardTitle>
                  <CardDescription>
                    {t('legal.privacy.cookies.subtitle')}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className='space-y-3'>
              <p className='text-muted-foreground text-sm leading-relaxed'>
                {t('legal.privacy.cookies.description')}
              </p>
              <div className='text-muted-foreground space-y-2 text-sm'>
                <p>{t('legal.privacy.cookies.essential')}</p>
                <p>{t('legal.privacy.cookies.performance')}</p>
                <p>{t('legal.privacy.cookies.functionality')}</p>
                <p>{t('legal.privacy.cookies.marketing')}</p>
              </div>
              <p className='text-muted-foreground text-sm'>
                {t('legal.privacy.cookies.manage')}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          variants={cardVariants}
          initial='hidden'
          animate='visible'
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card className='bg-primary/5'>
            <CardHeader>
              <CardTitle className='text-xl font-semibold'>
                {t('legal.privacy.contact.title')}
              </CardTitle>
              <CardDescription>
                {t('legal.privacy.contact.subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-3'>
              <p className='text-muted-foreground text-sm'>
                {t('legal.privacy.contact.description')}
              </p>
              <ul className='text-muted-foreground space-y-2 text-sm'>
                <li>
                  <strong>{t('legal.privacy.contact.privacy')}</strong>{' '}
                  <a
                    href='mailto:privacy@iswoacademy.com'
                    className='text-primary hover:underline'
                  >
                    privacy@iswoacademy.com
                  </a>
                </li>
                <li>
                  <strong>{t('legal.privacy.contact.support')}</strong>{' '}
                  <a
                    href='mailto:support@iswoacademy.com'
                    className='text-primary hover:underline'
                  >
                    support@iswoacademy.com
                  </a>
                </li>
              </ul>
              <p className='text-muted-foreground text-sm'>
                {t('legal.privacy.contact.response')}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA Footer */}
        <motion.div
          variants={cardVariants}
          initial='hidden'
          animate='visible'
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <Card className='border-primary/20 from-primary/5 to-primary/10 bg-gradient-to-r'>
            <CardContent className='py-6'>
              <div className='flex flex-col items-center justify-between space-y-4 text-center md:flex-row md:space-y-0 md:text-left'>
                <div>
                  <h3 className='text-lg font-semibold'>
                    {t('legal.privacy.cta.title')}
                  </h3>
                  <p className='text-muted-foreground text-sm'>
                    {t('legal.privacy.cta.subtitle')}
                  </p>
                </div>
                <div className='flex space-x-4'>
                  <Button variant='outline' asChild>
                    <Link to='/sign-in'>{t('legal.privacy.cta.signIn')}</Link>
                  </Button>
                  <Button asChild>
                    <Link to='/sign-up'>{t('legal.privacy.cta.signUp')}</Link>
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
