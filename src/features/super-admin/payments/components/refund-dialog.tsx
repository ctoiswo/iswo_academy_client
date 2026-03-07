import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useTranslation } from '@/hooks/use-translation'
import type { RefundTarget } from '../types'

interface RefundDialogProps {
  target: RefundTarget | null
  loading: boolean
  onConfirm: () => void
  onClose: () => void
}

export function RefundDialog({ target, loading, onConfirm, onClose }: RefundDialogProps) {
  const { t } = useTranslation()

  return (
    <AlertDialog open={!!target} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('superAdmin.payments.dialog.title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('superAdmin.payments.dialog.description', {
              name: target?.payment.user?.full_name ?? t('superAdmin.payments.dialog.thisUser'),
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            {t('superAdmin.payments.dialog.cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            {loading
              ? t('superAdmin.payments.dialog.processing')
              : t('superAdmin.payments.dialog.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
