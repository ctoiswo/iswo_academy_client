import { createFileRoute } from '@tanstack/react-router'
import SuperAdminGamification from '@/pages/super-admin-gamification'

export const Route = createFileRoute('/_authenticated/super-admin/gamification')({
  component: SuperAdminGamification,
})
