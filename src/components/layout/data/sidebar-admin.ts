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
        },
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
      ],
    },
  ]
}
