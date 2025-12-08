import apiClient from '@/lib/api-client'
import type {
  UserDetail,
  UserAddress,
  SocialNetwork,
  UserDetailRequest,
  UserAddressRequest,
  SocialNetworkRequest,
  UserDetailResponse,
  UserAddressResponse,
  UserAddressesResponse,
  SocialNetworkResponse,
  SocialNetworksResponse
} from '@/types'

/**
 * Profile Service
 * Handles all user profile-related API calls (details, addresses, social networks)
 */
class ProfileService {
  /**
   * Get current user's detail information
   * @returns Promise with user detail or null if not found
   */
  async getUserDetail(): Promise<UserDetail | null> {
    try {
      const response = await apiClient.get<UserDetailResponse>('/user_details/me')
      return response.data.user_detail
    } catch (_error) {
      // If 404, user doesn't have details yet
      return null
    }
  }

  /**
   * Update current user's detail information
   * @param data - User detail data to update
   * @returns Promise with updated user detail
   */
  async updateUserDetail(data: UserDetailRequest): Promise<UserDetail> {
    const response = await apiClient.put<UserDetailResponse>('/user_details/me', {
      user_detail: data,
    })
    return response.data.user_detail
  }

  /**
   * Create user detail information for current user
   * @param data - User detail data to create
   * @returns Promise with created user detail
   */
  async createUserDetail(data: UserDetailRequest): Promise<UserDetail> {
    const response = await apiClient.post<UserDetailResponse>('/user_details', {
      user_detail: data,
    })
    return response.data.user_detail
  }

  /**
   * Get all addresses for current user
   * @returns Promise with array of user addresses
   */
  async getUserAddresses(): Promise<UserAddress[]> {
    try {
      const response = await apiClient.get<UserAddressesResponse>('/user_addresses')
      return response.data.user_addresses
    } catch (_error) {
      return []
    }
  }

  /**
   * Create a new address for current user
   * @param data - Address data to create
   * @returns Promise with created user address
   */
  async createUserAddress(data: UserAddressRequest): Promise<UserAddress> {
    const response = await apiClient.post<UserAddressResponse>('/user_addresses', {
      user_address: data,
    })
    return response.data.user_address
  }

  /**
   * Update an existing address
   * @param id - Address ID
   * @param data - Address data to update
   * @returns Promise with updated user address
   */
  async updateUserAddress(id: number, data: UserAddressRequest): Promise<UserAddress> {
    const response = await apiClient.put<UserAddressResponse>(`/user_addresses/${id}`, {
      user_address: data,
    })
    return response.data.user_address
  }

  /**
   * Delete a user address
   * @param id - Address ID
   * @returns Promise that resolves when address is deleted
   */
  async deleteUserAddress(id: number): Promise<void> {
    await apiClient.delete(`/user_addresses/${id}`)
  }

  /**
   * Get all social networks for current user
   * @returns Promise with array of social networks
   */
  async getSocialNetworks(): Promise<SocialNetwork[]> {
    try {
      const response = await apiClient.get<SocialNetworksResponse>('/social_networks')
      return response.data.social_networks
    } catch (_error) {
      return []
    }
  }

  /**
   * Create a new social network profile for current user
   * @param data - Social network data to create
   * @returns Promise with created social network
   */
  async createSocialNetwork(data: SocialNetworkRequest): Promise<SocialNetwork> {
    const response = await apiClient.post<SocialNetworkResponse>('/social_networks', {
      social_network: data,
    })
    return response.data.social_network
  }

  /**
   * Update an existing social network profile
   * @param id - Social network ID
   * @param data - Social network data to update
   * @returns Promise with updated social network
   */
  async updateSocialNetwork(id: number, data: SocialNetworkRequest): Promise<SocialNetwork> {
    const response = await apiClient.put<SocialNetworkResponse>(`/social_networks/${id}`, {
      social_network: data,
    })
    return response.data.social_network
  }

  /**
   * Delete a social network profile
   * @param id - Social network ID
   * @returns Promise that resolves when social network is deleted
   */
  async deleteSocialNetwork(id: number): Promise<void> {
    await apiClient.delete(`/social_networks/${id}`)
  }

  /**
   * Mark user onboarding as complete
   * @returns Promise that resolves when onboarding is marked complete
   */
  async completeOnboarding(): Promise<void> {
    await apiClient.post('/users/complete_onboarding')
  }
}

// Export singleton instance
const profileService = new ProfileService()
export default profileService

// Also export as named export
export { profileService }
