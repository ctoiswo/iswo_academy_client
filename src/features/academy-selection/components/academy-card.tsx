import { motion } from 'framer-motion'
import {
  Building,
  GraduationCap,
  ArrowRight,
  Shield,
  BookOpen,
  Clock,
  Sparkles,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { AcademyMembership } from '../types'

interface AcademyCardProps {
  academy: AcademyMembership
  onSelect: (academy: AcademyMembership) => void
  isSelecting: boolean
}

export function AcademyCard({ academy, onSelect }: AcademyCardProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className='h-4 w-4' />
      case 'teacher':
        return <BookOpen className='h-4 w-4' />
      default:
        return <GraduationCap className='h-4 w-4' />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'teacher':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      default:
        return 'bg-green-100 text-green-700 border-green-200'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador'
      case 'teacher':
        return 'Profesor'
      case 'student':
        return 'Estudiante'
      default:
        return academy.user_role_display
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Card
        className='academy-card hover:border-primary/40 group relative h-full cursor-pointer overflow-hidden border-2 transition-all duration-300 hover:shadow-2xl'
        onClick={() => onSelect(academy)}
      >
        {/* Gradient background effect */}
        <div className='from-primary/5 absolute inset-0 bg-gradient-to-br via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />

        <CardHeader className='relative'>
          <div className='flex items-start space-x-4'>
            {academy.logo_url ? (
              <div className='relative'>
                <img
                  src={academy.logo_url}
                  alt={`${academy.name} logo`}
                  className='border-muted h-16 w-16 rounded-xl border-2 object-cover shadow-md'
                />
                <div className='bg-primary absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full'>
                  <Sparkles className='h-3 w-3 text-white' />
                </div>
              </div>
            ) : (
              <div className='from-primary/20 to-primary/5 border-primary/20 relative flex h-16 w-16 items-center justify-center rounded-xl border-2 bg-gradient-to-br shadow-md'>
                <Building
                  className='text-primary h-8 w-8'
                  data-testid='building-icon'
                />
                <div className='bg-primary absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full'>
                  <Sparkles className='h-3 w-3 text-white' />
                </div>
              </div>
            )}
            <div className='min-w-0 flex-1'>
              <CardTitle className='group-hover:text-primary line-clamp-2 text-xl leading-tight transition-colors'>
                {academy.name}
              </CardTitle>
              <Badge
                className={`mt-2 ${getRoleColor(academy.user_role)} flex w-fit items-center gap-1 border`}
              >
                {getRoleIcon(academy.user_role)}
                <span className='font-medium'>
                  {getRoleLabel(academy.user_role)}
                </span>
              </Badge>
            </div>
            <ArrowRight className='text-muted-foreground group-hover:text-primary h-5 w-5 transition-all group-hover:translate-x-1' />
          </div>
        </CardHeader>

        <CardContent className='relative space-y-3'>
          <p className='text-muted-foreground line-clamp-2 text-sm leading-relaxed'>
            {academy.description || 'Sin descripción disponible'}
          </p>

          <div className='border-muted/50 flex items-center justify-between border-t pt-2'>
            {academy.last_accessed_at ? (
              <div className='text-muted-foreground flex items-center text-xs'>
                <Clock className='mr-1.5 h-3.5 w-3.5' />
                <span>
                  Último acceso: {formatDate(academy.last_accessed_at)}
                </span>
              </div>
            ) : (
              <div className='text-muted-foreground flex items-center text-xs'>
                <Sparkles className='mr-1.5 h-3.5 w-3.5' />
                <span>Nueva academia</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
