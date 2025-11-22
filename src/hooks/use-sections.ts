import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  sectionService,
  type CreateSectionData,
  type UpdateSectionData,
} from '@/services/section-service'

export function useSections(academySlug: string, courseSlug: string) {
  return useQuery({
    queryKey: ['sections', academySlug, courseSlug],
    queryFn: () => sectionService.getSections(academySlug, courseSlug),
    enabled: !!academySlug && !!courseSlug,
  })
}

export function useSection(
  academySlug: string,
  courseSlug: string,
  sectionId: number
) {
  return useQuery({
    queryKey: ['section', academySlug, courseSlug, sectionId],
    queryFn: () => sectionService.getSection(academySlug, courseSlug, sectionId),
    enabled: !!academySlug && !!courseSlug && !!sectionId,
  })
}

export function useCreateSection(academySlug: string, courseSlug: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateSectionData) =>
      sectionService.createSection(academySlug, courseSlug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections', academySlug, courseSlug] })
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      toast.success('Sección creada exitosamente')
    },
    onError: (error: any) => {
      toast.error(`Error al crear la sección: ${error.message}`)
    },
  })
}

export function useUpdateSection(academySlug: string, courseSlug: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      sectionId,
      data,
    }: {
      sectionId: number
      data: UpdateSectionData
    }) => sectionService.updateSection(academySlug, courseSlug, sectionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections', academySlug, courseSlug] })
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      toast.success('Sección actualizada exitosamente')
    },
    onError: (error: any) => {
      toast.error(`Error al actualizar la sección: ${error.message}`)
    },
  })
}

export function useDeleteSection(academySlug: string, courseSlug: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (sectionId: number) =>
      sectionService.deleteSection(academySlug, courseSlug, sectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections', academySlug, courseSlug] })
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      toast.success('Sección eliminada exitosamente')
    },
    onError: (error: any) => {
      toast.error(`Error al eliminar la sección: ${error.message}`)
    },
  })
}

export function useReorderSection(academySlug: string, courseSlug: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      sectionId,
      position,
    }: {
      sectionId: number
      position: number
    }) => sectionService.reorderSection(academySlug, courseSlug, sectionId, position),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections', academySlug, courseSlug] })
    },
    onError: (error: any) => {
      toast.error(`Error al reordenar la sección: ${error.message}`)
    },
  })
}
