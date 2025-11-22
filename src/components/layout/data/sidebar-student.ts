import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  ClipboardList,
  Calendar,
  Trophy,
  Award,
  Key,
  Settings,
  UserCog,
  Bell,
  Palette,
  Monitor,
  HelpCircle,
} from 'lucide-react'
import { type SidebarData } from '../types'

/**
 * Sidebar para usuarios Student
 * Enfocado en aprendizaje y progreso personal
 */
export function getStudentSidebar(academySlug: string): SidebarData['navGroups'] {
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
          title: 'Mis Cursos',
          url: `/academy/${academySlug}/my-courses`,
          icon: BookOpen,
        },
        {
          title: 'Explorar Cursos',
          url: `/academy/${academySlug}/courses`,
          icon: GraduationCap,
        },
        {
          title: 'Mis Tareas',
          url: `/academy/${academySlug}/my-assignments`,
          icon: ClipboardList,
        },
        {
          title: 'Calendario',
          url: `/academy/${academySlug}/calendar`,
          icon: Calendar,
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
          title: 'Mis Logros',
          url: `/academy/${academySlug}/achievements`,
          icon: Trophy,
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
