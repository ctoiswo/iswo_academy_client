import { motion } from 'framer-motion'
import { BookOpen } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { PublicAcademyCard } from '@/components/public-academy-card'

interface AcademyGridProps {
  academies: any[]
  categoryName: string
  selectedCategory: string
  setSelectedCategory: (value: string) => void
  setSearchInput: (value: string) => void
  setSearchQuery: (value: string) => void
  navigate: any
  searchQuery: string
}

export function AcademyGrid({
  academies,
  categoryName,
  selectedCategory,
  setSelectedCategory,
  setSearchInput,
  setSearchQuery,
  navigate,
  searchQuery,
}: AcademyGridProps) {
  const { t } = useTranslation()

  if (academies.length === 0) {
    return (
      <motion.div
        className='py-16 text-center'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <BookOpen className='text-muted-foreground mx-auto mb-4 h-16 w-16' />
        <h3 className='mb-2 text-xl font-semibold'>
          {t('academies.grid.noAcademies')}
        </h3>
        <p className='text-muted-foreground mx-auto mb-6 max-w-md'>
          {searchQuery
            ? `${t('academies.grid.noResultsWithSearch')} "${searchQuery}"${selectedCategory !== 'all' ? ` ${t('academies.grid.inThisCategory')}` : ''}`
            : t('academies.grid.noAvailable')}
        </p>
        <div className='flex justify-center gap-2'>
          <Button
            onClick={() => {
              setSearchInput('')
              setSearchQuery('')
            }}
            variant='outline'
            size='sm'
            disabled={!searchQuery}
          >
            {t('academies.search.clearSearch')}
          </Button>
          <Button
            onClick={() => {
              setSelectedCategory('all')
              navigate({ to: '/academies' })
            }}
            variant='outline'
            size='sm'
            disabled={selectedCategory === 'all'}
          >
            {t('academies.search.viewAllCategories')}
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className='mb-8 flex items-center justify-between'>
        <div>
          <h2 className='text-foreground mb-2 text-2xl font-bold'>
            {categoryName}
          </h2>
          <p className='text-muted-foreground text-sm'>
            {academies.length}{' '}
            {academies.length === 1
              ? t('academies.grid.academyFound')
              : t('academies.grid.academiesFound')}
          </p>
        </div>
        <Button
          variant='outline'
          onClick={() => {
            setSelectedCategory('all')
            setSearchInput('')
            setSearchQuery('')
            navigate({ to: '/academies' })
          }}
        >
          {t('academies.search.viewAllCategories')}
        </Button>
      </div>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {academies.map((academy: any, index: number) => (
          <div key={academy.id}>
            <PublicAcademyCard academy={academy} index={index} />
          </div>
        ))}
      </div>
    </motion.div>
  )
}
