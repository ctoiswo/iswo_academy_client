import {
  LayoutDashboard,
  BookOpen,
  Users,
  GraduationCap,
  Settings,
  BarChart3,
  Calendar,
  MessageSquare,
  Award,
  FileText,
  UserCog,
  Bell,
  Palette,
  Monitor,
  Route,
  BookMarked,
  ClipboardList,
  FileQuestion,
  Target,
  Building2,
  UserCheck,
  Trophy,
  FolderKanban,
  Layers,
  ShoppingCart,
  Megaphone,
} from 'lucide-react'
import { type SidebarData } from '../types'
import { type AcademyMembership } from '@/stores/auth-store'

export function getAcademySidebarData(
  academyId: string,
  currentAcademy: AcademyMembership | null
): SidebarData {
  const isAdmin = currentAcademy?.user_role === 'admin'
  const isTeacher = currentAcademy?.user_role === 'teacher' || isAdmin
  const isStudent = currentAcademy?.user_role === 'student'

  return {
    user: {
      name: 'Academy User',
      email: 'user@academy.com',
      avatar: '/avatars/shadcn.jpg',
    },
    teams: [],
    navGroups: [
      {
        title: 'General',
        items: [
          {
            title: 'Panel Principal',
            url: `/academy/${academyId}/dashboard`,
            icon: LayoutDashboard,
          },
          {
            title: 'Analíticas',
            url: `/academy/${academyId}/analytics`,
            icon: BarChart3,
          },
        ],
      },
      ...(isAdmin ? [
        {
          title: 'Academia',
          items: [
            {
              title: 'Información',
              url: `/academy/${academyId}/info`,
              icon: Building2,
            },
            {
              title: 'Rutas de Aprendizaje',
              url: `/academy/${academyId}/learning-paths`,
              icon: Route,
            },
            {
              title: 'Cursos',
              url: `/academy/${academyId}/courses`,
              icon: GraduationCap,
            },
            {
              title: 'Lecciones',
              url: `/academy/${academyId}/lessons`,
              icon: BookMarked,
            },
            {
              title: 'Tareas',
              url: `/academy/${academyId}/assignments`,
              icon: ClipboardList,
            },
            {
              title: 'Exámenes',
              url: `/academy/${academyId}/exams`,
              icon: FileQuestion,
            },
            {
              title: 'Quizzes',
              url: `/academy/${academyId}/quizzes`,
              icon: Target,
            },
          ],
        },
        {
          title: 'Usuarios',
          items: [
            {
              title: 'Todos los Usuarios',
              url: `/academy/${academyId}/users`,
              icon: Users,
            },
            {
              title: 'Profesores',
              url: `/academy/${academyId}/teachers`,
              icon: UserCheck,
            },
            {
              title: 'Estudiantes',
              url: `/academy/${academyId}/students`,
              icon: GraduationCap,
            },
            {
              title: 'Inscripciones',
              url: `/academy/${academyId}/enrollments`,
              icon: UserCog,
            },
          ],
        },
        {
          title: 'Gamificación',
          items: [
            {
              title: 'Insignias',
              url: `/academy/${academyId}/badges`,
              icon: Award,
            },
            {
              title: 'Logros',
              url: `/academy/${academyId}/achievements`,
              icon: Trophy,
            },
            {
              title: 'Tabla de Clasificación',
              url: `/academy/${academyId}/leaderboard`,
              icon: BarChart3,
            },
          ],
        },
        {
          title: 'Comunicación',
          items: [
            {
              title: 'Chats',
              url: `/academy/${academyId}/chats`,
              icon: MessageSquare,
            },
            {
              title: 'Anuncios',
              url: `/academy/${academyId}/announcements`,
              icon: Megaphone,
            },
            {
              title: 'Eventos',
              url: `/academy/${academyId}/events`,
              icon: Calendar,
            },
          ],
        },
        {
          title: 'Gestión',
          items: [
            {
              title: 'Pagos y Suscripciones',
              url: `/academy/${academyId}/payments`,
              icon: ShoppingCart,
            },
            {
              title: 'Recursos',
              url: `/academy/${academyId}/resources`,
              icon: FolderKanban,
            },
            {
              title: 'Categorías',
              url: `/academy/${academyId}/categories`,
              icon: Layers,
            },
            {
              title: 'Reportes',
              url: `/academy/${academyId}/reports`,
              icon: FileText,
            },
          ],
        },
      ] : isTeacher ? [
        {
          title: 'Enseñanza',
          items: [
            {
              title: 'Mis Cursos',
              url: `/academy/${academyId}/teacher/courses`,
              icon: GraduationCap,
            },
            {
              title: 'Mis Lecciones',
              url: `/academy/${academyId}/teacher/lessons`,
              icon: BookMarked,
            },
            {
              title: 'Tareas',
              url: `/academy/${academyId}/teacher/assignments`,
              icon: ClipboardList,
            },
            {
              title: 'Exámenes',
              url: `/academy/${academyId}/teacher/exams`,
              icon: FileQuestion,
            },
            {
              title: 'Mis Estudiantes',
              url: `/academy/${academyId}/teacher/students`,
              icon: Users,
            },
            {
              title: 'Calificaciones',
              url: `/academy/${academyId}/teacher/grades`,
              icon: Award,
            },
            {
              title: 'Recursos',
              url: `/academy/${academyId}/teacher/resources`,
              icon: FolderKanban,
            },
          ],
        },
      ] : [
        {
          title: 'Aprendizaje',
          items: [
            {
              title: 'Mis Cursos',
              url: `/academy/${academyId}/my-courses`,
              icon: BookOpen,
            },
            {
              title: 'Explorar Cursos',
              url: `/academy/${academyId}/courses`,
              icon: GraduationCap,
            },
            {
              title: 'Mis Tareas',
              url: `/academy/${academyId}/my-assignments`,
              icon: ClipboardList,
            },
            {
              title: 'Calendario',
              url: `/academy/${academyId}/calendar`,
              icon: Calendar,
            },
            {
              title: 'Mis Logros',
              url: `/academy/${academyId}/achievements`,
              icon: Trophy,
            },
          ],
        },
      ]),
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
        ],
      },
    ],
  }
}