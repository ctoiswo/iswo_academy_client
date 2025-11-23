import * as React from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ArrowLeftRight, Building, ChevronsUpDown } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Badge } from '@/components/ui/badge'

interface AcademySwitcherProps {
  fallback?: React.ReactNode
}

export function AcademySwitcher({ fallback }: AcademySwitcherProps) {
  const navigate = useNavigate()
  const { isMobile } = useSidebar()
  const { currentAcademy, academyData, switchAcademy } = useAuthStore()

  // Show fallback if user has no academies or only one academy
  if (!academyData || academyData.count <= 1) {
    return fallback ? <>{fallback}</> : null
  }

  const handleSwitchAcademy = () => {
    switchAcademy()
    navigate({ to: '/academy-selection' })
  }

  // If no current academy is selected, show a placeholder
  if (!currentAcademy) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            onClick={handleSwitchAcademy}
            className="cursor-pointer"
          >
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <Building className="size-4" />
            </div>
            <div className="grid flex-1 text-start text-sm leading-tight">
              <span className="truncate font-semibold">Select Academy</span>
              <span className="truncate text-xs text-muted-foreground">
                Choose an academy
              </span>
            </div>
            <ChevronsUpDown className="ms-auto" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {/* Academy Logo or Default Icon */}
              <div className="flex-shrink-0">
                {currentAcademy.logo_url ? (
                  <img
                    src={currentAcademy.logo_url}
                    alt={`${currentAcademy.name} logo`}
                    className="size-8 rounded-lg object-cover"
                    onError={(e) => {
                      // Fallback to default icon if image fails to load
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const fallback = target.nextElementSibling as HTMLElement
                      if (fallback) fallback.style.display = 'flex'
                    }}
                  />
                ) : null}
                <div
                  className={`bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg ${
                    currentAcademy.logo_url ? 'hidden' : ''
                  }`}
                >
                  <Building className="size-4" />
                </div>
              </div>

              {/* Academy Name and Role */}
              <div className="grid flex-1 text-start text-sm leading-tight">
                <span className="truncate font-semibold">
                  {currentAcademy.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {currentAcademy.user_role_display}
                </span>
              </div>
              <ChevronsUpDown className="ms-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Current Academy
            </DropdownMenuLabel>
            
            {/* Current Academy Display */}
            <div className="px-2 py-1.5">
              <div className="flex items-center gap-2">
                {currentAcademy.logo_url ? (
                  <img
                    src={currentAcademy.logo_url}
                    alt={`${currentAcademy.name} logo`}
                    className="size-6 rounded object-cover"
                  />
                ) : (
                  <div className="bg-primary/10 text-primary flex size-6 items-center justify-center rounded">
                    <Building className="size-3" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">
                    {currentAcademy.name}
                  </div>
                  <Badge variant="secondary" className="text-xs mt-0.5">
                    {currentAcademy.user_role_display}
                  </Badge>
                </div>
              </div>
            </div>

            <DropdownMenuSeparator />
            
            {/* Switch Academy Action */}
            <DropdownMenuItem 
              onClick={handleSwitchAcademy}
              className="gap-2 p-2 cursor-pointer"
            >
              <ArrowLeftRight className="size-4" />
              <span>Cambiar Academia</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}