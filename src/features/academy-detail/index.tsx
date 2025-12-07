import { useParams, useRouter } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { useAcademy } from '@/hooks/use-academy'
import { Header } from '@/features/home/components/header'
import {
  LoadingSpinner,
  ErrorCard,
  HeroBanner,
  MainContent,
  Sidebar,
} from './components'

export function AcademyDetailPage() {
  const { slug } = useParams({ from: '/academies/$slug/' })
  const router = useRouter()
  const { academy, loading, error } = useAcademy(slug)

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error || !academy) {
    return <ErrorCard error={error} />
  }

  return (
    <div className='bg-background min-h-screen'>
      <Header />

      <motion.div
        variants={pageVariants}
        initial='hidden'
        animate='visible'
        className='relative'
      >
        <HeroBanner academy={academy} router={router} />

        <div className='container mx-auto px-4 py-12'>
          <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
            <MainContent academy={academy} />
            <Sidebar academy={academy} />
          </div>
        </div>
      </motion.div>
    </div>
  )
}