import {
  LayoutDashboard,
  Settings,
  UserCog,
  Wrench,
  Palette,
  Bell,
  Monitor,
  HelpCircle,
  GraduationCap,
  BookOpen,
  Users,
  BarChart3,
  FileText,
  Award,
  ShoppingCart,
  FolderKanban,
  Sparkles,
  MessagesSquare,
  Route,
  BookMarked,
  Key,
} from 'lucide-react'
import { type SidebarData } from '../types'

interface UserWithOnboarding {
  onboarding_completed_at: string | null
}

/**
 * Genera los datos del sidebar según el role del usuario
 */
export function getSidebarDataByRole(
  userRole: 'guest' | 'student' | 'teacher' | 'admin' | 'super_admin',
  user?: UserWithOnboarding | null
): SidebarData['navGroups'] {
  // Configuración común de Settings
  const settingsItems = [
    {
      title: 'Perfil',
      url: '/settings',
      icon: UserCog,
    },
    {
      title: 'Cuenta',
      url: '/settings/account',
      icon: Wrench,
    },
    {
      title: 'Apariencia',
      url: '/settings/appearance',
      icon: Palette,
    },
    {
      title: 'Notificaciones',
      url: '/settings/notifications',
      icon: Bell,
    },
    {
      title: 'Pantalla',
      url: '/settings/display',
      icon: Monitor,
    },
  ]

  // Check if onboarding is incomplete
  const showOnboarding = user && !user.onboarding_completed_at

  switch (userRole) {
    case 'guest':
      // Usuario sin academias - solo dashboard básico
      const guestGeneralItems = [
        {
          title: 'Panel Principal',
          url: '/dashboard',
          icon: LayoutDashboard,
        },
      ]

      // Add onboarding if not completed
      if (showOnboarding) {
        guestGeneralItems.push({
          title: 'Completa tu Perfil',
          url: '/onboarding',
          icon: Sparkles,
          badge: '¡Nuevo!',
        } as any)
      }

      return [
        {
          title: 'General',
          items: guestGeneralItems,
        },
        {
          title: 'Configuración',
          items: [
            {
              title: 'Ajustes',
              icon: Settings,
              items: settingsItems,
            },
            {
              title: 'Centro de Ayuda',
              url: '/help-center',
              icon: HelpCircle,
            },
          ],
        },
      ]

    case 'student':
      // Estudiante - cursos y progreso
      return [
        {
          title: 'General',
          items: [
            {
              title: 'Panel Principal',
              url: '/dashboard',
              icon: LayoutDashboard,
            },
            {
              title: 'Mis Cursos',
              url: '/my-courses',
              icon: BookOpen,
            },
            {
              title: 'Canjear Código',
              url: '/redeem-code',
              icon: Key,
            },
            {
              title: 'Certificados',
              url: '/certificates',
              icon: Award,
            },
          ],
        },
        {
          title: 'Configuración',
          items: [
            {
              title: 'Ajustes',
              icon: Settings,
              items: settingsItems,
            },
            {
              title: 'Centro de Ayuda',
              url: '/help-center',
              icon: HelpCircle,
            },
          ],
        },
      ]

    case 'teacher':
      // Profesor - gestión de cursos y estudiantes
      return [
        {
          title: 'General',
          items: [
            {
              title: 'Panel Principal',
              url: '/dashboard',
              icon: LayoutDashboard,
            },
            {
              title: 'Mis Cursos',
              url: '/teacher/courses',
              icon: GraduationCap,
            },
            {
              title: 'Estudiantes',
              url: '/teacher/students',
              icon: Users,
            },
            {
              title: 'Analíticas',
              url: '/teacher/analytics',
              icon: BarChart3,
            },
          ],
        },
        {
          title: 'Contenido',
          items: [
            {
              title: 'Crear Curso',
              url: '/teacher/courses/create',
              icon: FileText,
            },
            {
              title: 'Recursos',
              url: '/teacher/resources',
              icon: FolderKanban,
            },
          ],
        },
        {
          title: 'Configuración',
          items: [
            {
              title: 'Ajustes',
              icon: Settings,
              items: settingsItems,
            },
            {
              title: 'Centro de Ayuda',
              url: '/help-center',
              icon: HelpCircle,
            },
          ],
        },
      ]

    case 'admin':
      // Admin de academia - gestión completa de la academia
      return [
        {
          title: 'General',
          items: [
            {
              title: 'Panel principal',
              url: '/dashboard',
              icon: LayoutDashboard,
            },
            {
              title: 'Onboarding',
              url: '/onboarding',
              icon: Sparkles,
            },
            {
              title: 'Rutas de aprendizaje',
              url: '/admin/learning-paths',
              icon: Route,
            },
            {
              title: 'Cursos',
              url: '/admin/courses',
              icon: GraduationCap,
            },
            {
              title: 'Lecciones',
              url: '/admin/lessons',
              icon: BookMarked,
            },
            {
              title: 'Chats',
              url: '/chats',
              icon: MessagesSquare,
            },
            {
              title: 'Usuarios',
              url: '/admin/users',
              icon: Users,
            },
            {
              title: 'Analytics',
              url: '/admin/analytics',
              icon: BarChart3,
            },
          ],
        },
        {
          title: 'Gestión',
          items: [
            {
              title: 'Profesores',
              url: '/admin/teachers',
              icon: Users,
            },
            {
              title: 'Estudiantes',
              url: '/admin/students',
              icon: Users,
            },
            {
              title: 'Pagos',
              url: '/admin/payments',
              icon: ShoppingCart,
            },
          ],
        },
        {
          title: 'Configuración',
          items: [
            {
              title: 'Ajustes',
              icon: Settings,
              items: settingsItems,
            },
            {
              title: 'Centro de Ayuda',
              url: '/help-center',
              icon: HelpCircle,
            },
          ],
        },
      ]

    case 'super_admin':
      // Super admin - gestión de todas las academias
      return [
        {
          title: 'General',
          items: [
            {
              title: 'Panel Principal',
              url: '/dashboard',
              icon: LayoutDashboard,
            },
            {
              title: 'Todas las Academias',
              url: '/super-admin/academies',
              icon: GraduationCap,
            },
            {
              title: 'Analíticas Globales',
              url: '/super-admin/analytics',
              icon: BarChart3,
            },
          ],
        },
        {
          title: 'Gestión',
          items: [
            {
              title: 'Usuarios',
              url: '/super-admin/users',
              icon: Users,
            },
            {
              title: 'Pagos',
              url: '/super-admin/payments',
              icon: ShoppingCart,
            },
            {
              title: 'Estado del Sistema',
              url: '/super-admin/health',
              icon: Monitor,
            },
          ],
        },
        {
          title: 'Configuración',
          items: [
            {
              title: 'Ajustes',
              icon: Settings,
              items: settingsItems,
            },
            {
              title: 'Centro de Ayuda',
              url: '/help-center',
              icon: HelpCircle,
            },
          ],
        },
      ]

    default:
      return []
  }
}
