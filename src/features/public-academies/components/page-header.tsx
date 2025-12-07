import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()
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
        {t('academies.pageTitle')}{' '}
        <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
          {t('academies.pageTitleHighlight')}
        </span>
      </h1>
      <p className='text-muted-foreground mx-auto max-w-3xl text-xl leading-relaxed'>
        {searchQuery || selectedCategory !== 'all' ? (
          <>
            {totalAcademies > 0 ? (
              <>
                {t('academies.resultsFound')}{' '}
                <span className='font-semibold'>{totalAcademies}</span>{' '}
                {t('academies.resultsFoundSuffix')}
              </>
            ) : (
              t('academies.noResults')
            )}
          </>
        ) : (
          t('academies.defaultDescription')
        )}
      </p>
    </motion.div>
  )
}
