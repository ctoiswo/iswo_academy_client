import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { CourseManagementPanel } from '../course-management-panel'
import type { AcademyMembership } from '@/stores/auth-store'

// Mock the academy membership
const mockAcademy: AcademyMembership = {
  id: 1,
  name: 'Test Academy',
  user_role: 'admin',
  permissions: ['manage_users', 'manage_courses'],
  academy: {
    id: 1,
    name: 'Test Academy',
    description: 'A test academy',
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  }
}

// Mock console.log to avoid test output noise
const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

describe('CourseManagementPanel', () => {
  afterEach(() => {
    consoleSpy.mockClear()
  })

  it('should render loading state initially', () => {
    render(<CourseManagementPanel academy={mockAcademy} loading={true} />)
    
    // Check for skeleton loading elements
    const skeletons = document.querySelectorAll('[data-slot="skeleton"]')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('should render course statistics after loading', async () => {
    render(<CourseManagementPanel academy={mockAcademy} />)
    
    await waitFor(() => {
      expect(screen.getByText('Total Courses')).toBeInTheDocument()
      expect(screen.getByText('Published')).toBeInTheDocument()
      expect(screen.getByText('In Draft')).toBeInTheDocument()
    })

    // Check for mock data values
    await waitFor(() => {
      expect(screen.getByText('4')).toBeInTheDocument() // Total courses
      expect(screen.getByText('3')).toBeInTheDocument() // Published courses
      expect(screen.getByText('1')).toBeInTheDocument() // Draft courses
    })
  })

  it('should display course list with correct information', async () => {
    render(<CourseManagementPanel academy={mockAcademy} />)
    
    await waitFor(() => {
      expect(screen.getByText('Course Management')).toBeInTheDocument()
      expect(screen.getByText('Manage all courses in your academy')).toBeInTheDocument()
    })

    // Check for course titles
    await waitFor(() => {
      expect(screen.getByText('Advanced React Development')).toBeInTheDocument()
      expect(screen.getByText('Python for Data Science')).toBeInTheDocument()
      expect(screen.getByText('Digital Marketing Fundamentals')).toBeInTheDocument()
      expect(screen.getByText('UI/UX Design Principles')).toBeInTheDocument()
    })
  })

  it('should display course status badges correctly', async () => {
    render(<CourseManagementPanel academy={mockAcademy} />)
    
    await waitFor(() => {
      // Check for status badges
      const publishedBadges = screen.getAllByText('Published')
      const draftBadges = screen.getAllByText('Draft')
      
      expect(publishedBadges.length).toBeGreaterThan(0)
      expect(draftBadges.length).toBeGreaterThan(0)
    })
  })

  it('should display course metrics (students, revenue, duration)', async () => {
    render(<CourseManagementPanel academy={mockAcademy} />)
    
    await waitFor(() => {
      // Check for student counts
      expect(screen.getByText('89 students')).toBeInTheDocument()
      expect(screen.getByText('76 students')).toBeInTheDocument()
      
      // Check for revenue
      expect(screen.getByText('$8,900')).toBeInTheDocument()
      expect(screen.getByText('$7,600')).toBeInTheDocument()
      
      // Check for duration
      expect(screen.getByText('8 weeks')).toBeInTheDocument()
      expect(screen.getByText('10 weeks')).toBeInTheDocument()
    })
  })

  it('should display teacher information', async () => {
    render(<CourseManagementPanel academy={mockAcademy} />)
    
    await waitFor(() => {
      expect(screen.getByText('Teacher: John Smith')).toBeInTheDocument()
      expect(screen.getByText('Teacher: Sarah Johnson')).toBeInTheDocument()
      expect(screen.getByText('Teacher: Mike Wilson')).toBeInTheDocument()
      expect(screen.getByText('Teacher: Emily Davis')).toBeInTheDocument()
    })
  })

  it('should handle create course button click', async () => {
    render(<CourseManagementPanel academy={mockAcademy} />)
    
    await waitFor(() => {
      const createButton = screen.getByText('New Course')
      expect(createButton).toBeInTheDocument()
      
      fireEvent.click(createButton)
      expect(consoleSpy).toHaveBeenCalledWith('Create new course')
    })
  })

  it('should handle course action menu interactions', async () => {
    render(<CourseManagementPanel academy={mockAcademy} />)
    
    await waitFor(() => {
      // Find and click the first dropdown menu trigger
      const dropdownTriggers = screen.getAllByRole('button')
      const menuTrigger = dropdownTriggers.find(button => 
        button.querySelector('svg') // Looking for the MoreHorizontal icon
      )
      
      if (menuTrigger) {
        fireEvent.click(menuTrigger)
        
        // Check if menu items appear
        expect(screen.getByText('View Details')).toBeInTheDocument()
        expect(screen.getByText('Edit Course')).toBeInTheDocument()
        expect(screen.getByText('Delete Course')).toBeInTheDocument()
      }
    })
  })

  it('should handle view course action', async () => {
    render(<CourseManagementPanel academy={mockAcademy} />)
    
    await waitFor(() => {
      const dropdownTriggers = screen.getAllByRole('button')
      const menuTrigger = dropdownTriggers.find(button => 
        button.querySelector('svg')
      )
      
      if (menuTrigger) {
        fireEvent.click(menuTrigger)
        
        const viewButton = screen.getByText('View Details')
        fireEvent.click(viewButton)
        
        expect(consoleSpy).toHaveBeenCalledWith('View course:', 1)
      }
    })
  })

  it('should handle edit course action', async () => {
    render(<CourseManagementPanel academy={mockAcademy} />)
    
    await waitFor(() => {
      const dropdownTriggers = screen.getAllByRole('button')
      const menuTrigger = dropdownTriggers.find(button => 
        button.querySelector('svg')
      )
      
      if (menuTrigger) {
        fireEvent.click(menuTrigger)
        
        const editButton = screen.getByText('Edit Course')
        fireEvent.click(editButton)
        
        expect(consoleSpy).toHaveBeenCalledWith('Edit course:', 1)
      }
    })
  })

  it('should handle delete course action', async () => {
    render(<CourseManagementPanel academy={mockAcademy} />)
    
    await waitFor(() => {
      const dropdownTriggers = screen.getAllByRole('button')
      const menuTrigger = dropdownTriggers.find(button => 
        button.querySelector('svg')
      )
      
      if (menuTrigger) {
        fireEvent.click(menuTrigger)
        
        const deleteButton = screen.getByText('Delete Course')
        fireEvent.click(deleteButton)
        
        expect(consoleSpy).toHaveBeenCalledWith('Delete course:', 1)
      }
    })
  })

  it('should display course prices correctly', async () => {
    render(<CourseManagementPanel academy={mockAcademy} />)
    
    await waitFor(() => {
      expect(screen.getByText('$199')).toBeInTheDocument()
      expect(screen.getByText('$149')).toBeInTheDocument()
      expect(screen.getByText('$99')).toBeInTheDocument()
      expect(screen.getByText('$179')).toBeInTheDocument()
    })
  })

  it('should handle academy prop changes', async () => {
    const { rerender } = render(<CourseManagementPanel academy={mockAcademy} />)
    
    const updatedAcademy = { ...mockAcademy, name: 'Updated Academy' }
    rerender(<CourseManagementPanel academy={updatedAcademy} />)
    
    // Component should re-fetch data when academy changes
    await waitFor(() => {
      expect(screen.getByText('Course Management')).toBeInTheDocument()
    })
  })
})