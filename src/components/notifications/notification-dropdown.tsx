import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { useNavigate } from '@tanstack/react-router'
import { es } from 'date-fns/locale'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, ExternalLink } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { getCategoryEmoji, getPriorityColor } from '@/lib/notification-utils'
import { useNotifications } from '@/hooks/use-notifications'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

interface NotificationDropdownProps {
  className?: string
}

export function NotificationDropdown({ className }: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const { currentAcademy } = useAuthStore()
  const {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    hasUnread,
  } = useNotifications()

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }

    if (notification.action_url) {
      if (notification.action_url.startsWith('/')) {
        navigate({ to: notification.action_url })
      } else {
        window.location.href = notification.action_url
      }
    }

    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`}>
      {/* Bell Icon with Badge */}
      <Button
        variant='ghost'
        size='sm'
        onClick={() => setIsOpen(!isOpen)}
        className='relative p-2'
      >
        <Bell
          size={20}
          className={hasUnread ? 'text-blue-600' : 'text-muted-foreground'}
        />
        {hasUnread && (
          <Badge
            variant='destructive'
            className='absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center p-0 text-xs'
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <div
              className='fixed inset-0 z-40'
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className='bg-popover border-border absolute top-full right-0 z-50 mt-2 w-96 rounded-lg border shadow-lg'
            >
              {/* Header */}
              <div className='flex items-center justify-between border-b p-4'>
                <div className='flex items-center gap-2'>
                  <h3 className='font-semibold'>Notificaciones</h3>
                  <div
                    className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
                  />
                </div>
                {hasUnread && (
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={markAllAsRead}
                    className='text-xs'
                  >
                    Marcar todas como leídas
                  </Button>
                )}
              </div>

              {/* Notifications List */}
              <ScrollArea className='max-h-96'>
                {notifications.length === 0 ? (
                  <div className='text-muted-foreground p-8 text-center'>
                    <Bell size={32} className='mx-auto mb-2 opacity-50' />
                    <p>No tienes notificaciones</p>
                  </div>
                ) : (
                  <div className='p-2'>
                    {notifications.slice(0, 10).map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`hover:bg-accent/60 mb-2 cursor-pointer rounded-lg p-3 transition-all ${!notification.read ? 'border-primary/60 bg-primary/10 border-l-4' : 'bg-card'} `}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className='flex items-start gap-3'>
                          {/* Priority Dot + Category Emoji */}
                          <div className='mt-1 flex flex-col items-center gap-1'>
                            <div
                              className={`h-2 w-2 rounded-full ${getPriorityColor(notification.priority)}`}
                            />
                            <span className='text-sm'>
                              {getCategoryEmoji(
                                notification.category,
                                (notification as any).type ||
                                  notification.notification_type
                              )}
                            </span>
                          </div>

                          {/* Content */}
                          <div className='min-w-0 flex-1'>
                            <div className='flex items-start justify-between gap-2'>
                              <h4
                                className={`line-clamp-1 text-sm font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}
                              >
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <div className='mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500' />
                              )}
                            </div>

                            {notification.body && (
                              <p className='text-muted-foreground mt-1 line-clamp-2 text-xs'>
                                {notification.body}
                              </p>
                            )}

                            <div className='mt-2 flex items-center justify-between'>
                              <span className='text-muted-foreground text-xs'>
                                {formatDistanceToNow(
                                  new Date(notification.created_at),
                                  {
                                    addSuffix: true,
                                    locale: es,
                                  }
                                )}
                              </span>

                              {notification.action_url && (
                                <ExternalLink
                                  size={12}
                                  className='text-muted-foreground'
                                />
                              )}
                            </div>

                            {/* Actor Info */}
                            {notification.actor && (
                              <div className='mt-1 flex items-center gap-1'>
                                <span className='text-muted-foreground text-xs'>
                                  por
                                </span>
                                <span className='text-muted-foreground text-xs font-medium'>
                                  {notification.actor.full_name}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className='border-border bg-muted/40 border-t p-3 text-center'>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => {
                      const notificationsUrl = currentAcademy
                        ? `/academy/${currentAcademy.slug}/notifications`
                        : '/notifications'
                      navigate({ to: notificationsUrl })
                      setIsOpen(false)
                    }}
                    className='text-xs'
                  >
                    Ver todas las notificaciones
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
