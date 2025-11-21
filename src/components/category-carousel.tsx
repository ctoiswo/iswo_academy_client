import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { PublicAcademyCard } from '@/components/public-academy-card'

interface Academy {
  id: number
  name: string
  slug: string
  description?: string
  instructor?: string
  students?: number
  rating?: number
  courses?: number
  image?: string
  banner_url?: string
  category?: string
  duration?: string
  level?: 'Principiante' | 'Intermedio' | 'Avanzado'
  price?: number
}

interface CategoryCarouselProps {
  title: string
  academies: Academy[]
  categoryIcon?: React.ReactNode
  categorySlug?: string
}

export function CategoryCarousel({
  title,
  academies,
  categoryIcon,
  categorySlug,
}: CategoryCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const CARDS_PER_VIEW = 3
  const maxIndex = Math.max(0, academies.length - CARDS_PER_VIEW)

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  }

  const headerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  }

  const carouselVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }

  if (academies.length === 0) {
    return null
  }

  return (
    <motion.section
      variants={containerVariants}
      initial='hidden'
      animate='visible'
      className='py-6'
    >
      {/* Header */}
      <motion.div
        variants={headerVariants}
        className='mb-8 flex items-center justify-between'
      >
        <div className='flex items-center gap-3'>
          {categoryIcon && (
            <div className='rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 p-3 text-blue-600'>
              {categoryIcon}
            </div>
          )}
          <div>
            <h2 className='text-foreground mb-1 text-2xl font-bold'>{title}</h2>
            <p className='text-muted-foreground text-sm'>
              {academies.length}{' '}
              {academies.length === 1
                ? 'academia disponible'
                : 'academias disponibles'}
            </p>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className='hidden items-center gap-2 md:flex'>
          <Button
            variant='outline'
            size='sm'
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className='h-10 w-10 rounded-full p-0 disabled:opacity-40'
          >
            <ChevronLeft className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={nextSlide}
            disabled={currentIndex >= maxIndex}
            className='h-10 w-10 rounded-full p-0 disabled:opacity-40'
          >
            <ChevronRight className='h-4 w-4' />
          </Button>
        </div>
      </motion.div>

      {/* Carousel Container */}
      <motion.div
        variants={carouselVariants}
        className='relative overflow-hidden'
      >
        <div
          ref={containerRef}
          className='flex gap-6 transition-transform duration-500 ease-out'
          style={{
            transform: `translateX(-${currentIndex * (100 / CARDS_PER_VIEW + 2)}%)`,
          }}
        >
          {academies.map((academy, index) => (
            <div
              key={academy.id}
              className='w-full flex-none md:w-1/3 lg:w-1/3'
            >
              <PublicAcademyCard academy={academy} index={index} />
            </div>
          ))}
        </div>

        {/* Mobile Navigation Dots */}
        <div className='mt-6 flex justify-center gap-2 md:hidden'>
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 w-2 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'w-6 bg-blue-600'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* View All Button */}
      <motion.div variants={headerVariants} className='mt-8 text-center'>
        <Button variant='outline' className='group hover:border-blue-500/50' asChild>
          <Link 
            to='/academies' 
            search={{ category: categorySlug }}
          >
            Ver todas las academias de {title}
            <ChevronRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
          </Link>
        </Button>
      </motion.div>
    </motion.section>
  )
}
