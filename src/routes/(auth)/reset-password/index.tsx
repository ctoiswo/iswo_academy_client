import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { GuestGuard } from '@/components/route-guards'
import { ResetPassword } from '@/features/auth/reset-password'

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

export const Route = createFileRoute('/(auth)/reset-password/')({
  component: ResetPasswordRoute,
  validateSearch: resetPasswordSearchSchema,
})
