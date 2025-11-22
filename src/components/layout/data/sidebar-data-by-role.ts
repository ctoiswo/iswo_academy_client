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
  ClipboardList,
  FileQuestion,
  Target,
  Calendar,
  Trophy,
  Building2,
  UserCheck,
  Layers,
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
              title: 'Explorar Cursos',
              url: '/courses',
              icon: GraduationCap,
            },
            {
              title: 'Mis Tareas',
              url: '/assignments',
              icon: ClipboardList,
            },
            {
              title: 'Mis Insignias',
              url: '/badges',
              icon: Award,
            },
            {
              title: 'Certificados',
              url: '/certificates',
              icon: Trophy,
            },
            {
              title: 'Canjear Código',
              url: '/redeem-code',
              icon: Key,
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
              title: 'Mis Estudiantes',
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
              title: 'Mis Lecciones',
              url: '/teacher/lessons',
              icon: BookMarked,
            },
            {
              title: 'Tareas',
              url: '/teacher/assignments',
              icon: ClipboardList,
            },
            {
              title: 'Exámenes',
              url: '/teacher/exams',
              icon: FileQuestion,
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
              title: 'Panel Principal',
              url: '/dashboard',
              icon: LayoutDashboard,
            },
            {
              title: 'Analíticas',
              url: '/admin/analytics',
              icon: BarChart3,
            },
          ],
        },
        {
          title: 'Academia',
          items: [
            {
              title: 'Información',
              url: '/admin/academy/info',
              icon: Building2,
            },
            {
              title: 'Rutas de Aprendizaje',
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
              title: 'Tareas',
              url: '/admin/assignments',
              icon: ClipboardList,
            },
            {
              title: 'Exámenes',
              url: '/admin/exams',
              icon: FileQuestion,
            },
            {
              title: 'Quizzes',
              url: '/admin/quizzes',
              icon: Target,
            },
          ],
        },
        {
          title: 'Usuarios',
          items: [
            {
              title: 'Todos los Usuarios',
              url: '/admin/users',
              icon: Users,
            },
            {
              title: 'Profesores',
              url: '/admin/teachers',
              icon: UserCheck,
            },
            {
              title: 'Estudiantes',
              url: '/admin/students',
              icon: GraduationCap,
            },
            {
              title: 'Inscripciones',
              url: '/admin/enrollments',
              icon: UserCog,
            },
          ],
        },
        {
          title: 'Gamificación',
          items: [
            {
              title: 'Insignias',
              url: '/admin/badges',
              icon: Award,
            },
            {
              title: 'Logros',
              url: '/admin/achievements',
              icon: Trophy,
            },
            {
              title: 'Tabla de Clasificación',
              url: '/admin/leaderboard',
              icon: BarChart3,
            },
          ],
        },
        {
          title: 'Comunicación',
          items: [
            {
              title: 'Chats',
              url: '/admin/chats',
              icon: MessagesSquare,
            },
            {
              title: 'Anuncios',
              url: '/admin/announcements',
              icon: Bell,
            },
            {
              title: 'Eventos',
              url: '/admin/events',
              icon: Calendar,
            },
          ],
        },
        {
          title: 'Gestión',
          items: [
            {
              title: 'Pagos y Suscripciones',
              url: '/admin/payments',
              icon: ShoppingCart,
            },
            {
              title: 'Recursos',
              url: '/admin/resources',
              icon: FolderKanban,
            },
            {
              title: 'Categorías',
              url: '/admin/categories',
              icon: Layers,
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
              title: 'Academias',
              icon: GraduationCap,
              items: [
                {
                  title: 'Todas las Academias',
                  url: '/super-admin/academies',
                  icon: GraduationCap,
                },
                {
                  title: 'Categorías',
                  url: '/super-admin/categories',
                  icon: FolderKanban,
                },
                {
                  title: 'Gamificación',
                  url: '/super-admin/gamification',
                  icon: Award,
                },
              ],
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
