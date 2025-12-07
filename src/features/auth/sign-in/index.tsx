import { Link, useSearch } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { useTranslation } from '@/hooks/use-translation'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AnimatedAuthLayout } from '../components/animated-auth-layout'
import { UserAuthForm } from './components/user-auth-form'

export function SignIn() {
  const { t } = useTranslation()
  const { redirect } = useSearch({ from: '/(auth)/sign-in/' })

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  }

  const headerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  }

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }

  const footerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <AnimatedAuthLayout
      title={t('auth.signIn.welcome')}
      subtitle={t('auth.signIn.description')}
      reversed={true}
    >
      <motion.div
        variants={cardVariants}
        initial='hidden'
        animate='visible'
        whileHover={{ y: -2, transition: { duration: 0.2 } }}
      >
        <Card className='gap-4 border-0 bg-white/95 shadow-xl backdrop-blur-sm'>
          <motion.div variants={headerVariants}>
            <CardHeader className='pb-4'>
              <CardTitle className='text-2xl font-bold tracking-tight text-gray-900'>
                {t('auth.signIn.title')}
              </CardTitle>
              <CardDescription className='text-base text-gray-600'>
                {t('auth.signIn.subtitle')}
              </CardDescription>
            </CardHeader>
          </motion.div>

          <motion.div variants={contentVariants} transition={{ delay: 0.2 }}>
            <CardContent>
              <UserAuthForm redirectTo={redirect} />
            </CardContent>
          </motion.div>

          <motion.div variants={footerVariants} transition={{ delay: 0.3 }}>
            <CardFooter className='flex-col space-y-4'>
              <p className='text-muted-foreground text-center text-sm leading-relaxed'>
                {t('auth.signIn.terms')}{' '}
                <a
                  href='/terms'
                  className='hover:text-primary font-medium underline underline-offset-4'
                >
                  {t('auth.signIn.termsLink')}
                </a>{' '}
                {t('auth.signIn.and')}{' '}
                <a
                  href='/privacy'
                  className='hover:text-primary font-medium underline underline-offset-4'
                >
                  {t('auth.signIn.privacyLink')}
                </a>
                .
              </p>

              <div className='text-center'>
                <p className='text-sm text-gray-600'>
                  {t('auth.signIn.noAccount')}{' '}
                  <Link
                    to='/sign-up'
                    className='font-semibold text-blue-800 underline underline-offset-2 hover:text-blue-800/80'
                  >
                    {t('auth.signIn.signUp')}
                  </Link>
                </p>
              </div>
            </CardFooter>
          </motion.div>
        </Card>
      </motion.div>
    </AnimatedAuthLayout>
  )
}
