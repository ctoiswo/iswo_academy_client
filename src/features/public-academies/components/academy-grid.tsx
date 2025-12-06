import { motion } from 'framer-motion'
import { BookOpen } from 'lucide-react'
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
          No se encontraron academias
        </h3>
        <p className='text-muted-foreground mx-auto mb-6 max-w-md'>
          {searchQuery
            ? `No hay academias que coincidan con "${searchQuery}"${selectedCategory !== 'all' ? ' en esta categoría' : ''}`
            : 'No hay academias disponibles en esta categoría'}
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
            Limpiar búsqueda
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
            Ver todas las categorías
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
              ? 'academia encontrada'
              : 'academias encontradas'}
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
          Ver todas las categorías
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
