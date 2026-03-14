import { useAuthStore } from '@/stores/auth-store'
import { useLayout } from '@/context/layout-provider'
import { useSidebarData } from '@/hooks/use-sidebar-data'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { AcademySwitcher } from '@/components/academy-switcher'
import { LargeLogo } from '@/components/large-logo'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'

function IswoSidebarHeader({ subtitle }: { subtitle: string }) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size='lg'
          className='cursor-default hover:bg-transparent active:bg-transparent'
        >
          <LargeLogo className='h-8 w-auto dark:invert' />
          <div className='grid flex-1 text-start text-sm leading-tight'>
            <span className='text-muted-foreground truncate text-xs'>
              {subtitle}
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const { user, academyData } = useAuthStore()

  // Usar el hook centralizado para obtener el sidebar apropiado
  const navGroups = useSidebarData()

  // Determinar si el usuario es guest
  const isGuest =
    !user?.is_super_admin && (!academyData || academyData.count === 0)

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        {/* Academy Switcher for authenticated users with academies */}
        {!isGuest ? (
          <AcademySwitcher
            fallback={<IswoSidebarHeader subtitle='Platform' />}
          />
        ) : (
          <IswoSidebarHeader subtitle='Guest User' />
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
