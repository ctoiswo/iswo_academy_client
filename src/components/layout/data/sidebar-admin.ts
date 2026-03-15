import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BarChart3,
  Award,
  UserCheck,
  Route,
  Settings,
  Settings2,
  Info,
  PlayCircle,
  CheckSquare,
  FileQuestion,
  Layers,
  ShoppingCart,
  Bell,
} from 'lucide-react'
import { type SidebarData } from '../types'

/**
 * Sidebar para usuarios Admin/Owner de una academia
 * Incluye gestión completa de la academia
 */
export function getAdminSidebar(
  academySlug: string,
  t: (key: string) => string,
  courseSlug?: string,
  learningPathSlug?: string
): SidebarData['navGroups'] {
  // Si estamos en un learning path específico, mostrar acordeón de gestión de la ruta
  if (learningPathSlug) {
    return [
      {
        title: t('sidebar.groups.general'),
        items: [
          {
            title: t('sidebar.items.dashboard'),
            url: `/academy/${academySlug}/dashboard/admin`,
            icon: LayoutDashboard,
          },
          {
            title: t('sidebar.items.backToPaths'),
            url: `/academy/${academySlug}/learning-paths`,
            icon: Route,
          },
        ],
      },
      {
        title: t('sidebar.groups.pathManagement'),
        items: [
          {
            title: t('sidebar.items.information'),
            url: `/academy/${academySlug}/learning-paths/${learningPathSlug}/info`,
            icon: Info,
          },
          {
            title: t('sidebar.items.courses'),
            url: `/academy/${academySlug}/learning-paths/${learningPathSlug}/courses`,
            icon: GraduationCap,
          },
          {
            title: t('sidebar.items.unlock'),
            url: `/academy/${academySlug}/learning-paths/${learningPathSlug}/unlock-config`,
            icon: Layers,
          },
          {
            title: t('sidebar.items.pricing'),
            url: `/academy/${academySlug}/learning-paths/${learningPathSlug}/pricing`,
            icon: ShoppingCart,
          },
          {
            title: t('sidebar.items.students'),
            url: `/academy/${academySlug}/learning-paths/${learningPathSlug}/students`,
            icon: Users,
          },
          {
            title: t('sidebar.items.statistics'),
            url: `/academy/${academySlug}/learning-paths/${learningPathSlug}/analytics`,
            icon: BarChart3,
          },
          {
            title: t('sidebar.items.certificates'),
            url: `/academy/${academySlug}/learning-paths/${learningPathSlug}/certificates`,
            icon: Award,
          },
          {
            title: t('sidebar.items.settings'),
            url: `/academy/${academySlug}/learning-paths/${learningPathSlug}/settings`,
            icon: Settings,
          },
        ],
      },
    ]
  }

  // Si estamos en un curso específico, mostrar acordeón de gestión del curso
  if (courseSlug) {
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
            title: t('sidebar.items.backToCourses'),
            url: `/academy/${academySlug}/admin/courses`,
            icon: GraduationCap,
          },
        ],
      },
      {
        title: t('sidebar.groups.courseManagement'),
        items: [
          {
            title: t('sidebar.items.information'),
            url: `/academy/${academySlug}/courses/${courseSlug}/info`,
            icon: Info,
          },
          {
            title: t('sidebar.items.lessons'),
            url: `/academy/${academySlug}/courses/${courseSlug}/lessons`,
            icon: PlayCircle,
          },
          {
            title: t('sidebar.items.assignments'),
            url: `/academy/${academySlug}/courses/${courseSlug}/assignments`,
            icon: CheckSquare,
          },
          {
            title: t('sidebar.items.exams'),
            url: `/academy/${academySlug}/courses/${courseSlug}/exams`,
            icon: FileQuestion,
          },
          {
            title: t('sidebar.items.students'),
            url: `/academy/${academySlug}/courses/${courseSlug}/students`,
            icon: Users,
          },
          {
            title: t('sidebar.items.certificates'),
            url: `/academy/${academySlug}/courses/${courseSlug}/certificates`,
            icon: Award,
          },
          {
            title: t('sidebar.items.settings'),
            url: `/academy/${academySlug}/courses/${courseSlug}/settings`,
            icon: Settings,
          },
        ],
      },
    ]
  }

  // Sidebar normal para vista de cursos
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
      ],
    },
    {
      title: t('sidebar.groups.academy'),
      items: [
        {
          title: t('sidebar.items.courses'),
          url: `/academy/${academySlug}/admin/courses`,
          icon: GraduationCap,
        },
        {
          title: t('sidebar.items.learningPaths'),
          url: `/academy/${academySlug}/learning-paths`,
          icon: Route,
        },
        {
          title: t('sidebar.items.academySettings'),
          url: `/academy/${academySlug}/settings`,
          icon: Settings2,
        },
      ],
    },
    {
      title: t('sidebar.groups.users'),
      items: [
        {
          title: t('sidebar.items.allUsers'),
          url: `/academy/${academySlug}/users`,
          icon: Users,
        },
        {
          title: t('sidebar.items.teachers'),
          url: `/academy/${academySlug}/teachers`,
          icon: UserCheck,
        },
        {
          title: t('sidebar.items.students'),
          url: `/academy/${academySlug}/students`,
          icon: GraduationCap,
        },
      ],
    },
    {
      title: t('sidebar.groups.gamification'),
      items: [
        {
          title: t('sidebar.items.badges'),
          url: `/academy/${academySlug}/badges`,
          icon: Award,
        },
        {
          title: t('sidebar.items.myBadges'),
          url: `/academy/${academySlug}/my-badges`,
          icon: Award,
        },
      ],
    },
  ]
}
