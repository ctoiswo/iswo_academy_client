import { createFileRoute } from '@tanstack/react-router'
import { CreateAcademyPage } from '@/features/create-academy'
import { AuthGuard } from '@/components/route-guards'

function CreateAcademyRoute() {
  return (
    <AuthGuard>
      <CreateAcademyPage />
    </AuthGuard>
  )
}

export const Route = createFileRoute('/create-academy/')({
  component: CreateAcademyRoute,
})
