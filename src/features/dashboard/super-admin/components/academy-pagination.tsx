import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { getPageNumbers } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface AcademyPaginationProps {
  currentPage: number
  totalPages: number
  totalCount: number
  onPageChange: (page: number) => void
}

export function AcademyPagination({
  currentPage,
  totalPages,
  totalCount,
  onPageChange,
}: AcademyPaginationProps) {
  const { t } = useTranslation()
  const pages = Math.max(totalPages, 1)
  const pageNumbers = getPageNumbers(currentPage, pages)

  return (
    <div className='mt-4 flex items-center justify-between'>
      <p className='text-muted-foreground text-sm'>
        {t('super_admin.pagination.pageOf', {
          current: currentPage,
          total: pages,
        })}
        {' — '}
        {t('super_admin.pagination.totalCount', { count: totalCount })}
      </p>
      <div className='flex items-center gap-1'>
        <Button
          variant='outline'
          size='sm'
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft className='h-4 w-4' />
        </Button>

        {pageNumbers.map((page, i) =>
          page === '...' ? (
            <span
              key={`ellipsis-${i}`}
              className='text-muted-foreground px-2 text-sm'
            >
              …
            </span>
          ) : (
            <Button
              key={page}
              variant={currentPage === page ? 'default' : 'outline'}
              size='sm'
              onClick={() => onPageChange(page as number)}
            >
              {page}
            </Button>
          )
        )}

        <Button
          variant='outline'
          size='sm'
          disabled={currentPage === pages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight className='h-4 w-4' />
        </Button>
      </div>
    </div>
  )
}
