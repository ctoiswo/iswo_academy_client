import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  ClipboardList,
  Award,
  Key,
  Bell,
} from 'lucide-react'
import { type SidebarData } from '../types'

/**
 * Sidebar para usuarios Student
 * Enfocado en aprendizaje y progreso personal
 */
export function getStudentSidebar(
  academySlug: string,
  t: (key: string) => string
): SidebarData['navGroups'] {
  return [
    {
      title: t('sidebar.groups.general'),
      items: [
        {
          title: t('sidebar.items.dashboard'),
          url: `/academy/${academySlug}/dashboard`,
          icon: LayoutDashboard,
        },
        {
          title: t('sidebar.items.notifications'),
          url: `/academy/${academySlug}/notifications`,
          icon: Bell,
        },
        {
          title: t('sidebar.items.myCourses'),
          url: `/academy/${academySlug}/my-courses`,
          icon: BookOpen,
        },
        {
          title: t('sidebar.items.exploreCourses'),
          url: '/academies',
          icon: GraduationCap,
        },
        {
          title: t('sidebar.items.myAssignments'),
          url: `/academy/${academySlug}/my-assignments`,
          icon: ClipboardList,
        },
      ],
    },
    {
      title: t('sidebar.groups.progress'),
      items: [
        {
          title: t('sidebar.items.myBadges'),
          url: `/academy/${academySlug}/my-badges`,
          icon: Award,
        },
        {
          title: t('sidebar.items.certificates'),
          url: `/academy/${academySlug}/certificates`,
          icon: Award,
        },
      ],
    },
    {
      title: t('sidebar.groups.others'),
      items: [
        {
          title: t('sidebar.items.redeemCode'),
          url: `/academy/${academySlug}/redeem-code`,
          icon: Key,
        },
      ],
    },
  ]
}
