import type { AcademyCategory } from '@/types'
import { motion } from 'framer-motion'
import { Search, BookOpen } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface SearchFiltersProps {
  searchInput: string
  setSearchInput: (value: string) => void
  setSearchQuery: (value: string) => void
  selectedCategory: string
  setSelectedCategory: (value: string) => void
  sortBy: 'popular' | 'rating' | 'students' | 'newest'
  setSortBy: (value: 'popular' | 'rating' | 'students' | 'newest') => void
  categories: AcademyCategory[]
  searchQuery: string
  navigate: any
}

export function SearchFilters({
  searchInput,
  setSearchInput,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  categories,
  searchQuery,
  navigate,
}: SearchFiltersProps) {
  const { t } = useTranslation()

  const searchVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const categoryButtons = categories.map((category) => ({
    id: category.slug,
    name: category.name,
    count: category.academies_count,
  }))

  return (
    <motion.div
      variants={searchVariants}
      initial='hidden'
      animate='visible'
      className='bg-card mb-12 rounded-2xl border p-6 shadow-sm'
    >
      <div className='flex flex-col gap-4 lg:flex-row'>
        {/* Search Input */}
        <div className='relative flex-1'>
          <Search className='text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform' />
          <Input
            placeholder={t('academies.search.placeholder')}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
            className='h-12 pl-10'
          />
        </div>

        {/* Filters */}
        <div className='flex gap-3'>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className='h-12 w-48'>
              <SelectValue placeholder={t('academies.search.category')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>
                {t('academies.search.allCategories')}
              </SelectItem>
              {categoryButtons.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name} ({category.count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value as any)}
          >
            <SelectTrigger className='h-12 w-40'>
              <SelectValue placeholder={t('academies.search.sortBy')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='popular'>
                {t('academies.search.popular')}
              </SelectItem>
              <SelectItem value='rating'>
                {t('academies.search.rating')}
              </SelectItem>
              <SelectItem value='students'>
                {t('academies.search.students')}
              </SelectItem>
              <SelectItem value='newest'>
                {t('academies.search.newest')}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Category Tags */}
      <div className='mt-6 flex flex-wrap gap-3'>
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          size='sm'
          onClick={() => setSelectedCategory('all')}
          className='rounded-full'
        >
          <BookOpen className='mr-2 h-4 w-4' />
          {t('academies.search.all')}
        </Button>
        {categoryButtons.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            size='sm'
            onClick={() => setSelectedCategory(category.id)}
            className='rounded-full'
          >
            <BookOpen className='mr-2 h-4 w-4' />
            <span>{category.name}</span>
            <Badge variant='secondary' className='ml-2 text-xs'>
              {category.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Active Filters Indicator */}
      {(searchQuery || selectedCategory !== 'all' || sortBy !== 'popular') && (
        <div className='bg-muted/50 mt-4 flex flex-wrap items-center gap-2 rounded-lg p-3'>
          <span className='text-muted-foreground text-sm font-medium'>
            {t('academies.search.activeFilters')}
          </span>
          {searchQuery && (
            <Badge variant='secondary' className='gap-1'>
              {t('academies.search.searchLabel')} "{searchQuery}"
              <button
                onClick={() => {
                  setSearchInput('')
                  setSearchQuery('')
                }}
                className='hover:bg-muted-foreground/20 ml-1 rounded-full p-0.5'
              >
                ×
              </button>
            </Badge>
          )}
          {selectedCategory !== 'all' && (
            <Badge variant='secondary' className='gap-1'>
              {categoryButtons.find((c) => c.id === selectedCategory)?.name}
              <button
                onClick={() => setSelectedCategory('all')}
                className='hover:bg-muted-foreground/20 ml-1 rounded-full p-0.5'
              >
                ×
              </button>
            </Badge>
          )}
          {sortBy !== 'popular' && (
            <Badge variant='secondary' className='gap-1'>
              {t('academies.search.orderLabel')}{' '}
              {sortBy === 'rating'
                ? t('academies.search.rating')
                : sortBy === 'students'
                  ? t('academies.search.students')
                  : sortBy === 'newest'
                    ? t('academies.search.newest')
                    : t('academies.search.popular')}
              <button
                onClick={() => setSortBy('popular')}
                className='hover:bg-muted-foreground/20 ml-1 rounded-full p-0.5'
              >
                ×
              </button>
            </Badge>
          )}
          <Button
            variant='ghost'
            size='sm'
            onClick={() => {
              setSearchInput('')
              setSearchQuery('')
              setSelectedCategory('all')
              setSortBy('popular')
              navigate({ to: '/academies' })
            }}
            className='ml-auto h-6 text-xs'
          >
            {t('academies.search.clearAll')}
          </Button>
        </div>
      )}
    </motion.div>
  )
}
