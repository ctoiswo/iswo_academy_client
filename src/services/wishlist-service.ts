import { apiClient } from '@/lib/api-client'

export interface WishlistItem {
  id: number
  wishlistable_type: 'Course' | 'Academy'
  wishlistable_id: number
  notes?: string
  created_at: string
  resource: {
    id: number
    name: string
    slug: string
    description: string
    thumbnail_url?: string
    logo_url?: string
    duration_minutes?: number
    difficulty_level?: string
    academy_name?: string
    academy_slug?: string
    courses_count?: number
  }
}

export interface WishlistResponse {
  data: WishlistItem[]
  meta: {
    total_count: number
    courses_count: number
    academies_count: number
  }
}

export interface ToggleWishlistResponse {
  in_wishlist: boolean
  action: 'added' | 'removed'
  message: string
  data?: WishlistItem
}

export const wishlistService = {
  // Get all wishlist items
  getWishlist: async (): Promise<WishlistResponse> => {
    const response = await apiClient.get<WishlistResponse>('/api/v1/wishlists')
    return response.data
  },

  // Toggle item in wishlist
  toggleWishlist: async (
    wishlistableType: 'Course' | 'Academy',
    wishlistableId: number
  ): Promise<ToggleWishlistResponse> => {
    const response = await apiClient.post<ToggleWishlistResponse>('/api/v1/wishlists/toggle', {
      wishlistable_type: wishlistableType,
      wishlistable_id: wishlistableId,
    })
    return response.data
  },

  // Add item to wishlist
  addToWishlist: async (
    wishlistableType: 'Course' | 'Academy',
    wishlistableId: number,
    notes?: string
  ): Promise<{ data: WishlistItem; message: string }> => {
    const response = await apiClient.post('/api/v1/wishlists', {
      wishlistable_type: wishlistableType,
      wishlistable_id: wishlistableId,
      notes,
    })
    return response.data
  },

  // Remove item from wishlist
  removeFromWishlist: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/api/v1/wishlists/${id}`)
    return response.data
  },

  // Remove by resource
  removeByResource: async (
    wishlistableType: 'Course' | 'Academy',
    wishlistableId: number
  ): Promise<{ message: string }> => {
    const response = await apiClient.delete('/api/v1/wishlists/remove_by_resource', {
      params: {
        wishlistable_type: wishlistableType,
        wishlistable_id: wishlistableId,
      },
    })
    return response.data
  },
}
