import { createFileRoute } from '@tanstack/react-router'
import SuperAdminCategories from '@/pages/super-admin-categories'

export const Route = createFileRoute('/_authenticated/super-admin/categories')({
  component: SuperAdminCategories,
})
