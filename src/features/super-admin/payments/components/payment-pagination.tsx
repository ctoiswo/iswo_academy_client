import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/hooks/use-translation'
import type { PaymentsMeta } from '@/lib/super-admin-api'

interface PaymentPaginationProps {
  meta: PaymentsMeta
  currentPage: number
  onPageChange: (page: number) => void
}

export function PaymentPagination({
  meta,
  currentPage,
  onPageChange,
}: PaymentPaginationProps) {
  const { t } = useTranslation()

  if (meta.total_pages <= 1) return null

  const pages = Array.from({ length: meta.total_pages }, (_, i) => i + 1).filter(
    (p) =>
      p === 1 ||
      p === meta.total_pages ||
      (p >= currentPage - 1 && p <= currentPage + 1)
  )

  return (
    <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
      <div className='text-muted-foreground text-sm'>
        {t('superAdmin.payments.pagination.showing', {
          from: (meta.current_page - 1) * meta.per_page + 1,
          to: Math.min(meta.current_page * meta.per_page, meta.total_count),
          total: meta.total_count,
        })}
      </div>
      <div className='flex items-center gap-2'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className='h-4 w-4' />
          {t('superAdmin.payments.pagination.previous')}
        </Button>
        <div className='flex items-center gap-1'>
          {pages.map((p, idx, arr) => {
            const gap = idx > 0 && p - arr[idx - 1] > 1
            return (
              <div key={p} className='flex items-center gap-1'>
                {gap && <span className='text-muted-foreground px-1'>...</span>}
                <Button
                  variant={p === currentPage ? 'default' : 'outline'}
                  size='sm'
                  className='h-8 w-8 p-0'
                  onClick={() => onPageChange(p)}
                >
                  {p}
                </Button>
              </div>
            )
          })}
        </div>
        <Button
          variant='outline'
          size='sm'
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === meta.total_pages}
        >
          {t('superAdmin.payments.pagination.next')}
          <ChevronRight className='h-4 w-4' />
        </Button>
      </div>
    </div>
  )
}
