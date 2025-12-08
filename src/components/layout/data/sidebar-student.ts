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
  academySlug: string
): SidebarData['navGroups'] {
  return [
    {
      title: 'General',
      items: [
        {
          title: 'Panel Principal',
          url: `/academy/${academySlug}/dashboard`,
          icon: LayoutDashboard,
        },
        {
          title: 'Notificaciones',
          url: `/academy/${academySlug}/notifications`,
          icon: Bell,
        },
        {
          title: 'Mis Cursos',
          url: `/academy/${academySlug}/my-courses`,
          icon: BookOpen,
        },
        {
          title: 'Explorar Cursos',
          url: '/academies',
          icon: GraduationCap,
        },
        {
          title: 'Mis Tareas',
          url: `/academy/${academySlug}/my-assignments`,
          icon: ClipboardList,
        },
      ],
    },
    {
      title: 'Progreso',
      items: [
        {
          title: 'Mis Insignias',
          url: `/academy/${academySlug}/badges`,
          icon: Award,
        },
        {
          title: 'Certificados',
          url: `/academy/${academySlug}/certificates`,
          icon: Award,
        },
      ],
    },
    {
      title: 'Otros',
      items: [
        {
          title: 'Canjear Código',
          url: `/academy/${academySlug}/redeem-code`,
          icon: Key,
        },
      ],
    },
  ]
}
