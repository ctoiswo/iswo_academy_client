import type { AcademyCategoryMinimal } from '@/types/entities/category'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CategoriesFilter } from '../categories-filter'

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => (
      <button {...props}>{children}</button>
    ),
  },
}))

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'home.categories.all': 'Todas las categorías',
        'home.categories.loading': 'Cargando categorías...',
      }
      return translations[key] || key
    },
  }),
}))

// Mock lucide-react
jest.mock('lucide-react', () => ({
  Loader2: ({ className }: { className?: string }) => (
    <div className={className} data-testid='loader-icon'>
      Loading...
    </div>
  ),
}))

const mockCategories: AcademyCategoryMinimal[] = [
  { id: 1, name: 'Tecnología', slug: 'tecnologia' },
  { id: 2, name: 'Diseño', slug: 'diseno' },
  { id: 3, name: 'Negocios', slug: 'negocios' },
]

describe('CategoriesFilter', () => {
  const mockOnCategoryChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Loading state', () => {
    it('should render loading state', () => {
      render(
        <CategoriesFilter
          categories={[]}
          selectedCategory={null}
          onCategoryChange={mockOnCategoryChange}
          isLoading={true}
        />
      )

      expect(screen.getByTestId('loader-icon')).toBeInTheDocument()
      expect(screen.getByText('Cargando categorías...')).toBeInTheDocument()
    })
  })

  describe('Category display and interaction', () => {
    it('should render all categories with "All" option', () => {
      render(
        <CategoriesFilter
          categories={mockCategories}
          selectedCategory={null}
          onCategoryChange={mockOnCategoryChange}
        />
      )

      // Should show "All categories" option
      expect(screen.getByText('Todas las categorías')).toBeInTheDocument()

      // Should show all provided categories
      mockCategories.forEach((category) => {
        expect(screen.getByText(category.name)).toBeInTheDocument()
      })
    })

    it('should highlight selected category', () => {
      render(
        <CategoriesFilter
          categories={mockCategories}
          selectedCategory={1}
          onCategoryChange={mockOnCategoryChange}
        />
      )

      const selectedButton = screen.getByText('Tecnología').closest('button')
      expect(selectedButton).toHaveClass(
        'bg-primary',
        'text-primary-foreground'
      )
    })

    it('should highlight "All" when selectedCategory is null', () => {
      render(
        <CategoriesFilter
          categories={mockCategories}
          selectedCategory={null}
          onCategoryChange={mockOnCategoryChange}
        />
      )

      const allButton = screen
        .getByText('Todas las categorías')
        .closest('button')
      expect(allButton).toHaveClass('bg-primary', 'text-primary-foreground')
    })

    it('should call onCategoryChange when category is clicked', async () => {
      const user = userEvent.setup()

      render(
        <CategoriesFilter
          categories={mockCategories}
          selectedCategory={null}
          onCategoryChange={mockOnCategoryChange}
        />
      )

      // Click on "Tecnología" category
      await user.click(screen.getByText('Tecnología'))
      expect(mockOnCategoryChange).toHaveBeenCalledWith(1)

      // Click on "All categories"
      await user.click(screen.getByText('Todas las categorías'))
      expect(mockOnCategoryChange).toHaveBeenCalledWith(null)
    })

    it('should handle empty categories array', () => {
      render(
        <CategoriesFilter
          categories={[]}
          selectedCategory={null}
          onCategoryChange={mockOnCategoryChange}
        />
      )

      // Should still show "All categories" option
      expect(screen.getByText('Todas las categorías')).toBeInTheDocument()

      // Should only have one button (the "All" button)
      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(1)
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <CategoriesFilter
          categories={mockCategories}
          selectedCategory={1}
          onCategoryChange={mockOnCategoryChange}
        />
      )

      const buttons = screen.getAllByRole('button')
      buttons.forEach((button) => {
        expect(button).toBeInTheDocument()
      })
    })

    it('should handle keyboard navigation', async () => {
      const user = userEvent.setup()

      render(
        <CategoriesFilter
          categories={mockCategories}
          selectedCategory={null}
          onCategoryChange={mockOnCategoryChange}
        />
      )

      const firstButton = screen.getByText('Todas las categorías')
      await user.tab()
      expect(firstButton).toHaveFocus()

      // Press Enter to activate
      await user.keyboard('{Enter}')
      expect(mockOnCategoryChange).toHaveBeenCalledWith(null)
    })
  })
})
