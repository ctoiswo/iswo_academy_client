import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Users } from 'lucide-react'

export function PageFooter() {
  return (
    <motion.footer 
      className="mt-20 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <div className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-muted/30 backdrop-blur-sm">
        <Users className="w-4 h-4 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          ¿Necesitas ayuda? Contacta al administrador de tu academia o{' '}
          <Button variant="link" className="p-0 h-auto text-sm font-semibold">
            visita nuestro centro de ayuda
          </Button>
        </p>
      </div>
    </motion.footer>
  )
}