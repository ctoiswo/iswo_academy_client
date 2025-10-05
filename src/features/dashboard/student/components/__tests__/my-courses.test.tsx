import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MyCourses } from '../my-courses'
import type { Enrollment } from '../../types'

const mockEnrollments: Enrollment[] = [
  {
    id: 1,
    user_id: 1,
    course_id: 1,
    status: 'active',
    progress_percentage: 75,
    enrolled_at: '2024-01-15T10:00:00Z',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-03-01T10:00:00Z',
    course: {
      id: 1,
      title: 'Introduction to React',
      description: 'Learn the fundamentals of React development including components, state management, and hooks.',
      price: 99,
      difficulty_level: 'beginner',
      is_published: true,
      thumbnail_url: 'https://via.placeholder.com/300x200?text=React+Course',
      duration_minutes: 480,
      enrollment_count: 1250,
      academy_id: 1,
      created_at: '2024-01-01T10:00:00Z',
      updated_at: '2024-01-01T10:00:00Z'
    }
  },
  {
    id: 2,
    user_id: 1,
    course_id: 2,
    status: 'completed',
    progress_percentage: 100,
    enrolled_at: '2024-01-01T10:00:00Z',
    completed_at: '2024-02-15T10:00:00Z',
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-02-15T10:00:00Z',
    course: {
      id: 2,
      title: 'JavaScript Fundamentals',
      description: 'Master the core concepts of JavaScript programming language.',
      price: 79,
      difficulty_level: 'beginner',
      is_published: true,
      thumbnail_url: 'https://via.placeholder.com/300x200?text=JavaScript+Course',
      duration_minutes: 360,
      enrollment_count: 2100,
      academy_id: 1,
      created_at: '2023-12-01T10:00:00Z',
      updated_at: '2023-12-01T10:00:00Z'
    }
  }
]

describe('MyCourses', () => {
  it('renders loading state correctly', () => {
    render(<MyCourses enrollments={[]} loading={true} />)
    
    // Loading skeleton should be present
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('renders empty state when no enrollments', () => {
    render(<MyCourses enrollments={[]} />)
    
    expect(screen.getByText('No courses yet')).toBeInTheDocument()
    expect(screen.getByText('Start your learning journey by enrolling in your first course.')).toBeInTheDocument()
    expect(screen.getByText('Browse Courses')).toBeInTheDocument()
  })

  it('renders enrollments correctly', () => {
    render(<MyCourses enrollments={mockEnrollments} />)
    
    expect(screen.getByText('My Courses')).toBeInTheDocument()
    expect(screen.getByText('2 enrolled courses')).toBeInTheDocument()
    
    // Check course titles
    expect(screen.getByText('Introduction to React')).toBeInTheDocument()
    expect(screen.getByText('JavaScript Fundamentals')).toBeInTheDocument()
    
    // Check status badges
    expect(screen.getByText('active')).toBeInTheDocument()
    expect(screen.getByText('completed')).toBeInTheDocument()
    
    // Check difficulty badges
    expect(screen.getAllByText('beginner')).toHaveLength(2)
  })

  it('displays progress percentages correctly', () => {
    render(<MyCourses enrollments={mockEnrollments} />)
    
    expect(screen.getByText('75%')).toBeInTheDocument()
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('shows correct action buttons based on status', () => {
    render(<MyCourses enrollments={mockEnrollments} />)
    
    // Active course should show Continue button
    expect(screen.getByText('Continue')).toBeInTheDocument()
    
    // Completed course should show View Certificate button
    expect(screen.getByText('View Certificate')).toBeInTheDocument()
  })

  it('calls onContinueCourse when Continue button is clicked', () => {
    const mockOnContinue = vi.fn()
    render(<MyCourses enrollments={mockEnrollments} onContinueCourse={mockOnContinue} />)
    
    const continueButton = screen.getByText('Continue')
    fireEvent.click(continueButton)
    
    expect(mockOnContinue).toHaveBeenCalledWith(1) // course_id of active enrollment
  })

  it('calls onViewCertificate when View Certificate button is clicked', () => {
    const mockOnViewCertificate = vi.fn()
    render(<MyCourses enrollments={mockEnrollments} onViewCertificate={mockOnViewCertificate} />)
    
    const viewCertificateButton = screen.getByText('View Certificate')
    fireEvent.click(viewCertificateButton)
    
    expect(mockOnViewCertificate).toHaveBeenCalledWith(2) // course_id of completed enrollment
  })

  it('formats duration correctly', () => {
    render(<MyCourses enrollments={mockEnrollments} />)
    
    // 480 minutes = 8h 0m
    expect(screen.getByText('8h 0m')).toBeInTheDocument()
    // 360 minutes = 6h 0m
    expect(screen.getByText('6h 0m')).toBeInTheDocument()
  })

  it('displays enrollment dates correctly', () => {
    render(<MyCourses enrollments={mockEnrollments} />)
    
    // Check that enrollment dates are displayed (should find multiple)
    expect(screen.getAllByText(/Enrolled/)).toHaveLength(2)
  })

  it('shows course thumbnails when available', () => {
    render(<MyCourses enrollments={mockEnrollments} />)
    
    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(2)
    expect(images[0]).toHaveAttribute('alt', 'Introduction to React')
    expect(images[1]).toHaveAttribute('alt', 'JavaScript Fundamentals')
  })

  it('handles enrollments with 0 progress correctly', () => {
    const enrollmentWithZeroProgress = {
      ...mockEnrollments[0],
      progress_percentage: 0
    }
    
    render(<MyCourses enrollments={[enrollmentWithZeroProgress]} />)
    
    // Should show "Start" instead of "Continue" for 0% progress
    expect(screen.getByText('Start')).toBeInTheDocument()
  })
})