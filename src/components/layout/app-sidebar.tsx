import { useAuthStore } from '@/stores/auth-store'
import { useLayout } from '@/context/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { AcademySwitcher } from '@/components/academy-switcher'
import { sidebarData } from './data/sidebar-data'
import { getSidebarDataByRole } from './data/sidebar-data-by-role'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { TeamSwitcher } from './team-switcher'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const { user, academyData, currentAcademy } = useAuthStore()

  // Determinar el role del usuario
  const getUserRole = ():
    | 'guest'
    | 'student'
    | 'teacher'
    | 'admin'
    | 'super_admin' => {

    // Super admin siempre tiene prioridad - independiente de academias
    if (user?.is_super_admin) {
      return 'super_admin'
    }

    // Si no tiene academias, es guest
    if (!academyData || academyData.count === 0) {
      return 'guest'
    }

    // Si tiene academia seleccionada, usar su role en esa academia
    if (currentAcademy) {
      const role = currentAcademy.user_role
      if (role === 'owner' || role === 'admin') return 'admin'
      if (role === 'teacher') return 'teacher'
      if (role === 'student') return 'student'
    }
    return 'student'
  }

  const userRole = getUserRole()
  console.log('🔍 App Sidebar - User Role:', userRole, 'Is Super Admin:', user?.is_super_admin)
  const navGroups = getSidebarDataByRole(userRole, user)

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        {/* Academy Switcher for authenticated users with academies */}
        {userRole !== 'guest' ? (
          <AcademySwitcher
            fallback={<TeamSwitcher teams={sidebarData.teams} />}
          />
        ) : (
          <TeamSwitcher
            teams={[
              {
                name: 'ISWO Academy',
                logo: sidebarData.teams[0].logo,
                plan: 'Guest User',
              },
            ]}
          />
        )}
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
