import { useParams, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
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
} from 'lucide-react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { useCourse } from '@/hooks/use-courses'
import { useSections } from '@/hooks/use-sections'
import type { LessonType } from '@/types/entities/lesson'

// ─── Star Rating ─────────────────────────────────────────────────────────────

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const cls = size === 'lg' ? 'size-5' : size === 'md' ? 'size-4' : 'size-3.5'
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5
  return (
    <div className='flex items-center gap-0.5'>
      {Array.from({ length: full }).map((_, i) => (
        <Star key={i} className={cn(cls, 'fill-amber-400 text-amber-400')} />
      ))}
      {half && <StarHalf className={cn(cls, 'fill-amber-400 text-amber-400')} />}
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
      return <PlayCircle className='size-4 text-primary' />
    case 'text':
      return <BookOpen className='size-4 text-blue-400' />
    case 'document':
      return <FileText className='size-4 text-orange-400' />
    case 'quiz':
    case 'assignment':
      return <FileQuestion className='size-4 text-amber-400' />
    default:
      return <PlayCircle className='size-4 text-primary' />
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

  const { data: course, isLoading: courseLoading, error: courseError } = useCourse(courseSlug)
  const { data: sectionsData, isLoading: sectionsLoading } = useSections(academySlug, courseSlug)

  const sections = Array.isArray(sectionsData) ? sectionsData : []
  const isLoading = courseLoading || sectionsLoading

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className='min-h-screen bg-background'>
        <div className='space-y-4 p-6 max-w-7xl mx-auto pt-24'>
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
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <div className='text-center space-y-2'>
          <h3 className='text-lg font-bold text-destructive'>{t('courseContent.errorTitle')}</h3>
          <p className='text-muted-foreground'>{t('courseContent.errorDescription')}</p>
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
    (acc, s) => acc + (s.lessons?.filter((l) => l.lesson_type === 'video').length ?? 0),
    0
  )
  const totalQuizzes = sections.reduce(
    (acc, s) =>
      acc +
      (s.lessons?.filter((l) => l.lesson_type === 'quiz' || l.lesson_type === 'assignment')
        .length ?? 0),
    0
  )

  const durationHours = course.duration_minutes
    ? `${Math.round(course.duration_minutes / 60)}h`
    : null

  const rating = course.average_rating != null ? Number(course.average_rating) : null

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

  return (
    <div className='min-h-screen bg-background'>
      {/* ── Hero Banner ──────────────────────────────────────────────────────── */}
      <div className='relative overflow-hidden'>
        {/* backgrounds */}
        <div className='absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background' />
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.15),transparent_60%)]' />
        <div
          className='pointer-events-none absolute inset-0 opacity-[0.03]'
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className='relative max-w-7xl mx-auto px-4 lg:px-8 pt-8 pb-12 lg:pb-16'>
          {/* Back */}
          <button
            onClick={() =>
              navigate({
                to: '/academy/$academySlug/my-courses',
                params: { academySlug },
              })
            }
            className='inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6'
          >
            <ArrowLeft className='size-4' />
            {t('courseContent.backToCourses')}
          </button>

          <div className='grid lg:grid-cols-3 gap-8 lg:gap-12'>
            {/* ── Left: course info ─────────────────────────────────────────── */}
            <div className='lg:col-span-2 flex flex-col gap-5'>
              {/* Category & Tags */}
              <div className='flex flex-wrap items-center gap-2'>
                {course.category && (
                  <Badge variant='outline' className='border-primary/40 text-primary bg-primary/10'>
                    {course.category}
                  </Badge>
                )}
                {course.tags?.slice(0, 3).map((tag) => (
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
              <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground text-balance'>
                {course.title}
              </h1>

              {/* Description as subtitle */}
              {course.description && (
                <p className='text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl line-clamp-3'>
                  {course.description}
                </p>
              )}

              {/* Rating & students */}
              {(rating != null || course.enrollment_count != null) && (
                <div className='flex flex-wrap items-center gap-4 text-sm'>
                  {rating != null && (
                    <div className='flex items-center gap-2'>
                      <span className='font-semibold text-amber-400'>{rating.toFixed(1)}</span>
                      <StarRating rating={rating} size='sm' />
                      {course.enrollment_count != null && (
                        <span className='text-muted-foreground'>
                          ({new Intl.NumberFormat(i18n.language).format(course.enrollment_count)} {t('courseContent.reviews')})
                        </span>
                      )}
                    </div>
                  )}
                  {course.enrollment_count != null && (
                    <span className='flex items-center gap-1.5 text-muted-foreground'>
                      <Users className='size-4' />
                      {new Intl.NumberFormat(i18n.language).format(course.enrollment_count)} {t('courseContent.students')}
                    </span>
                  )}
                </div>
              )}

              {/* Instructor */}
              {course.creator?.name && (
                <div className='flex items-center gap-3'>
                  <Avatar className='size-10 border-2 border-primary/20'>
                    <AvatarImage src='' />
                    <AvatarFallback className='bg-primary/10 text-primary text-sm font-medium'>
                      {instructorInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col'>
                    <span className='text-sm font-medium text-foreground'>
                      {t('courseContent.createdBy')} {course.creator.name}
                    </span>
                    {course.academy?.name && (
                      <span className='text-xs text-muted-foreground'>{course.academy.name}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Meta */}
              <div className='flex flex-wrap items-center gap-4 text-xs text-muted-foreground'>
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
              <div className='sticky top-24 rounded-2xl border border-border/60 bg-card overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.2)]'>
                {/* Preview area */}
                {course.promotional_image_url ? (
                  <div
                    className='relative aspect-video bg-cover bg-center'
                    style={{ backgroundImage: `url(${course.promotional_image_url})` }}
                  >
                    <div className='absolute inset-0 bg-black/40 flex items-center justify-center'>
                      {firstLessonId && (
                        <button
                          onClick={() => navigateToLesson(firstLessonId!)}
                          className='flex items-center justify-center size-16 rounded-full bg-primary/90 text-primary-foreground shadow-[0_0_32px_rgba(99,102,241,0.4)] transition-transform hover:scale-105'
                        >
                          <Play className='size-7 ml-1' />
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className='relative aspect-video bg-gradient-to-br from-primary/30 to-primary/5 flex items-center justify-center'>
                    {firstLessonId && (
                      <button
                        onClick={() => navigateToLesson(firstLessonId!)}
                        className='flex items-center justify-center size-16 rounded-full bg-primary/90 text-primary-foreground shadow-[0_0_32px_rgba(99,102,241,0.4)] transition-transform hover:scale-105'
                      >
                        <Play className='size-7 ml-1' />
                      </button>
                    )}
                  </div>
                )}

                <div className='p-5 flex flex-col gap-4'>
                  {/* Progress */}
                  {course.enrolled && (
                    <div className='flex flex-col gap-2'>
                      <div className='flex items-center justify-between text-sm'>
                        <span className='text-muted-foreground'>{t('courseContent.yourProgress')}</span>
                        <span className='font-semibold text-primary'>{Math.round(progressPct)}%</span>
                      </div>
                      <Progress value={progressPct} className='h-2' />
                      <span className='text-xs text-muted-foreground'>
                        {t('courseContent.lessonsCompleted', { completed: completedLessons, total: totalLessons })}
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
                      {progressPct > 0 ? t('courseContent.continueLearning') : t('courseContent.startCourse')}
                    </Button>
                  )}

                  {/* Course includes */}
                  <div className='pt-4 border-t border-border/40 flex flex-col gap-2.5'>
                    <span className='text-sm font-medium text-foreground'>{t('courseContent.courseIncludes')}</span>
                    <div className='flex flex-col gap-2 text-xs text-muted-foreground'>
                      {durationHours && (
                        <span className='flex items-center gap-2'>
                          <PlayCircle className='size-3.5 text-primary' />
                          {t('courseContent.videoDemand', { hours: durationHours })}
                        </span>
                      )}
                      <span className='flex items-center gap-2'>
                        <FileText className='size-3.5 text-blue-400' />
                        {t('courseContent.totalLessons', { count: totalLessons })}
                      </span>
                      {totalQuizzes > 0 && (
                        <span className='flex items-center gap-2'>
                          <FileQuestion className='size-3.5 text-amber-400' />
                          {t('courseContent.interactiveQuizzes', { count: totalQuizzes })}
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
      <div className='max-w-7xl mx-auto px-4 lg:px-8 py-12'>
        <div className='grid lg:grid-cols-3 gap-8 lg:gap-12'>
          <div className='lg:col-span-2 flex flex-col gap-12'>
            {/* What you'll learn */}
            {course.course_objectives && course.course_objectives.length > 0 && (
              <section className='rounded-2xl border border-border/60 bg-card p-6'>
                <h2 className='text-xl font-semibold text-foreground mb-4'>{t('courseContent.whatYouLearn')}</h2>
                <div className='grid sm:grid-cols-2 gap-3'>
                  {course.course_objectives.map((obj) => (
                    <div key={obj.id} className='flex items-start gap-3'>
                      <CheckCircle2 className='size-5 text-emerald-400 mt-0.5 shrink-0' />
                      <span className='text-sm text-muted-foreground'>
                        {obj.formatted_title || obj.title}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Course content */}
            <section>
              <div className='flex items-center justify-between mb-4'>
                <h2 className='text-xl font-semibold text-foreground'>{t('courseContent.courseContentSection')}</h2>
                <span className='text-sm text-muted-foreground'>
                  {durationHours
                    ? t('courseContent.sectionsSummaryWithHours', { sections: sections.length, lessons: totalLessons, hours: durationHours })
                    : t('courseContent.sectionsSummary', { sections: sections.length, lessons: totalLessons })}
                </span>
              </div>

              {sections.length === 0 ? (
                <div className='rounded-2xl border border-border/60 bg-card p-12 text-center text-muted-foreground'>
                  <BookOpen className='mx-auto mb-4 size-10 opacity-40' />
                  <p className='font-medium'>{t('courseContent.noContent')}</p>
                  <p className='mt-1 text-sm'>{t('courseContent.noContentDesc')}</p>
                </div>
              ) : (
                <Accordion
                  type='multiple'
                  defaultValue={sections.slice(0, 2).map((s) => String(s.id))}
                  className='rounded-2xl border border-border/60 bg-card overflow-hidden'
                >
                  {sections.map((section, idx) => {
                    const lessonCount = section.lessons?.length ?? 0
                    return (
                      <AccordionItem
                        key={section.id}
                        value={String(section.id)}
                        className='border-b border-border/40 last:border-b-0'
                      >
                        <AccordionTrigger className='px-5 py-4 hover:no-underline hover:bg-secondary/20 transition-colors'>
                          <div className='flex items-center gap-4 flex-1 min-w-0'>
                            <div className='flex items-center justify-center size-8 rounded-lg bg-primary/10 text-primary text-sm font-semibold shrink-0'>
                              {idx + 1}
                            </div>
                            <div className='flex flex-col items-start gap-0.5 min-w-0 flex-1'>
                              <span className='font-medium text-foreground truncate w-full text-left'>
                                {section.title}
                              </span>
                              <div className='flex items-center gap-3 text-xs text-muted-foreground'>
                                <span>{lessonCount} {t('courseContent.lessonsLabel')}</span>
                              </div>
                            </div>
                            <Badge variant='outline' className='shrink-0 text-xs mr-2'>
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
                                  onClick={() => navigateToLesson(String(lesson.id))}
                                  className='group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-secondary/40 w-full text-left'
                                >
                                  <LessonTypeIcon type={lesson.lesson_type} />
                                  <span className='flex-1 text-sm text-foreground'>
                                    {lesson.title}
                                  </span>
                                  {lesson.is_free && (
                                    <Badge
                                      variant='outline'
                                      className='text-[10px] border-primary/40 text-primary shrink-0'
                                    >
                                      {t('courseContent.previewBadge')}
                                    </Badge>
                                  )}
                                  {lesson.duration_minutes != null && (
                                    <span className='text-xs text-muted-foreground shrink-0'>
                                      {lesson.duration_minutes}{t('courseContent.minLabel')}
                                    </span>
                                  )}
                                  <ChevronRight className='size-4 text-muted-foreground/40 shrink-0' />
                                </button>
                              ))}
                            </div>
                          ) : (
                            <p className='py-3 text-center text-xs text-muted-foreground'>
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
                <h2 className='text-xl font-semibold text-foreground mb-4'>{t('courseContent.descriptionSection')}</h2>
                <p className='text-sm text-muted-foreground leading-relaxed'>
                  {course.description}
                </p>
              </section>
            )}

            {/* Instructor */}
            {course.creator?.name && (
              <section>
                <h2 className='text-xl font-semibold text-foreground mb-4'>{t('courseContent.instructorSection')}</h2>
                <div className='rounded-2xl border border-border/60 bg-card p-5'>
                  <div className='flex items-start gap-4'>
                    <Avatar className='size-16 border-2 border-primary/20'>
                      <AvatarImage src='' />
                      <AvatarFallback className='bg-primary/10 text-primary text-lg font-semibold'>
                        {instructorInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col gap-1'>
                      <h3 className='font-semibold text-foreground'>{course.creator.name}</h3>
                      {course.academy?.name && (
                        <p className='text-sm text-muted-foreground'>{course.academy.name}</p>
                      )}
                      {course.enrollment_count != null && (
                        <div className='flex items-center gap-4 mt-2 text-xs text-muted-foreground'>
                          <span className='flex items-center gap-1.5'>
                            <Users className='size-3.5' />
                            {new Intl.NumberFormat(i18n.language).format(course.enrollment_count)} {t('courseContent.students')}
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
    </div>
  )
}
