import {
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react'
import { useNavigate } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  Settings,
  CheckCircle2,
  PlayCircle,
  BookOpen,
  FileQuestion,
  ChevronLeft,
  ChevronRight,
  Clock,
  Menu,
  X,
  FileText,
} from 'lucide-react'
import { useSections } from '@/hooks/use-sections'
import { lessonService } from '@/services/lesson-service'
import { useQuery } from '@tanstack/react-query'
import type { Lesson, Section } from '@/types'

// ─── Types ────────────────────────────────────────────────────────────────────

interface CoursePlayerProps {
  academySlug: string
  courseSlug: string
  lessonId: number
}

// ─── Video Player ─────────────────────────────────────────────────────────────

function VideoPlayer({
  lesson,
  onComplete,
}: {
  lesson: Lesson
  onComplete: () => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const controlsTimeout = useRef<ReturnType<typeof setTimeout>>(undefined)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showSettings, setShowSettings] = useState(false)
  const [completedOnce, setCompletedOnce] = useState(false)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }, [isPlaying])

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
      if (
        !completedOnce &&
        videoRef.current.duration > 0 &&
        videoRef.current.currentTime / videoRef.current.duration > 0.9
      ) {
        setCompletedOnce(true)
        onComplete()
      }
    }
  }

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const handleVolumeChange = (value: number[]) => {
    if (videoRef.current) {
      const newVolume = value[0]
      videoRef.current.volume = newVolume
      setVolume(newVolume)
      setIsMuted(newVolume === 0)
    }
  }

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }, [isMuted])

  const toggleFullscreen = useCallback(() => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen()
        setIsFullscreen(true)
      } else {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }, [])

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds
    }
  }

  const changePlaybackRate = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate
      setPlaybackRate(rate)
      setShowSettings(false)
    }
  }

  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current)
    controlsTimeout.current = setTimeout(() => {
      if (isPlaying) setShowControls(false)
    }, 3000)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.code === 'Space') {
        e.preventDefault()
        togglePlay()
      } else if (e.code === 'ArrowRight') {
        skip(10)
      } else if (e.code === 'ArrowLeft') {
        skip(-10)
      } else if (e.code === 'KeyM') {
        toggleMute()
      } else if (e.code === 'KeyF') {
        toggleFullscreen()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [togglePlay, toggleMute, toggleFullscreen])

  // Determine the actual video src from provider
  const getVideoSrc = (): string | undefined => {
    if (lesson.video_url) return lesson.video_url
    if (lesson.video_provider === 'youtube' && lesson.video_identifier) {
      // Return undefined — we'll render an iframe embed instead
      return undefined
    }
    return undefined
  }

  const isYouTube =
    lesson.video_provider === 'youtube' && !!lesson.video_identifier
  const isVimeo =
    lesson.video_provider === 'vimeo' && !!lesson.video_identifier
  const videoSrc = getVideoSrc()

  // YouTube / Vimeo: embed iframe
  if (isYouTube || isVimeo) {
    const src = isYouTube
      ? `https://www.youtube.com/embed/${lesson.video_identifier}?autoplay=0&rel=0`
      : `https://player.vimeo.com/video/${lesson.video_identifier}`

    return (
      <div className='relative w-full aspect-video bg-black rounded-xl overflow-hidden'>
        <iframe
          src={src}
          className='w-full h-full'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
          title={lesson.title}
        />
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className='relative w-full aspect-video bg-black rounded-xl overflow-hidden'
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Gradient placeholder shown when no real video file */}
      {!videoSrc && (
        <div className='absolute inset-0 bg-gradient-to-br from-indigo-950 via-background to-indigo-950/50 flex items-center justify-center'>
          <div className='text-center'>
            <PlayCircle className='size-20 text-primary/40 mx-auto mb-4' />
            <p className='text-muted-foreground text-sm'>{lesson.title}</p>
            <p className='text-muted-foreground/60 text-xs mt-1'>
              Video no disponible
            </p>
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        src={videoSrc}
        className={cn(
          'w-full h-full object-cover absolute inset-0',
          !videoSrc && 'opacity-0'
        )}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => {
          if (videoRef.current) setDuration(videoRef.current.duration)
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Play / Pause overlay */}
      <button
        onClick={togglePlay}
        className={cn(
          'absolute inset-0 flex items-center justify-center transition-opacity duration-300',
          isPlaying && !showControls ? 'opacity-0' : 'opacity-100'
        )}
      >
        <div
          className={cn(
            'size-20 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center',
            'transition-all duration-300 hover:bg-primary/30 hover:scale-110',
            'shadow-[0_0_40px_rgba(99,102,241,0.3)]'
          )}
        >
          {isPlaying ? (
            <Pause className='size-8 text-primary-foreground' />
          ) : (
            <Play className='size-8 text-primary-foreground ml-1' />
          )}
        </div>
      </button>

      {/* Controls */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 px-4 pb-4 pt-16',
          'bg-gradient-to-t from-black/90 via-black/50 to-transparent',
          'transition-opacity duration-300',
          showControls ? 'opacity-100' : 'opacity-0'
        )}
      >
        {/* Seek bar */}
        <div className='mb-3'>
          <Slider
            value={[currentTime]}
            max={duration || 1}
            step={1}
            onValueChange={handleSeek}
            className='cursor-pointer'
          />
        </div>

        {/* Controls row */}
        <div className='flex items-center justify-between gap-4'>
          <div className='flex items-center gap-2'>
            <button
              onClick={() => skip(-10)}
              className='p-2 rounded-lg hover:bg-white/10 transition-colors'
              title='Retroceder 10s'
            >
              <SkipBack className='size-5 text-white' />
            </button>
            <button
              onClick={togglePlay}
              className='p-2 rounded-lg hover:bg-white/10 transition-colors'
            >
              {isPlaying ? (
                <Pause className='size-5 text-white' />
              ) : (
                <Play className='size-5 text-white' />
              )}
            </button>
            <button
              onClick={() => skip(10)}
              className='p-2 rounded-lg hover:bg-white/10 transition-colors'
              title='Avanzar 10s'
            >
              <SkipForward className='size-5 text-white' />
            </button>

            {/* Volume */}
            <div className='flex items-center gap-2 group/vol'>
              <button
                onClick={toggleMute}
                className='p-2 rounded-lg hover:bg-white/10 transition-colors'
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className='size-5 text-white' />
                ) : (
                  <Volume2 className='size-5 text-white' />
                )}
              </button>
              <div className='w-0 group-hover/vol:w-20 overflow-hidden transition-all duration-300'>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={1}
                  step={0.05}
                  onValueChange={handleVolumeChange}
                  className='cursor-pointer'
                />
              </div>
            </div>

            <span className='text-xs text-white/80 font-mono ml-2'>
              {formatTime(currentTime)} / {formatTime(duration || 0)}
            </span>
          </div>

          <div className='flex items-center gap-2'>
            {/* Playback speed */}
            <div className='relative'>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className='p-2 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-1'
              >
                <Settings className='size-5 text-white' />
                <span className='text-xs text-white/80'>{playbackRate}x</span>
              </button>
              {showSettings && (
                <div className='absolute bottom-full right-0 mb-2 py-2 bg-popover border border-border rounded-lg shadow-xl min-w-[100px]'>
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => changePlaybackRate(rate)}
                      className={cn(
                        'w-full px-4 py-1.5 text-sm text-left hover:bg-accent transition-colors',
                        playbackRate === rate && 'text-primary font-medium'
                      )}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={toggleFullscreen}
              className='p-2 rounded-lg hover:bg-white/10 transition-colors'
            >
              {isFullscreen ? (
                <Minimize className='size-5 text-white' />
              ) : (
                <Maximize className='size-5 text-white' />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Reading Content ──────────────────────────────────────────────────────────

function ReadingContent({
  lesson,
  onComplete,
}: {
  lesson: Lesson
  onComplete: () => void
}) {
  const [progress, setProgress] = useState(0)
  const [completedOnce, setCompletedOnce] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const handleScroll = () => {
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current
      const scrollable = scrollHeight - clientHeight
      const scrollProgress = scrollable > 0 ? (scrollTop / scrollable) * 100 : 100
      setProgress(scrollProgress)
      if (!completedOnce && scrollProgress > 90) {
        setCompletedOnce(true)
        onComplete()
      }
    }
  }

  const rawContent = lesson.content || ''

  return (
    <div className='flex flex-col h-full bg-card rounded-xl border border-border overflow-hidden'>
      {/* Header */}
      <div className='flex items-center justify-between px-6 py-4 border-b border-border bg-secondary/20'>
        <div className='flex items-center gap-3'>
          <div className='flex items-center justify-center size-10 rounded-lg bg-primary/10'>
            <BookOpen className='size-5 text-primary' />
          </div>
          <div>
            <h2 className='font-semibold text-foreground'>{lesson.title}</h2>
            {lesson.duration_minutes && (
              <p className='text-xs text-muted-foreground'>
                Lectura estimada: {lesson.duration_minutes} min
              </p>
            )}
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <span className='text-xs text-muted-foreground'>
            {Math.round(progress)}% leído
          </span>
          <div className='w-24'>
            <Progress value={progress} className='h-1.5' />
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        onScroll={handleScroll}
        className='flex-1 overflow-y-auto px-8 py-6 prose prose-invert prose-sm max-w-none'
        dangerouslySetInnerHTML={{ __html: rawContent }}
      />

      {/* Footer */}
      <div className='px-6 py-4 border-t border-border bg-secondary/20'>
        <Button
          onClick={onComplete}
          className='w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90'
        >
          <CheckCircle2 className='size-4' />
          Marcar como completado
        </Button>
      </div>
    </div>
  )
}

// ─── Document Content ─────────────────────────────────────────────────────────

function DocumentContent({ lesson, onComplete }: { lesson: Lesson; onComplete: () => void }) {
  return (
    <div className='flex flex-col h-full bg-card rounded-xl border border-border overflow-hidden'>
      <div className='flex items-center justify-between px-6 py-4 border-b border-border bg-secondary/20'>
        <div className='flex items-center gap-3'>
          <div className='flex items-center justify-center size-10 rounded-lg bg-primary/10'>
            <FileText className='size-5 text-primary' />
          </div>
          <h2 className='font-semibold text-foreground'>{lesson.title}</h2>
        </div>
      </div>
      <div className='flex-1 flex items-center justify-center p-8 text-muted-foreground'>
        <div className='text-center'>
          <FileText className='size-12 mx-auto mb-4 opacity-40' />
          <p className='text-sm'>Documento no disponible en este momento.</p>
        </div>
      </div>
      <div className='px-6 py-4 border-t border-border bg-secondary/20'>
        <Button
          onClick={onComplete}
          className='w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90'
        >
          <CheckCircle2 className='size-4' />
          Marcar como completado
        </Button>
      </div>
    </div>
  )
}

// ─── Course Sidebar ───────────────────────────────────────────────────────────

function CourseSidebar({
  sections,
  currentLessonId,
  completedIds,
  onLessonSelect,
  courseProgress,
  isOpen,
  onToggle,
}: {
  sections: Section[]
  currentLessonId: number
  completedIds: Set<number>
  onLessonSelect: (lesson: Lesson) => void
  courseProgress: number
  isOpen: boolean
  onToggle: () => void
}) {
  const currentSectionId = sections
    .find((s) => s.lessons?.some((l) => l.id === currentLessonId))
    ?.id?.toString()

  const getLessonIcon = (lesson: Lesson) => {
    if (completedIds.has(lesson.id)) return CheckCircle2
    if (lesson.lesson_type === 'video') return PlayCircle
    if (lesson.lesson_type === 'text') return BookOpen
    if (lesson.lesson_type === 'quiz') return FileQuestion
    if (lesson.lesson_type === 'document') return FileText
    return BookOpen
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className='fixed inset-0 bg-black/60 z-40 lg:hidden'
          onClick={onToggle}
        />
      )}

      <aside
        className={cn(
          'fixed lg:relative inset-y-0 right-0 z-50 lg:z-auto',
          'w-80 bg-card border-l border-border flex flex-col',
          'transform transition-transform duration-300 lg:transform-none',
          isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header */}
        <div className='flex items-center justify-between px-4 py-4 border-b border-border'>
          <div>
            <h3 className='font-semibold text-foreground text-sm'>
              Contenido del curso
            </h3>
            <p className='text-xs text-muted-foreground mt-0.5'>
              {courseProgress}% completado
            </p>
          </div>
          <button
            onClick={onToggle}
            className='lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors'
          >
            <X className='size-5 text-muted-foreground' />
          </button>
        </div>

        {/* Progress */}
        <div className='px-4 py-3 border-b border-border'>
          <Progress value={courseProgress} className='h-1.5' />
        </div>

        {/* Sections */}
        <div className='flex-1 overflow-y-auto'>
          <Accordion
            type='single'
            collapsible
            defaultValue={currentSectionId}
            className='w-full'
          >
            {sections.map((section) => {
              const lessons = section.lessons ?? []
              const completedCount = lessons.filter((l) =>
                completedIds.has(l.id)
              ).length
              const sectionProgress =
                lessons.length > 0
                  ? Math.round((completedCount / lessons.length) * 100)
                  : 0

              return (
                <AccordionItem
                  key={section.id}
                  value={section.id.toString()}
                  className='border-b border-border'
                >
                  <AccordionTrigger className='px-4 py-3 hover:no-underline hover:bg-secondary/30'>
                    <div className='flex flex-col items-start gap-1 text-left'>
                      <span className='text-sm font-medium text-foreground'>
                        {section.title}
                      </span>
                      <div className='flex items-center gap-2'>
                        <span className='text-xs text-muted-foreground'>
                          {completedCount}/{lessons.length} lecciones
                        </span>
                        {sectionProgress === 100 && (
                          <CheckCircle2 className='size-3 text-emerald-400' />
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className='pb-0'>
                    <div className='flex flex-col'>
                      {lessons.map((lesson) => {
                        const Icon = getLessonIcon(lesson)
                        const isCurrent = lesson.id === currentLessonId
                        const isDone = completedIds.has(lesson.id)

                        return (
                          <button
                            key={lesson.id}
                            onClick={() => onLessonSelect(lesson)}
                            className={cn(
                              'flex items-center gap-3 px-4 py-3 text-left transition-all',
                              'hover:bg-secondary/30',
                              isCurrent &&
                                'bg-primary/10 border-l-2 border-primary'
                            )}
                          >
                            <div
                              className={cn(
                                'flex items-center justify-center size-7 rounded-lg shrink-0',
                                isDone
                                  ? 'bg-emerald-500/20'
                                  : isCurrent
                                    ? 'bg-primary/20'
                                    : 'bg-secondary'
                              )}
                            >
                              <Icon
                                className={cn(
                                  'size-4',
                                  isDone
                                    ? 'text-emerald-400'
                                    : isCurrent
                                      ? 'text-primary'
                                      : 'text-muted-foreground'
                                )}
                              />
                            </div>
                            <div className='flex-1 min-w-0'>
                              <p
                                className={cn(
                                  'text-sm truncate',
                                  isCurrent
                                    ? 'text-primary font-medium'
                                    : 'text-foreground'
                                )}
                              >
                                {lesson.title}
                              </p>
                              {lesson.duration_minutes && (
                                <div className='flex items-center gap-1 mt-0.5'>
                                  <Clock className='size-3 text-muted-foreground' />
                                  <span className='text-xs text-muted-foreground'>
                                    {lesson.duration_minutes} min
                                  </span>
                                </div>
                              )}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </div>
      </aside>
    </>
  )
}

// ─── Lesson Type Badge ────────────────────────────────────────────────────────

function LessonTypeBadge({ type }: { type: Lesson['lesson_type'] }) {
  const map: Record<
    Lesson['lesson_type'],
    { label: string; className: string }
  > = {
    video: {
      label: 'Video',
      className: 'border-primary/30 text-primary',
    },
    text: {
      label: 'Lectura',
      className: 'border-emerald-500/30 text-emerald-400',
    },
    quiz: {
      label: 'Quiz',
      className: 'border-amber-500/30 text-amber-400',
    },
    assignment: {
      label: 'Tarea',
      className: 'border-orange-500/30 text-orange-400',
    },
    interactive: {
      label: 'Interactivo',
      className: 'border-purple-500/30 text-purple-400',
    },
    document: {
      label: 'Documento',
      className: 'border-blue-500/30 text-blue-400',
    },
  }
  const { label, className } = map[type] ?? {
    label: type,
    className: 'border-border text-foreground',
  }
  return (
    <Badge variant='outline' className={cn('text-xs capitalize', className)}>
      {label}
    </Badge>
  )
}

// ─── Course Player (Main) ─────────────────────────────────────────────────────

export function CoursePlayer({
  academySlug,
  courseSlug,
  lessonId,
}: CoursePlayerProps) {
  const navigate = useNavigate()

  const { data: sectionsData, isLoading: sectionsLoading } = useSections(
    academySlug,
    courseSlug
  )
  const sections: Section[] = Array.isArray(sectionsData) ? sectionsData : []

  // Find the section that contains the current lesson
  const currentSection = sections.find((s) =>
    s.lessons?.some((l) => l.id === lessonId)
  )

  const { data: currentLesson, isLoading: lessonLoading } = useQuery({
    queryKey: ['lesson', academySlug, courseSlug, currentSection?.id, lessonId],
    queryFn: () =>
      lessonService.getLesson(
        academySlug,
        courseSlug,
        currentSection!.id,
        lessonId
      ),
    enabled: !!currentSection,
  })

  const [completedIds, setCompletedIds] = useState<Set<number>>(new Set())
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Course-level progress derived from completed set
  const allLessons = sections.flatMap((s) => s.lessons ?? [])
  const courseProgress =
    allLessons.length > 0
      ? Math.round((completedIds.size / allLessons.length) * 100)
      : 0

  const handleComplete = () => {
    if (currentLesson) {
      setCompletedIds((prev) => new Set([...prev, currentLesson.id]))
    }
  }

  const handleLessonSelect = (lesson: Lesson) => {
    setSidebarOpen(false)
    navigate({
      to: '/academy/$academySlug/courses/$courseSlug/watch/$lessonId',
      params: {
        academySlug,
        courseSlug,
        lessonId: String(lesson.id),
      },
    })
  }

  const navigateLesson = (direction: 'prev' | 'next') => {
    const currentIndex = allLessons.findIndex((l) => l.id === lessonId)
    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1
    if (newIndex >= 0 && newIndex < allLessons.length) {
      handleLessonSelect(allLessons[newIndex])
    }
  }

  const currentIndex = allLessons.findIndex((l) => l.id === lessonId)
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < allLessons.length - 1

  const isLoading = sectionsLoading || lessonLoading

  const renderContent = () => {
    if (!currentLesson) return null

    switch (currentLesson.lesson_type) {
      case 'video':
        return (
          <VideoPlayer lesson={currentLesson} onComplete={handleComplete} />
        )
      case 'text':
        return (
          <ReadingContent lesson={currentLesson} onComplete={handleComplete} />
        )
      case 'document':
        return (
          <DocumentContent lesson={currentLesson} onComplete={handleComplete} />
        )
      default:
        // quiz, assignment, interactive — placeholder
        return (
          <div className='flex flex-col items-center justify-center min-h-[400px] bg-card rounded-xl border border-border p-8 text-muted-foreground'>
            <FileQuestion className='size-12 mx-auto mb-4 opacity-40' />
            <p className='text-sm'>
              Este tipo de lección ({currentLesson.lesson_type}) estará disponible próximamente.
            </p>
            <Button onClick={handleComplete} className='mt-6'>
              Marcar como completado
            </Button>
          </div>
        )
    }
  }

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background'>
        <div className='animate-pulse text-muted-foreground text-sm'>
          Cargando lección...
        </div>
      </div>
    )
  }

  const courseTitle =
    currentLesson?.title
      ? sections[0]?.title ?? courseSlug
      : courseSlug

  return (
    <div className='min-h-screen flex flex-col bg-background'>
      {/* Top bar */}
      <header className='flex items-center justify-between px-4 lg:px-6 py-3 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-30'>
        <div className='flex items-center gap-4'>
          <Button
            variant='ghost'
            size='sm'
            className='gap-2 text-muted-foreground hover:text-foreground'
            onClick={() =>
              navigate({
                to: '/academy/$academySlug/courses/$courseSlug/content',
                params: { academySlug, courseSlug },
              })
            }
          >
            <ChevronLeft className='size-4' />
            <span className='hidden sm:inline'>Volver al curso</span>
          </Button>
          <div className='h-6 w-px bg-border hidden sm:block' />
          <h1 className='text-sm font-medium text-foreground truncate max-w-[200px] sm:max-w-none'>
            {courseTitle}
          </h1>
        </div>

        <div className='flex items-center gap-2'>
          <Badge
            variant='outline'
            className='hidden sm:flex gap-1.5 text-xs'
          >
            <Clock className='size-3' />
            {courseProgress}% completado
          </Badge>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className='lg:hidden'
          >
            <Menu className='size-5' />
          </Button>
        </div>
      </header>

      {/* Main content + sidebar */}
      <div className='flex-1 flex'>
        <main className='flex-1 flex flex-col p-4 lg:p-6 max-w-5xl mx-auto w-full'>
          {/* Lesson content */}
          <div className='flex-1'>{renderContent()}</div>

          {/* Lesson info & navigation */}
          {currentLesson && (
            <div className='mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-card rounded-xl border border-border'>
              <div>
                <div className='flex items-center gap-2 mb-1'>
                  <LessonTypeBadge type={currentLesson.lesson_type} />
                  {currentLesson.duration_minutes && (
                    <span className='text-xs text-muted-foreground'>
                      {currentLesson.duration_minutes} min
                    </span>
                  )}
                </div>
                <h2 className='text-lg font-semibold text-foreground'>
                  {currentLesson.title}
                </h2>
              </div>

              <div className='flex items-center gap-2 w-full sm:w-auto'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => navigateLesson('prev')}
                  disabled={!hasPrev}
                  className='flex-1 sm:flex-initial gap-1'
                >
                  <ChevronLeft className='size-4' />
                  Anterior
                </Button>
                <Button
                  size='sm'
                  onClick={() => navigateLesson('next')}
                  disabled={!hasNext}
                  className='flex-1 sm:flex-initial gap-1 bg-primary text-primary-foreground hover:bg-primary/90'
                >
                  Siguiente
                  <ChevronRight className='size-4' />
                </Button>
              </div>
            </div>
          )}
        </main>

        <CourseSidebar
          sections={sections}
          currentLessonId={lessonId}
          completedIds={completedIds}
          onLessonSelect={handleLessonSelect}
          courseProgress={courseProgress}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>
    </div>
  )
}
