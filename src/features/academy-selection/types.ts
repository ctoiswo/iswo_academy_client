// TypeScript interfaces for academy data
export interface AcademyMembership {
  id: number
  name: string
  slug: string
  description: string
  logo_url: string | null
  user_role: string
  user_role_display: string
  created_at: string
  last_accessed: string | null
  last_accessed_at?: string | null
}

export interface AcademyData {
  count: number
  academies: AcademyMembership[]
}