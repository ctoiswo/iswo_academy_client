/**
 * String Utility Functions
 */

/**
 * Generate a URL-friendly slug from text
 * @param text - Text to convert to slug
 * @returns URL-friendly slug
 * @example
 * generateSlug('Hello World!') // "hello-world"
 * generateSlug('  TypeScript   101  ') // "typescript-101"
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

/**
 * Truncate text to a maximum length
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @param suffix - Suffix to add when truncated (default: '...')
 * @returns Truncated text
 * @example
 * truncate('Hello World', 5) // "Hello..."
 */
export function truncate(
  text: string,
  maxLength: number,
  suffix: string = '...'
): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - suffix.length) + suffix
}

/**
 * Capitalize first letter of string
 * @param text - Text to capitalize
 * @returns Capitalized text
 * @example
 * capitalize('hello') // "Hello"
 */
export function capitalize(text: string): string {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/**
 * Convert text to title case
 * @param text - Text to convert
 * @returns Title cased text
 * @example
 * toTitleCase('hello world') // "Hello World"
 */
export function toTitleCase(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ')
}
