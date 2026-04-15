import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { useNavigate } from '@tanstack/react-router'
import { es } from 'date-fns/locale'
import { Bell, BellOff, CheckCheck } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import {
  getCategoryIcon,
  getCategoryColor,
  getPriorityColor,
} from '@/lib/notification-utils'
import {
  useNotificationsList,
  useMarkAllAsRead,
  useOptimisticMarkAsRead,
} from '@/hooks/use-notifications-query'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

export default function NotificationsPage() {
  const { user, currentAcademy } = useAuthStore()
  const navigate = useNavigate()
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  // Query para todas las notificaciones (sin filtro)
  const { data: allData, isLoading: isLoadingAll } = useNotificationsList({
    filter: 'all',
    per_page: 50,
  })

  // Query para notificaciones filtradas según el tab actual
  const { data, isLoading } = useNotificationsList({
    filter,
    per_page: 50,
  })

  const markAllAsReadMutation = useMarkAllAsRead()
  const optimisticMarkAsRead = useOptimisticMarkAsRead()

  const notifications = data?.data || []
  const totalCount = allData?.meta?.total_count || 0
  const unreadCount = (allData?.data || []).filter((n) => !n.read).length
  const hasUnread = unreadCount > 0

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      optimisticMarkAsRead(notification.id)
    }

    // Si tiene action_url, navegar
    if (notification.action_url) {
      if (notification.action_url.startsWith('/')) {
        navigate({ to: notification.action_url })
      } else {
        window.location.href = notification.action_url
      }
    }
  }

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate()
  }

  const dashboardType = user?.is_super_admin
    ? 'super-admin'
    : currentAcademy?.user_role === 'admin'
      ? 'academy-admin'
      : currentAcademy?.user_role === 'teacher'
        ? 'teacher'
        : 'student'

  if (isLoading || isLoadingAll) {
    return (
      <DashboardLayout
        user={user}
        academy={currentAcademy}
        variant='full'
        dashboardType={dashboardType}
      >
        <div className='flex items-center justify-center py-12'>
          <p className='text-muted-foreground'>Cargando notificaciones...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      user={user}
      academy={currentAcademy}
      variant='full'
      dashboardType={dashboardType}
    >
      <div className='flex-1 space-y-6 px-4'>
        {/* Header */}
        <div className='mb-8 flex flex-col gap-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold tracking-tight'>
                Notificaciones
              </h1>
              <p className='text-muted-foreground mt-1'>
                Mantente al día con todas tus notificaciones
              </p>
            </div>

            {hasUnread && (
              <Button
                variant='outline'
                size='sm'
                onClick={handleMarkAllAsRead}
                disabled={markAllAsReadMutation.isPending}
                className='gap-2'
              >
                <CheckCheck className='h-4 w-4' />
                Marcar todas como leídas
              </Button>
            )}
          </div>

          {/* Stats */}
          <div className='flex gap-4'>
            <Card className='flex-1 p-4'>
              <div className='flex items-center gap-3'>
                <div className='rounded-lg bg-blue-100 p-2 dark:bg-blue-950'>
                  <Bell className='h-5 w-5 text-blue-600' />
                </div>
                <div>
                  <p className='text-2xl font-bold'>{totalCount}</p>
                  <p className='text-muted-foreground text-sm'>Total</p>
                </div>
              </div>
            </Card>

            <Card className='flex-1 p-4'>
              <div className='flex items-center gap-3'>
                <div className='rounded-lg bg-orange-100 p-2 dark:bg-orange-950'>
                  <BellOff className='h-5 w-5 text-orange-600' />
                </div>
                <div>
                  <p className='text-2xl font-bold'>{unreadCount}</p>
                  <p className='text-muted-foreground text-sm'>Sin leer</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Filters */}
        {/* Filters */}
        <div className='mb-6 flex items-center justify-between'>
          <Tabs
            value={filter}
            onValueChange={(v) => setFilter(v as 'all' | 'unread')}
          >
            <TabsList>
              <TabsTrigger value='all'>Todas ({totalCount})</TabsTrigger>
              <TabsTrigger value='unread'>Sin leer ({unreadCount})</TabsTrigger>
            </TabsList>
          </Tabs>

          {hasUnread && filter === 'unread' && (
            <Button
              variant='ghost'
              size='sm'
              onClick={handleMarkAllAsRead}
              disabled={markAllAsReadMutation.isPending}
              className='gap-2'
            >
              <CheckCheck className='h-4 w-4' />
              Marcar todas como leídas
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <div className='space-y-3'>
          {notifications.length === 0 ? (
            <Card className='p-12 text-center'>
              <div className='flex flex-col items-center gap-2'>
                <div className='rounded-full bg-gray-100 p-4 dark:bg-gray-800'>
                  <Bell className='text-muted-foreground h-8 w-8' />
                </div>
                <h3 className='text-lg font-semibold'>No hay notificaciones</h3>
                <p className='text-muted-foreground'>
                  {filter === 'unread'
                    ? 'Todas tus notificaciones están marcadas como leídas'
                    : 'No tienes notificaciones en este momento'}
                </p>
              </div>
            </Card>
          ) : (
            notifications.map((notification) => {
              const Icon = getCategoryIcon(
                notification.category,
                (notification as any).type || notification.notification_type
              )
              const categoryColor = getCategoryColor(notification.category)

              return (
                <Card
                  key={notification.id}
                  className={`cursor-pointer p-4 transition-all hover:shadow-md ${
                    !notification.read
                      ? 'border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
                      : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className='flex gap-4'>
                    {/* Icon */}
                    <div
                      className={`flex-shrink-0 rounded-lg p-3 ${categoryColor}`}
                    >
                      <Icon className='h-5 w-5' />
                    </div>

                    {/* Content */}
                    <div className='min-w-0 flex-1'>
                      <div className='mb-1 flex items-start justify-between gap-2'>
                        <h3 className='text-sm font-semibold'>
                          {notification.title}
                        </h3>
                        <div className='flex items-center gap-2'>
                          {!notification.read && (
                            <Badge variant='default' className='text-xs'>
                              Nuevo
                            </Badge>
                          )}
                          <div
                            className={`h-2 w-2 rounded-full ${getPriorityColor(notification.priority)}`}
                            title={`Prioridad ${notification.priority}`}
                          />
                        </div>
                      </div>

                      <p className='text-muted-foreground mb-2 text-sm'>
                        {notification.body}
                      </p>

                      <div className='text-muted-foreground flex items-center gap-4 text-xs'>
                        <span className='capitalize'>
                          {notification.category}
                        </span>
                        <span>•</span>
                        <span>
                          {formatDistanceToNow(
                            new Date(notification.created_at),
                            {
                              addSuffix: true,
                              locale: es,
                            }
                          )}
                        </span>
                        {notification.actor && (
                          <>
                            <span>•</span>
                            <span>Por {notification.actor.full_name}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
