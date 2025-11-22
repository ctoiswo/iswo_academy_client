import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BarChart3,
  Award,
  Bell,
  Calendar,
  UserCheck,
  Trophy,
  FolderKanban,
  Layers,
  ShoppingCart,
  Route,
  MessageSquare,
  Megaphone,
  UserCog,
  Settings,
  Palette,
  Monitor,
  HelpCircle,
  Settings2,
  Info,
  PlayCircle,
  CheckSquare,
  FileQuestion,
} from 'lucide-react'
import { type SidebarData } from '../types'

/**
 * Sidebar para usuarios Admin/Owner de una academia
 * Incluye gestión completa de la academia
 */
export function getAdminSidebar(
  academySlug: string,
  courseSlug?: string,
  learningPathSlug?: string
): SidebarData['navGroups'] {
  // Si estamos en un learning path específico, mostrar acordeón de gestión de la ruta
  if (learningPathSlug) {
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
            title: 'Volver a Rutas',
            url: `/academy/${academySlug}/learning-paths`,
            icon: Route,
          },
        ],
      },
      {
        title: 'Gestión de la Ruta',
        items: [
          {
            title: 'Información',
            url: `/academy/${academySlug}/learning-paths/${learningPathSlug}/info`,
            icon: Info,
          },
          {
            title: 'Cursos',
            url: `/academy/${academySlug}/learning-paths/${learningPathSlug}/courses`,
            icon: GraduationCap,
          },
          {
            title: 'Desbloqueo',
            url: `/academy/${academySlug}/learning-paths/${learningPathSlug}/unlock-config`,
            icon: Layers,
          },
          {
            title: 'Precios',
            url: `/academy/${academySlug}/learning-paths/${learningPathSlug}/pricing`,
            icon: ShoppingCart,
          },
          {
            title: 'Estudiantes',
            url: `/academy/${academySlug}/learning-paths/${learningPathSlug}/students`,
            icon: Users,
          },
          {
            title: 'Estadísticas',
            url: `/academy/${academySlug}/learning-paths/${learningPathSlug}/analytics`,
            icon: BarChart3,
          },
          {
            title: 'Certificados',
            url: `/academy/${academySlug}/learning-paths/${learningPathSlug}/certificates`,
            icon: Award,
          },
          {
            title: 'Configuración',
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
        title: 'General',
        items: [
          {
            title: 'Panel Principal',
            url: `/academy/${academySlug}/dashboard`,
            icon: LayoutDashboard,
          },
          {
            title: 'Volver a Cursos',
            url: `/academy/${academySlug}/courses`,
            icon: GraduationCap,
          },
        ],
      },
      {
        title: 'Gestión del Curso',
        items: [
          {
            title: 'Información',
            url: `/academy/${academySlug}/courses/${courseSlug}/info`,
            icon: Info,
          },
          {
            title: 'Lecciones',
            url: `/academy/${academySlug}/courses/${courseSlug}/lessons`,
            icon: PlayCircle,
          },
          {
            title: 'Tareas',
            url: `/academy/${academySlug}/courses/${courseSlug}/assignments`,
            icon: CheckSquare,
          },
          {
            title: 'Exámenes',
            url: `/academy/${academySlug}/courses/${courseSlug}/exams`,
            icon: FileQuestion,
          },
          {
            title: 'Estudiantes',
            url: `/academy/${academySlug}/courses/${courseSlug}/students`,
            icon: Users,
          },
          {
            title: 'Certificados',
            url: `/academy/${academySlug}/courses/${courseSlug}/certificates`,
            icon: Award,
          },
          {
            title: 'Configuración',
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
      title: 'Academia',
      items: [
        {
          title: 'Cursos',
          url: `/academy/${academySlug}/courses`,
          icon: GraduationCap,
        },
        {
          title: 'Rutas de Aprendizaje',
          url: `/academy/${academySlug}/learning-paths`,
          icon: Route,
        },
        {
          title: 'Configuraciones',
          url: `/academy/${academySlug}/settings`,
          icon: Settings2,
        }
      ],
    },
    {
      title: 'Usuarios',
      items: [
        {
          title: 'Todos los Usuarios',
          url: `/academy/${academySlug}/users`,
          icon: Users,
        },
        {
          title: 'Profesores',
          url: `/academy/${academySlug}/teachers`,
          icon: UserCheck,
        },
        {
          title: 'Estudiantes',
          url: `/academy/${academySlug}/students`,
          icon: GraduationCap,
        },
        {
          title: 'Inscripciones',
          url: `/academy/${academySlug}/enrollments`,
          icon: UserCog,
        },
      ],
    },
    {
      title: 'Gamificación',
      items: [
        {
          title: 'Insignias',
          url: `/academy/${academySlug}/badges`,
          icon: Award,
        },
        {
          title: 'Logros',
          url: `/academy/${academySlug}/achievements`,
          icon: Trophy,
        },
        {
          title: 'Tabla de Clasificación',
          url: `/academy/${academySlug}/leaderboard`,
          icon: BarChart3,
        },
      ],
    },
    {
      title: 'Comunicación',
      items: [
        {
          title: 'Chats',
          url: `/academy/${academySlug}/chats`,
          icon: MessageSquare,
        },
        {
          title: 'Anuncios',
          url: `/academy/${academySlug}/announcements`,
          icon: Megaphone,
        },
        {
          title: 'Eventos',
          url: `/academy/${academySlug}/events`,
          icon: Calendar,
        },
      ],
    },
    {
      title: 'Gestión',
      items: [
        {
          title: 'Pagos y Suscripciones',
          url: `/academy/${academySlug}/payments`,
          icon: ShoppingCart,
        },
        {
          title: 'Recursos',
          url: `/academy/${academySlug}/resources`,
          icon: FolderKanban,
        },
        {
          title: 'Categorías',
          url: `/academy/${academySlug}/categories`,
          icon: Layers,
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
