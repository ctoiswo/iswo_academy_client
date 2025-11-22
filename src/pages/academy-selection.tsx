import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth-store'
import { 
  Building, 
  Users, 
  GraduationCap,
  ArrowRight,
  Plus,
  Shield,
  BookOpen,
  Clock,
  Sparkles
} from 'lucide-react'

// TypeScript interfaces for academy data
export interface AcademyMembership {
  id: number
  name: string
  description: string
  logo_url: string | null
  user_role: string
  user_role_display: string
  created_at: string
  last_accessed: string | null
}

export interface AcademyData {
  count: number
  academies: AcademyMembership[]
}

interface AcademyCardProps {
  academy: AcademyMembership
  onSelect: (academy: AcademyMembership) => void
  isSelecting: boolean
}

function AcademyCard({ academy, onSelect }: AcademyCardProps) {
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

function EmptyState() {
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

export function AcademySelectionPage() {
  const navigate = useNavigate()
  const { user, academyData, selectAcademy } = useAuthStore()
  const [isSelecting, setIsSelecting] = useState(false)

  const handleAcademySelect = async (academy: AcademyMembership) => {
    try {
      setIsSelecting(true)
      
      // Select academy in store
      selectAcademy(academy.id)
      
      // Determine dashboard path based on user role
      let dashboardPath = `/academy/${academy.id}/dashboard`
      if (academy.user_role === 'admin') {
        dashboardPath = `/academy/${academy.id}/admin`
      } else if (academy.user_role === 'teacher') {
        dashboardPath = `/academy/${academy.id}/teacher/dashboard`
      }
      
      // Navigate to role-specific dashboard
      navigate({ to: dashboardPath })
    } catch (error) {
      console.error('Failed to select academy:', error)
      // TODO: Add proper error handling with toast notifications
    } finally {
      setIsSelecting(false)
    }
  }

  // Show loading state if user data is not available
  if (!user || !academyData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6" role="status" aria-label="Loading"></div>
          <p className="text-muted-foreground text-lg">Cargando tus academias...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
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
            ¡Bienvenido de nuevo, <span className="font-semibold text-foreground">{user.first_name}</span>! 
            Elige la academia a la que deseas acceder hoy.
          </motion.p>
        </motion.header>

        {/* Academy Grid or Empty State */}
        {academyData.count === 0 ? (
          <EmptyState />
        ) : (
          <>
            <motion.div 
              className="mb-8 flex items-center justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Tienes acceso a <span className="font-semibold text-foreground">{academyData.count}</span> {academyData.count === 1 ? 'academia' : 'academias'}
                </p>
              </div>
            </motion.div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {academyData.academies.map((academy, index) => (
                <motion.div
                  key={academy.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <AcademyCard
                    academy={academy}
                    onSelect={handleAcademySelect}
                    isSelecting={isSelecting}
                  />
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* Footer */}
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
      </div>
    </div>
  )
}