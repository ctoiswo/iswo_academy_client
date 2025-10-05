import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { ResetPassword } from '@/features/auth/forgot-password/reset-password'
import { GuestGuard } from '@/components/route-guards'

const resetPasswordSearchSchema = z.object({
  token: z.string().optional(),
})

function ResetPasswordRoute() {
  return (
    <GuestGuard>
      <ResetPassword />
    </GuestGuard>
  )
}

export const Route = createFileRoute('/(auth)/reset-password')({
  component: ResetPasswordRoute,
  validateSearch: resetPasswordSearchSchema,
})