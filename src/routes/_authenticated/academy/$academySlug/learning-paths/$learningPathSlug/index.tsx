import { createFileRoute, Navigate } from '@tanstack/react-router'

function Component() {
  const { academySlug, learningPathSlug } = Route.useParams()
  return (
    <Navigate
      to='/academy/$academySlug/learning-paths/$learningPathSlug/info'
      params={{ academySlug, learningPathSlug }}
    />
  )
}

export const Route = createFileRoute(
  '/_authenticated/academy/$academySlug/learning-paths/$learningPathSlug/'
)({
  component: Component,
})
