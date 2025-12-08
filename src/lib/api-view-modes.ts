/**
 * API View Modes
 *
 * View modes allow clients to request different levels of detail from the API.
 * This reduces data transfer and improves performance when full details aren't needed.
 *
 * - minimal: Only essential fields (id, name, slug)
 * - summary: Key fields without full relations
 * - full: Complete data including all relations (default)
 */

export type ViewMode = 'minimal' | 'summary' | 'full'

/**
 * Helper function to add view parameter to query params
 * @param params - Existing query parameters
 * @param view - View mode to apply
 * @returns Updated params object with view parameter if specified
 */
export function withView<T extends Record<string, any>>(
  params: T,
  view?: ViewMode
): T & { view?: ViewMode } {
  if (!view) return params

  return {
    ...params,
    view,
  }
}

/**
 * Default view modes for common operations
 */
export const DEFAULT_VIEWS = {
  LIST: 'minimal' as ViewMode, // For list views (grids, tables)
  DETAIL: 'full' as ViewMode, // For detail/show pages
  SUMMARY: 'summary' as ViewMode, // For cards, previews
} as const
