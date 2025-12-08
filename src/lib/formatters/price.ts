/**
 * Price Formatting Utilities
 */

/**
 * Format price value to compact notation (e.g., $12k)
 * @param priceValue - Price as string or number
 * @returns Formatted price string
 * @example
 * formatPrice(12000) // "$12k"
 * formatPrice("25000") // "$25k"
 */
export function formatPrice(priceValue: string | number): string {
  const price =
    typeof priceValue === 'string' ? parseFloat(priceValue) : priceValue
  return `$${(price / 1000).toFixed(0)}k`
}

/**
 * Format price with full currency display
 * @param priceValue - Price as string or number
 * @param currency - Currency code (default: 'COP')
 * @returns Formatted price string
 * @example
 * formatFullPrice(12000, 'USD') // "$12,000.00"
 * formatFullPrice(25000, 'COP') // "$25,000"
 */
export function formatFullPrice(
  priceValue: string | number,
  currency: string = 'COP'
): string {
  const price =
    typeof priceValue === 'string' ? parseFloat(priceValue) : priceValue

  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: currency === 'COP' ? 0 : 2,
    maximumFractionDigits: currency === 'COP' ? 0 : 2,
  }).format(price)
}

/**
 * Check if a price is free
 * @param price - Price value
 * @returns True if price is 0 or falsy
 */
export function isFreePrice(
  price: string | number | null | undefined
): boolean {
  if (!price) return true
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return numPrice === 0
}
