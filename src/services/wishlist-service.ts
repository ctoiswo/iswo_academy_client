import { apiClient } from '@/lib/api-client'
import type {
  WishlistableType,
  WishlistResponse,
  ToggleWishlistResponse,
  AddToWishlistResponse,
  RemoveFromWishlistResponse
} from '@/types'

/**
 * Wishlist Service
 * Handles all wishlist-related API calls for courses and academies
 */
class WishlistService {
  /**
   * Get all wishlist items
   * @returns Promise with wishlist items and metadata
   */
  async getWishlist(): Promise<WishlistResponse> {
    const response = await apiClient.get<WishlistResponse>('/api/v1/wishlists')
    return response.data
  }

  /**
   * Toggle item in wishlist (add if not present, remove if present)
   * @param wishlistableType - Type of resource ('Course' or 'Academy')
   * @param wishlistableId - Resource ID
   * @returns Promise with toggle result and action performed
   */
  async toggleWishlist(
    wishlistableType: WishlistableType,
    wishlistableId: number
  ): Promise<ToggleWishlistResponse> {
    const response = await apiClient.post<ToggleWishlistResponse>('/api/v1/wishlists/toggle', {
      wishlistable_type: wishlistableType,
      wishlistable_id: wishlistableId,
    })
    return response.data
  }

  /**
   * Add item to wishlist
   * @param wishlistableType - Type of resource ('Course' or 'Academy')
   * @param wishlistableId - Resource ID
   * @param notes - Optional notes for the wishlist item
   * @returns Promise with created wishlist item
   */
  async addToWishlist(
    wishlistableType: WishlistableType,
    wishlistableId: number,
    notes?: string
  ): Promise<AddToWishlistResponse> {
    const response = await apiClient.post('/api/v1/wishlists', {
      wishlistable_type: wishlistableType,
      wishlistable_id: wishlistableId,
      notes,
    })
    return response.data
  }

  /**
   * Remove item from wishlist by wishlist item ID
   * @param id - Wishlist item ID
   * @returns Promise with success message
   */
  async removeFromWishlist(id: number): Promise<RemoveFromWishlistResponse> {
    const response = await apiClient.delete(`/api/v1/wishlists/${id}`)
    return response.data
  }

  /**
   * Remove item from wishlist by resource type and ID
   * @param wishlistableType - Type of resource ('Course' or 'Academy')
   * @param wishlistableId - Resource ID
   * @returns Promise with success message
   */
  async removeByResource(
    wishlistableType: WishlistableType,
    wishlistableId: number
  ): Promise<RemoveFromWishlistResponse> {
    const response = await apiClient.delete('/api/v1/wishlists/remove_by_resource', {
      params: {
        wishlistable_type: wishlistableType,
        wishlistable_id: wishlistableId,
      },
    })
    return response.data
  }
}

// Export singleton instance
const wishlistService = new WishlistService()
export default wishlistService

// Also export as named export
export { wishlistService }
