import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/academy/$academySlug/learning-paths/$learningPathSlug/'
)({
  component: () => {
    const { academySlug, learningPathSlug } = Route.useParams()
    return (
      <Navigate
        to="/academy/$academySlug/learning-paths/$learningPathSlug/info"
        params={{ academySlug, learningPathSlug }}
      />
    )
  },
})
