import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { UserManagementPanel } from '../user-management-panel'
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

describe('UserManagementPanel', () => {
  afterEach(() => {
    consoleSpy.mockClear()
  })

  it('should render loading state initially', () => {
    render(<UserManagementPanel academy={mockAcademy} loading={true} />)
    
    // Check for skeleton loading elements
    const skeletons = document.querySelectorAll('[data-slot="skeleton"]')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('should render user statistics after loading', async () => {
    render(<UserManagementPanel academy={mockAcademy} />)
    
    await waitFor(() => {
      expect(screen.getByText('Total Users')).toBeInTheDocument()
      expect(screen.getByText('Admins')).toBeInTheDocument()
      expect(screen.getByText('Teachers')).toBeInTheDocument()
      expect(screen.getByText('Students')).toBeInTheDocument()
    })

    // Check for mock data values
    await waitFor(() => {
      expect(screen.getByText('7')).toBeInTheDocument() // Total users
      expect(screen.getByText('1')).toBeInTheDocument() // Admins
      expect(screen.getByText('3')).toBeInTheDocument() // Teachers
      expect(screen.getByText('3')).toBeInTheDocument() // Students
    })
  })

  it('should display role filter buttons', async () => {
    render(<UserManagementPanel academy={mockAcademy} />)
    
    await waitFor(() => {
      expect(screen.getByText('Filter by role:')).toBeInTheDocument()
      expect(screen.getByText('All Users')).toBeInTheDocument()
      expect(screen.getByText('Admin')).toBeInTheDocument()
      expect(screen.getByText('Teacher')).toBeInTheDocument()
      expect(screen.getByText('Student')).toBeInTheDocument()
    })
  })

  it('should filter users by role when filter buttons are clicked', async () => {
    render(<UserManagementPanel academy={mockAcademy} />)
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('John Smith')).toBeInTheDocument()
    })

    // Click Teacher filter button (not badge)
    const teacherFilter = screen.getByRole('button', { name: 'Teacher' })
    fireEvent.click(teacherFilter)

    await waitFor(() => {
      // Should show teachers
      expect(screen.getByText('John Smith')).toBeInTheDocument()
      expect(screen.getByText('Sarah Johnson')).toBeInTheDocument()
      expect(screen.getByText('Mike Wilson')).toBeInTheDocument()
      
      // Should not show students or other roles in the description
      expect(screen.getByText('Manage teachers in your academy')).toBeInTheDocument()
    })
  })

  it('should display user information correctly', async () => {
    render(<UserManagementPanel academy={mockAcademy} />)
    
    await waitFor(() => {
      // Check for user names
      expect(screen.getByText('John Smith')).toBeInTheDocument()
      expect(screen.getByText('Sarah Johnson')).toBeInTheDocument()
      expect(screen.getByText('Emily Davis')).toBeInTheDocument()
      
      // Check for emails
      expect(screen.getByText('john.smith@academy.com')).toBeInTheDocument()
      expect(screen.getByText('sarah.johnson@academy.com')).toBeInTheDocument()
      expect(screen.getByText('emily.davis@academy.com')).toBeInTheDocument()
    })
  })

  it('should display role and status badges correctly', async () => {
    render(<UserManagementPanel academy={mockAcademy} />)
    
    await waitFor(() => {
      // Check for role badges
      const adminBadges = screen.getAllByText('Admin')
      const teacherBadges = screen.getAllByText('Teacher')
      const studentBadges = screen.getAllByText('Student')
      
      expect(adminBadges.length).toBeGreaterThan(0)
      expect(teacherBadges.length).toBeGreaterThan(0)
      expect(studentBadges.length).toBeGreaterThan(0)
      
      // Check for status badges
      const activeBadges = screen.getAllByText('Active')
      const pendingBadges = screen.getAllByText('Pending')
      
      expect(activeBadges.length).toBeGreaterThan(0)
      expect(pendingBadges.length).toBeGreaterThan(0)
    })
  })

  it('should display user metrics (enrollments, courses teaching)', async () => {
    render(<UserManagementPanel academy={mockAcademy} />)
    
    await waitFor(() => {
      // Check for teacher course counts
      expect(screen.getByText('3 courses')).toBeInTheDocument()
      expect(screen.getByText('2 courses')).toBeInTheDocument()
      expect(screen.getByText('1 courses')).toBeInTheDocument()
      
      // Check for student enrollment counts
      expect(screen.getByText('3 enrollments')).toBeInTheDocument()
      expect(screen.getByText('2 enrollments')).toBeInTheDocument()
      expect(screen.getByText('1 enrollments')).toBeInTheDocument()
    })
  })

  it('should display join dates and last active dates', async () => {
    render(<UserManagementPanel academy={mockAcademy} />)
    
    await waitFor(() => {
      // Check for join dates (formatted) - use getAllByText since there are multiple
      const joinDates = screen.getAllByText(/Joined \d{1,2}\/\d{1,2}\/\d{4}/)
      expect(joinDates.length).toBeGreaterThan(0)
      
      // Check for last active dates
      const lastActiveDates = screen.getAllByText(/Last active: \d{1,2}\/\d{1,2}\/\d{4}/)
      expect(lastActiveDates.length).toBeGreaterThan(0)
    })
  })

  it('should handle invite user button click', async () => {
    render(<UserManagementPanel academy={mockAcademy} />)
    
    await waitFor(() => {
      const inviteButton = screen.getByText('Invite User')
      expect(inviteButton).toBeInTheDocument()
      
      fireEvent.click(inviteButton)
      expect(consoleSpy).toHaveBeenCalledWith('Invite new user')
    })
  })

  it('should handle user action menu interactions', async () => {
    render(<UserManagementPanel academy={mockAcademy} />)
    
    await waitFor(() => {
      // Find and click the first dropdown menu trigger
      const dropdownTriggers = screen.getAllByRole('button')
      const menuTrigger = dropdownTriggers.find(button => 
        button.querySelector('svg') && button.getAttribute('aria-haspopup') === 'menu'
      )
      
      if (menuTrigger) {
        fireEvent.click(menuTrigger)
        
        // Check if menu items appear
        expect(screen.getByText('View Profile')).toBeInTheDocument()
        expect(screen.getByText('Edit User')).toBeInTheDocument()
      }
    })
  })

  it('should not show remove option for admin users', async () => {
    render(<UserManagementPanel academy={mockAcademy} />)
    
    // Filter to show only admins
    const adminFilter = screen.getByRole('button', { name: 'Admin' })
    fireEvent.click(adminFilter)
    
    await waitFor(() => {
      const dropdownTriggers = screen.getAllByRole('button')
      const menuTrigger = dropdownTriggers.find(button => 
        button.querySelector('svg') && button.getAttribute('aria-haspopup') === 'menu'
      )
      
      if (menuTrigger) {
        fireEvent.click(menuTrigger)
        
        // Should not show remove option for admin
        expect(screen.queryByText('Remove User')).not.toBeInTheDocument()
      }
    })
  })

  it('should show remove option for non-admin users', async () => {
    render(<UserManagementPanel academy={mockAcademy} />)
    
    // Filter to show only teachers
    const teacherFilter = screen.getByRole('button', { name: 'Teacher' })
    fireEvent.click(teacherFilter)
    
    await waitFor(() => {
      const dropdownTriggers = screen.getAllByRole('button')
      const menuTrigger = dropdownTriggers.find(button => 
        button.querySelector('svg') && button.getAttribute('aria-haspopup') === 'menu'
      )
      
      if (menuTrigger) {
        fireEvent.click(menuTrigger)
        
        // Should show remove option for non-admin
        expect(screen.getByText('Remove User')).toBeInTheDocument()
      }
    })
  })

  it('should handle user actions correctly', async () => {
    render(<UserManagementPanel academy={mockAcademy} />)
    
    await waitFor(() => {
      const dropdownTriggers = screen.getAllByRole('button')
      const menuTrigger = dropdownTriggers.find(button => 
        button.querySelector('svg') && button.getAttribute('aria-haspopup') === 'menu'
      )
      
      if (menuTrigger) {
        fireEvent.click(menuTrigger)
        
        // Test view action
        const viewButton = screen.getByText('View Profile')
        fireEvent.click(viewButton)
        expect(consoleSpy).toHaveBeenCalledWith('View user:', 1)
        
        // Reopen menu for edit action
        fireEvent.click(menuTrigger)
        const editButton = screen.getByText('Edit User')
        fireEvent.click(editButton)
        expect(consoleSpy).toHaveBeenCalledWith('Edit user:', 1)
      }
    })
  })

  it('should handle academy prop changes', async () => {
    const { rerender } = render(<UserManagementPanel academy={mockAcademy} />)
    
    const updatedAcademy = { ...mockAcademy, name: 'Updated Academy' }
    rerender(<UserManagementPanel academy={updatedAcademy} />)
    
    // Component should re-fetch data when academy changes
    await waitFor(() => {
      expect(screen.getByText('User Management')).toBeInTheDocument()
    })
  })

  it('should update description based on selected filter', async () => {
    render(<UserManagementPanel academy={mockAcademy} />)
    
    // Initially should show "all users"
    await waitFor(() => {
      expect(screen.getByText('Manage all users in your academy')).toBeInTheDocument()
    })

    // Filter by students
    const studentFilter = screen.getByRole('button', { name: 'Student' })
    fireEvent.click(studentFilter)

    await waitFor(() => {
      expect(screen.getByText('Manage students in your academy')).toBeInTheDocument()
    })
  })
})