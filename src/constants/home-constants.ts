import type { FeaturedCategory } from '@/types'
import { BookOpen, Zap, Shield, Globe, BarChart3, Users } from 'lucide-react'

/**
 * Visual configuration for featured category carousel.
 * Keyed by category slug (from backend). If a slug is not found,
 * DEFAULT_CATEGORY_VISUAL is used as fallback.
*/
export interface CategoryVisualConfig {
  /** Lucide icon name (must exist in the iconMap of AcademiesSection) */
  icon: string
  /** Tailwind gradient from class */
  accentFrom: string
  /** Tailwind gradient to class */
  accentTo: string
  /** Short marketing tagline shown in the carousel panel */
  tagline: string
}

export const CATEGORY_VISUAL_CONFIG: Record<string, CategoryVisualConfig> = {
  // Seeds originales
  'programacion': { icon: 'Terminal', accentFrom: 'from-sky-600', accentTo: 'to-blue-500', tagline: 'Construye cualquier cosa con código' },
  'diseno-grafico': { icon: 'PenTool', accentFrom: 'from-pink-500', accentTo: 'to-rose-400', tagline: 'Del boceto a la obra maestra' },
  'marketing-digital': { icon: 'TrendingUp', accentFrom: 'from-orange-500', accentTo: 'to-amber-400', tagline: 'Impulsa tu presencia online' },
  'negocios': { icon: 'Briefcase', accentFrom: 'from-yellow-500', accentTo: 'to-amber-400', tagline: 'Lleva tu negocio al siguiente nivel' },
  'cocina': { icon: 'ChefHat', accentFrom: 'from-red-600', accentTo: 'to-orange-500', tagline: 'Descubre el arte culinario' },
  'idiomas': { icon: 'Globe', accentFrom: 'from-teal-500', accentTo: 'to-cyan-400', tagline: 'Abre puertas con nuevos idiomas' },
  'musica': { icon: 'Music', accentFrom: 'from-violet-600', accentTo: 'to-purple-400', tagline: 'Expresa tu talento musical' },
  'fitness': { icon: 'Dumbbell', accentFrom: 'from-emerald-600', accentTo: 'to-green-400', tagline: 'Transforma tu cuerpo y tu mente' },
  'fotografia': { icon: 'Camera', accentFrom: 'from-amber-600', accentTo: 'to-yellow-500', tagline: 'Captura el mundo con tu lente' },
  'desarrollo-personal': { icon: 'Brain', accentFrom: 'from-indigo-600', accentTo: 'to-violet-500', tagline: 'Crece y supera tus límites' },
  // Categorías adicionales en BD actual
  'arte-y-diseno': { icon: 'Palette', accentFrom: 'from-fuchsia-500', accentTo: 'to-pink-400', tagline: 'Crea experiencias visuales únicas' },
  'ciencias': { icon: 'FlaskConical', accentFrom: 'from-purple-600', accentTo: 'to-fuchsia-400', tagline: 'Explora el mundo científico' },
  'educacion': { icon: 'GraduationCap', accentFrom: 'from-lime-600', accentTo: 'to-green-500', tagline: 'Transforma el aprendizaje' },
  'salud-y-bienestar': { icon: 'Heart', accentFrom: 'from-rose-600', accentTo: 'to-pink-500', tagline: 'Cuida tu cuerpo y tu mente' },
  'tecnologia': { icon: 'Code', accentFrom: 'from-blue-600', accentTo: 'to-cyan-500', tagline: 'Domina el stack moderno' },
}

export const DEFAULT_CATEGORY_VISUAL: CategoryVisualConfig = {
  icon: 'Globe',
  accentFrom: 'from-primary',
  accentTo: 'to-primary/60',
  tagline: 'Expertos en su área',
}

/** A FeaturedCategory enriched with visual config for the carousel */
export type CategoryWithVisual = FeaturedCategory & CategoryVisualConfig

export const featureKeys = [
  { icon: BookOpen, key: 'qualityCourses', accent: 'from-indigo-500 to-indigo-600' },
  { icon: Zap,      key: 'learnAtYourPace', accent: 'from-amber-500 to-orange-600' },
  { icon: Shield,   key: 'verifiedCerts',  accent: 'from-emerald-500 to-teal-600' },
  { icon: Globe,    key: 'createAcademy',  accent: 'from-pink-500 to-rose-600' },
  { icon: BarChart3,key: 'analytics',      accent: 'from-sky-500 to-blue-600' },
  { icon: Users,    key: 'community',      accent: 'from-violet-500 to-purple-600' },
]

export const COURSE_CATEGORIES = [
  'Todos',
  'Desarrollo Web',
  'Inteligencia Artificial',
  'Mobile',
  'Diseño',
  'Marketing',
  'Negocios',
  'Idiomas',
  'Ciencias',
  'Salud',
  'Música',
  'Educación',
]