import {
  LayoutDashboard,
  Sparkles,
  Settings,
  UserCog,
  Wrench,
  Palette,
  Bell,
  Monitor,
  HelpCircle,
} from 'lucide-react'
import { type SidebarData } from '../types'

/**
 * Sidebar para usuarios Guest (sin academias)
 * Vista básica con opciones limitadas
 */
export function getGuestSidebar(showOnboarding: boolean): SidebarData['navGroups'] {
  const generalItems = [
    {
      title: 'Panel Principal',
      url: '/dashboard',
      icon: LayoutDashboard,
    },
  ]

  // Add onboarding if not completed
  if (showOnboarding) {
    generalItems.push({
      title: 'Completa tu Perfil',
      url: '/onboarding',
      icon: Sparkles,
      badge: '¡Nuevo!',
    })
  }

  return [
    {
      title: 'General',
      items: generalItems,
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
