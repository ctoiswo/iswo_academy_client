/**
 * Navigation and UI related types
 */

import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  id: string
  label: string
  icon?: LucideIcon
  href?: string
  children?: NavItem[]
  badge?: string | number
  isActive?: boolean
  onClick?: () => void
}

export interface SidebarSection {
  id: string
  title?: string
  items: NavItem[]
}

export type TabType = 'lessons' | 'assignments' | 'exams' | 'content' | 'info' | 'students'

export interface TabItem {
  id: string
  label: string
  value: TabType
  icon?: LucideIcon
  count?: number
}
