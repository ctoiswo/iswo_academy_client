/**
 * Certificate Entity Types
 * Matching backend certificate_json structure
 */

// Certificate structure (from backend certificate_json)
export interface Certificate {
  id: number
  certificate_number: string
  issued_at: string
  revoked_at: string | null
  user: {
    id: number
    full_name: string
    email: string
  }
  course: {
    id: number
    title: string
    academy_name: string
  }
  verification_url: string | null
  created_at: string
  updated_at: string
}

// Certificate template structure (detailed)
export interface CertificateTemplate {
  id: number
  academy_id: number
  name: string
  description: string | null
  is_default: boolean
  is_active: boolean
  usage_count: number
  design: {
    layout: 'portrait' | 'landscape'
    background_color: string
    border_style: 'classic' | 'minimal' | 'modern' | 'none'
    font_family: string
    logo_position: 'top-left' | 'top-center' | 'top-right'
    signature_count: number
  }
  content: {
    title: string
    subtitle: string
    body: string
    footer: string
    signatures: Array<{
      title: string
      name_placeholder: string
    }>
  }
  requirements: {
    lessons_completion?: number
    minimum_score?: number
  }
  background_image_url?: string
  logo_url?: string
  created_at: string
  updated_at: string
}

// Learning path certificate configuration
export interface LearningPathCertificateConfiguration {
  certificate_enabled: boolean
  certificate_template: CertificateTemplate | null
  learning_path: {
    id: number
    title: string
    description: string
    estimated_duration_hours: number
    courses_count: number
  }
  academy: {
    id: number
    name: string
    slug: string
  }
  statistics: {
    total_issued: number
    active_certificates: number
    revoked_certificates: number
  }
}

// Certificate verification response
export interface CertificateVerification {
  valid: boolean
  certificate?: {
    id: number
    certificate_number: string
    student_name: string
    course_title: string
    academy_name: string
    issued_at: string
    revoked_at: string | null
  }
  message?: string
}

// Certificate download template data
export interface CertificateDownloadData {
  certificate: Certificate
  template_data: {
    student_name: string
    course_title: string
    completion_date: string
    certificate_number: string
    academy_name: string
    instructor_name: string
  }
}
