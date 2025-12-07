/**
 * Categories Filter Component
 * Displays category filter buttons
 */
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { AcademyCategoryMinimal } from '@/types/entities/category'

interface CategoriesFilterProps {
  categories: AcademyCategoryMinimal[]
  selectedCategory: number | null
  onCategoryChange: (categoryId: number | null) => void
  isLoading?: boolean
}

export function CategoriesFilter({
  categories,
  selectedCategory,
  onCategoryChange,
  isLoading = false,
}: CategoriesFilterProps) {
  const { t } = useTranslation()

  const allCategories = [
    { id: null, name: t('home.categories.all'), slug: 'all' },
    ...categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
    })),
  ]

  if (isLoading) {
    return (
      <section className='bg-muted/50 border-b py-12'>
        <div className='container'>
          <div className='flex items-center justify-center py-4'>
            <Loader2 className='h-6 w-6 animate-spin' />
            <span className='text-muted-foreground ml-2'>
              {t('home.categories.loading')}
            </span>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className='bg-muted/50 border-b py-12'>
      <div className='container'>
        <div className='flex flex-wrap justify-center gap-4'>
          {allCategories.map((category, index) => (
            <motion.button
              key={category.slug}
              onClick={() => onCategoryChange(category.id)}
              className={`rounded-full px-6 py-3 text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background hover:bg-muted border'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.name}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}
