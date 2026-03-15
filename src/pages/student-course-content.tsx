import { useState } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import type { LessonType } from '@/types/entities/lesson'
import {
  ArrowLeft,
  Award,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileQuestion,
  FileText,
  Play,
  PlayCircle,
  Star,
  StarHalf,
  Users,
  X,
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { useCourse } from '@/hooks/use-courses'
import { useSections } from '@/hooks/use-sections'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'

// ─── Star Rating ─────────────────────────────────────────────────────────────

function StarRating({
  rating,
  size = 'sm',
}: {
  rating: number
  size?: 'sm' | 'md' | 'lg'
}) {
  const cls = size === 'lg' ? 'size-5' : size === 'md' ? 'size-4' : 'size-3.5'
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5
  return (
    <div className='flex items-center gap-0.5'>
      {Array.from({ length: full }).map((_, i) => (
        <Star key={i} className={cn(cls, 'fill-amber-400 text-amber-400')} />
      ))}
      {half && (
        <StarHalf className={cn(cls, 'fill-amber-400 text-amber-400')} />
      )}
      {Array.from({ length: 5 - Math.ceil(rating) }).map((_, i) => (
        <Star key={`e${i}`} className={cn(cls, 'text-muted-foreground/30')} />
      ))}
    </div>
  )
}

// ─── Lesson Icon ──────────────────────────────────────────────────────────────

function LessonTypeIcon({ type }: { type: LessonType }) {
  switch (type) {
    case 'video':
      return <PlayCircle className='text-primary size-4' />
    case 'text':
      return <BookOpen className='size-4 text-blue-400' />
    case 'document':
      return <FileText className='size-4 text-orange-400' />
    case 'quiz':
    case 'assignment':
      return <FileQuestion className='size-4 text-amber-400' />
    default:
      return <PlayCircle className='text-primary size-4' />
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StudentCourseContentPage() {
  const params = useParams({ strict: false }) as {
    academySlug: string
    courseSlug: string
  }
  const { academySlug, courseSlug } = params
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()

  const {
    data: course,
    isLoading: courseLoading,
    error: courseError,
  } = useCourse(courseSlug, academySlug)
  const { data: sectionsData, isLoading: sectionsLoading } = useSections(
    academySlug,
    courseSlug
  )

  const sections = Array.isArray(sectionsData) ? sectionsData : []
  const isLoading = courseLoading || sectionsLoading

  const [showVideoModal, setShowVideoModal] = useState(false)

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className='bg-background min-h-screen'>
        <div className='mx-auto max-w-7xl space-y-4 p-6 pt-24'>
          <Skeleton className='h-10 w-48' />
          <Skeleton className='h-12 w-3/4' />
          <Skeleton className='h-6 w-1/2' />
          <Skeleton className='h-56 w-full rounded-xl' />
        </div>
      </div>
    )
  }

  if (courseError || !course) {
    return (
      <div className='bg-background flex min-h-screen items-center justify-center'>
        <div className='space-y-2 text-center'>
          <h3 className='text-destructive text-lg font-bold'>
            {t('courseContent.errorTitle')}
          </h3>
          <p className='text-muted-foreground'>
            {t('courseContent.errorDescription')}
          </p>
        </div>
      </div>
    )
  }

  // ── Derived values ───────────────────────────────────────────────────────────
  const completedLessons = course.progress?.completed_lessons ?? 0
  const totalLessons =
    course.progress?.total_lessons ||
    course.total_lessons ||
    sections.reduce((acc, s) => acc + (s.lessons?.length || 0), 0)
  const progressPct = course.progress?.completion_percentage ?? 0

  const totalVideos = sections.reduce(
    (acc, s) =>
      acc + (s.lessons?.filter((l) => l.lesson_type === 'video').length ?? 0),
    0
  )
  const totalQuizzes = sections.reduce(
    (acc, s) =>
      acc +
      (s.lessons?.filter(
        (l) => l.lesson_type === 'quiz' || l.lesson_type === 'assignment'
      ).length ?? 0),
    0
  )

  const durationHours = course.duration_minutes
    ? `${Math.round(course.duration_minutes / 60)}h`
    : null

  const rating =
    course.average_rating != null ? Number(course.average_rating) : null

  const updatedAt = course.updated_at
    ? new Date(course.updated_at).toLocaleDateString(i18n.language, {
        month: 'long',
        year: 'numeric',
      })
    : null

  const instructorInitials = course.creator?.name
    ? course.creator.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : '?'

  // First lesson CTA
  let firstLessonId: string | null = null
  outerLoop: for (const section of sections) {
    for (const lesson of section.lessons ?? []) {
      firstLessonId = String(lesson.id)
      break outerLoop
    }
  }

  const navigateToLesson = (lessonId: string) =>
    navigate({
      to: '/academy/$academySlug/courses/$courseSlug/watch/$lessonId',
      params: { academySlug, courseSlug, lessonId },
    })

  const hasPromoVideo =
    course.promotional_video_embedded_url || course.promotional_video_url

  return (
    <div className='bg-background min-h-screen'>
      {/* ── Hero Banner ──────────────────────────────────────────────────────── */}
      <div className='relative overflow-hidden'>
        {/* promotional image fading to background */}
        {course.promotional_image_url ? (
          <>
            <div
              className='absolute inset-0 bg-cover bg-center'
              style={{ backgroundImage: `url(${course.promotional_image_url})` }}
            />
            {/* fade-out overlay: dark tint on top, full background color at bottom */}
            <div className='absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background' />
          </>
        ) : (
          <>
            <div className='from-primary/20 via-background to-background absolute inset-0 bg-gradient-to-br' />
            <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.15),transparent_60%)]' />
          </>
        )}
        <div
          className='pointer-events-none absolute inset-0 opacity-[0.03]'
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className='relative mx-auto max-w-7xl px-4 pt-8 pb-12 lg:px-8 lg:pb-16'>
          {/* Back */}
          <button
            onClick={() =>
              navigate({
                to: '/academy/$academySlug/my-courses',
                params: { academySlug },
              })
            }
            className='text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-2 text-sm transition-colors'
          >
            <ArrowLeft className='size-4' />
            {t('courseContent.backToCourses')}
          </button>

          <div className='grid gap-8 lg:grid-cols-3 lg:gap-12'>
            {/* ── Left: course info ─────────────────────────────────────────── */}
            <div className='flex flex-col gap-5 lg:col-span-2'>
              {/* Category & Tags */}
              <div className='flex flex-wrap items-center gap-2'>
                {course.category && (
                  <Badge
                    variant='outline'
                    className='border-primary/40 text-primary bg-primary/10'
                  >
                    {course.category}
                  </Badge>
                )}
                {[...new Set(course.tags ?? [])]
                  .slice(0, 3)
                  .map((tag: string) => (
                    <Badge
                      key={tag}
                      variant='outline'
                      className='border-border/60 text-muted-foreground'
                    >
                      {tag}
                    </Badge>
                  ))}
              </div>

              {/* Title */}
              <h1 className='text-foreground text-3xl font-bold tracking-tight text-balance md:text-4xl lg:text-5xl'>
                {course.title}
              </h1>

              {/* Description as subtitle */}
              {course.description && (
                <p className='text-muted-foreground line-clamp-3 max-w-2xl text-base leading-relaxed md:text-lg'>
                  {course.description}
                </p>
              )}

              {/* Rating & students */}
              {(rating != null || course.enrollment_count != null) && (
                <div className='flex flex-wrap items-center gap-4 text-sm'>
                  {rating != null && (
                    <div className='flex items-center gap-2'>
                      <span className='font-semibold text-amber-400'>
                        {rating.toFixed(1)}
                      </span>
                      <StarRating rating={rating} size='sm' />
                      {course.enrollment_count != null && (
                        <span className='text-muted-foreground'>
                          (
                          {new Intl.NumberFormat(i18n.language).format(
                            course.enrollment_count
                          )}{' '}
                          {t('courseContent.reviews')})
                        </span>
                      )}
                    </div>
                  )}
                  {course.enrollment_count != null && (
                    <span className='text-muted-foreground flex items-center gap-1.5'>
                      <Users className='size-4' />
                      {new Intl.NumberFormat(i18n.language).format(
                        course.enrollment_count
                      )}{' '}
                      {t('courseContent.students')}
                    </span>
                  )}
                </div>
              )}

              {/* Instructor */}
              {course.creator?.name && (
                <div className='flex items-center gap-3'>
                  <Avatar className='border-primary/20 size-10 border-2'>
                    <AvatarImage src='' />
                    <AvatarFallback className='bg-primary/10 text-primary text-sm font-medium'>
                      {instructorInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col'>
                    <span className='text-foreground text-sm font-medium'>
                      {t('courseContent.createdBy')} {course.creator.name}
                    </span>
                    {course.academy?.name && (
                      <span className='text-muted-foreground text-xs'>
                        {course.academy.name}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Meta */}
              <div className='text-muted-foreground flex flex-wrap items-center gap-4 text-xs'>
                {updatedAt && (
                  <span className='flex items-center gap-1.5'>
                    <Clock className='size-3.5' />
                    {t('courseContent.updatedAt')} {updatedAt}
                  </span>
                )}
                {course.difficulty_level && (
                  <span className='flex items-center gap-1.5'>
                    <BarChart3 className='size-3.5' />
                    {t(`myCourses.difficulty.${course.difficulty_level}`)}
                  </span>
                )}
              </div>
            </div>

            {/* ── Right: Sticky CTA card ────────────────────────────────────── */}
            <div className='lg:row-span-1'>
              <div className='border-border/60 bg-card sticky top-24 overflow-hidden rounded-2xl border shadow-[0_8px_32px_rgba(0,0,0,0.2)]'>
                {/* Preview area */}
                {course.promotional_image_url ? (
                  <div
                    className='relative aspect-video bg-cover bg-center'
                    style={{
                      backgroundImage: `url(${course.promotional_image_url})`,
                    }}
                  >
                    <div className='absolute inset-0 flex items-center justify-center bg-black/40'>
                      {hasPromoVideo ? (
                        <button
                          onClick={() => setShowVideoModal(true)}
                          className='bg-primary/90 text-primary-foreground flex size-16 items-center justify-center rounded-full shadow-[0_0_32px_rgba(99,102,241,0.4)] transition-transform hover:scale-105'
                        >
                          <Play className='ml-1 size-7' />
                        </button>
                      ) : firstLessonId ? (
                        <button
                          onClick={() => navigateToLesson(firstLessonId!)}
                          className='bg-primary/90 text-primary-foreground flex size-16 items-center justify-center rounded-full shadow-[0_0_32px_rgba(99,102,241,0.4)] transition-transform hover:scale-105'
                        >
                          <Play className='ml-1 size-7' />
                        </button>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <div className='from-primary/30 to-primary/5 relative flex aspect-video items-center justify-center bg-gradient-to-br'>
                    {hasPromoVideo ? (
                      <button
                        onClick={() => setShowVideoModal(true)}
                        className='bg-primary/90 text-primary-foreground flex size-16 items-center justify-center rounded-full shadow-[0_0_32px_rgba(99,102,241,0.4)] transition-transform hover:scale-105'
                      >
                        <Play className='ml-1 size-7' />
                      </button>
                    ) : firstLessonId ? (
                      <button
                        onClick={() => navigateToLesson(firstLessonId!)}
                        className='bg-primary/90 text-primary-foreground flex size-16 items-center justify-center rounded-full shadow-[0_0_32px_rgba(99,102,241,0.4)] transition-transform hover:scale-105'
                      >
                        <Play className='ml-1 size-7' />
                      </button>
                    ) : null}
                  </div>
                )}

                <div className='flex flex-col gap-4 p-5'>
                  {/* Progress */}
                  {course.enrolled && (
                    <div className='flex flex-col gap-2'>
                      <div className='flex items-center justify-between text-sm'>
                        <span className='text-muted-foreground'>
                          {t('courseContent.yourProgress')}
                        </span>
                        <span className='text-primary font-semibold'>
                          {Math.round(progressPct)}%
                        </span>
                      </div>
                      <Progress value={progressPct} className='h-2' />
                      <span className='text-muted-foreground text-xs'>
                        {t('courseContent.lessonsCompleted', {
                          completed: completedLessons,
                          total: totalLessons,
                        })}
                      </span>
                    </div>
                  )}

                  {firstLessonId && (
                    <Button
                      size='lg'
                      className='w-full gap-2 shadow-[0_0_20px_rgba(99,102,241,0.25)]'
                      onClick={() => navigateToLesson(firstLessonId!)}
                    >
                      <Play className='size-4' />
                      {progressPct > 0
                        ? t('courseContent.continueLearning')
                        : t('courseContent.startCourse')}
                    </Button>
                  )}

                  {/* Course includes */}
                  <div className='border-border/40 flex flex-col gap-2.5 border-t pt-4'>
                    <span className='text-foreground text-sm font-medium'>
                      {t('courseContent.courseIncludes')}
                    </span>
                    <div className='text-muted-foreground flex flex-col gap-2 text-xs'>
                      {durationHours && (
                        <span className='flex items-center gap-2'>
                          <PlayCircle className='text-primary size-3.5' />
                          {t('courseContent.videoDemand', {
                            hours: durationHours,
                          })}
                        </span>
                      )}
                      <span className='flex items-center gap-2'>
                        <FileText className='size-3.5 text-blue-400' />
                        {t('courseContent.totalLessons', {
                          count: totalLessons,
                        })}
                      </span>
                      {totalQuizzes > 0 && (
                        <span className='flex items-center gap-2'>
                          <FileQuestion className='size-3.5 text-amber-400' />
                          {t('courseContent.interactiveQuizzes', {
                            count: totalQuizzes,
                          })}
                        </span>
                      )}
                      {course.certificate_enabled && (
                        <span className='flex items-center gap-2'>
                          <Award className='size-3.5 text-emerald-400' />
                          {t('courseContent.certificate')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <div className='mx-auto max-w-7xl px-4 py-12 lg:px-8'>
        <div className='grid gap-8 lg:grid-cols-3 lg:gap-12'>
          <div className='flex flex-col gap-12 lg:col-span-2'>
            {/* What you'll learn */}
            {course.course_objectives &&
              course.course_objectives.length > 0 && (
                <section className='border-border/60 bg-card rounded-2xl border p-6'>
                  <h2 className='text-foreground mb-4 text-xl font-semibold'>
                    {t('courseContent.whatYouLearn')}
                  </h2>
                  <div className='grid gap-3 sm:grid-cols-2'>
                    {course.course_objectives.map((obj) => (
                      <div key={obj.id} className='flex items-start gap-3'>
                        <CheckCircle2 className='mt-0.5 size-5 shrink-0 text-emerald-400' />
                        <span className='text-muted-foreground text-sm'>
                          {obj.formatted_title || obj.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

            {/* Course content */}
            <section>
              <div className='mb-4 flex items-center justify-between'>
                <h2 className='text-foreground text-xl font-semibold'>
                  {t('courseContent.courseContentSection')}
                </h2>
                <span className='text-muted-foreground text-sm'>
                  {durationHours
                    ? t('courseContent.sectionsSummaryWithHours', {
                        sections: sections.length,
                        lessons: totalLessons,
                        hours: durationHours,
                      })
                    : t('courseContent.sectionsSummary', {
                        sections: sections.length,
                        lessons: totalLessons,
                      })}
                </span>
              </div>

              {sections.length === 0 ? (
                <div className='border-border/60 bg-card text-muted-foreground rounded-2xl border p-12 text-center'>
                  <BookOpen className='mx-auto mb-4 size-10 opacity-40' />
                  <p className='font-medium'>{t('courseContent.noContent')}</p>
                  <p className='mt-1 text-sm'>
                    {t('courseContent.noContentDesc')}
                  </p>
                </div>
              ) : (
                <Accordion
                  type='multiple'
                  defaultValue={sections.slice(0, 2).map((s) => String(s.id))}
                  className='border-border/60 bg-card overflow-hidden rounded-2xl border'
                >
                  {sections.map((section, idx) => {
                    const lessonCount = section.lessons?.length ?? 0
                    const completedCount = section.lessons?.filter(
                      (l) => l.is_completed
                    ).length ?? 0
                    const sectionDone =
                      lessonCount > 0 && completedCount === lessonCount
                    return (
                      <AccordionItem
                        key={section.id}
                        value={String(section.id)}
                        className='border-border/40 border-b last:border-b-0'
                      >
                        <AccordionTrigger className='hover:bg-secondary/20 px-5 py-4 transition-colors hover:no-underline'>
                          <div className='flex min-w-0 flex-1 items-center gap-4'>
                            {sectionDone ? (
                              <div className='flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15'>
                                <CheckCircle2 className='size-5 text-emerald-500' />
                              </div>
                            ) : (
                              <div className='bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-lg text-sm font-semibold'>
                                {idx + 1}
                              </div>
                            )}
                            <div className='flex min-w-0 flex-1 flex-col items-start gap-0.5'>
                              <span
                                className={cn(
                                  'w-full truncate text-left font-medium',
                                  sectionDone
                                    ? 'text-emerald-500'
                                    : 'text-foreground'
                                )}
                              >
                                {section.title}
                              </span>
                              <div className='text-muted-foreground flex items-center gap-3 text-xs'>
                                <span>
                                  {lessonCount}{' '}
                                  {t('courseContent.lessonsLabel')}
                                </span>
                                {course.enrolled && lessonCount > 0 && (
                                  <span className='text-emerald-500'>
                                    {completedCount}/{lessonCount}
                                  </span>
                                )}
                              </div>
                            </div>
                            <Badge
                              variant='outline'
                              className={cn(
                                'mr-2 shrink-0 text-xs',
                                sectionDone &&
                                  'border-emerald-500/40 bg-emerald-500/10 text-emerald-500'
                              )}
                            >
                              {lessonCount}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className='px-5 pb-4'>
                          {section.lessons && section.lessons.length > 0 ? (
                            <div className='flex flex-col gap-1'>
                              {section.lessons.map((lesson) => (
                                <button
                                  key={lesson.id}
                                  onClick={() =>
                                    navigateToLesson(String(lesson.id))
                                  }
                                  className={cn(
                                    'group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
                                    lesson.is_completed
                                      ? 'hover:bg-emerald-500/10'
                                      : 'hover:bg-secondary/40'
                                  )}
                                >
                                  {lesson.is_completed ? (
                                    <CheckCircle2 className='size-4 shrink-0 text-emerald-500' />
                                  ) : (
                                    <LessonTypeIcon type={lesson.lesson_type} />
                                  )}
                                  <span
                                    className={cn(
                                      'flex-1 text-sm',
                                      lesson.is_completed
                                        ? 'text-emerald-600 line-through dark:text-emerald-400'
                                        : 'text-foreground'
                                    )}
                                  >
                                    {lesson.title}
                                  </span>
                                  {lesson.is_free && (
                                    <Badge
                                      variant='outline'
                                      className='border-primary/40 text-primary shrink-0 text-[10px]'
                                    >
                                      {t('courseContent.previewBadge')}
                                    </Badge>
                                  )}
                                  {lesson.duration_minutes != null && (
                                    <span className='text-muted-foreground shrink-0 text-xs'>
                                      {lesson.duration_minutes}
                                      {t('courseContent.minLabel')}
                                    </span>
                                  )}
                                  <ChevronRight className='text-muted-foreground/40 size-4 shrink-0' />
                                </button>
                              ))}
                            </div>
                          ) : (
                            <p className='text-muted-foreground py-3 text-center text-xs'>
                              {t('courseContent.noLessonsInSection')}
                            </p>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    )
                  })}
                </Accordion>
              )}
            </section>

            {/* Description */}
            {course.description && (
              <section>
                <h2 className='text-foreground mb-4 text-xl font-semibold'>
                  {t('courseContent.descriptionSection')}
                </h2>
                <p className='text-muted-foreground text-sm leading-relaxed'>
                  {course.description}
                </p>
              </section>
            )}

            {/* Instructor */}
            {course.creator?.name && (
              <section>
                <h2 className='text-foreground mb-4 text-xl font-semibold'>
                  {t('courseContent.instructorSection')}
                </h2>
                <div className='border-border/60 bg-card rounded-2xl border p-5'>
                  <div className='flex items-start gap-4'>
                    <Avatar className='border-primary/20 size-16 border-2'>
                      <AvatarImage src='' />
                      <AvatarFallback className='bg-primary/10 text-primary text-lg font-semibold'>
                        {instructorInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col gap-1'>
                      <h3 className='text-foreground font-semibold'>
                        {course.creator.name}
                      </h3>
                      {course.academy?.name && (
                        <p className='text-muted-foreground text-sm'>
                          {course.academy.name}
                        </p>
                      )}
                      {course.enrollment_count != null && (
                        <div className='text-muted-foreground mt-2 flex items-center gap-4 text-xs'>
                          <span className='flex items-center gap-1.5'>
                            <Users className='size-3.5' />
                            {new Intl.NumberFormat(i18n.language).format(
                              course.enrollment_count
                            )}{' '}
                            {t('courseContent.students')}
                          </span>
                          <span className='flex items-center gap-1.5'>
                            <PlayCircle className='size-3.5' />
                            {totalVideos} {t('courseContent.videosLabel')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Empty space for sticky card on large screens */}
          <div className='hidden lg:block' />
        </div>
      </div>

      {/* Promotional Video Modal */}
      <AnimatePresence>
        {showVideoModal && hasPromoVideo && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className='fixed inset-0 z-50 bg-black/90 backdrop-blur-sm'
              onClick={() => setShowVideoModal(false)}
            />
            <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 20 }}
                transition={{
                  type: 'spring',
                  damping: 25,
                  stiffness: 300,
                  duration: 0.4,
                }}
                className='relative w-full max-w-5xl'
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowVideoModal(false)}
                  className='absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-white/20'
                  aria-label='Close video'
                >
                  <X className='h-6 w-6' />
                </button>
                <div className='relative aspect-video overflow-hidden rounded-xl bg-black shadow-2xl'>
                  {course.promotional_video_embedded_url ? (
                    <iframe
                      src={`${course.promotional_video_embedded_url}?autoplay=1`}
                      className='h-full w-full'
                      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                      allowFullScreen
                      title={`${course.title} - Preview`}
                    />
                  ) : (
                    <video
                      src={course.promotional_video_url}
                      className='h-full w-full'
                      controls
                      autoPlay
                    />
                  )}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
