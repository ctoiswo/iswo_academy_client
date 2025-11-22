import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  AcademyStatsOverview, 
  CourseManagementPanel, 
  UserManagementPanel
} from './components'
import type { DashboardProps } from '@/components/dashboard-router'

export function AcademyAdminDashboard({ user, academy }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')

  if (!user || !academy) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Academia Requerida</h2>
          <p className="mt-2 text-muted-foreground">
            Por favor selecciona una academia para acceder al panel de administración.
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
    >
      <div className="w-full space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Panel de Administración</h1>
          <p className="text-muted-foreground">
            Gestiona tu academia: estudiantes, profesores, cursos y contenido
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="overview">Resumen General</TabsTrigger>
            <TabsTrigger value="courses">Cursos</TabsTrigger>
            <TabsTrigger value="users">Usuarios</TabsTrigger>
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