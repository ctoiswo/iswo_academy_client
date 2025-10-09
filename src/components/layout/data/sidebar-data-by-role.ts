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
      title: 'Profile',
      url: '/settings',
      icon: UserCog,
    },
    {
      title: 'Account',
      url: '/settings/account',
      icon: Wrench,
    },
    {
      title: 'Appearance',
      url: '/settings/appearance',
      icon: Palette,
    },
    {
      title: 'Notifications',
      url: '/settings/notifications',
      icon: Bell,
    },
    {
      title: 'Display',
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
          title: 'Dashboard',
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
          title: 'Configuration',
          items: [
            {
              title: 'Settings',
              icon: Settings,
              items: settingsItems,
            },
            {
              title: 'Help Center',
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
              title: 'Dashboard',
              url: '/dashboard',
              icon: LayoutDashboard,
            },
            {
              title: 'My Courses',
              url: '/my-courses',
              icon: BookOpen,
            },
            {
              title: 'Redeem Code',
              url: '/redeem-code',
              icon: Key,
            },
            {
              title: 'Certificates',
              url: '/certificates',
              icon: Award,
            },
          ],
        },
        {
          title: 'Configuration',
          items: [
            {
              title: 'Settings',
              icon: Settings,
              items: settingsItems,
            },
            {
              title: 'Help Center',
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
              title: 'Dashboard',
              url: '/dashboard',
              icon: LayoutDashboard,
            },
            {
              title: 'My Courses',
              url: '/teacher/courses',
              icon: GraduationCap,
            },
            {
              title: 'Students',
              url: '/teacher/students',
              icon: Users,
            },
            {
              title: 'Analytics',
              url: '/teacher/analytics',
              icon: BarChart3,
            },
          ],
        },
        {
          title: 'Content',
          items: [
            {
              title: 'Create Course',
              url: '/teacher/courses/create',
              icon: FileText,
            },
            {
              title: 'Resources',
              url: '/teacher/resources',
              icon: FolderKanban,
            },
          ],
        },
        {
          title: 'Configuration',
          items: [
            {
              title: 'Settings',
              icon: Settings,
              items: settingsItems,
            },
            {
              title: 'Help Center',
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
              title: 'Dashboard',
              url: '/dashboard',
              icon: LayoutDashboard,
            },
            {
              title: 'Wizard',
              url: '/onboarding',
              icon: Sparkles,
            },
            {
              title: 'Learning Paths',
              url: '/admin/learning-paths',
              icon: Route,
            },
            {
              title: 'Courses',
              url: '/admin/courses',
              icon: GraduationCap,
            },
            {
              title: 'Lessons',
              url: '/admin/lessons',
              icon: BookMarked,
            },
            {
              title: 'Chats',
              url: '/chats',
              icon: MessagesSquare,
            },
            {
              title: 'Users',
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
          title: 'Management',
          items: [
            {
              title: 'Teachers',
              url: '/admin/teachers',
              icon: Users,
            },
            {
              title: 'Students',
              url: '/admin/students',
              icon: Users,
            },
            {
              title: 'Payments',
              url: '/admin/payments',
              icon: ShoppingCart,
            },
          ],
        },
        {
          title: 'Configuration',
          items: [
            {
              title: 'Settings',
              icon: Settings,
              items: settingsItems,
            },
            {
              title: 'Help Center',
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
              title: 'Dashboard',
              url: '/dashboard',
              icon: LayoutDashboard,
            },
            {
              title: 'All Academies',
              url: '/super-admin/academies',
              icon: GraduationCap,
            },
            {
              title: 'Global Analytics',
              url: '/super-admin/analytics',
              icon: BarChart3,
            },
          ],
        },
        {
          title: 'Management',
          items: [
            {
              title: 'Users',
              url: '/super-admin/users',
              icon: Users,
            },
            {
              title: 'Payments',
              url: '/super-admin/payments',
              icon: ShoppingCart,
            },
            {
              title: 'System Health',
              url: '/super-admin/health',
              icon: Monitor,
            },
          ],
        },
        {
          title: 'Configuration',
          items: [
            {
              title: 'Settings',
              icon: Settings,
              items: settingsItems,
            },
            {
              title: 'Help Center',
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
