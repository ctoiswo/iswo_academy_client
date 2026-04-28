import {
  LayoutDashboard,
  GraduationCap,
  User,
} from 'lucide-react'
import { type SidebarData } from '../types'

/**
 * Sidebar para usuarios Guest (sin academias)
 * Vista básica con opciones limitadas
 */
export function getGuestSidebar(
  _showOnboarding: boolean,
  t: (key: string) => string
): SidebarData['navGroups'] {
  return [
    {
      title: t('sidebar.groups.general'),
      items: [
        {
          title: t('sidebar.items.dashboard'),
          url: '/dashboard/student',
          icon: LayoutDashboard,
        },
        {
          title: t('sidebar.items.exploreCourses'),
          url: '/academies',
          icon: GraduationCap,
        },
        {
          title: t('sidebar.items.profile'),
          url: '/settings',
          icon: User,
        },
      ],
    },
  ]
}
