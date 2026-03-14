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
    import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'
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
        <div className='overflow-hidden rounded-lg bg-gray-100'>
          {isLoading ? (
            <Skeleton className='h-[500px] w-full' />
          ) : preview?.html ? (
            <iframe
              srcDoc={preview.html}
              className='w-full'
              style={{ height: '500px', border: 'none' }}
              title='Vista previa del certificado'
              sandbox='allow-same-origin'
            />
          ) : (
            <div className='text-muted-foreground py-12 text-center'>
              <p>No se pudo cargar la vista previa</p>
              <p className='text-muted-foreground mt-2 text-sm'>
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
