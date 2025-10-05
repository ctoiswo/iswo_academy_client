import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { LearningProgress } from '../learning-progress'
import type { LearningProgress as LearningProgressType, StudentStats } from '../../types'

const mockProgressData: LearningProgressType[] = [
  {
    course_id: 1,
    course_title: 'Introduction to React',
    progress_percentage: 75,
    completed_lessons: 15,
    total_lessons: 20,
    last_accessed: '2024-03-08T10:00:00Z',
    estimated_completion: '2024-03-15T10:00:00Z'
  },
  {
    course_id: 2,
    course_title: 'Advanced TypeScript',
    progress_percentage: 45,
    completed_lessons: 9,
    total_lessons: 20,
    last_accessed: '2024-03-07T10:00:00Z',
    estimated_completion: '2024-03-25T10:00:00Z'
  }
]

const mockStats: StudentStats = {
  total_enrollments: 5,
  completed_courses: 2,
  certificates_earned: 2,
  study_streak_days: 7,
  total_study_hours: 24,
  average_progress: 68
}

describe('LearningProgress', () => {
  it('renders loading state correctly', () => {
    render(<LearningProgress progressData={[]} stats={mockStats} loading={true} />)
    
    // Loading skeleton should be present
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('renders progress overview cards correctly', () => {
    render(<LearningProgress progressData={mockProgressData} stats={mockStats} />)
    
    // Check stats cards
    expect(screen.getByText('Average Progress')).toBeInTheDocument()
    expect(screen.getByText('68%')).toBeInTheDocument()
    
    expect(screen.getByText('Study Hours')).toBeInTheDocument()
    expect(screen.getByText('24h')).toBeInTheDocument()
    
    expect(screen.getByText('Study Streak')).toBeInTheDocument()
    expect(screen.getByText('7')).toBeInTheDocument()
    
    expect(screen.getByText('Active Courses')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument() // total_enrollments - completed_courses
  })

  it('renders chart widgets correctly', () => {
    render(<LearningProgress progressData={mockProgressData} stats={mockStats} />)
    
    expect(screen.getByText('Course Progress')).toBeInTheDocument()
    expect(screen.getByText('Progress across your enrolled courses')).toBeInTheDocument()
    
    expect(screen.getByText('Weekly Study Hours')).toBeInTheDocument()
    expect(screen.getByText('Your study time over the past week')).toBeInTheDocument()
  })

  it('renders detailed progress list correctly', () => {
    render(<LearningProgress progressData={mockProgressData} stats={mockStats} />)
    
    expect(screen.getByText('Course Progress Details')).toBeInTheDocument()
    expect(screen.getByText('Detailed breakdown of your learning progress')).toBeInTheDocument()
    
    // Check course titles
    expect(screen.getByText('Introduction to React')).toBeInTheDocument()
    expect(screen.getByText('Advanced TypeScript')).toBeInTheDocument()
    
    // Check progress percentages
    expect(screen.getByText('75% complete')).toBeInTheDocument()
    expect(screen.getByText('45% complete')).toBeInTheDocument()
    
    // Check lesson counts
    expect(screen.getByText('15 of 20 lessons completed')).toBeInTheDocument()
    expect(screen.getByText('9 of 20 lessons completed')).toBeInTheDocument()
  })

  it('displays last accessed dates correctly', () => {
    render(<LearningProgress progressData={mockProgressData} stats={mockStats} />)
    
    expect(screen.getAllByText(/Last accessed:/)).toHaveLength(2)
  })

  it('displays estimated completion dates when available', () => {
    render(<LearningProgress progressData={mockProgressData} stats={mockStats} />)
    
    expect(screen.getAllByText(/Estimated completion:/)).toHaveLength(2)
  })

  it('renders empty state when no progress data', () => {
    render(<LearningProgress progressData={[]} stats={mockStats} />)
    
    // Should render the stats cards even with no progress data
    expect(screen.getByText('Average Progress')).toBeInTheDocument()
    expect(screen.getByText('No progress data available')).toBeInTheDocument()
  })

  it('calculates active courses correctly', () => {
    const statsWithDifferentValues: StudentStats = {
      total_enrollments: 10,
      completed_courses: 3,
      certificates_earned: 2,
      study_streak_days: 5,
      total_study_hours: 30,
      average_progress: 55
    }
    
    render(<LearningProgress progressData={mockProgressData} stats={statsWithDifferentValues} />)
    
    // Should show 7 active courses (10 total - 3 completed)
    expect(screen.getByText('7')).toBeInTheDocument()
  })

  it('displays trend indicators correctly', () => {
    render(<LearningProgress progressData={mockProgressData} stats={mockStats} />)
    
    // Check for trend indicator
    expect(screen.getByText('+5% this week')).toBeInTheDocument()
  })

  it('handles zero values gracefully', () => {
    const zeroStats: StudentStats = {
      total_enrollments: 0,
      completed_courses: 0,
      certificates_earned: 0,
      study_streak_days: 0,
      total_study_hours: 0,
      average_progress: 0
    }
    
    render(<LearningProgress progressData={[]} stats={zeroStats} />)
    
    expect(screen.getByText('0%')).toBeInTheDocument()
    expect(screen.getByText('0h')).toBeInTheDocument()
    // Check for multiple zeros (there will be several)
    expect(screen.getAllByText('0')).toHaveLength(2) // study streak and active courses
  })

  it('truncates long course titles in chart data', () => {
    const longTitleProgress: LearningProgressType[] = [
      {
        course_id: 1,
        course_title: 'This is a very long course title that should be truncated',
        progress_percentage: 50,
        completed_lessons: 10,
        total_lessons: 20,
        last_accessed: '2024-03-08T10:00:00Z',
        estimated_completion: '2024-03-15T10:00:00Z'
      }
    ]
    
    render(<LearningProgress progressData={longTitleProgress} stats={mockStats} />)
    
    // The full title should still be visible in the detailed list
    expect(screen.getByText('This is a very long course title that should be truncated')).toBeInTheDocument()
  })
})