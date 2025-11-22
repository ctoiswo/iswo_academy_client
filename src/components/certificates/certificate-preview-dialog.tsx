import { useCertificateTemplatePreview } from '@/hooks/use-certificate-templates'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  academySlug: string
  templateId: number
}

export function CertificatePreviewDialog({
  open,
  onOpenChange,
  academySlug,
  templateId,
}: Props) {
  const { data: preview, isLoading } = useCertificateTemplatePreview(
    academySlug,
    templateId
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] max-w-4xl'>
        <DialogHeader>
          <DialogTitle>Vista Previa del Certificado</DialogTitle>
        </DialogHeader>
        <div className='max-h-[70vh] overflow-auto rounded-lg bg-gray-50 p-4'>
          {isLoading ? (
            <Skeleton className='h-[600px] w-full' />
          ) : preview?.html ? (
            <div dangerouslySetInnerHTML={{ __html: preview.html }} />
          ) : (
            <div className='py-12 text-center text-gray-600'>
              <p>No se pudo cargar la vista previa</p>
              <Button onClick={() => onOpenChange(false)} className='mt-4'>
                Cerrar
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
