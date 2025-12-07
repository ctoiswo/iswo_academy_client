import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useNotifications } from '@/hooks/use-notifications'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

interface NotificationDropdownProps {
  className?: string
}

export function NotificationDropdown({ className }: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { 
    notifications, 
    unreadCount, 
    isConnected, 
    markAsRead, 
    markAllAsRead,
    hasUnread 
  } = useNotifications()

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }
    
    if (notification.action_url) {
      window.location.href = notification.action_url
    }
    
    setIsOpen(false)
  }

  const getCategoryEmoji = (category: string, type: string) => {
    switch (category) {
      case 'academic':
        if (type.includes('assignment')) return '📋'
        if (type.includes('lesson')) return '📚'
        if (type.includes('certificate')) return '🎓'
        if (type.includes('course')) return '📖'
        return '📚'
      case 'social':
        return '💬'
      case 'administrative':
        return '📢'
      case 'system':
        return '⚙️'
      default:
        return '🔔'
    }
  }

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 4: return 'bg-red-500'
      case 3: return 'bg-orange-500'  
      case 2: return 'bg-blue-500'
      case 1: return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* Bell Icon with Badge */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2"
      >
        <Bell size={20} className={hasUnread ? 'text-blue-600' : 'text-gray-600'} />
        {hasUnread && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
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
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">Notificaciones</h3>
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                </div>
                {hasUnread && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    Marcar todas como leídas
                  </Button>
                )}
              </div>

              {/* Notifications List */}
              <ScrollArea className="max-h-96">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Bell size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No tienes notificaciones</p>
                  </div>
                ) : (
                  <div className="p-2">
                    {notifications.slice(0, 10).map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`
                          p-3 rounded-lg mb-2 cursor-pointer transition-all hover:bg-gray-50
                          ${!notification.read ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-white'}
                        `}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start gap-3">
                          {/* Priority Dot + Category Emoji */}
                          <div className="flex flex-col items-center gap-1 mt-1">
                            <div 
                              className={`w-2 h-2 rounded-full ${getPriorityColor(notification.priority)}`}
                            />
                            <span className="text-sm">
                              {getCategoryEmoji(notification.category, notification.notification_type)}
                            </span>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className={`text-sm font-medium line-clamp-1 ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                              )}
                            </div>
                            
                            {notification.body && (
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                {notification.body}
                              </p>
                            )}
                            
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-500">
                                {formatDistanceToNow(new Date(notification.created_at), { 
                                  addSuffix: true, 
                                  locale: es 
                                })}
                              </span>
                              
                              {notification.action_url && (
                                <ExternalLink size={12} className="text-gray-400" />
                              )}
                            </div>

                            {/* Actor Info */}
                            {notification.actor && (
                              <div className="flex items-center gap-1 mt-1">
                                <span className="text-xs text-gray-500">por</span>
                                <span className="text-xs font-medium text-gray-700">
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
                <div className="p-3 border-t bg-gray-50 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      window.location.href = '/notifications'
                      setIsOpen(false)
                    }}
                    className="text-xs"
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