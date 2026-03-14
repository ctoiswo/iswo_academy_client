import { useState, useEffect, useCallback, useRef } from 'react'
import { academyCategoryService } from '@/services'
import type { FeaturedCategory } from '@/types'
import {
  Globe,
  Palette,
  FlaskConical,
  ChefHat,
  GraduationCap,
  Music,
  Briefcase,
  Heart,
  Code,
  Terminal,
  PenTool,
  TrendingUp,
  Dumbbell,
  Camera,
  Brain,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  CATEGORY_VISUAL_CONFIG,
  DEFAULT_CATEGORY_VISUAL,
  type CategoryWithVisual,
} from '@/constants/home-constants'
import { AcademiesSectionHeader } from '../components/academies-section-header'
import { AcademyCardsRow } from '../components/academy-cards-row'
import { CarouselNavArrows } from '../components/carousel-nav-arrows'
import { CategoryAmbientGradients } from '../components/category-ambient-gradients'
import { CategoryInfoPanel } from '../components/category-info-panel'
import { CategoryProgressBars } from '../components/category-progress-bars'

const iconMap: Record<string, LucideIcon> = {
  Globe,
  Palette,
  FlaskConical,
  ChefHat,
  GraduationCap,
  Music,
  Briefcase,
  Heart,
  Code,
  Terminal,
  PenTool,
  TrendingUp,
  Dumbbell,
  Camera,
  Brain,
}
const INTERVAL = 5000

function mergeVisual(category: FeaturedCategory): CategoryWithVisual {
  const visual =
    CATEGORY_VISUAL_CONFIG[category.slug] ?? DEFAULT_CATEGORY_VISUAL
  return { ...category, ...visual }
}

export function AcademiesSection() {
  const [categories, setCategories] = useState<CategoryWithVisual[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const category = categories[activeIndex]
  const Icon = category ? (iconMap[category.icon] ?? Globe) : Globe

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return
      setIsTransitioning(true)
      setTimeout(() => {
        setActiveIndex(index)
        setProgress(0)
        setTimeout(() => setIsTransitioning(false), 50)
      }, 280)
    },
    [isTransitioning]
  )

  const goNext = useCallback(() => {
    goTo((activeIndex + 1) % categories.length)
  }, [activeIndex, goTo, categories.length])

  useEffect(() => {
    academyCategoryService
      .getFeaturedCategories()
      .then((data) => {
        setCategories(data.map(mergeVisual))
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const step = 30
    progressRef.current = setInterval(() => {
      setProgress((p) => Math.min(p + (step / INTERVAL) * 100, 100))
    }, step)
    intervalRef.current = setInterval(goNext, INTERVAL)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (progressRef.current) clearInterval(progressRef.current)
    }
  }, [activeIndex, goNext])

  return (
    <section id='academias' className='relative overflow-hidden py-24'>
      <div className='mx-auto flex max-w-7xl flex-col gap-12 px-4 lg:px-8'>
        <AcademiesSectionHeader />

        {categories.length > 0 && category && (
          <div className='border-border/50 bg-card/60 relative overflow-hidden rounded-2xl border backdrop-blur-sm'>
            <CategoryAmbientGradients
              categories={categories}
              activeIndex={activeIndex}
              isTransitioning={isTransitioning}
            />

            <CategoryProgressBars
              categories={categories}
              activeIndex={activeIndex}
              progress={progress}
              onGoTo={goTo}
            />

            <div className='relative min-h-[420px] md:min-h-[380px]'>
              <div
                className={cn(
                  'relative z-10 flex h-full flex-col transition-all duration-300 lg:flex-row',
                  isTransitioning
                    ? 'translate-y-2 opacity-0'
                    : 'translate-y-0 opacity-100'
                )}
              >
                <CategoryInfoPanel category={category} Icon={Icon} />
                <div className='bg-border/25 my-8 hidden w-px lg:block' />
                <AcademyCardsRow category={category} />
              </div>
            </div>

            <CarouselNavArrows
              onPrev={() =>
                goTo((activeIndex - 1 + categories.length) % categories.length)
              }
              onNext={goNext}
            />
          </div>
        )}
      </div>
    </section>
  )
}
