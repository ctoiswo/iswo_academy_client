/**
 * User Profile Entity Types
 * Types for user details, addresses, and social networks
 */

export type AddressType = 'home' | 'work' | 'other'

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

/**
 * User Detail interface
 * Extended profile information for a user
 */
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

/**
 * User Address interface
 * Physical address information for a user
 */
export interface UserAddress {
  id: number
  user_id: number
  street: string | null
  city: string | null
  state: string | null
  postal_code: string | null
  country: string | null
  address_type: AddressType
  is_primary: boolean
  latitude: number | null
  longitude: number | null
  created_at: string
  updated_at: string
}

/**
 * Social Network interface
 * User's social media profiles
 */
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
