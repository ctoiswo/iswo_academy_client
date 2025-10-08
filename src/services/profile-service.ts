import apiClient from '@/lib/api-client'

// User Details Types
export interface UserDetail {
  id: number
  user_id: number
  birth_date: string | null
  gender: string | null
  phone: string | null
  bio: string | null
  occupation: string | null
  website_url: string | null
  preferences: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export interface UserDetailInput {
  birth_date?: string | null
  gender?: string | null
  phone?: string | null
  bio?: string | null
  occupation?: string | null
  website_url?: string | null
}

// User Address Types
export interface UserAddress {
  id: number
  user_id: number
  street: string | null
  city: string | null
  state: string | null
  postal_code: string | null
  country: string | null // ISO 2-char code
  address_type: 'home' | 'work' | 'other'
  is_primary: boolean
  latitude: number | null
  longitude: number | null
  created_at: string
  updated_at: string
}

export interface UserAddressInput {
  street?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
  address_type?: 'home' | 'work' | 'other'
  is_primary?: boolean
}

// Social Network Types
export type SocialPlatform =
  | 'facebook'
  | 'twitter'
  | 'instagram'
  | 'linkedin'
  | 'github'
  | 'youtube'
  | 'tiktok'
  | 'twitch'
  | 'discord'
  | 'telegram'
  | 'whatsapp'
  | 'other'

export interface SocialNetwork {
  id: number
  user_id: number
  platform: SocialPlatform
  username: string | null
  profile_url: string
  is_public: boolean
  order_index: number | null
  created_at: string
  updated_at: string
}

export interface SocialNetworkInput {
  platform: SocialPlatform
  username?: string | null
  profile_url: string
  is_public?: boolean
  order_index?: number | null
}

// API Response Types
export interface UserDetailResponse {
  user_detail: UserDetail
}

export interface UserAddressResponse {
  user_address: UserAddress
}

export interface UserAddressesResponse {
  user_addresses: UserAddress[]
}

export interface SocialNetworkResponse {
  social_network: SocialNetwork
}

export interface SocialNetworksResponse {
  social_networks: SocialNetwork[]
}

// Profile Service
const profileService = {
  // User Details
  async getUserDetail(): Promise<UserDetail | null> {
    try {
      const response = await apiClient.get<UserDetailResponse>('/user_details/me')
      return response.data.user_detail
    } catch (error) {
      // If 404, user doesn't have details yet
      return null
    }
  },

  async updateUserDetail(data: UserDetailInput): Promise<UserDetail> {
    const response = await apiClient.put<UserDetailResponse>('/user_details/me', {
      user_detail: data,
    })
    return response.data.user_detail
  },

  async createUserDetail(data: UserDetailInput): Promise<UserDetail> {
    const response = await apiClient.post<UserDetailResponse>('/user_details', {
      user_detail: data,
    })
    return response.data.user_detail
  },

  // User Addresses
  async getUserAddresses(): Promise<UserAddress[]> {
    try {
      const response = await apiClient.get<UserAddressesResponse>('/user_addresses')
      return response.data.user_addresses
    } catch (error) {
      return []
    }
  },

  async createUserAddress(data: UserAddressInput): Promise<UserAddress> {
    const response = await apiClient.post<UserAddressResponse>('/user_addresses', {
      user_address: data,
    })
    return response.data.user_address
  },

  async updateUserAddress(id: number, data: UserAddressInput): Promise<UserAddress> {
    const response = await apiClient.put<UserAddressResponse>(`/user_addresses/${id}`, {
      user_address: data,
    })
    return response.data.user_address
  },

  async deleteUserAddress(id: number): Promise<void> {
    await apiClient.delete(`/user_addresses/${id}`)
  },

  // Social Networks
  async getSocialNetworks(): Promise<SocialNetwork[]> {
    try {
      const response = await apiClient.get<SocialNetworksResponse>('/social_networks')
      return response.data.social_networks
    } catch (error) {
      return []
    }
  },

  async createSocialNetwork(data: SocialNetworkInput): Promise<SocialNetwork> {
    const response = await apiClient.post<SocialNetworkResponse>('/social_networks', {
      social_network: data,
    })
    return response.data.social_network
  },

  async updateSocialNetwork(id: number, data: SocialNetworkInput): Promise<SocialNetwork> {
    const response = await apiClient.put<SocialNetworkResponse>(`/social_networks/${id}`, {
      social_network: data,
    })
    return response.data.social_network
  },

  async deleteSocialNetwork(id: number): Promise<void> {
    await apiClient.delete(`/social_networks/${id}`)
  },

  // Complete Onboarding
  async completeOnboarding(): Promise<void> {
    await apiClient.post('/users/complete_onboarding')
  },
}

export default profileService
