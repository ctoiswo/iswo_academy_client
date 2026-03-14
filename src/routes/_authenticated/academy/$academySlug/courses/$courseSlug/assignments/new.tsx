import { createFileRoute } from '@tanstack/react-router'
import CreateAssignmentPage from '@/pages/create-assignment'

export const Route = createFileRoute(
  '/_authenticated/academy/$academySlug/courses/$courseSlug/assignments/new'
)({ component: CreateAssignmentPage })
