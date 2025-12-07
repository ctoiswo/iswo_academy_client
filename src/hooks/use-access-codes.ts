import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { accessCodeService } from '@/services/access-code-service'
import type {
  CreateAccessCodeRequest,
  UpdateAccessCodeRequest,
  RedeemAccessCodeRequest
} from '@/types'

export function useAccessCodes(courseId: number | string) {
  return useQuery({
    queryKey: ['access_codes', courseId],
    queryFn: () => accessCodeService.getAccessCodes(courseId),
    enabled: !!courseId,
  })
}

export function useAccessCode(courseId: number | string, accessCodeId: number) {
  return useQuery({
    queryKey: ['access_code', courseId, accessCodeId],
    queryFn: () => accessCodeService.getAccessCode(courseId, accessCodeId),
    enabled: !!courseId && !!accessCodeId,
  })
}

export function useCreateAccessCode(courseId: number | string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateAccessCodeRequest) =>
      accessCodeService.createAccessCode(courseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['access_codes', courseId] })
      toast.success('Código de acceso creado exitosamente')
    },
    onError: (error) => {
      toast.error(`Error al crear el código de acceso: ${error.message}`)
    },
  })
}

export function useUpdateAccessCode(courseId: number | string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ accessCodeId, data }: { accessCodeId: number; data: UpdateAccessCodeRequest }) =>
      accessCodeService.updateAccessCode(courseId, accessCodeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['access_codes', courseId] })
      toast.success('Código de acceso actualizado exitosamente')
    },
    onError: (error) => {
      toast.error(`Error al actualizar el código de acceso: ${error.message}`)
    },
  })
}

export function useDeleteAccessCode(courseId: number | string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (accessCodeId: number) =>
      accessCodeService.deleteAccessCode(courseId, accessCodeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['access_codes', courseId] })
      toast.success('Código de acceso eliminado exitosamente')
    },
    onError: (error) => {
      toast.error(`Error al eliminar el código de acceso: ${error.message}`)
    },
  })
}

export function useToggleAccessCodeStatus(courseId: number | string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (accessCodeId: number) =>
      accessCodeService.toggleAccessCodeStatus(courseId, accessCodeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['access_codes', courseId] })
      toast.success('Estado del código de acceso actualizado exitosamente')
    },
    onError: (error) => {
      toast.error(`Error al actualizar el estado del código de acceso: ${error.message}`)
    },
  })
}

export function useRedeemAccessCode() {
  return useMutation({
    mutationFn: (data: RedeemAccessCodeRequest) =>
      accessCodeService.redeemAccessCode(data),
    onSuccess: (response) => {
      toast.success(response.message)
    },
    onError: (error) => {
      toast.error(`Error al canjear el código de acceso: ${error.message}`)
    },
  })
}

export function useValidateAccessCode() {
  return useMutation({
    mutationFn: (code: string) =>
      accessCodeService.validateAccessCode(code),
    onError: (error) => {
      toast.error(`Error al validar el código de acceso: ${error.message}`)
    },
  })
}