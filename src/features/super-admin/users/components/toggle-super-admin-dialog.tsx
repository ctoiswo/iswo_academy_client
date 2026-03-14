import { useTranslation } from '@/hooks/use-translation'
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
import type { ConfirmTarget } from '../types'

interface ToggleSuperAdminDialogProps {
  target: ConfirmTarget | null
  loading: boolean
  onConfirm: () => void
  onClose: () => void
}

export function ToggleSuperAdminDialog({
  target,
  loading,
  onConfirm,
  onClose,
}: ToggleSuperAdminDialogProps) {
  const { t } = useTranslation()
  const isPromoting = target?.action === 'promote'

  return (
    <AlertDialog open={!!target} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isPromoting
              ? t('superAdmin.users.dialog.promoteTitle')
              : t('superAdmin.users.dialog.demoteTitle')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isPromoting
              ? t('superAdmin.users.dialog.promoteDesc', {
                  name: target?.user.full_name,
                })
              : t('superAdmin.users.dialog.demoteDesc', {
                  name: target?.user.full_name,
                })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            {t('superAdmin.users.dialog.cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading}
            className={
              !isPromoting
                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                : ''
            }
          >
            {loading
              ? t('superAdmin.users.dialog.saving')
              : isPromoting
                ? t('superAdmin.users.dialog.confirm')
                : t('superAdmin.users.dialog.removeRole')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
