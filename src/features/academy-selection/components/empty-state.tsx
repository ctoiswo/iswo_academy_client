import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { GraduationCap, Plus } from 'lucide-react'

export function EmptyState() {
  return (
    <motion.div 
      className="text-center py-16"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-6 shadow-lg">
        <GraduationCap className="w-12 h-12 text-primary" />
      </div>
      <h3 className="text-2xl font-bold mb-3">No tienes academias</h3>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto text-lg">
        Aún no perteneces a ninguna academia. Crea tu propia academia o solicita una invitación a un administrador.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button size="lg" className="shadow-lg">
          <Plus className="w-5 h-5 mr-2" />
          Crear Academia
        </Button>
        <Button variant="outline" size="lg">
          Solicitar Invitación
        </Button>
      </div>
    </motion.div>
  )
}