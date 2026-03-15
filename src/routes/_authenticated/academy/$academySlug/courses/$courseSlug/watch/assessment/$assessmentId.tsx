import { createFileRoute } from '@tanstack/react-router'
import { CoursePlayer } from '@/features/video-player'

function AssessmentViewerPage() {
  const { academySlug, courseSlug, assessmentId } = Route.useParams()

  return (
    <CoursePlayer
      academySlug={academySlug}
      courseSlug={courseSlug}
      assessmentId={Number(assessmentId)}
    />
  )
}

export const Route = createFileRoute(
  '/_authenticated/academy/$academySlug/courses/$courseSlug/watch/assessment/$assessmentId'
)({
  component: AssessmentViewerPage,
})
