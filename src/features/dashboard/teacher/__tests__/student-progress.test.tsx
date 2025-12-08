import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { StudentProgress } from '../components/student-progress'
import type {
  StudentProgress as StudentProgressType,
  TeacherCourse,
} from '../types'

const mockCourses: TeacherCourse[] = [
  {
    id: 1,
    title: 'Introduction to React',
    description: 'Learn React fundamentals',
    status: 'published',
    enrollments: 45,
    completionRate: 82,
    totalLessons: 12,
    completedLessons: 10,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
    price: 99,
    duration: '8 weeks',
    academy: { id: 1, name: 'Tech Academy' },
  },
  {
    id: 2,
    title: 'Advanced JavaScript',
    description: 'Master JavaScript concepts',
    status: 'published',
    enrollments: 32,
    completionRate: 75,
    totalLessons: 15,
    completedLessons: 12,
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-02-05T00:00:00Z',
    price: 149,
    duration: '10 weeks',
    academy: { id: 1, name: 'Tech Academy' },
  },
]

const mockStudents: StudentProgressType[] = [
  {
    id: 1,
    student: {
      id: 101,
      name: 'Alice Johnson',
      email: 'alice@example.com',
      avatar: undefined,
    },
    course: { id: 1, title: 'Introduction to React' },
    progress: 85,
    completedLessons: 10,
    totalLessons: 12,
    lastActivity: '2024-02-09T14:30:00Z',
    enrolledAt: '2024-01-20T00:00:00Z',
    status: 'active',
  },
  {
    id: 2,
    student: {
      id: 102,
      name: 'Bob Smith',
      email: 'bob@example.com',
      avatar: undefined,
    },
    course: { id: 1, title: 'Introduction to React' },
    progress: 100,
    completedLessons: 12,
    totalLessons: 12,
    lastActivity: '2024-02-08T16:45:00Z',
    enrolledAt: '2024-01-18T00:00:00Z',
    completedAt: '2024-02-08T16:45:00Z',
    status: 'completed',
  },
  {
    id: 3,
    student: {
      id: 103,
      name: 'Carol Davis',
      email: 'carol@example.com',
      avatar: undefined,
    },
    course: { id: 2, title: 'Advanced JavaScript' },
    progress: 45,
    completedLessons: 7,
    totalLessons: 15,
    lastActivity: '2024-01-25T10:20:00Z', // Old activity - at risk
    enrolledAt: '2024-01-25T00:00:00Z',
    status: 'active',
  },
  {
    id: 4,
    student: {
      id: 104,
      name: 'David Wilson',
      email: 'david@example.com',
      avatar: undefined,
    },
    course: { id: 1, title: 'Introduction to React' },
    progress: 15,
    completedLessons: 2,
    totalLessons: 12,
    lastActivity: '2024-02-07T09:15:00Z',
    enrolledAt: '2024-02-01T00:00:00Z',
    status: 'dropped',
  },
]

describe('StudentProgress', () => {
  describe('Basic Rendering', () => {
    it('renders student statistics correctly', () => {
      render(<StudentProgress students={mockStudents} courses={mockCourses} />)

      expect(screen.getByText('Active Students')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument() // Alice and Carol are active

      expect(screen.getByText('Completed')).toBeInTheDocument()
      expect(screen.getByText('1')).toBeInTheDocument() // Bob completed

      expect(screen.getByText('Avg. Progress')).toBeInTheDocument()
      expect(screen.getByText('61%')).toBeInTheDocument() // (85 + 100 + 45 + 15) / 4

      expect(screen.getByText('At Risk')).toBeInTheDocument()
      expect(screen.getByText('1')).toBeInTheDocument() // Carol (old activity) or David (low progress)
    })

    it('renders student list with correct information', () => {
      render(<StudentProgress students={mockStudents} courses={mockCourses} />)

      expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
      expect(screen.getByText('alice@example.com')).toBeInTheDocument()
      expect(screen.getByText('Bob Smith')).toBeInTheDocument()
      expect(screen.getByText('Carol Davis')).toBeInTheDocument()
      expect(screen.getByText('David Wilson')).toBeInTheDocument()

      expect(screen.getByText('10/12 lessons')).toBeInTheDocument()
      expect(screen.getByText('12/12 lessons')).toBeInTheDocument()
      expect(screen.getByText('7/15 lessons')).toBeInTheDocument()
    })

    it('renders status badges correctly', () => {
      render(<StudentProgress students={mockStudents} courses={mockCourses} />)

      expect(screen.getAllByText('Active')).toHaveLength(2) // Alice and Carol
      expect(screen.getByText('Completed')).toBeInTheDocument() // Bob
      expect(screen.getByText('Dropped')).toBeInTheDocument() // David
    })

    it('renders progress bars for each student', () => {
      render(<StudentProgress students={mockStudents} courses={mockCourses} />)

      const progressBars = document.querySelectorAll('[role="progressbar"]')
      expect(progressBars.length).toBe(mockStudents.length)
    })
  })

  describe('Filtering', () => {
    it('filters students by course', () => {
      render(<StudentProgress students={mockStudents} courses={mockCourses} />)

      // Select "Introduction to React" course
      fireEvent.click(screen.getByRole('combobox'))
      fireEvent.click(screen.getByText('Introduction to React'))

      // Should show Alice, Bob, and David (all in React course)
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
      expect(screen.getByText('Bob Smith')).toBeInTheDocument()
      expect(screen.getByText('David Wilson')).toBeInTheDocument()

      // Should not show Carol (in JavaScript course)
      expect(screen.queryByText('Carol Davis')).not.toBeInTheDocument()
    })

    it('filters students by status', () => {
      render(<StudentProgress students={mockStudents} courses={mockCourses} />)

      // Click on Completed filter
      fireEvent.click(screen.getByText('Completed'))

      // Should only show Bob
      expect(screen.getByText('Bob Smith')).toBeInTheDocument()
      expect(screen.queryByText('Alice Johnson')).not.toBeInTheDocument()
      expect(screen.queryByText('Carol Davis')).not.toBeInTheDocument()
      expect(screen.queryByText('David Wilson')).not.toBeInTheDocument()
    })

    it('shows filter badges with correct counts', () => {
      render(<StudentProgress students={mockStudents} courses={mockCourses} />)

      const activeButton = screen.getByText('Active').closest('button')
      expect(activeButton).toContainHTML('2') // Alice and Carol

      const completedButton = screen.getByText('Completed').closest('button')
      expect(completedButton).toContainHTML('1') // Bob

      const droppedButton = screen.getByText('Dropped').closest('button')
      expect(droppedButton).toContainHTML('1') // David
    })

    it('combines course and status filters', () => {
      render(<StudentProgress students={mockStudents} courses={mockCourses} />)

      // Select React course
      fireEvent.click(screen.getByRole('combobox'))
      fireEvent.click(screen.getByText('Introduction to React'))

      // Then filter by active status
      fireEvent.click(screen.getByText('Active'))

      // Should only show Alice (active in React course)
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
      expect(screen.queryByText('Bob Smith')).not.toBeInTheDocument() // Completed, not active
      expect(screen.queryByText('Carol Davis')).not.toBeInTheDocument() // Different course
      expect(screen.queryByText('David Wilson')).not.toBeInTheDocument() // Dropped, not active
    })
  })

  describe('Event Handlers', () => {
    it('calls onViewProgress when View Progress is clicked', () => {
      const onViewProgress = vi.fn()
      render(
        <StudentProgress
          students={mockStudents}
          courses={mockCourses}
          onViewProgress={onViewProgress}
        />
      )

      // Click on the first dropdown menu
      const dropdownTriggers = screen.getAllByRole('button', { name: '' })
      fireEvent.click(dropdownTriggers[0])

      // Click on View Progress option
      fireEvent.click(screen.getByText('View Progress'))
      expect(onViewProgress).toHaveBeenCalledWith(101, 1) // studentId, courseId
    })

    it('calls onViewStudent when View Profile is clicked', () => {
      const onViewStudent = vi.fn()
      render(
        <StudentProgress
          students={mockStudents}
          courses={mockCourses}
          onViewStudent={onViewStudent}
        />
      )

      // Click on the first dropdown menu
      const dropdownTriggers = screen.getAllByRole('button', { name: '' })
      fireEvent.click(dropdownTriggers[0])

      // Click on View Profile option
      fireEvent.click(screen.getByText('View Profile'))
      expect(onViewStudent).toHaveBeenCalledWith(101)
    })

    it('calls onMessageStudent when Send Message is clicked', () => {
      const onMessageStudent = vi.fn()
      render(
        <StudentProgress
          students={mockStudents}
          courses={mockCourses}
          onMessageStudent={onMessageStudent}
        />
      )

      // Click on the first dropdown menu
      const dropdownTriggers = screen.getAllByRole('button', { name: '' })
      fireEvent.click(dropdownTriggers[0])

      // Click on Send Message option
      fireEvent.click(screen.getByText('Send Message'))
      expect(onMessageStudent).toHaveBeenCalledWith(101)
    })
  })

  describe('Loading State', () => {
    it('shows loading state when loading prop is true', () => {
      render(<StudentProgress students={[]} courses={[]} loading={true} />)

      const skeletons = document.querySelectorAll('[data-slot="skeleton"]')
      expect(skeletons.length).toBeGreaterThan(0)
    })
  })

  describe('Empty State', () => {
    it('shows empty message when no students', () => {
      render(<StudentProgress students={[]} courses={mockCourses} />)

      expect(
        screen.getByText('No students enrolled in your courses yet.')
      ).toBeInTheDocument()
    })

    it('shows filtered empty message when filters have no results', () => {
      render(<StudentProgress students={mockStudents} courses={mockCourses} />)

      // Filter by a course that has no students
      fireEvent.click(screen.getByRole('combobox'))
      fireEvent.click(screen.getByText('Advanced JavaScript'))

      // Then filter by completed status (Carol is active, not completed)
      fireEvent.click(screen.getByText('Completed'))

      expect(
        screen.getByText('No students match the selected filters.')
      ).toBeInTheDocument()
    })
  })

  describe('Statistics Calculations', () => {
    it('calculates statistics correctly with empty students', () => {
      render(<StudentProgress students={[]} courses={mockCourses} />)

      expect(screen.getByText('0')).toBeInTheDocument() // Active students
      expect(screen.getByText('0%')).toBeInTheDocument() // Average progress
    })

    it('handles at-risk student calculation', () => {
      // Create students with old activity and low progress
      const atRiskStudents: StudentProgressType[] = [
        {
          ...mockStudents[0],
          lastActivity: '2024-01-01T00:00:00Z', // Very old activity
          progress: 10, // Low progress
        },
        {
          ...mockStudents[1],
          lastActivity: '2024-01-01T00:00:00Z', // Very old activity
          progress: 50,
          status: 'active',
        },
      ]

      render(
        <StudentProgress students={atRiskStudents} courses={mockCourses} />
      )

      // Both students should be at risk (old activity or low progress)
      expect(screen.getByText('At Risk')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
    })
  })

  describe('Time Formatting', () => {
    it('formats recent activity correctly', () => {
      const recentStudent: StudentProgressType = {
        ...mockStudents[0],
        lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      }

      render(
        <StudentProgress students={[recentStudent]} courses={mockCourses} />
      )

      expect(screen.getByText('Last active 2h ago')).toBeInTheDocument()
    })

    it('formats old activity correctly', () => {
      const oldStudent: StudentProgressType = {
        ...mockStudents[0],
        lastActivity: new Date(
          Date.now() - 10 * 24 * 60 * 60 * 1000
        ).toISOString(), // 10 days ago
      }

      render(<StudentProgress students={[oldStudent]} courses={mockCourses} />)

      // Should show date instead of relative time for old activity
      const lastActivityText = screen.getByText(/Last active/)
      expect(lastActivityText).toBeInTheDocument()
    })
  })

  describe('Avatars', () => {
    it('renders student avatars with fallback initials', () => {
      render(<StudentProgress students={mockStudents} courses={mockCourses} />)

      // Should have avatars for each student
      const avatars = document.querySelectorAll('[data-slot="avatar"]')
      expect(avatars.length).toBe(mockStudents.length)

      // Check fallback initials
      expect(screen.getByText('AJ')).toBeInTheDocument() // Alice Johnson
      expect(screen.getByText('BS')).toBeInTheDocument() // Bob Smith
      expect(screen.getByText('CD')).toBeInTheDocument() // Carol Davis
      expect(screen.getByText('DW')).toBeInTheDocument() // David Wilson
    })
  })

  describe('Completion Status', () => {
    it('shows completion badge for completed students', () => {
      render(<StudentProgress students={mockStudents} courses={mockCourses} />)

      // Bob is completed, should show completion badge
      const completedSection = screen.getByText('Bob Smith').closest('div')
      expect(completedSection).toContainElement(screen.getByText('Completed'))
    })

    it('shows progress percentage for active students', () => {
      render(<StudentProgress students={mockStudents} courses={mockCourses} />)

      // Alice is active, should show progress percentage
      expect(screen.getByText('85%')).toBeInTheDocument()
      expect(screen.getByText('2 remaining')).toBeInTheDocument() // 12 - 10 lessons
    })
  })
})
