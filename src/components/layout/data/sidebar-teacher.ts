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
  Palette,
  Monitor,
  HelpCircle,
} from 'lucide-react'
import { type SidebarData } from '../types'

/**
 * Sidebar para usuarios Teacher
 * Enfocado en enseñanza y gestión de cursos propios
 */
export function getTeacherSidebar(academySlug: string): SidebarData['navGroups'] {
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
          title: 'Analíticas',
          url: `/academy/${academySlug}/analytics`,
          icon: BarChart3,
        },
      ],
    },
    {
      title: 'Enseñanza',
      items: [
        {
          title: 'Mis Cursos',
          url: `/academy/${academySlug}/teaching/courses`,
          icon: GraduationCap,
        },
        {
          title: 'Mis Lecciones',
          url: `/academy/${academySlug}/teaching/lessons`,
          icon: BookMarked,
        },
        {
          title: 'Tareas',
          url: `/academy/${academySlug}/teaching/assignments`,
          icon: ClipboardList,
        },
        {
          title: 'Exámenes',
          url: `/academy/${academySlug}/teaching/exams`,
          icon: FileQuestion,
        },
        {
          title: 'Mis Estudiantes',
          url: `/academy/${academySlug}/teaching/students`,
          icon: Users,
        },
        {
          title: 'Calificaciones',
          url: `/academy/${academySlug}/teaching/grades`,
          icon: Award,
        },
        {
          title: 'Recursos',
          url: `/academy/${academySlug}/teaching/resources`,
          icon: FolderKanban,
        },
      ],
    },
    {
      title: 'Configuración',
      items: [
        {
          title: 'Ajustes',
          icon: Settings,
          items: [
            {
              title: 'Perfil',
              url: `/settings`,
              icon: UserCog,
            },
            {
              title: 'Notificaciones',
              url: `/settings/notifications`,
              icon: Bell,
            },
            {
              title: 'Apariencia',
              url: `/settings/appearance`,
              icon: Palette,
            },
            {
              title: 'Pantalla',
              url: `/settings/display`,
              icon: Monitor,
            },
          ],
        },
        {
          title: 'Centro de Ayuda',
          url: '/help-center',
          icon: HelpCircle,
        },
      ],
    },
  ]
}
