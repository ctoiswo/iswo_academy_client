import {
  LayoutDashboard,
  GraduationCap,
  Users,
  BarChart3,
  Monitor,
  ShoppingCart,
  Award,
  Settings,
  UserCog,
  HelpCircle,
} from 'lucide-react'
import { type SidebarData } from '../types'

/**
 * Sidebar para Super Admin
 * Gestión global de todas las academias del sistema
 */
export function getSuperAdminSidebar(): SidebarData['navGroups'] {
  return [
    {
      title: 'General',
      items: [
        {
          title: 'Panel Principal',
          url: '/dashboard/super-admin',
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
              icon: LayoutDashboard,
            },
            {
              title: 'Gamificación',
              url: '/super-admin/gamification',
              icon: Award,
            },
          ],
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
          items: [
            {
              title: 'Perfil',
              url: '/settings',
              icon: UserCog,
            },
          ],
        },
        {
          title: 'Centro de Ayuda',
          url: '/help-center',
          icon: HelpCircle,
        },
      ],
    },
  ]
}
