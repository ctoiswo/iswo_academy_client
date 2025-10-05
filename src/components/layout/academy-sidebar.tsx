import { useParams } from '@tanstack/react-router'
import { useLayout } from '@/context/layout-provider'
import { useAuthStore } from '@/stores/auth-store'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { AcademySwitcher } from '@/components/academy-switcher'
import { getAcademySidebarData } from './data/academy-sidebar-data'

export function AcademySidebar() {
  const { collapsible, variant } = useLayout()
  const { academyId } = useParams({ from: '/academy/$academyId' })
  const { currentAcademy, user } = useAuthStore()
  
  // Get academy-specific sidebar data
  const sidebarData = getAcademySidebarData(academyId, currentAcademy)
  
  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <AcademySwitcher />
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user || sidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}