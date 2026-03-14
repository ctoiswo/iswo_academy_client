import { ExternalLink } from 'lucide-react'
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

  // URL for opening in new tab (direct HTML endpoint)
  const apiBaseUrl =
    import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1'
  const baseUrl = apiBaseUrl.replace(/\/api\/v1\/?$/, '')
  const directUrl = `${baseUrl}/api/v1/academies/${academySlug}/certificate_templates/${templateId}/preview_html`

  const handleOpenInNewTab = () => {
    window.open(directUrl, '_blank')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] max-w-4xl'>
        <DialogHeader>
          <DialogTitle className='flex items-center justify-between'>
            <span>Vista Previa del Certificado</span>
            <Button
              variant='outline'
              size='sm'
              onClick={handleOpenInNewTab}
              className='gap-2'
            >
              <ExternalLink className='h-4 w-4' />
              Abrir en Nueva Pestaña
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className='max-h-[70vh] overflow-auto rounded-lg bg-gray-50 p-4'>
          {isLoading ? (
            <Skeleton className='h-[600px] w-full' />
          ) : preview?.html ? (
            <div
              dangerouslySetInnerHTML={{ __html: preview.html }}
              className='certificate-preview'
              style={{
                transform: 'scale(0.7)',
                transformOrigin: 'top center',
                width: '142%',
                marginLeft: '-21%',
              }}
            />
          ) : (
            <div className='py-12 text-center text-muted-foreground'>
              <p>No se pudo cargar la vista previa</p>
              <p className='mt-2 text-sm text-muted-foreground'>
                Haz clic en "Abrir en Nueva Pestaña" para ver el certificado
                completo
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
