import { Trophy, Flame, Rocket, Target, BookOpen } from 'lucide-react'
import type { MockTask, MockLearningPath, MockAchievement } from './types'

export const mockTasks: MockTask[] = [
  {
    id: '1',
    title: 'Quiz: Variables y tipos de datos',
    course: 'Introducción a Python',
    dueDate: 'Hoy',
    type: 'quiz',
    urgent: true,
  },
  {
    id: '2',
    title: 'Proyecto: Calculadora básica',
    course: 'Introducción a Python',
    dueDate: 'Mañana',
    type: 'project',
    urgent: false,
  },
  {
    id: '3',
    title: 'Lectura: Patrones de diseño',
    course: 'Arquitectura de Software',
    dueDate: 'En 3 días',
    type: 'reading',
    urgent: false,
  },
]

export const mockLearningPaths: MockLearningPath[] = [
  {
    id: '1',
    title: 'Full Stack Developer',
    progress: 45,
    totalCourses: 8,
    completedCourses: 4,
    currentCourse: 'React Avanzado',
    estimatedTime: '3 meses',
    color: 'from-indigo-500/30 to-indigo-600/10',
  },
  {
    id: '2',
    title: 'Data Science Professional',
    progress: 20,
    totalCourses: 6,
    completedCourses: 1,
    currentCourse: 'Python para Data Science',
    estimatedTime: '5 meses',
    color: 'from-emerald-500/30 to-emerald-600/10',
  },
  {
    id: '3',
    title: 'Cloud Architecture',
    progress: 80,
    totalCourses: 5,
    completedCourses: 4,
    currentCourse: 'Kubernetes Avanzado',
    estimatedTime: '1 mes',
    color: 'from-sky-500/30 to-sky-600/10',
  },
]

export const mockAchievements: MockAchievement[] = [
  {
    id: '1',
    title: 'Completaste tu primer curso',
    icon: Trophy,
    date: 'Hace 2 días',
    color: 'text-amber-400',
  },
  {
    id: '2',
    title: '7 días seguidos estudiando',
    icon: Flame,
    date: 'Hoy',
    color: 'text-orange-400',
  },
  {
    id: '3',
    title: 'Terminaste un learning path',
    icon: Rocket,
    date: 'Hace 1 semana',
    color: 'text-primary',
  },
]

export const taskTypeConfig = {
  quiz: { icon: Target, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  project: { icon: Rocket, color: 'text-primary', bg: 'bg-primary/10' },
  reading: {
    icon: BookOpen,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
} as const
