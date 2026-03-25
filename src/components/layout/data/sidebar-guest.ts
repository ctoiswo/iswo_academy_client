import { type SidebarData } from '../types'

/**
 * Sidebar para usuarios Guest (sin academias)
 * Vista básica con opciones limitadas
 */
export function getGuestSidebar(
  _showOnboarding: boolean,
  t: (key: string) => string
): SidebarData['navGroups'] {
  void t
  return []
}
