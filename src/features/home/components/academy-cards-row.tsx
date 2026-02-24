import { AcademyCard } from '@/components'
import type { CategoryWithVisual } from '@/constants/home-constants'

interface AcademyCardsRowProps {
  category: CategoryWithVisual
}

export function AcademyCardsRow({ category }: AcademyCardsRowProps) {
  return (
    <div className='flex-1 flex items-center px-4 pt-6 pb-8 lg:pt-8 lg:pb-8 lg:px-6 overflow-hidden'>
      <div className='flex gap-4 overflow-x-auto pb-1 snap-x snap-mandatory no-scrollbar w-full'>
        {category.academies.map((academy, i) => (
          <AcademyCard
            key={academy.id}
            academy={academy}
            accentFrom={category.accentFrom}
            accentTo={category.accentTo}
            index={i}
          />
        ))}
      </div>
    </div>
  )
}
