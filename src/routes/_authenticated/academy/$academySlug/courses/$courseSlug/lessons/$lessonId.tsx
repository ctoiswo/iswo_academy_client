import { createFileRoute } from '@tanstack/react-router'
import { CoursePlayer } from '@/features/video-player'

function LessonViewerPage() {
  const { academySlug, courseSlug, lessonId } = Route.useParams()

  return (
    <CoursePlayer
      academySlug={academySlug}
      courseSlug={courseSlug}
      lessonId={Number(lessonId)}
    />
  )
}

export const Route = createFileRoute(
  '/_authenticated/academy/$academySlug/courses/$courseSlug/lessons/$lessonId'
)({
  component: LessonViewerPage,
})
