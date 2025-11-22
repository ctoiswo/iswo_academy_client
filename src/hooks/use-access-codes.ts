import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
  accessCodeService,
  type AccessCodeFilters,
  type CreateAccessCodeData,
  type UpdateAccessCodeData,
  type RedeemAccessCodeData
} from '@/services/access-code-service'

export function useAccessCodes(courseId: number | string, filters?: AccessCodeFilters) {
  return useQuery({
    queryKey: ['access_codes', courseId, filters],
    queryFn: () => accessCodeService.getAccessCodes(courseId, filters),
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
    mutationFn: (data: CreateAccessCodeData) =>
      accessCodeService.createAccessCode(courseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['access_codes', courseId] })
      toast.success('Access code created successfully')
    },
    onError: (error) => {
      toast.error(`Failed to create access code: ${error.message}`)
    },
  })
}

export function useUpdateAccessCode(courseId: number | string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ accessCodeId, data }: { accessCodeId: number; data: UpdateAccessCodeData }) =>
      accessCodeService.updateAccessCode(courseId, accessCodeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['access_codes', courseId] })
      toast.success('Access code updated successfully')
    },
    onError: (error) => {
      toast.error(`Failed to update access code: ${error.message}`)
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
      toast.success('Access code deleted successfully')
    },
    onError: (error) => {
      toast.error(`Failed to delete access code: ${error.message}`)
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
      toast.success('Access code status updated successfully')
    },
    onError: (error) => {
      toast.error(`Failed to update access code status: ${error.message}`)
    },
  })
}

export function useRedeemAccessCode() {
  return useMutation({
    mutationFn: (data: RedeemAccessCodeData) =>
      accessCodeService.redeemAccessCode(data),
    onSuccess: (response) => {
      toast.success(response.message)
    },
    onError: (error) => {
      toast.error(`Failed to redeem access code: ${error.message}`)
    },
  })
}

export function useValidateAccessCode() {
  return useMutation({
    mutationFn: (code: string) =>
      accessCodeService.validateAccessCode(code),
    onError: (error) => {
      toast.error(`Failed to validate access code: ${error.message}`)
    },
  })
}