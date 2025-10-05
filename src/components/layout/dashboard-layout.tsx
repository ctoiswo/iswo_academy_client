import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { getCookie } from '@/lib/cookies'
import { LayoutProvider } from '@/context/layout-provider'
import { SearchProvider } from '@/context/search-provider'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { SkipToMain } from '@/components/skip-to-main'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import type { DashboardType } from '@/components/dashboard-router'
import type { AuthUser, AcademyMembership } from '@/stores/auth-store'

export type DashboardLayoutVariant = 'full' | 'sidebar' | 'compact'

interface DashboardLayoutProps {
  children: React.ReactNode
  user: AuthUser | null
  academy?: AcademyMembership | null
  variant?: DashboardLayoutVariant
  dashboardType?: DashboardType
  sidebar?: React.ComponentType<DashboardSidebarProps>
  topNavLinks?: TopNavLink[]
  showSearch?: boolean
  showConfigDrawer?: boolean
  className?: string
}

interface DashboardSidebarProps {
  user: AuthUser | null
  academy?: AcademyMembership | null
  dashboardType?: DashboardType
}

interface TopNavLink {
  title: string
  href: string
  isActive?: boolean
  disabled?: boolean
}

/**
 * Base dashboard layout component with responsive design
 */
export function DashboardLayout({
  children,
  user,
  academy,
  variant = 'sidebar',
  dashboardType,
  sidebar: SidebarComponent,
  topNavLinks = [],
  showSearch = true,
  showConfigDrawer = true,
  className
}: DashboardLayoutProps) {
  const defaultOpen = getCookie('sidebar_state') !== 'false'
  
  // Render different layouts based on variant
  switch (variant) {
    case 'full':
      return (
        <FullLayout
          user={user}
          academy={academy}
          topNavLinks={topNavLinks}
          showSearch={showSearch}
          showConfigDrawer={showConfigDrawer}
          className={className}
        >
          {children}
        </FullLayout>
      )
      
    case 'compact':
      return (
        <CompactLayout
          user={user}
          academy={academy}
          topNavLinks={topNavLinks}
          showSearch={showSearch}
          showConfigDrawer={showConfigDrawer}
          className={className}
        >
          {children}
        </CompactLayout>
      )
      
    case 'sidebar':
    default:
      return (
        <SidebarLayout
          user={user}
          academy={academy}
          dashboardType={dashboardType}
          sidebar={SidebarComponent}
          topNavLinks={topNavLinks}
          showSearch={showSearch}
          showConfigDrawer={showConfigDrawer}
          defaultOpen={defaultOpen}
          className={className}
        >
          {children}
        </SidebarLayout>
      )
  }
}

/**
 * Full layout - no sidebar, full width content (for Super Admin)
 */
function FullLayout({
  children,
  user,
  academy,
  topNavLinks,
  showSearch,
  showConfigDrawer,
  className
}: Omit<DashboardLayoutProps, 'variant' | 'sidebar' | 'dashboardType'>) {
  if (!user) return null
  return (
    <SearchProvider>
      <LayoutProvider>
        <div className={cn('min-h-screen bg-background', className)}>
          <SkipToMain />
          
          {/* Header */}
          <Header className="border-b">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold">
                  {academy ? academy.name : 'ISWO Academy'}
                </h1>
                {topNavLinks.length > 0 && <TopNav links={topNavLinks} />}
              </div>
              
              <div className="flex items-center space-x-4">
                {showSearch && <Search />}
                <ThemeSwitch />
                {showConfigDrawer && <ConfigDrawer />}
                <ProfileDropdown />
              </div>
            </div>
          </Header>
          
          {/* Main Content */}
          <Main className="container mx-auto px-4 py-6">
            {children}
          </Main>
        </div>
      </LayoutProvider>
    </SearchProvider>
  )
}

/**
 * Compact layout - minimal header, focused content (for Students)
 */
function CompactLayout({
  children,
  user,
  academy,
  topNavLinks,
  showSearch,
  showConfigDrawer,
  className
}: Omit<DashboardLayoutProps, 'variant' | 'sidebar' | 'dashboardType'>) {
  if (!user) return null
  return (
    <SearchProvider>
      <LayoutProvider>
        <div className={cn('min-h-screen bg-background', className)}>
          <SkipToMain />
          
          {/* Compact Header */}
          <Header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-medium">
                  {academy ? academy.name : 'My Learning'}
                </h1>
              </div>
              
              <div className="flex items-center space-x-2">
                {showSearch && <Search />}
                <ThemeSwitch />
                <ProfileDropdown />
              </div>
            </div>
          </Header>
          
          {/* Navigation Tabs */}
          {topNavLinks.length > 0 && (
            <div className="border-b bg-muted/30">
              <div className="container mx-auto px-4">
                <TopNav links={topNavLinks} />
              </div>
            </div>
          )}
          
          {/* Main Content */}
          <Main className="container mx-auto px-4 py-4">
            {children}
          </Main>
        </div>
      </LayoutProvider>
    </SearchProvider>
  )
}

/**
 * Sidebar layout - sidebar navigation with main content (for Academy Admin, Teachers)
 */
function SidebarLayout({
  children,
  user,
  academy,
  dashboardType,
  sidebar: SidebarComponent,
  topNavLinks,
  showSearch,
  showConfigDrawer,
  defaultOpen,
  className
}: DashboardLayoutProps & { defaultOpen: boolean }) {
  if (!user) return null
  return (
    <SearchProvider>
      <LayoutProvider>
        <SidebarProvider defaultOpen={defaultOpen}>
          <div className={cn('min-h-screen bg-background', className)}>
            <SkipToMain />
            
            {/* Sidebar */}
            {SidebarComponent && (
              <SidebarComponent 
                user={user} 
                academy={academy} 
                dashboardType={dashboardType}
              />
            )}
            
            {/* Main Content Area */}
            <SidebarInset
              className={cn(
                // Set content container for container queries
                '@container/content',
                
                // If layout is fixed, set height to prevent overflow
                'has-[[data-layout=fixed]]:h-svh',
                
                // If sidebar is inset, adjust height calculation
                'peer-data-[variant=inset]:has-[[data-layout=fixed]]:h-[calc(100svh-(var(--spacing)*4))]'
              )}
            >
              {/* Header */}
              <Header>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-4">
                    {topNavLinks.length > 0 && <TopNav links={topNavLinks} />}
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {showSearch && <Search />}
                    <ThemeSwitch />
                    {showConfigDrawer && <ConfigDrawer />}
                    <ProfileDropdown />
                  </div>
                </div>
              </Header>
              
              {/* Main Content */}
              <Main>
                {children}
              </Main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </LayoutProvider>
    </SearchProvider>
  )
}

/**
 * Hook for dashboard layout configuration
 */
export function useDashboardLayout(dashboardType: DashboardType) {
  const layoutConfig = useMemo(() => {
    const configs: Record<DashboardType, {
      variant: DashboardLayoutVariant
      showSearch: boolean
      showConfigDrawer: boolean
    }> = {
      'super-admin': {
        variant: 'full',
        showSearch: true,
        showConfigDrawer: true
      },
      'academy-admin': {
        variant: 'sidebar',
        showSearch: true,
        showConfigDrawer: true
      },
      'teacher': {
        variant: 'sidebar',
        showSearch: true,
        showConfigDrawer: false
      },
      'student': {
        variant: 'compact',
        showSearch: true,
        showConfigDrawer: false
      }
    }
    
    return configs[dashboardType]
  }, [dashboardType])
  
  return layoutConfig
}