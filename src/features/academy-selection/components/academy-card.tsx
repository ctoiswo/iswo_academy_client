import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Building,
  GraduationCap,
  ArrowRight,
  Shield,
  BookOpen,
  Clock,
  Sparkles
} from 'lucide-react'
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
      day: 'numeric'
    })
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-4 h-4" />
      case 'teacher':
        return <BookOpen className="w-4 h-4" />
      default:
        return <GraduationCap className="w-4 h-4" />
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
        className="academy-card cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/40 relative overflow-hidden group h-full"
        onClick={() => onSelect(academy)}
      >
        {/* Gradient background effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <CardHeader className="relative">
          <div className="flex items-start space-x-4">
            {academy.logo_url ? (
              <div className="relative">
                <img 
                  src={academy.logo_url} 
                  alt={`${academy.name} logo`}
                  className="w-16 h-16 rounded-xl object-cover border-2 border-muted shadow-md"
                />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
            ) : (
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border-2 border-primary/20 shadow-md relative">
                <Building className="w-8 h-8 text-primary" data-testid="building-icon" />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <CardTitle className="text-xl line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                {academy.name}
              </CardTitle>
              <Badge 
                className={`mt-2 ${getRoleColor(academy.user_role)} border flex items-center gap-1 w-fit`}
              >
                {getRoleIcon(academy.user_role)}
                <span className="font-medium">{getRoleLabel(academy.user_role)}</span>
              </Badge>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
        </CardHeader>
        
        <CardContent className="relative space-y-3">
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
            {academy.description || 'Sin descripción disponible'}
          </p>
          
          <div className="flex items-center justify-between pt-2 border-t border-muted/50">
            {academy.last_accessed_at ? (
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5 mr-1.5" />
                <span>Último acceso: {formatDate(academy.last_accessed_at)}</span>
              </div>
            ) : (
              <div className="flex items-center text-xs text-muted-foreground">
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                <span>Nueva academia</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}