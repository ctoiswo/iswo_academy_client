import React from 'react'
import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Award, BookOpen, Sparkles, Users } from 'lucide-react'
import { useTranslation } from '@/hooks/use-translation'
import { LanguageToggle } from '@/components/language-toggle'
import { LargeLogo } from '@/components/large-logo'

type AnimatedAuthLayoutProps = {
  children: React.ReactNode
  showBackButton?: boolean
  title?: string
  subtitle?: string
  reversed?: boolean
  singleColumn?: boolean
}

export function AnimatedAuthLayout({
  children,
  title,
  subtitle,
  reversed = false,
  singleColumn = false,
}: AnimatedAuthLayoutProps) {
  const { t } = useTranslation()
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const diagonalVariants = {
    hidden: {
      clipPath: reversed
        ? 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)'
        : 'polygon(0 0, 0 0, 0 100%, 0% 100%)',
    },
    visible: {
      clipPath: reversed
        ? 'polygon(40% 0, 100% 0, 100% 100%, 60% 100%)'
        : 'polygon(0 0, 60% 0, 40% 100%, 0% 100%)',
    },
  }

  const formVariants = {
    hidden: {
      opacity: 0,
      x: reversed ? -50 : 50,
      scale: 0.95,
    },
    visible: { opacity: 1, x: 0, scale: 1 },
  }

  return (
    <motion.div
      className='relative min-h-screen w-full overflow-hidden bg-background'
      variants={containerVariants}
      initial='hidden'
      animate='visible'
    >
      {/* Diagonal Background */}
      <motion.div
        className='absolute inset-0'
        style={{
          background: reversed
            ? `linear-gradient(225deg, #020618 0%, #0a1428 50%, #1a2332 100%)`
            : `linear-gradient(135deg, #020618 0%, #0a1428 50%, #1a2332 100%)`,
        }}
        variants={diagonalVariants}
      />

      {/* Animated Background Elements */}
      <div className='pointer-events-none absolute inset-0 overflow-hidden'>
        {/* Floating Icons */}
        <motion.div
          className={`absolute top-20 ${reversed ? 'right-20' : 'left-20'} text-primary/20`}
          animate={{
            y: [-10, 10, -10],
            rotate: [-2, 2, -2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <BookOpen size={64} />
        </motion.div>

        <motion.div
          className={`absolute top-40 ${reversed ? 'right-40' : 'left-40'} text-primary/15`}
          animate={{
            y: [-15, 15, -15],
            rotate: [-3, 3, -3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        >
          <Users size={48} />
        </motion.div>

        <motion.div
          className={`absolute top-60 ${reversed ? 'right-10' : 'left-10'} text-primary/15`}
          animate={{
            y: [-8, 12, -8],
            rotate: [-1, 1, -1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 4,
          }}
        >
          <Award size={56} />
        </motion.div>

        {/* Animated Dots */}
        {Array.from({ length: 20 }).map((_, i) => {
          const randomPos = Math.random() * 50
          return (
            <motion.div
              key={i}
              className='absolute h-2 w-2 rounded-full bg-primary/20'
              style={{
                [reversed ? 'right' : 'left']: `${randomPos}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0.8, 1.2, 0.8],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          )
        })}
      </div>

      {/* Language and Theme Toggle - Fixed to top right */}
      <motion.div
        className='absolute top-6 right-6 z-20 flex items-center gap-2'
        variants={itemVariants}
      >
        <LanguageToggle variant='outline' />
      </motion.div>

      {/* Content Container */}
      {singleColumn ? (
        // Single Column Layout
        <div className='relative z-10 flex min-h-screen flex-col'>
          {/* Header with Logo and Title */}
          <motion.div
            className='flex-shrink-0 p-6 lg:p-12'
            style={{
              background: 'linear-gradient(90deg, #020618 0%, #0a1428 100%)',
            }}
            variants={itemVariants}
          >
            <div className='mx-auto max-w-6xl'>
              <div className='mb-8 flex items-center justify-center'>
                <Link to='/'>
                  <LargeLogo className='size-16 invert' />
                </Link>
              </div>

              {title && (
                <motion.h1
                  className='mb-4 text-center text-3xl font-bold text-white lg:text-4xl'
                  variants={itemVariants}
                >
                  {title}
                </motion.h1>
              )}

              {subtitle && (
                <motion.p
                  className='mx-auto max-w-2xl text-center text-lg text-slate-200'
                  variants={itemVariants}
                >
                  {subtitle}
                </motion.p>
              )}
            </div>
          </motion.div>

          {/* Content Container */}
          <div className='flex flex-1 items-start justify-center p-6 lg:p-12'>
            <motion.div className='w-full' variants={itemVariants}>
              {children}
            </motion.div>
          </div>
        </div>
      ) : (
        // Two Column Layout
        <div
          className={`relative z-10 flex min-h-screen ${reversed ? 'flex-row-reverse' : ''}`}
        >
          {/* Hero Section */}
          <motion.div
            className='relative hidden flex-col justify-center px-12 text-white lg:flex lg:w-2/5'
            variants={itemVariants}
          >
            <div className='max-w-md'>
              <motion.div className='flex items-center' variants={itemVariants}>
                <Link to='/'>
                  <LargeLogo className='size-26 invert' />
                </Link>
              </motion.div>

              <motion.h2
                className='mb-6 text-4xl leading-tight font-bold'
                variants={itemVariants}
              >
                {title}
              </motion.h2>

              <motion.p
                className='mb-8 text-lg leading-relaxed text-slate-200'
                variants={itemVariants}
              >
                {subtitle}
              </motion.p>

              <motion.div className='space-y-4' variants={itemVariants}>
                <div className='flex items-center space-x-3'>
                  <div className='h-2 w-2 rounded-full bg-slate-300'></div>
                  <span className='text-slate-200'>
                    {t('auth.layout.features.createAcademy')}
                  </span>
                </div>
                <div className='flex items-center space-x-3'>
                  <div className='h-2 w-2 rounded-full bg-slate-300'></div>
                  <span className='text-slate-200'>
                    {t('auth.layout.features.qualityCourses')}
                  </span>
                </div>
                <div className='flex items-center space-x-3'>
                  <div className='h-2 w-2 rounded-full bg-slate-300'></div>
                  <span className='text-slate-200'>
                    {t('auth.layout.features.certifications')}
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Decorative Element */}
            <motion.div
              className={`absolute bottom-10 ${reversed ? 'left-10' : 'right-10'}`}
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <Sparkles className='text-primary/30' size={80} />
            </motion.div>
          </motion.div>

          {/* Form Section */}
          <motion.div
            className='flex min-h-screen w-full flex-col lg:w-3/5'
            variants={formVariants}
          >
            {/* Header for mobile */}
            <div
              className='flex-shrink-0 p-6 lg:hidden'
              style={{
                background: 'linear-gradient(90deg, #020618 0%, #0a1428 100%)',
              }}
            >
              <div className='flex items-center justify-between text-white'>
                <div className='flex items-center'>
                  <Link to='/'>
                    <LargeLogo className='size-12 invert' />
                  </Link>
                </div>
              </div>
            </div>

            {/* Form Container */}
            <div className='flex flex-1 items-center justify-center p-6 lg:p-12'>
              <motion.div className='w-full max-w-md' variants={itemVariants}>
                {children}
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
