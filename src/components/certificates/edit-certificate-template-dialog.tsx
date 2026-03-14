import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  academySlug: string
  templateId: number
}

export function EditCertificateTemplateDialog({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl'>
        <DialogHeader>
          <DialogTitle>Editar Plantilla de Certificado</DialogTitle>
        </DialogHeader>
        <div className='text-muted-foreground p-6 text-center'>
          <p>Funcionalidad de edición en desarrollo</p>
          <Button onClick={() => onOpenChange(false)} className='mt-4'>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
