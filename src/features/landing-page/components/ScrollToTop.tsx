import { motion } from 'framer-motion'
import { ChevronUp } from 'lucide-react'

interface ScrollToTopProps {
  show: boolean
  onClick: () => void
}

export function ScrollToTop({ show, onClick }: ScrollToTopProps) {
  if (!show) return null

  return (
    <motion.button
      onClick={onClick}
      className='bg-primary text-primary-foreground hover:bg-primary/90 fixed right-8 bottom-8 z-50 rounded-full p-3 shadow-lg transition-all duration-200'
      aria-label='Volver arriba'
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      whileHover={{ scale: 1.1, y: -5 }}
      whileTap={{ scale: 0.9 }}
    >
      <ChevronUp className='h-5 w-5' />
    </motion.button>
  )
}
