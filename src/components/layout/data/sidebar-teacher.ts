import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BarChart3,
  Award,
  Bell,
  FolderKanban,
  BookMarked,
  ClipboardList,
  FileQuestion,
  Settings,
  UserCog,
  HelpCircle,
} from 'lucide-react'
import { type SidebarData } from '../types'

/**
 * Sidebar para usuarios Teacher
 * Enfocado en enseñanza y gestión de cursos propios
 */
export function getTeacherSidebar(
  academySlug: string,
  t: (key: string) => string
): SidebarData['navGroups'] {
  return [
    {
      title: t('sidebar.groups.general'),
      items: [
        {
          title: t('sidebar.items.dashboard'),
          url: `/academy/${academySlug}/dashboard/teacher`,
          icon: LayoutDashboard,
        },
        {
          title: t('sidebar.items.notifications'),
          url: `/academy/${academySlug}/notifications`,
          icon: Bell,
        },
        {
          title: t('sidebar.items.analytics'),
          url: `/academy/${academySlug}/analytics`,
          icon: BarChart3,
        },
      ],
    },
    {
      title: t('sidebar.groups.teaching'),
      items: [
        {
          title: t('sidebar.items.myCourses'),
          url: `/academy/${academySlug}/teaching/courses`,
          icon: GraduationCap,
        },
        {
          title: t('sidebar.items.myLessons'),
          url: `/academy/${academySlug}/teaching/lessons`,
          icon: BookMarked,
        },
        {
          title: t('sidebar.items.assignments'),
          url: `/academy/${academySlug}/teaching/assignments`,
          icon: ClipboardList,
        },
        {
          title: t('sidebar.items.exams'),
          url: `/academy/${academySlug}/teaching/exams`,
          icon: FileQuestion,
        },
        {
          title: t('sidebar.items.myStudents'),
          url: `/academy/${academySlug}/teaching/students`,
          icon: Users,
        },
        {
          title: t('sidebar.items.grades'),
          url: `/academy/${academySlug}/teaching/grades`,
          icon: Award,
        },
        {
          title: t('sidebar.items.resources'),
          url: `/academy/${academySlug}/teaching/resources`,
          icon: FolderKanban,
        },
      ],
    },
    {
      title: t('sidebar.groups.configuration'),
      items: [
        {
          title: t('sidebar.items.settings'),
          icon: Settings,
          items: [
            {
              title: t('sidebar.items.profile'),
              url: `/settings`,
              icon: UserCog,
            },
          ],
        },
        {
          title: t('sidebar.items.helpCenter'),
          url: '/help-center',
          icon: HelpCircle,
        },
      ],
    },
  ]
}
