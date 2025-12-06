/**
 * Difficulty Level Formatting Utilities
 */

import type { DifficultyLevel } from '@/types'

/**
 * Difficulty level translations
 */
const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  beginner: 'Principiante',
  intermediate: 'Intermedio',
  advanced: 'Avanzado',
}

/**
 * Format difficulty level to Spanish
 * @param level - Difficulty level
 * @returns Translated difficulty label
 * @example
 * formatDifficulty('beginner') // "Principiante"
 * formatDifficulty('advanced') // "Avanzado"
 */
export function formatDifficulty(level: DifficultyLevel): string {
  return DIFFICULTY_LABELS[level] || level
}

/**
 * Get difficulty level badge color
 * @param level - Difficulty level
 * @returns Tailwind color class
 */
export function getDifficultyColor(level: DifficultyLevel): string {
  const colors: Record<DifficultyLevel, string> = {
    beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  }
  return colors[level] || 'bg-gray-100 text-gray-800'
}

/**
 * Get all difficulty levels with translations
 * @returns Array of difficulty levels with labels
 */
export function getDifficultyLevels(): Array<{ value: DifficultyLevel; label: string }> {
  return Object.entries(DIFFICULTY_LABELS).map(([value, label]) => ({
    value: value as DifficultyLevel,
    label,
  }))
}
