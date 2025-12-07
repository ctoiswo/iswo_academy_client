/**
 * Academies Section Component
 * Displays featured academies grouped by category
 */
import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowRight, Loader2, AlertCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AcademyCard } from './academy-card'

interface AcademiesSectionProps {
  data: Array<{
    category: {
      id: number
      name: string
      description?: string
    }
    academies: Array<any>
  }>
  isLoading: boolean
  isError: boolean
  onRetry: () => void
}

export function AcademiesSection({
  data,
  isLoading,
  isError,
  onRetry,
}: AcademiesSectionProps) {
  const { t } = useTranslation()

  return (
    <section className='py-20'>
      <div className='container'>
        <motion.div
          className='mb-16 text-center'
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>
            {t('home.academies.title')}
          </h2>
          <p className='text-muted-foreground mt-4 text-lg'>
            {t('home.academies.description')}
          </p>
        </motion.div>

        {isLoading ? (
          <div className='col-span-full flex items-center justify-center py-12'>
            <Loader2 className='h-8 w-8 animate-spin' />
            <span className='text-muted-foreground ml-2'>
              {t('home.academies.loading')}
            </span>
          </div>
        ) : isError ? (
          <div className='col-span-full'>
            <Alert variant='destructive'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>
                {t('home.academies.error')}{' '}
                <Button variant='outline' size='sm' onClick={onRetry}>
                  {t('home.academies.retry')}
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        ) : data && data.length > 0 ? (
          <div className='space-y-16'>
            {data.map((categoryData, categoryIndex) => {
              const { category, academies } = categoryData

              if (!academies || academies.length === 0) return null

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
                >
                  <div className='mb-8'>
                    <h3 className='mb-2 text-2xl font-bold'>{category.name}</h3>
                    <p className='text-muted-foreground'>
                      {category.description}
                    </p>
                  </div>

                  <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
                    {academies.map((academy, index) => (
                      <AcademyCard
                        key={academy.id}
                        academy={academy}
                        index={index}
                      />
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <div className='col-span-full py-12 text-center'>
            <p className='text-muted-foreground'>
              {t('home.academies.notFound')}
            </p>
          </div>
        )}

        <motion.div
          className='mt-12 text-center'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Button size='lg' variant='outline' asChild>
            <Link to='/academies'>
              {t('home.academies.viewAll')}
              <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
