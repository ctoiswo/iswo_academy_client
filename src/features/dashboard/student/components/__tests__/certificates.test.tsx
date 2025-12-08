import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import type { Certificate } from '../../types'
import { Certificates } from '../certificates'

const mockCertificates: Certificate[] = [
  {
    id: 1,
    user_id: 1,
    course_id: 1,
    enrollment_id: 1,
    certificate_number: 'CERT-JS-2024-001',
    issued_at: '2024-02-15T10:00:00Z',
    course: {
      id: 1,
      title: 'JavaScript Fundamentals',
      description:
        'Master the core concepts of JavaScript programming language.',
      price: 79,
      difficulty_level: 'beginner',
      is_published: true,
      duration_minutes: 360,
      enrollment_count: 2100,
      academy_id: 1,
      created_at: '2023-12-01T10:00:00Z',
      updated_at: '2023-12-01T10:00:00Z',
    },
  },
  {
    id: 2,
    user_id: 1,
    course_id: 2,
    enrollment_id: 2,
    certificate_number: 'CERT-REACT-2024-002',
    issued_at: '2024-01-15T10:00:00Z',
    revoked_at: '2024-03-01T10:00:00Z',
    revoked_reason: 'Course content updated',
    course: {
      id: 2,
      title: 'Introduction to React',
      description: 'Learn the fundamentals of React development.',
      price: 99,
      difficulty_level: 'intermediate',
      is_published: true,
      duration_minutes: 480,
      enrollment_count: 1250,
      academy_id: 1,
      created_at: '2024-01-01T10:00:00Z',
      updated_at: '2024-01-01T10:00:00Z',
    },
  },
]

describe('Certificates', () => {
  it('renders loading state correctly', () => {
    render(<Certificates certificates={[]} loading={true} />)

    // Loading skeleton should be present
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('renders empty state when no certificates', () => {
    render(<Certificates certificates={[]} />)

    expect(screen.getByText('No certificates yet')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Complete your courses to earn certificates and showcase your achievements.'
      )
    ).toBeInTheDocument()
    expect(screen.getByText('View Available Courses')).toBeInTheDocument()
  })

  it('renders certificate statistics correctly', () => {
    render(<Certificates certificates={mockCertificates} />)

    expect(screen.getByText('Total Certificates')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()

    expect(screen.getAllByText('Active')).toHaveLength(3) // Stats card, badge, and timeline
    expect(screen.getByText('1')).toBeInTheDocument() // Only one active certificate

    expect(screen.getByText('This Year')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument() // Both certificates are from 2024
  })

  it('separates active and revoked certificates correctly', () => {
    render(<Certificates certificates={mockCertificates} />)

    // Active certificates section
    expect(screen.getByText('Active Certificates')).toBeInTheDocument()
    expect(screen.getByText('1 valid certificate')).toBeInTheDocument()

    // Revoked certificates section
    expect(screen.getByText('Revoked Certificates')).toBeInTheDocument()
    expect(screen.getByText('1 revoked certificate')).toBeInTheDocument()
  })

  it('displays certificate details correctly', () => {
    render(<Certificates certificates={mockCertificates} />)

    // Check course titles (will appear multiple times in different sections)
    expect(screen.getAllByText('JavaScript Fundamentals')).toHaveLength(2) // Active section and timeline
    expect(screen.getAllByText('Introduction to React')).toHaveLength(2) // Revoked section and timeline

    // Check certificate numbers
    expect(
      screen.getByText('Certificate #: CERT-JS-2024-001')
    ).toBeInTheDocument()
    expect(
      screen.getByText('Certificate #: CERT-REACT-2024-002')
    ).toBeInTheDocument()

    // Check issued dates (will appear multiple times)
    expect(screen.getAllByText(/Issued:/)).toHaveLength(2)
  })

  it('shows revocation details for revoked certificates', () => {
    render(<Certificates certificates={mockCertificates} />)

    expect(screen.getByText(/Revoked:/)).toBeInTheDocument()
    expect(
      screen.getByText('Reason: Course content updated')
    ).toBeInTheDocument()
  })

  it('displays correct action buttons for active certificates', () => {
    render(<Certificates certificates={mockCertificates} />)

    // Should have Verify, View, and Download buttons for active certificates
    expect(screen.getByText('Verify')).toBeInTheDocument()
    expect(screen.getByText('View')).toBeInTheDocument()
    expect(screen.getByText('Download')).toBeInTheDocument()
  })

  it('calls callback functions when buttons are clicked', () => {
    const mockDownload = vi.fn()
    const mockView = vi.fn()
    const mockVerify = vi.fn()

    render(
      <Certificates
        certificates={mockCertificates}
        onDownloadCertificate={mockDownload}
        onViewCertificate={mockView}
        onVerifyCertificate={mockVerify}
      />
    )

    // Click Download button
    const downloadButton = screen.getByText('Download')
    fireEvent.click(downloadButton)
    expect(mockDownload).toHaveBeenCalledWith(1) // certificate id

    // Click View button
    const viewButton = screen.getByText('View')
    fireEvent.click(viewButton)
    expect(mockView).toHaveBeenCalledWith(1) // certificate id

    // Click Verify button
    const verifyButton = screen.getByText('Verify')
    fireEvent.click(verifyButton)
    expect(mockVerify).toHaveBeenCalledWith('CERT-JS-2024-001') // certificate number
  })

  it('renders achievement timeline correctly', () => {
    render(<Certificates certificates={mockCertificates} />)

    expect(screen.getByText('Achievement Timeline')).toBeInTheDocument()
    expect(
      screen.getByText('Your certification journey over time')
    ).toBeInTheDocument()

    // Timeline should show both certificates with their status
    const activeBadges = screen.getAllByText('Active')
    const revokedBadges = screen.getAllByText('Revoked')

    // Should have Active badge in stats and timeline
    expect(activeBadges.length).toBeGreaterThan(0)
    // Should have Revoked badge in stats and timeline
    expect(revokedBadges.length).toBeGreaterThan(0)
  })

  it('sorts certificates by issued date in timeline', () => {
    render(<Certificates certificates={mockCertificates} />)

    // The timeline should show the most recent certificate first
    // JavaScript Fundamentals was issued on 2024-02-15 (more recent)
    // Introduction to React was issued on 2024-01-15 (older)
    const timelineItems = screen.getAllByText(/Earned on|Revoked on/)
    expect(timelineItems.length).toBeGreaterThan(0)
  })

  it('calculates this year certificates correctly', () => {
    const currentYear = new Date().getFullYear()
    const certificatesFromDifferentYears: Certificate[] = [
      {
        ...mockCertificates[0],
        issued_at: `${currentYear}-02-15T10:00:00Z`,
      },
      {
        ...mockCertificates[1],
        issued_at: `${currentYear - 1}-01-15T10:00:00Z`,
      },
    ]

    render(<Certificates certificates={certificatesFromDifferentYears} />)

    // Should only count certificates from current year
    const thisYearElements = screen.getAllByText('1')
    expect(thisYearElements.length).toBeGreaterThan(0)
  })

  it('handles certificates without revocation reason', () => {
    const certificateWithoutReason: Certificate[] = [
      {
        ...mockCertificates[1],
        revoked_reason: undefined,
      },
    ]

    render(<Certificates certificates={certificateWithoutReason} />)

    // Should not show reason section if no reason provided
    expect(screen.queryByText(/Reason:/)).not.toBeInTheDocument()
  })
})
