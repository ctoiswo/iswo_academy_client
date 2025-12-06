import { motion } from 'framer-motion'

interface PageHeaderProps {
  totalAcademies: number
  searchQuery: string
  selectedCategory: string
}

export function PageHeader({
  totalAcademies,
  searchQuery,
  selectedCategory,
}: PageHeaderProps) {
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      variants={headerVariants}
      initial='hidden'
      animate='visible'
      className='mb-12 text-center'
    >
      <h1 className='text-foreground mb-4 text-4xl font-bold lg:text-5xl'>
        Explora Nuestras{' '}
        <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
          Academias
        </span>
      </h1>
      <p className='text-muted-foreground mx-auto max-w-3xl text-xl leading-relaxed'>
        {searchQuery || selectedCategory !== 'all' ? (
          <>
            {totalAcademies > 0 ? (
              <>
                Encontramos{' '}
                <span className='font-semibold'>{totalAcademies}</span>{' '}
                academias que coinciden con tu búsqueda
              </>
            ) : (
              'No se encontraron academias que coincidan con tu búsqueda'
            )}
          </>
        ) : (
          <>
            Descubre las mejores academias online, creadas por expertos de la
            industria. Aprende nuevas habilidades y avanza en tu carrera
            profesional.
          </>
        )}
      </p>
    </motion.div>
  )
}
