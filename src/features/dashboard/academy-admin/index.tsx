
import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { RoleNavigation } from '@/components/layout/role-navigation'
import { Sidebar, SidebarContent, SidebarHeader } from '@/components/ui/sidebar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  AcademyStatsOverview, 
  CourseManagementPanel, 
  UserManagementPanel
} from './components'
import type { DashboardProps } from '@/components/dashboard-router'

// Import hook at the top level to avoid issues
import { useRoleNavigation } from '@/components/layout/role-navigation'

function AcademyAdminSidebar({ user, academy, dashboardType }: any) {
  const { currentPath } = useRoleNavigation(academy)
  
  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="text-lg font-semibold px-4 py-2">
          {academy?.name || 'Academy Admin'}
        </h2>
      </SidebarHeader>
      <SidebarContent>
        <RoleNavigation
          user={user}
          academy={academy}
          dashboardType={dashboardType || 'academy-admin'}
          currentPath={currentPath}
          className="px-4"
        />
      </SidebarContent>
    </Sidebar>
  )
}

export function AcademyAdminDashboard({ user, academy }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')

  if (!user || !academy) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Academy Required</h2>
          <p className="mt-2 text-muted-foreground">
            Please select an academy to access the admin dashboard.
          </p>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout
      user={user}
      academy={academy}
      variant="sidebar"
      dashboardType="academy-admin"
      sidebar={AcademyAdminSidebar}
    >
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Academy Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your academy's students, teachers, and courses
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <AcademyStatsOverview academy={academy} />
          </TabsContent>
          
          <TabsContent value="courses" className="space-y-6">
            <CourseManagementPanel academy={academy} />
          </TabsContent>
          
          <TabsContent value="users" className="space-y-6">
            <UserManagementPanel academy={academy} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}