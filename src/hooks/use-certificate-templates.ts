import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import certificateTemplateService, {
  type CertificateTemplate,
  type CreateCertificateTemplateData,
  type UpdateCertificateTemplateData,
} from '@/services/certificate-template-service'

export const useCertificateTemplates = (academySlug: string) => {
  return useQuery({
    queryKey: ['certificate-templates', academySlug],
    queryFn: () => certificateTemplateService.getAcademyTemplates(academySlug),
    enabled: !!academySlug,
  })
}

export const useCertificateTemplate = (academySlug: string, templateId: number) => {
  return useQuery({
    queryKey: ['certificate-template', academySlug, templateId],
    queryFn: () => certificateTemplateService.getTemplate(academySlug, templateId),
    enabled: !!academySlug && !!templateId,
  })
}

export const useCreateCertificateTemplate = (academySlug: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCertificateTemplateData) =>
      certificateTemplateService.createTemplate(academySlug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificate-templates', academySlug] })
      toast.success('Plantilla de certificado creada exitosamente')
    },
    onError: (error: any) => {
      const message = error.response?.data?.error?.message || 'Error al crear la plantilla'
      toast.error(message)
    },
  })
}

export const useUpdateCertificateTemplate = (academySlug: string, templateId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateCertificateTemplateData) =>
      certificateTemplateService.updateTemplate(academySlug, templateId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificate-templates', academySlug] })
      queryClient.invalidateQueries({ queryKey: ['certificate-template', academySlug, templateId] })
      toast.success('Plantilla actualizada exitosamente')
    },
    onError: (error: any) => {
      const message = error.response?.data?.error?.message || 'Error al actualizar la plantilla'
      toast.error(message)
    },
  })
}

export const useDeleteCertificateTemplate = (academySlug: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (templateId: number) =>
      certificateTemplateService.deleteTemplate(academySlug, templateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificate-templates', academySlug] })
      toast.success('Plantilla eliminada exitosamente')
    },
    onError: (error: any) => {
      const message = error.response?.data?.error?.message || 'Error al eliminar la plantilla'
      toast.error(message)
    },
  })
}

export const useSetDefaultTemplate = (academySlug: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (templateId: number) =>
      certificateTemplateService.setAsDefault(academySlug, templateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificate-templates', academySlug] })
      toast.success('Plantilla establecida como predeterminada')
    },
    onError: (error: any) => {
      const message = error.response?.data?.error?.message || 'Error al establecer plantilla predeterminada'
      toast.error(message)
    },
  })
}

export const useCertificateTemplatePreview = (academySlug: string, templateId: number) => {
  return useQuery({
    queryKey: ['certificate-template-preview', academySlug, templateId],
    queryFn: () => certificateTemplateService.getPreview(academySlug, templateId),
    enabled: !!academySlug && !!templateId,
  })
}
