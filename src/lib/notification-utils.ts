import {
  Bell,
  CheckCheck,
  BookOpen,
  Award,
  MessageSquare,
  Megaphone,
  Settings as SettingsIcon,
  type LucideIcon,
} from 'lucide-react'

export type NotificationCategory =
  | 'academic'
  | 'social'
  | 'administrative'
  | 'system'
export type NotificationPriority = 1 | 2 | 3 | 4

export function getCategoryIcon(category: string, type?: string): LucideIcon {
  switch (category) {
    case 'academic':
      if (type?.includes('assignment')) return CheckCheck
      if (type?.includes('lesson')) return BookOpen
      if (type?.includes('certificate')) return Award
      return BookOpen
    case 'social':
      return MessageSquare
    case 'administrative':
      return Megaphone
    case 'system':
      return SettingsIcon
    default:
      return Bell
  }
}

export function getCategoryColor(category: string): string {
  switch (category) {
    case 'academic':
      return 'text-blue-600 bg-blue-50 dark:bg-blue-950'
    case 'social':
      return 'text-purple-600 bg-purple-50 dark:bg-purple-950'
    case 'administrative':
      return 'text-orange-600 bg-orange-50 dark:bg-orange-950'
    case 'system':
      return 'text-gray-600 bg-gray-50 dark:bg-gray-950'
    default:
      return 'text-gray-600 bg-gray-50 dark:bg-gray-950'
  }
}

export function getPriorityColor(priority: number): string {
  switch (priority) {
    case 4:
      return 'bg-red-500'
    case 3:
      return 'bg-orange-500'
    case 2:
      return 'bg-blue-500'
    case 1:
      return 'bg-gray-400'
    default:
      return 'bg-gray-400'
  }
}

export function getCategoryEmoji(category: string, type?: string): string {
  switch (category) {
    case 'academic':
      if (type?.includes('assignment')) return '📋'
      if (type?.includes('lesson')) return '📚'
      if (type?.includes('certificate')) return '🎓'
      if (type?.includes('course')) return '📖'
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

export function getPriorityDuration(priority: number): number {
  switch (priority) {
    case 4:
      return 8000 // Crítica - 8s
    case 3:
      return 5000 // Alta - 5s
    case 2:
      return 4000 // Normal - 4s
    case 1:
      return 3000 // Baja - 3s
    default:
      return 4000
  }
}
