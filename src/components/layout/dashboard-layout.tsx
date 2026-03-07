import { useMemo } from 'react'
import type { AuthUser, AcademyMembership } from '@/stores/auth-store'
import { getCookie } from '@/lib/cookies'
import { cn } from '@/lib/utils'
import { LayoutProvider } from '@/context/layout-provider'
import { SearchProvider } from '@/context/search-provider'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { ConfigDrawer } from '@/components/config-drawer'
import type { DashboardType } from '@/components/dashboard-router'
import { PointsDisplay } from '@/components/gamification/points-display'
import { LanguageToggle } from '@/components/language-toggle'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { NotificationDropdown } from '@/components/notifications'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { SkipToMain } from '@/components/skip-to-main'

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
  title?: string
  subtitle?: string
}

interface DashboardSidebarProps {
  user: AuthUser | null
  academy?: AcademyMembership | null
  dashboardType?: DashboardType
}

interface TopNavLink {
  title: string
  href: string
  isActive: boolean
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
  className,
  title,
  subtitle,
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
          title={title}
          subtitle={subtitle}
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
          title={title}
          subtitle={subtitle}
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
          title={title}
          subtitle={subtitle}
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
  topNavLinks = [],
  showSearch,
  showConfigDrawer,
  className,
  title,
  subtitle,
}: Omit<DashboardLayoutProps, 'variant' | 'sidebar' | 'dashboardType'>) {
  if (!user) return null
  return (
    <SearchProvider>
      <LayoutProvider>
        <div className={cn('bg-background min-h-screen', className)}>
          <SkipToMain />

          {/* Header */}
          <Header className='border-b'>
            <div className='flex w-full items-center justify-between'>
              <div className='flex items-center space-x-4'>
                <div className='flex flex-col'>
                  <h1 className='text-xl font-semibold leading-tight'>
                    {title ?? (academy ? academy.name : 'ISWO Academy')}
                  </h1>
                  {subtitle && (
                    <p className='text-muted-foreground text-xs'>{subtitle}</p>
                  )}
                </div>
                {topNavLinks.length > 0 && <TopNav links={topNavLinks} />}
              </div>

              <div className='flex items-center space-x-4'>
                {showSearch && <Search />}
                <PointsDisplay compact />
                <NotificationDropdown />
                <LanguageToggle />
                {showConfigDrawer && <ConfigDrawer />}
                <ProfileDropdown />
              </div>
            </div>
          </Header>

          {/* Main Content */}
          <Main className='container mx-auto px-4 py-6'>{children}</Main>
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
  topNavLinks = [],
  showSearch,
  className,
  title,
  subtitle,
}: Omit<DashboardLayoutProps, 'variant' | 'sidebar' | 'dashboardType'>) {
  if (!user) return null
  return (
    <SearchProvider>
      <LayoutProvider>
        <div className={cn('bg-background min-h-screen min-w-full', className)}>
          <SkipToMain />

          {/* Compact Header */}
          <Header className='bg-card/50 supports-[backdrop-filter]:bg-card/50 border-b backdrop-blur'>
            <div className='flex w-full items-center justify-between'>
              <div className='flex flex-col'>
                <h1 className='text-lg font-medium leading-tight'>
                  {title ?? (academy ? academy.name : 'My Learning')}
                </h1>
                {subtitle && (
                  <p className='text-muted-foreground text-xs'>{subtitle}</p>
                )}
              </div>

              <div className='flex items-center space-x-2'>
                {showSearch && <Search />}
                <PointsDisplay compact />
                <NotificationDropdown />
                <LanguageToggle />
                <ProfileDropdown />
              </div>
            </div>
          </Header>

          {/* Navigation Tabs */}
          {topNavLinks.length > 0 && (
            <div className='bg-muted/30 border-b'>
              <div className='container mx-auto px-4'>
                <TopNav links={topNavLinks} />
              </div>
            </div>
          )}

          {/* Main Content */}
          <Main className='container mx-auto px-4 py-4'>{children}</Main>
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
  topNavLinks = [],
  showSearch,
  showConfigDrawer,
  defaultOpen,
  className,
  title,
  subtitle,
}: Omit<DashboardLayoutProps, 'variant'> & { defaultOpen: boolean }) {
  if (!user) return null
  return (
    <SearchProvider>
      <LayoutProvider>
        <SidebarProvider defaultOpen={defaultOpen}>
          <div className={cn('bg-background min-h-screen', className)}>
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
                <div className='flex w-full items-center justify-between'>
                  <div className='flex items-center space-x-4'>
                    {title && (
                      <div className='flex flex-col'>
                        <h1 className='text-xl font-semibold leading-tight'>{title}</h1>
                        {subtitle && (
                          <p className='text-muted-foreground text-xs'>{subtitle}</p>
                        )}
                      </div>
                    )}
                    {topNavLinks.length > 0 && <TopNav links={topNavLinks} />}
                  </div>

                  <div className='flex items-center space-x-4'>
                    {showSearch && <Search />}
                    <PointsDisplay compact />
                    <NotificationDropdown />
                    <LanguageToggle />
                    {showConfigDrawer && <ConfigDrawer />}
                    <ProfileDropdown />
                  </div>
                </div>
              </Header>

              {/* Main Content */}
              <Main className='container mx-auto px-4 py-4'>{children}</Main>
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
    const configs: Record<
      DashboardType,
      {
        variant: DashboardLayoutVariant
        showSearch: boolean
        showConfigDrawer: boolean
      }
    > = {
      'super-admin': {
        variant: 'full',
        showSearch: true,
        showConfigDrawer: true,
      },
      'academy-admin': {
        variant: 'sidebar',
        showSearch: true,
        showConfigDrawer: true,
      },
      teacher: {
        variant: 'sidebar',
        showSearch: true,
        showConfigDrawer: false,
      },
      student: {
        variant: 'compact',
        showSearch: true,
        showConfigDrawer: false,
      },
    }

    return configs[dashboardType]
  }, [dashboardType])

  return layoutConfig
}
