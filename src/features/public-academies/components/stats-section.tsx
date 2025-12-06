import { motion } from 'framer-motion'

interface StatsSectionProps {
  totalAcademies: number
  totalStudents: number
  totalCategories: number
  searchQuery: string
  selectedCategory: string
}

export function StatsSection({
  totalAcademies,
  totalStudents,
  totalCategories,
  searchQuery,
  selectedCategory,
}: StatsSectionProps) {
  const statsVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  }

  return (
    <motion.div
      variants={statsVariants}
      initial='hidden'
      animate='visible'
      className='mb-12 grid grid-cols-1 gap-6 md:grid-cols-3'
    >
      <div className='bg-card rounded-2xl border p-6 text-center shadow-sm'>
        <div className='mb-2 text-3xl font-bold text-blue-600'>
          {totalAcademies}+
        </div>
        <div className='text-muted-foreground font-medium'>
          Academias Disponibles
        </div>
      </div>
      <div className='bg-card rounded-2xl border p-6 text-center shadow-sm'>
        <div className='mb-2 text-3xl font-bold text-green-600'>
          {totalStudents}
        </div>
        <div className='text-muted-foreground font-medium'>
          Estudiantes Activos
        </div>
      </div>
      <div className='bg-card rounded-2xl border p-6 text-center shadow-sm'>
        <div className='mb-2 text-3xl font-bold text-purple-600'>
          {totalCategories}+
        </div>
        <div className='text-muted-foreground font-medium'>
          {searchQuery || selectedCategory !== 'all'
            ? 'Categorías Encontradas'
            : 'Categorías Principales'}
        </div>
      </div>
    </motion.div>
  )
}
