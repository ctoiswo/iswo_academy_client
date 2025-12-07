import { motion } from 'framer-motion'
import { GraduationCap } from 'lucide-react'

interface PageHeaderProps {
  userName: string
}

export function PageHeader({ userName }: PageHeaderProps) {
  return (
    <motion.header 
      className="text-center mb-16"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mr-4 shadow-xl">
          <GraduationCap className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Selecciona tu Academia
        </h1>
      </div>
      <motion.p 
        className="text-xl text-muted-foreground max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        ¡Bienvenido de nuevo, <span className="font-semibold text-foreground">{userName}</span>! 
        Elige la academia a la que deseas acceder hoy.
      </motion.p>
    </motion.header>
  )
}