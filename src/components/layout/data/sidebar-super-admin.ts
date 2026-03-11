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
export function getSuperAdminSidebar(
  t: (key: string) => string
): SidebarData['navGroups'] {
  return [
    {
      title: t('sidebar.groups.general'),
      items: [
        {
          title: t('sidebar.items.dashboard'),
          url: '/dashboard/super-admin',
          icon: LayoutDashboard,
        },
        {
          title: t('sidebar.items.academies'),
          icon: GraduationCap,
          items: [
            {
              title: t('sidebar.items.allAcademies'),
              url: '/super-admin/academies',
              icon: GraduationCap,
            },
            {
              title: t('sidebar.items.categories'),
              url: '/super-admin/categories',
              icon: LayoutDashboard,
            },
            {
              title: t('sidebar.groups.gamification'),
              url: '/super-admin/gamification',
              icon: Award,
            },
          ],
        },
      ],
    },
    {
      title: t('sidebar.groups.management'),
      items: [
        {
          title: t('sidebar.items.usersList'),
          url: '/super-admin/users',
          icon: Users,
        },
        {
          title: t('sidebar.items.payments'),
          url: '/super-admin/payments',
          icon: ShoppingCart,
        },
        {
          title: t('sidebar.items.systemHealth'),
          url: '/super-admin/health',
          icon: Monitor,
        },
      ],
    },
    {
      title: t('sidebar.groups.configuration'),
      items: [
        {
          title: t('sidebar.items.settings'),
          icon: Settings,
          items: [
            {
              title: t('sidebar.items.profile'),
              url: '/settings',
              icon: UserCog,
            },
          ],
        },
        {
          title: t('sidebar.items.helpCenter'),
          url: '/help-center',
          icon: HelpCircle,
        },
      ],
    },
  ]
}
