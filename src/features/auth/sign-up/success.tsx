import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import {
  CheckCircle2,
  Mail,
  Sparkles,
  ArrowRight,
  BookOpen,
  Trophy,
  Star,
} from 'lucide-react'
import { useTranslation } from '@/hooks/use-translation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CustomButton } from '@/components/ui/custom-button'
import { AnimatedAuthLayout } from '../components/animated-auth-layout'

export function SignUpSuccess() {
  const { t } = useTranslation()

  return (
    <AnimatedAuthLayout
      title={t('auth.signUpSuccess.title')}
      subtitle={t('auth.signUpSuccess.subtitle')}
      showBackButton={false}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className='relative'
      >
        {/* Sparkles animados */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            y: [-10, 10, -10],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
          className='absolute -top-6 -left-6 text-yellow-400'
        >
          <Sparkles className='h-8 w-8' />
        </motion.div>

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            y: [-5, 15, -5],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
          className='absolute -top-4 -right-8 text-purple-400'
        >
          <Star className='h-6 w-6' />
        </motion.div>

        <Card className='relative overflow-hidden border-0 bg-white/95 shadow-2xl backdrop-blur-sm'>
          <div className='absolute inset-0 bg-gradient-to-br from-green-50/50 via-blue-50/30 to-purple-50/50' />

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className='relative'
          >
            <CardHeader className='pb-6 text-center'>
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 }}
                className='mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg'
              >
                <CheckCircle2 className='h-10 w-10 text-white' />
              </motion.div>

              <CardTitle className='bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent'>
                {t('auth.signUpSuccess.successTitle')}
              </CardTitle>

              <CardDescription className='mt-2 text-lg leading-relaxed text-gray-600'>
                {t('auth.signUpSuccess.successDescription')} <br />
                {t('auth.signUpSuccess.confirmationSent')}
              </CardDescription>
            </CardHeader>

            <CardContent className='space-y-6 px-8 pb-8'>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 }}
                className='flex items-center gap-4 rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4'
              >
                <Mail className='h-8 w-8 flex-shrink-0 text-blue-600' />
                <div>
                  <h4 className='font-semibold text-blue-900'>
                    {t('auth.signUpSuccess.verifyEmail')}
                  </h4>
                  <p className='text-sm text-blue-700'>
                    {t('auth.signUpSuccess.verifyEmailDescription')}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className='space-y-3'
              >
                <h4 className='mb-4 text-center font-semibold text-gray-900'>
                  {t('auth.signUpSuccess.whatAwaits')}
                </h4>

                <div className='flex items-center gap-3 text-sm text-gray-700'>
                  <BookOpen className='h-5 w-5 text-blue-600' />
                  <span>{t('auth.signUpSuccess.feature1')}</span>
                </div>

                <div className='flex items-center gap-3 text-sm text-gray-700'>
                  <Trophy className='h-5 w-5 text-yellow-600' />
                  <span>{t('auth.signUpSuccess.feature2')}</span>
                </div>

                <div className='flex items-center gap-3 text-sm text-gray-700'>
                  <Star className='h-5 w-5 text-purple-600' />
                  <span>{t('auth.signUpSuccess.feature3')}</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1.1 }}
                className='space-y-3 pt-4'
              >
                <CustomButton
                  asChild
                  variant='primary'
                  className='group w-full'
                >
                  <Link to='/sign-in'>
                    {t('auth.signUpSuccess.signInButton')}
                    <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
                  </Link>
                </CustomButton>

                <CustomButton asChild variant='primary' className='w-full'>
                  <Link to='/sign-up'>
                    {t('auth.signUpSuccess.registerAnotherButton')}
                  </Link>
                </CustomButton>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 1.3 }}
                className='border-t border-gray-100 pt-4 text-center'
              >
                <p className='text-xs text-gray-500'>
                  💡 <strong>{t('auth.signUpSuccess.funFact')}</strong>{' '}
                  {t('auth.signUpSuccess.funFactText')}
                </p>
              </motion.div>
            </CardContent>
          </motion.div>
        </Card>
      </motion.div>
    </AnimatedAuthLayout>
  )
}
