import { Command } from 'lucide-react'
import { useLocation } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { useLayout } from '@/context/layout-provider'
import { useSidebarData } from '@/hooks/use-sidebar-data'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { AcademySwitcher } from '@/components/academy-switcher'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { TeamSwitcher } from './team-switcher'
import { CourseStatsHeader } from './course-stats-header'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const { user, academyData } = useAuthStore()
  const location = useLocation()
  
  // Usar el hook centralizado para obtener el sidebar apropiado
  const navGroups = useSidebarData()
  
  // Determinar si el usuario es guest
  const isGuest = !user?.is_super_admin && (!academyData || academyData.count === 0)
  
  // Detectar si estamos en una ruta de curso específico
  const isInCourseRoute = location.pathname.match(/\/academy\/[^/]+\/courses\/([^/]+)/)

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        {/* Academy Switcher for authenticated users with academies */}
        {!isGuest ? (
          <AcademySwitcher
            fallback={
              <TeamSwitcher
                teams={[
                  {
                    name: 'ISWO Academy',
                    logo: Command,
                    plan: 'Platform',
                  },
                ]}
              />
            }
          />
        ) : (
          <TeamSwitcher
            teams={[
              {
                name: 'ISWO Academy',
                logo: Command,
                plan: 'Guest User',
              },
            ]}
          />
        )}
        
        {/* Course Stats Header - Only shown when viewing a specific course */}
        {isInCourseRoute && <CourseStatsHeader />}
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user?.full_name || user?.first_name || 'User',
            email: user?.email || '',
            avatar: user?.avatar_url || '/avatars/default.jpg',
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
