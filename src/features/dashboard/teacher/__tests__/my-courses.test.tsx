import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MyCourses } from '../components/my-courses'
import type { TeacherCourse } from '../types'

const mockCourses: TeacherCourse[] = [
  {
    id: 1,
    title: "Introduction to React",
    description: "Learn the fundamentals of React development",
    status: "published",
    enrollments: 45,
    completionRate: 82,
    totalLessons: 12,
    completedLessons: 10,
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-02-01T00:00:00Z",
    price: 99,
    duration: "8 weeks",
    academy: { id: 1, name: "Tech Academy" }
  },
  {
    id: 2,
    title: "Advanced JavaScript",
    description: "Master advanced JavaScript concepts",
    status: "draft",
    enrollments: 0,
    completionRate: 0,
    totalLessons: 15,
    completedLessons: 5,
    createdAt: "2024-01-20T00:00:00Z",
    updatedAt: "2024-02-05T00:00:00Z",
    price: 149,
    duration: "10 weeks",
    academy: { id: 1, name: "Tech Academy" }
  },
  {
    id: 3,
    title: "Node.js Backend",
    description: "Build scalable backend applications",
    status: "archived",
    enrollments: 25,
    completionRate: 95,
    totalLessons: 20,
    completedLessons: 20,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-30T00:00:00Z",
    price: 199,
    duration: "12 weeks",
    academy: { id: 1, name: "Tech Academy" }
  }
]

describe('MyCourses', () => {
  describe('Basic Rendering', () => {
    it('renders course statistics correctly', () => {
      render(<MyCourses courses={mockCourses} />)

      expect(screen.getByText('My Courses')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument() // Total courses
      expect(screen.getByText('1 published, 1 draft')).toBeInTheDocument()
      
      expect(screen.getByText('Total Students')).toBeInTheDocument()
      expect(screen.getByText('70')).toBeInTheDocument() // 45 + 0 + 25
      
      expect(screen.getByText('Avg. Completion')).toBeInTheDocument()
      expect(screen.getByText('59%')).toBeInTheDocument() // (82 + 0 + 95) / 3
    })

    it('renders course list with correct information', () => {
      render(<MyCourses courses={mockCourses} />)

      expect(screen.getByText('Introduction to React')).toBeInTheDocument()
      expect(screen.getByText('Advanced JavaScript')).toBeInTheDocument()
      expect(screen.getByText('Node.js Backend')).toBeInTheDocument()

      expect(screen.getByText('45 students')).toBeInTheDocument()
      expect(screen.getByText('82% completion')).toBeInTheDocument()
      expect(screen.getByText('10/12 lessons')).toBeInTheDocument()
    })

    it('renders status badges correctly', () => {
      render(<MyCourses courses={mockCourses} />)

      expect(screen.getByText('Published')).toBeInTheDocument()
      expect(screen.getByText('Draft')).toBeInTheDocument()
      expect(screen.getByText('Archived')).toBeInTheDocument()
    })

    it('renders New Course button', () => {
      render(<MyCourses courses={mockCourses} />)

      expect(screen.getByText('New Course')).toBeInTheDocument()
    })
  })

  describe('Filtering', () => {
    it('filters courses by status', () => {
      render(<MyCourses courses={mockCourses} />)

      // Click on Published filter
      fireEvent.click(screen.getByText('Published'))
      
      expect(screen.getByText('Introduction to React')).toBeInTheDocument()
      expect(screen.queryByText('Advanced JavaScript')).not.toBeInTheDocument()
      expect(screen.queryByText('Node.js Backend')).not.toBeInTheDocument()
    })

    it('shows filter badges with correct counts', () => {
      render(<MyCourses courses={mockCourses} />)

      // Check filter buttons have correct counts
      const publishedButton = screen.getByText('Published').closest('button')
      expect(publishedButton).toContainHTML('1') // 1 published course

      const draftButton = screen.getByText('Draft').closest('button')
      expect(draftButton).toContainHTML('1') // 1 draft course

      const archivedButton = screen.getByText('Archived').closest('button')
      expect(archivedButton).toContainHTML('1') // 1 archived course
    })

    it('shows all courses when "All" filter is selected', () => {
      render(<MyCourses courses={mockCourses} />)

      // Click on Draft filter first
      fireEvent.click(screen.getByText('Draft'))
      expect(screen.queryByText('Introduction to React')).not.toBeInTheDocument()

      // Click on All filter
      fireEvent.click(screen.getByText('All'))
      expect(screen.getByText('Introduction to React')).toBeInTheDocument()
      expect(screen.getByText('Advanced JavaScript')).toBeInTheDocument()
      expect(screen.getByText('Node.js Backend')).toBeInTheDocument()
    })
  })

  describe('Event Handlers', () => {
    it('calls onCreateCourse when New Course button is clicked', () => {
      const onCreateCourse = vi.fn()
      render(<MyCourses courses={mockCourses} onCreateCourse={onCreateCourse} />)

      fireEvent.click(screen.getByText('New Course'))
      expect(onCreateCourse).toHaveBeenCalledTimes(1)
    })

    it('calls onViewCourse when View Course is clicked', () => {
      const onViewCourse = vi.fn()
      render(<MyCourses courses={mockCourses} onViewCourse={onViewCourse} />)

      // Click on the first dropdown menu
      const dropdownTriggers = screen.getAllByRole('button', { name: '' })
      fireEvent.click(dropdownTriggers[0])

      // Click on View Course option
      fireEvent.click(screen.getByText('View Course'))
      expect(onViewCourse).toHaveBeenCalledWith(1)
    })

    it('calls onEditCourse when Edit Content is clicked', () => {
      const onEditCourse = vi.fn()
      render(<MyCourses courses={mockCourses} onEditCourse={onEditCourse} />)

      // Click on the first dropdown menu
      const dropdownTriggers = screen.getAllByRole('button', { name: '' })
      fireEvent.click(dropdownTriggers[0])

      // Click on Edit Content option
      fireEvent.click(screen.getByText('Edit Content'))
      expect(onEditCourse).toHaveBeenCalledWith(1)
    })

    it('calls onManageCourse when Manage Settings is clicked', () => {
      const onManageCourse = vi.fn()
      render(<MyCourses courses={mockCourses} onManageCourse={onManageCourse} />)

      // Click on the first dropdown menu
      const dropdownTriggers = screen.getAllByRole('button', { name: '' })
      fireEvent.click(dropdownTriggers[0])

      // Click on Manage Settings option
      fireEvent.click(screen.getByText('Manage Settings'))
      expect(onManageCourse).toHaveBeenCalledWith(1)
    })
  })

  describe('Loading State', () => {
    it('shows loading state when loading prop is true', () => {
      render(<MyCourses courses={[]} loading={true} />)

      // Should show loading skeletons
      const skeletons = document.querySelectorAll('[data-slot="skeleton"]')
      expect(skeletons.length).toBeGreaterThan(0)
    })
  })

  describe('Empty State', () => {
    it('shows empty message when no courses', () => {
      render(<MyCourses courses={[]} />)

      expect(screen.getByText('No courses found. Create your first course to get started.')).toBeInTheDocument()
    })

    it('shows filtered empty message when filter has no results', () => {
      render(<MyCourses courses={mockCourses} />)

      // Filter by published first, then by draft to get no results
      fireEvent.click(screen.getByText('Published'))
      fireEvent.click(screen.getByText('Draft'))

      expect(screen.getByText('No draft courses found.')).toBeInTheDocument()
    })
  })

  describe('Statistics Calculations', () => {
    it('calculates statistics correctly with empty courses', () => {
      render(<MyCourses courses={[]} />)

      expect(screen.getByText('0')).toBeInTheDocument() // Total courses
      expect(screen.getByText('0 published, 0 draft')).toBeInTheDocument()
      expect(screen.getByText('0%')).toBeInTheDocument() // Average completion
    })

    it('handles single course statistics', () => {
      const singleCourse = [mockCourses[0]]
      render(<MyCourses courses={singleCourse} />)

      expect(screen.getByText('1')).toBeInTheDocument() // Total courses
      expect(screen.getByText('1 published, 0 draft')).toBeInTheDocument()
      expect(screen.getByText('45')).toBeInTheDocument() // Total students
      expect(screen.getByText('82%')).toBeInTheDocument() // Average completion
    })
  })

  describe('Progress Bars', () => {
    it('renders progress bars for each course', () => {
      render(<MyCourses courses={mockCourses} />)

      // Should have progress bars for lesson completion
      const progressBars = document.querySelectorAll('[role="progressbar"]')
      expect(progressBars.length).toBe(mockCourses.length)
    })

    it('calculates progress percentages correctly', () => {
      render(<MyCourses courses={mockCourses} />)

      // First course: 10/12 lessons = 83.33%
      // Second course: 5/15 lessons = 33.33%
      // Third course: 20/20 lessons = 100%
      const progressBars = document.querySelectorAll('[role="progressbar"]')
      
      expect(progressBars[0]).toHaveAttribute('aria-valuenow', '83.33333333333334')
      expect(progressBars[1]).toHaveAttribute('aria-valuenow', '33.333333333333336')
      expect(progressBars[2]).toHaveAttribute('aria-valuenow', '100')
    })
  })
})