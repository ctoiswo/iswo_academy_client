import { AcademyCard } from '@/components'
import type { CategoryWithVisual } from '@/constants/home-constants'

interface AcademyCardsRowProps {
  category: CategoryWithVisual
}

export function AcademyCardsRow({ category }: AcademyCardsRowProps) {
  return (
    <div className='flex flex-1 items-center overflow-hidden px-4 pt-6 pb-8 lg:px-6 lg:pt-8 lg:pb-8'>
      <div className='no-scrollbar flex w-full snap-x snap-mandatory gap-4 overflow-x-auto pb-1'>
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
