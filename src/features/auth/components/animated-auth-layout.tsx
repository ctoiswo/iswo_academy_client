import React from 'react'
import { motion } from 'framer-motion'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, BookOpen, Users, Award, Sparkles } from 'lucide-react'
import { Logo } from '@/assets/logo'
import { CustomButton } from '@/components/ui/custom-button'
import { LargeLogo } from '@/components/large-logo'

type AnimatedAuthLayoutProps = {
  children: React.ReactNode
  showBackButton?: boolean
  title?: string
  subtitle?: string
  reversed?: boolean
}

export function AnimatedAuthLayout({
  children,
  showBackButton = true,
  title = "Únete a ISWO Academy",
  subtitle = "La plataforma donde tu conocimiento cobra vida",
  reversed = false
}: AnimatedAuthLayoutProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const diagonalVariants = {
    hidden: { 
      clipPath: reversed 
        ? "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)" 
        : "polygon(0 0, 0 0, 0 100%, 0% 100%)" 
    },
    visible: { 
      clipPath: reversed 
        ? "polygon(40% 0, 100% 0, 100% 100%, 60% 100%)" 
        : "polygon(0 0, 60% 0, 40% 100%, 0% 100%)" 
    }
  }

  const formVariants = {
    hidden: { 
      opacity: 0, 
      x: reversed ? -50 : 50, 
      scale: 0.95 
    },
    visible: { opacity: 1, x: 0, scale: 1 }
  }

  return (
    <motion.div 
      className="min-h-screen w-full overflow-hidden relative bg-gradient-to-br from-slate-50 to-slate-100"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Diagonal Background */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: reversed 
            ? `linear-gradient(225deg, #020618 0%, #0a1428 50%, #1a2332 100%)`
            : `linear-gradient(135deg, #020618 0%, #0a1428 50%, #1a2332 100%)`
        }}
        variants={diagonalVariants}
      />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Icons */}
        <motion.div 
          className={`absolute top-20 ${reversed ? 'right-20' : 'left-20'} text-slate-400/30`}
          animate={{
            y: [-10, 10, -10],
            rotate: [-2, 2, -2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <BookOpen size={64} />
        </motion.div>
        
        <motion.div 
          className={`absolute top-40 ${reversed ? 'right-40' : 'left-40'} text-slate-300/25`}
          animate={{
            y: [-15, 15, -15],
            rotate: [-3, 3, -3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        >
          <Users size={48} />
        </motion.div>

        <motion.div 
          className={`absolute top-60 ${reversed ? 'right-10' : 'left-10'} text-slate-500/20`}
          animate={{
            y: [-8, 12, -8],
            rotate: [-1, 1, -1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        >
          <Award size={56} />
        </motion.div>

        {/* Animated Dots */}
        {Array.from({ length: 20 }).map((_, i) => {
          const randomPos = Math.random() * 50;
          return (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-slate-400/30 rounded-full"
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

      {/* Content Container */}
      <div className={`relative z-10 min-h-screen flex ${reversed ? 'flex-row-reverse' : ''}`}>
        {/* Hero Section */}
        <motion.div 
          className="hidden lg:flex lg:w-2/5 flex-col justify-center px-12 text-white relative"
          variants={itemVariants}
        >
          {/* Desktop Back Button */}
          {showBackButton && (
            <motion.div 
              className={`absolute top-6 ${reversed ? 'right-6' : 'left-6'}`}
              variants={itemVariants}
            >
              <CustomButton variant="secondary" className="" asChild>
                <Link to='/'>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver al inicio
                </Link>
              </CustomButton>
            </motion.div>
          )}

          <div className="max-w-md">
            <motion.div 
              className="flex items-center "
              variants={itemVariants}
            >
              <Link to='/'>
                <LargeLogo className='invert size-26' />
              </Link>
            </motion.div>

            <motion.h2 
              className="text-4xl font-bold mb-6 leading-tight"
              variants={itemVariants}
            >
              {title}
            </motion.h2>
            
            <motion.p 
              className="text-slate-200 text-lg mb-8 leading-relaxed"
              variants={itemVariants}
            >
              {subtitle}
            </motion.p>

            <motion.div 
              className="space-y-4"
              variants={itemVariants}
            >
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                <span className="text-slate-200">Crea tu propia academia online</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                <span className="text-slate-200">Accede a cursos de calidad</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                <span className="text-slate-200">Certificaciones reconocidas</span>
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
              ease: "linear"
            }}
          >
            <Sparkles className="text-slate-400/40" size={80} />
          </motion.div>
        </motion.div>

        {/* Form Section */}
        <motion.div 
          className="w-full lg:w-3/5 flex flex-col min-h-screen"
          variants={formVariants}
        >
          {/* Header for mobile */}
          <div className="lg:hidden flex-shrink-0 p-6" style={{ background: 'linear-gradient(90deg, #020618 0%, #0a1428 100%)' }}>
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center">
                <Logo className="me-2" />
                <h1 className="text-xl font-medium">ISWO Academy</h1>
              </div>
              {showBackButton && (
                <CustomButton variant="ghost" className="text-white hover:bg-white/20" asChild>
                  <Link to='/'>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver
                  </Link>
                </CustomButton>
              )}
            </div>
          </div>

          {/* Form Container */}
          <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
            <motion.div 
              className="w-full max-w-md"
              variants={itemVariants}
            >
              {children}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}