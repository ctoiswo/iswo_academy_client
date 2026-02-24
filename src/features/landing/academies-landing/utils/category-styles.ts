import { Globe, Palette, Brain, Cloud, Shield, GraduationCap } from 'lucide-react'

// Maps slug keywords → icon component
const SLUG_ICON_MAP: Array<[string, typeof Globe]> = [
  ['tech', Brain],
  ['programacion', Brain],
  ['desarrollo', Brain],
  ['diseno', Palette],
  ['design', Palette],
  ['arte', Palette],
  ['cloud', Cloud],
  ['devops', Cloud],
  ['seguridad', Shield],
  ['security', Shield],
]

export function getCategoryIcon(slug: string): typeof Globe {
  const lower = slug.toLowerCase()
  const match = SLUG_ICON_MAP.find(([key]) => lower.includes(key))
  return match ? match[1] : GraduationCap
}

export const GRADIENTS = [
  { from: 'from-blue-500/20', to: 'to-indigo-600/20' },
  { from: 'from-violet-500/20', to: 'to-purple-600/20' },
  { from: 'from-emerald-500/20', to: 'to-teal-600/20' },
  { from: 'from-amber-500/20', to: 'to-orange-600/20' },
  { from: 'from-rose-500/20', to: 'to-pink-600/20' },
]

export function getGradientByIndex(index: number) {
  return GRADIENTS[index % GRADIENTS.length]
}
