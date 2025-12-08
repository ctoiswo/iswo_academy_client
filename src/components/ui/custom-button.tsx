import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  isLoading?: boolean
  children: React.ReactNode
  asChild?: boolean
}

export function CustomButton({
  variant = 'primary',
  isLoading = false,
  className,
  children,
  disabled,
  ...props
}: CustomButtonProps) {
  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          className: cn(
            'text-white shadow-lg transition-all duration-200 border-0',
            className
          ),
          style: {
            background:
              'linear-gradient(90deg, #020618 0%, #0a1428 50%, #1a2332 100%)',
            boxShadow: '0 4px 14px 0 rgba(2, 6, 24, 0.4)',
          },
        }

      case 'secondary':
        return {
          className: cn(
            'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 shadow-sm transition-all duration-200',
            className
          ),
          style: {},
        }

      case 'outline':
        return {
          className: cn(
            'border-slate-300 hover:bg-slate-50 hover:border-slate-400 shadow-sm transition-all duration-200',
            className
          ),
          style: {},
        }

      case 'ghost':
        return {
          className: cn(
            'hover:bg-slate-100 text-slate-700 transition-all duration-200',
            className
          ),
          style: {},
        }

      default:
        return {
          className: className,
          style: {},
        }
    }
  }

  const variantStyles = getVariantStyles()

  return (
    <motion.div
      variants={buttonVariants}
      initial='idle'
      whileHover={disabled || isLoading ? 'idle' : 'hover'}
      whileTap={disabled || isLoading ? 'idle' : 'tap'}
    >
      <Button
        className={variantStyles.className}
        style={variantStyles.style}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <motion.span
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {children}
          </motion.span>
        ) : (
          children
        )}
      </Button>
    </motion.div>
  )
}
