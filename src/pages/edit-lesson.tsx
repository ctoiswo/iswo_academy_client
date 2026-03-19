import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearch } from '@tanstack/react-router'
import type { LessonAttachment, LessonType } from '@/types'
import {
  ArrowLeft,
  Video,
  FileText,
  Upload,
  Link as LinkIcon,
  Clock,
  Eye,
  Save,
  Sparkles,
  X,
  Paperclip,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLesson, useUpdateLesson } from '@/hooks/use-lessons'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { RichTextEditor } from '@/components/editor/rich-text-editor'

type VideoSourceType = 'url' | 'file'

export default function EditLessonPage() {
  const { academySlug, courseSlug, lessonId } = useParams({ strict: false }) as {
    academySlug: string
    courseSlug: string
    lessonId: string
  }
  const { sectionId } = useSearch({ strict: false }) as { sectionId: number }
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)

  // Form state
  const [title, setTitle] = useState('')
  const [lessonType, setLessonType] = useState<LessonType>('video')
  const [duration, setDuration] = useState('')
  const [isFree, setIsFree] = useState(false)

  // Video state
  const [videoSource, setVideoSource] = useState<VideoSourceType>('url')
  const [videoUrl, setVideoUrl] = useState('')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)

  // Text state
  const [textContent, setTextContent] = useState('')

  // Resource files state (new files to upload, max 5)
  const [resourceFiles, setResourceFiles] = useState<File[]>([])
  const [existingAttachments, setExistingAttachments] = useState<
    LessonAttachment[]
  >([])
  const [removedAttachmentIds, setRemovedAttachmentIds] = useState<number[]>([])

  const {
    data: lesson,
    isLoading: lessonLoading,
    isError: lessonError,
  } = useLesson(academySlug, courseSlug, Number(sectionId), Number(lessonId))

  const updateLesson = useUpdateLesson(academySlug, courseSlug, Number(sectionId))

  const normalizeLesson = (raw: any) => {
    if (!raw) return null
    if (raw.lesson) return raw.lesson
    if (raw.data?.lesson) return raw.data.lesson
    if (raw.data && raw.data.id) return raw.data
    return raw
  }

  const currentLesson: any = normalizeLesson(lesson as any)

  useEffect(() => {
    if (videoSource === 'url' && videoUrl) {
      setVideoPreview(convertToEmbedUrl(videoUrl))
    } else {
      setVideoPreview(null)
    }
  }, [videoUrl, videoSource])

  useEffect(() => {
    if (!currentLesson) return

    const rawType = currentLesson.lesson_type
    const detectedType: LessonType =
      rawType === 'video' || rawType === 'text'
        ? rawType
        : currentLesson.has_video ||
            currentLesson.video_url ||
            currentLesson.video_identifier
          ? 'video'
          : 'text'

    setTitle(currentLesson.title || '')
    setLessonType(detectedType)
    setDuration(
      currentLesson.duration_minutes
        ? String(currentLesson.duration_minutes)
        : ''
    )
    setIsFree(Boolean(currentLesson.is_free))

    setVideoUrl(currentLesson.video_url || '')
    setVideoSource(currentLesson.video_url ? 'url' : 'file')

    setTextContent(
      typeof currentLesson.content === 'string' ? currentLesson.content : ''
    )
    setExistingAttachments(
      Array.isArray(currentLesson.attachments)
        ? currentLesson.attachments
        : []
    )
    setRemovedAttachmentIds([])
    setResourceFiles([])
  }, [currentLesson])

  const convertToEmbedUrl = (url: string): string | null => {
    try {
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const videoId =
          new URL(url).searchParams.get('v') ||
          url.split('youtu.be/')[1]?.split('?')[0]
        if (videoId) return `https://www.youtube.com/embed/${videoId}`
      }
      if (url.includes('vimeo.com')) {
        const videoId = url.split('vimeo.com/')[1]?.split('?')[0]
        if (videoId) return `https://player.vimeo.com/video/${videoId}`
      }
    } catch {
      return null
    }
    return null
  }

  const extractVideoId = (identifier: string, provider: string): string => {
    const cleaned = identifier.trim()
    if (provider === 'youtube') {
      const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
        /^([a-zA-Z0-9_-]{11})(?:&|$)/,
        /^([a-zA-Z0-9_-]{11})$/,
      ]
      for (const pattern of patterns) {
        const match = cleaned.match(pattern)
        if (match) return match[1]
      }
    } else if (provider === 'vimeo') {
      const match = cleaned.match(/(?:vimeo\.com\/)(\d+)/)
      if (match) return match[1]
      if (/^\d+$/.test(cleaned)) return cleaned
    }
    return cleaned
  }

  const detectProvider = (url: string): string => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube'
    if (url.includes('vimeo.com')) return 'vimeo'
    return 'youtube'
  }

  const handleBack = () => {
    navigate({
      to: '/academy/$academySlug/courses/$courseSlug/lessons',
      params: { academySlug, courseSlug },
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsLoading(true)
    const formDataToSend = new FormData()

    formDataToSend.append('lesson[title]', title.trim())
    formDataToSend.append('lesson[lesson_type]', lessonType)
    formDataToSend.append('lesson[is_free]', String(isFree))

    if (duration && parseInt(duration) > 0) {
      formDataToSend.append('lesson[duration_minutes]', duration)
    }

    if (lessonType === 'video') {
      if (videoSource === 'file' && videoFile) {
        formDataToSend.append('lesson[video_provider]', 's3_direct')
        formDataToSend.append('lesson[video_file]', videoFile)
      } else if (videoSource === 'url' && videoUrl.trim()) {
        const provider = detectProvider(videoUrl)
        const videoId = extractVideoId(videoUrl, provider)
        formDataToSend.append('lesson[video_provider]', provider)
        formDataToSend.append('lesson[video_identifier]', videoId)
        formDataToSend.append('lesson[video_url]', videoUrl.trim())
      }

      // If lesson changed from text to video, clear stale text content.
      formDataToSend.append('lesson[content_json]', '')
    }

    if (lessonType === 'text') {
      formDataToSend.append('lesson[content_json]', textContent || '')

      // If lesson changed from video to text, clear stale video fields.
      formDataToSend.append('lesson[video_provider]', 'none')
      formDataToSend.append('lesson[video_identifier]', '')
      formDataToSend.append('lesson[video_url]', '')
    }

    let attrIndex = 0

    removedAttachmentIds.forEach((attachmentId) => {
      formDataToSend.append(
        `lesson[attachments_attributes][${attrIndex}][id]`,
        String(attachmentId)
      )
      formDataToSend.append(
        `lesson[attachments_attributes][${attrIndex}][_destroy]`,
        'true'
      )
      attrIndex += 1
    })

    resourceFiles.forEach((file) => {
      const titleValue = file.name.replace(/\.[^/.]+$/, '')
      formDataToSend.append(
        `lesson[attachments_attributes][${attrIndex}][type]`,
        'FileAttachment'
      )
      formDataToSend.append(
        `lesson[attachments_attributes][${attrIndex}][title]`,
        titleValue || file.name
      )
      formDataToSend.append(
        `lesson[attachments_attributes][${attrIndex}][attachment_type]`,
        'general'
      )
      formDataToSend.append(
        `lesson[attachments_attributes][${attrIndex}][required]`,
        'false'
      )
      formDataToSend.append(
        `lesson[attachments_attributes][${attrIndex}][file]`,
        file
      )
      attrIndex += 1
    })

    try {
      await updateLesson.mutateAsync({
        lessonId: Number(lessonId),
        data: formDataToSend as any,
      })

      handleBack()
    } catch (error: any) {
      console.error('Error updating lesson with resources', error)
      toast.error(error?.message || 'Error actualizando la lección')
    } finally {
      setIsLoading(false)
    }
  }

  const maxAllowed = Math.max(0, 5 - existingAttachments.length)

  const handleResourceFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || [])
    setResourceFiles((prev) => {
      const combined = [...prev, ...selected]
      return combined.slice(0, maxAllowed)
    })
    e.target.value = ''
  }

  const removeResourceFile = (index: number) => {
    setResourceFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const removeExistingAttachment = (attachmentId: number) => {
    setRemovedAttachmentIds((prev) => [...prev, attachmentId])
    setExistingAttachments((prev) =>
      prev.filter((attachment) => attachment.id !== attachmentId)
    )
  }

  const lessonTypeConfig = [
    {
      type: 'video' as LessonType,
      label: 'Video',
      description: 'Contenido multimedia de YouTube o Vimeo',
      icon: Video,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
    },
    {
      type: 'text' as LessonType,
      label: 'Lectura',
      description: 'Articulo o texto enriquecido',
      icon: FileText,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
    },
  ]

  if (lessonLoading) {
    return (
      <div className='p-6 text-sm text-muted-foreground'>Cargando lección...</div>
    )
  }

  if (lessonError || !currentLesson) {
    return (
      <div className='p-6 text-sm text-destructive'>No se pudo cargar la lección.</div>
    )
  }

  return (
    <div className='bg-background relative min-h-screen'>
      <div
        className='pointer-events-none fixed inset-0 opacity-[0.02]'
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
        aria-hidden='true'
      />
      <div
        className='bg-primary pointer-events-none fixed top-0 left-1/2 h-[300px] w-[700px] -translate-x-1/2 rounded-full opacity-15 blur-[140px]'
        aria-hidden='true'
      />

      <header className='border-border/40 bg-background/80 sticky top-0 z-50 border-b backdrop-blur-xl'>
        <div className='mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 lg:px-8'>
          <div className='flex items-center gap-4'>
            <button
              type='button'
              onClick={handleBack}
              className='text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors'
            >
              <ArrowLeft className='size-4' />
              <span className='hidden sm:inline'>Volver</span>
            </button>
            <div className='bg-border/60 h-6 w-px' />
            <div className='flex flex-col'>
              <span className='text-muted-foreground text-xs'>Editar Lección</span>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <Button type='button' variant='ghost' size='sm' className='text-muted-foreground gap-2' disabled={!title}>
              <Eye className='size-4' />
              <span className='hidden sm:inline'>Vista previa</span>
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || updateLesson.isPending || !title.trim()}
              className='bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-[0_0_16px_rgba(99,102,241,0.2)]'
            >
              {isLoading || updateLesson.isPending ? (
                <>
                  <div className='border-primary-foreground/30 border-t-primary-foreground size-4 animate-spin rounded-full border-2' />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className='size-4' />
                  Guardar leccion
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className='relative z-10 mx-auto max-w-5xl px-4 py-8 lg:px-8'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
          <section className='border-border/60 bg-card animate-in fade-in-0 slide-in-from-bottom-4 flex flex-col gap-6 rounded-xl border p-6'>
            <div className='flex items-center gap-3'>
              <div className='bg-primary/10 flex size-10 items-center justify-center rounded-lg'>
                <Sparkles className='text-primary size-5' />
              </div>
              <div>
                <h1 className='text-foreground text-lg font-semibold'>Editar Leccion</h1>
                <p className='text-muted-foreground text-sm'>Actualiza el contenido educativo de tu curso</p>
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='title' className='text-sm font-medium'>
                Titulo de la leccion <span className='text-destructive'>*</span>
              </Label>
              <Input
                id='title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='ej. Introduccion a los Hooks de React'
                className='bg-secondary/40 border-border/60 focus:border-primary/50 h-12 text-base'
                required
              />
            </div>

            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='duration' className='text-sm font-medium'>Duracion estimada</Label>
                <div className='relative'>
                  <Clock className='text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2' />
                  <Input
                    id='duration'
                    type='number'
                    min='1'
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder='30'
                    className='bg-secondary/40 border-border/60 h-11 pl-10'
                  />
                  <span className='text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 text-sm'>min</span>
                </div>
              </div>

              <div className='border-border/60 bg-secondary/20 flex items-center justify-between rounded-lg border p-4'>
                <div className='space-y-0.5'>
                  <Label htmlFor='is_free' className='cursor-pointer text-sm font-medium'>Leccion gratuita</Label>
                  <p className='text-muted-foreground text-xs'>Disponible sin inscripcion</p>
                </div>
                <Switch id='is_free' checked={isFree} onCheckedChange={setIsFree} />
              </div>
            </div>
          </section>

          <section className='border-border/60 bg-card animate-in fade-in-0 slide-in-from-bottom-4 flex flex-col gap-4 rounded-xl border p-6 delay-100'>
            <Label className='text-sm font-medium'>
              Tipo de contenido <span className='text-destructive'>*</span>
            </Label>
            <div className='grid gap-3 sm:grid-cols-3'>
              {lessonTypeConfig.map((config) => {
                const Icon = config.icon
                const isSelected = lessonType === config.type
                return (
                  <button
                    key={config.type}
                    type='button'
                    onClick={() => setLessonType(config.type)}
                    className={cn(
                      'flex flex-col items-center gap-3 rounded-xl border-2 p-5 transition-all duration-300',
                      'hover:border-primary/30 hover:bg-primary/5',
                      isSelected
                        ? `${config.borderColor} ${config.bgColor} shadow-[0_0_20px_rgba(99,102,241,0.1)]`
                        : 'border-border/60 bg-secondary/20'
                    )}
                  >
                    <div
                      className={cn(
                        'flex size-12 items-center justify-center rounded-xl transition-all duration-300',
                        isSelected ? config.bgColor : 'bg-secondary/60'
                      )}
                    >
                      <Icon
                        className={cn(
                          'size-6 transition-colors',
                          isSelected ? config.color : 'text-muted-foreground'
                        )}
                      />
                    </div>
                    <div className='text-center'>
                      <p className={cn('font-medium transition-colors', isSelected ? 'text-foreground' : 'text-muted-foreground')}>
                        {config.label}
                      </p>
                      <p className='text-muted-foreground mt-0.5 text-xs'>{config.description}</p>
                    </div>
                    {isSelected && <Badge className='bg-primary/20 text-primary border-0'>Seleccionado</Badge>}
                  </button>
                )
              })}
            </div>
          </section>

          <section className='border-border/60 bg-card animate-in fade-in-0 slide-in-from-bottom-4 flex flex-col gap-6 rounded-xl border p-6 delay-200'>
            {lessonType === 'video' && (
              <>
                <div className='flex items-center gap-3'>
                  <div className='flex size-10 items-center justify-center rounded-lg bg-blue-500/10'>
                    <Video className='size-5 text-blue-400' />
                  </div>
                  <div>
                    <h2 className='text-foreground text-base font-semibold'>Contenido de Video</h2>
                    <p className='text-muted-foreground text-sm'>Sube un video o usa una URL de YouTube/Vimeo</p>
                  </div>
                </div>

                <RadioGroup
                  value={videoSource}
                  onValueChange={(v) => setVideoSource(v as VideoSourceType)}
                  className='grid gap-3 sm:grid-cols-2'
                >
                  <label
                    className={cn(
                      'flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-all',
                      videoSource === 'url'
                        ? 'border-primary/50 bg-primary/5'
                        : 'border-border/60 bg-secondary/20 hover:border-border'
                    )}
                  >
                    <RadioGroupItem value='url' id='url' />
                    <LinkIcon className='text-muted-foreground size-4' />
                    <div>
                      <p className='text-sm font-medium'>URL del video</p>
                      <p className='text-muted-foreground text-xs'>YouTube, Vimeo</p>
                    </div>
                  </label>
                  <label
                    className={cn(
                      'flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-all',
                      videoSource === 'file'
                        ? 'border-primary/50 bg-primary/5'
                        : 'border-border/60 bg-secondary/20 hover:border-border'
                    )}
                  >
                    <RadioGroupItem value='file' id='file' />
                    <Upload className='text-muted-foreground size-4' />
                    <div>
                      <p className='text-sm font-medium'>Subir archivo</p>
                      <p className='text-muted-foreground text-xs'>MP4, WebM</p>
                    </div>
                  </label>
                </RadioGroup>

                {videoSource === 'url' ? (
                  <div className='space-y-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='video_url'>URL del video</Label>
                      <Input
                        id='video_url'
                        type='url'
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder='https://www.youtube.com/watch?v=...'
                        className='bg-secondary/40 border-border/60'
                      />
                    </div>
                    {videoPreview && (
                      <div className='space-y-2'>
                        <Label>Vista previa</Label>
                        <div className='border-border/60 relative aspect-video w-full overflow-hidden rounded-lg border bg-black'>
                          <iframe
                            src={videoPreview}
                            className='absolute inset-0 h-full w-full'
                            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                            allowFullScreen
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className='space-y-4'>
                    <div
                      className={cn(
                        'flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-8 transition-all',
                        'hover:border-primary/50 hover:bg-primary/5',
                        videoFile ? 'border-primary/50 bg-primary/5' : 'border-border/60'
                      )}
                    >
                      {videoFile ? (
                        <>
                          <div className='bg-primary/10 flex size-14 items-center justify-center rounded-full'>
                            <Video className='text-primary size-7' />
                          </div>
                          <div className='text-center'>
                            <p className='text-foreground font-medium'>{videoFile.name}</p>
                            <p className='text-muted-foreground text-sm'>
                              {(videoFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <Button
                            type='button'
                            variant='ghost'
                            size='sm'
                            onClick={() => setVideoFile(null)}
                            className='text-destructive hover:text-destructive'
                          >
                            <X className='mr-1 size-4' />
                            Quitar archivo
                          </Button>
                        </>
                      ) : (
                        <>
                          <div className='bg-secondary/60 flex size-14 items-center justify-center rounded-full'>
                            <Upload className='text-muted-foreground size-7' />
                          </div>
                          <div className='text-center'>
                            <p className='text-foreground font-medium'>Arrastra un video aqui</p>
                            <p className='text-muted-foreground text-sm'>o haz clic para seleccionar</p>
                          </div>
                          <Input
                            type='file'
                            accept='video/*'
                            onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                            className='max-w-xs'
                          />
                        </>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {lessonType === 'text' && (
              <>
                <div className='flex items-center gap-3'>
                  <div className='flex size-10 items-center justify-center rounded-lg bg-emerald-500/10'>
                    <FileText className='size-5 text-emerald-400' />
                  </div>
                  <div>
                    <h2 className='text-foreground text-base font-semibold'>Contenido de Lectura</h2>
                    <p className='text-muted-foreground text-sm'>Usa el editor para crear articulos con formato enriquecido</p>
                  </div>
                </div>
                <RichTextEditor
                  content={textContent}
                  onChange={setTextContent}
                  placeholder='Escribe el contenido de tu leccion aqui... Puedes usar titulos, listas, codigo y mas.'
                />
              </>
            )}
          </section>

          <section className='border-border/60 bg-card animate-in fade-in-0 slide-in-from-bottom-4 flex flex-col gap-4 rounded-xl border p-6 delay-300'>
            <div className='flex items-center gap-3'>
              <div className='flex size-10 items-center justify-center rounded-lg bg-violet-500/10'>
                <Paperclip className='size-5 text-violet-400' />
              </div>
              <div>
                <h2 className='text-foreground text-base font-semibold'>Recursos descargables</h2>
                <p className='text-muted-foreground text-sm'>Archivos que el estudiante puede descargar (máx. 5)</p>
              </div>
            </div>

            {existingAttachments.length > 0 && (
              <div className='space-y-2'>
                <Label className='text-xs text-muted-foreground'>Recursos actuales</Label>
                <ul className='flex flex-col gap-2'>
                  {existingAttachments.map((attachment) => (
                    <li
                      key={attachment.id}
                      className='border-border/60 bg-secondary/10 flex items-center justify-between rounded-lg border px-4 py-2.5'
                    >
                      <div className='flex items-center gap-3 overflow-hidden'>
                        <FileText className='text-muted-foreground size-4 shrink-0' />
                        <span className='text-foreground truncate text-sm'>{attachment.title}</span>
                        {attachment.file_size_mb ? (
                          <span className='text-muted-foreground shrink-0 text-xs'>{attachment.file_size_mb} MB</span>
                        ) : null}
                      </div>
                      <button
                        type='button'
                        onClick={() => removeExistingAttachment(attachment.id)}
                        className='text-muted-foreground hover:text-destructive ml-2 shrink-0 transition-colors'
                      >
                        <X className='size-4' />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {existingAttachments.length === 0 && (
              <p className='text-muted-foreground text-sm'>
                Esta lección no tiene recursos adjuntos actualmente.
              </p>
            )}

            {resourceFiles.length > 0 && (
              <div className='space-y-2'>
                <Label className='text-xs text-muted-foreground'>Nuevos recursos a agregar</Label>
                <ul className='flex flex-col gap-2'>
                  {resourceFiles.map((file, index) => (
                    <li
                      key={index}
                      className='border-border/60 bg-secondary/20 flex items-center justify-between rounded-lg border px-4 py-2.5'
                    >
                      <div className='flex items-center gap-3 overflow-hidden'>
                        <FileText className='text-muted-foreground size-4 shrink-0' />
                        <span className='text-foreground truncate text-sm'>{file.name}</span>
                        <span className='text-muted-foreground shrink-0 text-xs'>
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                      <button
                        type='button'
                        onClick={() => removeResourceFile(index)}
                        className='text-muted-foreground hover:text-destructive ml-2 shrink-0 transition-colors'
                      >
                        <X className='size-4' />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {maxAllowed > 0 && resourceFiles.length < maxAllowed && (
              <label className='border-border/60 hover:border-primary/50 hover:bg-primary/5 flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 transition-all'>
                <Upload className='text-muted-foreground size-4' />
                <span className='text-muted-foreground text-sm'>
                  {resourceFiles.length === 0
                    ? `Seleccionar archivos (${existingAttachments.length}/5 existentes)`
                    : `Agregar más (${existingAttachments.length + resourceFiles.length}/5)`}
                </span>
                <input type='file' multiple className='hidden' onChange={handleResourceFilesChange} />
              </label>
            )}
          </section>

          <div className='border-border/40 flex items-center justify-between border-t pt-4'>
            <Button type='button' variant='ghost' onClick={handleBack}>Cancelar</Button>
            <div className='flex items-center gap-3'>
              <Button type='button' variant='outline' disabled={!title}>
                <Eye className='mr-2 size-4' />
                Vista previa
              </Button>
              <Button
                type='submit'
                disabled={isLoading || updateLesson.isPending || !title.trim()}
                className='bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-[0_0_16px_rgba(99,102,241,0.2)]'
              >
                {isLoading || updateLesson.isPending ? (
                  <>
                    <div className='border-primary-foreground/30 border-t-primary-foreground size-4 animate-spin rounded-full border-2' />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className='size-4' />
                    Guardar leccion
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
