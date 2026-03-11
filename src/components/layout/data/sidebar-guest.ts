import {
  LayoutDashboard,
  Sparkles,
  Settings,
  UserCog,
  HelpCircle,
} from 'lucide-react'
import { type SidebarData } from '../types'

/**
 * Sidebar para usuarios Guest (sin academias)
 * Vista básica con opciones limitadas
 */
export function getGuestSidebar(
  showOnboarding: boolean,
  t: (key: string) => string
): SidebarData['navGroups'] {
  const generalItems: { title: string; url: string; icon: typeof LayoutDashboard }[] = [
    {
      title: t('sidebar.items.dashboard'),
      url: '/dashboard/student',
      icon: LayoutDashboard,
    },
  ]

  // Add onboarding if not completed
  if (showOnboarding) {
    generalItems.push({
      title: t('sidebar.items.completeProfile'),
      url: '/onboarding',
      icon: Sparkles,
    })
  }

  return [
    {
      title: t('sidebar.groups.general'),
      items: generalItems,
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
