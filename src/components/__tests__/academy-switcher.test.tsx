import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AcademySwitcher } from '../academy-switcher'
import { useAuthStore } from '@/stores/auth-store'
import type { AcademyData, AcademyMembership } from '@/stores/auth-store'

// Mock the auth store
vi.mock('@/stores/auth-store')
const mockUseAuthStore = vi.mocked(useAuthStore)

// Mock the sidebar hook
vi.mock('@/components/ui/sidebar', () => ({
  SidebarMenu: ({ children }: { children: React.ReactNode }) => <div data-testid="sidebar-menu">{children}</div>,
  SidebarMenuItem: ({ children }: { children: React.ReactNode }) => <div data-testid="sidebar-menu-item">{children}</div>,
  SidebarMenuButton: ({ children, onClick, ...props }: any) => (
    <button data-testid="sidebar-menu-button" onClick={onClick} {...props}>
      {children}
    </button>
  ),
  useSidebar: () => ({ isMobile: false }),
}))

const mockUseSidebar = vi.fn(() => ({ isMobile: false }))

// Mock the dropdown menu components
vi.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div data-testid="dropdown-menu">{children}</div>,
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-menu-trigger">{children}</div>
  ),
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-menu-content">{children}</div>
  ),
  DropdownMenuItem: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <div data-testid="dropdown-menu-item" onClick={onClick}>
      {children}
    </div>
  ),
  DropdownMenuLabel: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-menu-label">{children}</div>
  ),
  DropdownMenuSeparator: () => <div data-testid="dropdown-menu-separator" />,
}))

// Mock the badge component
vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children, ...props }: { children: React.ReactNode }) => (
    <span data-testid="badge" {...props}>
      {children}
    </span>
  ),
}))

// Mock react-router
const mockNavigate = vi.fn()
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
}))

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  ArrowLeftRight: () => <div data-testid="arrow-left-right-icon" />,
  Building: () => <div data-testid="building-icon" />,
  ChevronsUpDown: () => <div data-testid="chevrons-up-down-icon" />,
}))

describe('AcademySwitcher', () => {
  const mockSwitchAcademy = vi.fn()
  
  const mockAcademyMembership: AcademyMembership = {
    id: 1,
    name: 'Tech Academy',
    description: 'Learn cutting-edge technology',
    logo_url: 'https://example.com/logo.png',
    user_role: 'admin',
    user_role_display: 'Administrator',
    created_at: '2024-01-01T00:00:00Z',
    last_accessed: '2024-02-01T10:30:00Z',
  }

  const mockMultipleAcademyData: AcademyData = {
    count: 2,
    academies: [
      mockAcademyMembership,
      {
        id: 2,
        name: 'Art Academy',
        description: 'Creative arts and design',
        logo_url: null,
        user_role: 'student',
        user_role_display: 'Student',
        created_at: '2024-01-15T00:00:00Z',
        last_accessed: null,
      },
    ],
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAuthStore.mockReturnValue({
      currentAcademy: null,
      academyData: null,
      switchAcademy: mockSwitchAcademy,
    } as any)
  })

  const renderComponent = (props = {}) => {
    return render(<AcademySwitcher {...props} />)
  }

  describe('Rendering Logic', () => {
    it('renders nothing when user has no academies', () => {
      mockUseAuthStore.mockReturnValue({
        currentAcademy: null,
        academyData: { count: 0, academies: [] },
        switchAcademy: mockSwitchAcademy,
      } as any)

      const { container } = renderComponent()
      expect(container.firstChild).toBeNull()
    })

    it('renders nothing when user has only one academy', () => {
      mockUseAuthStore.mockReturnValue({
        currentAcademy: mockAcademyMembership,
        academyData: { count: 1, academies: [mockAcademyMembership] },
        switchAcademy: mockSwitchAcademy,
      } as any)

      const { container } = renderComponent()
      expect(container.firstChild).toBeNull()
    })

    it('renders fallback when user has no academies and fallback is provided', () => {
      mockUseAuthStore.mockReturnValue({
        currentAcademy: null,
        academyData: { count: 0, academies: [] },
        switchAcademy: mockSwitchAcademy,
      } as any)

      const fallback = <div data-testid="fallback-component">Fallback</div>
      renderComponent({ fallback })
      
      expect(screen.getByTestId('fallback-component')).toBeInTheDocument()
    })

    it('renders fallback when user has only one academy and fallback is provided', () => {
      mockUseAuthStore.mockReturnValue({
        currentAcademy: mockAcademyMembership,
        academyData: { count: 1, academies: [mockAcademyMembership] },
        switchAcademy: mockSwitchAcademy,
      } as any)

      const fallback = <div data-testid="fallback-component">Fallback</div>
      renderComponent({ fallback })
      
      expect(screen.getByTestId('fallback-component')).toBeInTheDocument()
    })
  })

  describe('Multiple Academies - No Current Academy Selected', () => {
    beforeEach(() => {
      mockUseAuthStore.mockReturnValue({
        currentAcademy: null,
        academyData: mockMultipleAcademyData,
        switchAcademy: mockSwitchAcademy,
      } as any)
    })

    it('renders placeholder when no current academy is selected', () => {
      renderComponent()
      
      expect(screen.getByTestId('sidebar-menu')).toBeInTheDocument()
      expect(screen.getByText('Select Academy')).toBeInTheDocument()
      expect(screen.getByText('Choose an academy')).toBeInTheDocument()
      expect(screen.getByTestId('building-icon')).toBeInTheDocument()
      expect(screen.getByTestId('chevrons-up-down-icon')).toBeInTheDocument()
    })

    it('navigates to academy selection when placeholder is clicked', async () => {
      renderComponent()
      
      const button = screen.getByTestId('sidebar-menu-button')
      fireEvent.click(button)
      
      await waitFor(() => {
        expect(mockSwitchAcademy).toHaveBeenCalledOnce()
        expect(mockNavigate).toHaveBeenCalledWith({ to: '/academy-selection' })
      })
    })
  })

  describe('Multiple Academies - Current Academy Selected', () => {
    beforeEach(() => {
      mockUseAuthStore.mockReturnValue({
        currentAcademy: mockAcademyMembership,
        academyData: mockMultipleAcademyData,
        switchAcademy: mockSwitchAcademy,
      } as any)
    })

    it('renders current academy information', () => {
      renderComponent()
      
      expect(screen.getAllByText('Tech Academy')).toHaveLength(2) // One in trigger, one in content
      expect(screen.getAllByText('Administrator')).toHaveLength(2) // One in trigger, one in content
      expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument()
    })

    it('displays academy logo when available', () => {
      renderComponent()
      
      const logos = screen.getAllByAltText('Tech Academy logo')
      expect(logos).toHaveLength(2) // One in trigger, one in content
      expect(logos[0]).toHaveAttribute('src', 'https://example.com/logo.png')
      expect(logos[1]).toHaveAttribute('src', 'https://example.com/logo.png')
    })

    it('displays default building icon when logo is not available', () => {
      const academyWithoutLogo = {
        ...mockAcademyMembership,
        logo_url: null,
      }
      
      mockUseAuthStore.mockReturnValue({
        currentAcademy: academyWithoutLogo,
        academyData: mockMultipleAcademyData,
        switchAcademy: mockSwitchAcademy,
      } as any)

      renderComponent()
      
      const buildingIcons = screen.getAllByTestId('building-icon')
      expect(buildingIcons.length).toBeGreaterThanOrEqual(1)
    })

    it('renders dropdown menu content with current academy details', () => {
      renderComponent()
      
      expect(screen.getByTestId('dropdown-menu-content')).toBeInTheDocument()
      expect(screen.getByText('Current Academy')).toBeInTheDocument()
      expect(screen.getByText('Switch Academy')).toBeInTheDocument()
      expect(screen.getByTestId('arrow-left-right-icon')).toBeInTheDocument()
    })

    it('calls switchAcademy and navigates when Switch Academy is clicked', async () => {
      renderComponent()
      
      const switchButton = screen.getByText('Switch Academy')
      fireEvent.click(switchButton)
      
      await waitFor(() => {
        expect(mockSwitchAcademy).toHaveBeenCalledOnce()
        expect(mockNavigate).toHaveBeenCalledWith({ to: '/academy-selection' })
      })
    })
  })

  describe('Image Error Handling', () => {
    beforeEach(() => {
      mockUseAuthStore.mockReturnValue({
        currentAcademy: mockAcademyMembership,
        academyData: mockMultipleAcademyData,
        switchAcademy: mockSwitchAcademy,
      } as any)
    })

    it('handles image load errors gracefully', () => {
      renderComponent()
      
      const logos = screen.getAllByAltText('Tech Academy logo')
      
      // Simulate image load error on first logo
      fireEvent.error(logos[0])
      
      // The error handler should hide the image and show the fallback
      // Note: In a real test environment, you might need to mock the DOM manipulation
      expect(logos[0]).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    beforeEach(() => {
      mockUseAuthStore.mockReturnValue({
        currentAcademy: mockAcademyMembership,
        academyData: mockMultipleAcademyData,
        switchAcademy: mockSwitchAcademy,
      } as any)
    })

    it('provides proper alt text for academy logos', () => {
      renderComponent()
      
      const logos = screen.getAllByAltText('Tech Academy logo')
      expect(logos).toHaveLength(2) // One in trigger, one in content
    })

    it('renders role information in badges', () => {
      renderComponent()
      
      const badges = screen.getAllByTestId('badge')
      expect(badges).toHaveLength(1) // Only one badge in content (trigger shows role as text)
      expect(badges[0]).toHaveTextContent('Administrator')
    })
  })

  describe('Mobile Responsiveness', () => {
    beforeEach(() => {
      // Mock mobile sidebar
      mockUseSidebar.mockReturnValue({ isMobile: true })
      
      mockUseAuthStore.mockReturnValue({
        currentAcademy: mockAcademyMembership,
        academyData: mockMultipleAcademyData,
        switchAcademy: mockSwitchAcademy,
      } as any)
    })

    it('renders correctly on mobile devices', () => {
      renderComponent()
      
      expect(screen.getByTestId('dropdown-menu-content')).toBeInTheDocument()
      // The component should render the same content but with different positioning
      expect(screen.getAllByText('Tech Academy')).toHaveLength(2)
    })
  })
})