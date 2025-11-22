import { createFileRoute } from '@tanstack/react-router'
import SuperAdminAcademies from '@/pages/super-admin-academies'

export const Route = createFileRoute('/_authenticated/super-admin/academies')({
  component: SuperAdminAcademies,
})
