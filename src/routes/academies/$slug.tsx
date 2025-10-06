import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/academies/$slug')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/academies/$slug"!</div>
}
