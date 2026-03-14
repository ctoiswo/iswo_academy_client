import { useState, useEffect } from 'react'
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
} from 'lucide-react'
import { useNavigate, useParams, useSearch } from '@tanstack/react-router'
import { useCreateLesson } from '@/hooks/use-lessons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { RichTextEditor } from '@/components/editor/rich-text-editor'
import { cn } from '@/lib/utils'
import type { LessonType } from '@/types'

type VideoSourceType = 'url' | 'file'

export default function CreateLessonPage() {
  const { academySlug, courseSlug } = useParams({ strict: false }) as {
    academySlug: string
    courseSlug: string
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

  const createLesson = useCreateLesson(academySlug, courseSlug, sectionId)

  useEffect(() => {
    if (videoSource === 'url' && videoUrl) {
      setVideoPreview(convertToEmbedUrl(videoUrl))
    } else {
      setVideoPreview(null)
    }
  }, [videoUrl, videoSource])

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
    }

    if (lessonType === 'text' && textContent) {
      formDataToSend.append('lesson[content_json]', textContent)
    }

    try {
      await createLesson.mutateAsync(formDataToSend as any)
      handleBack()
    } catch (_error) {
      // Error handled by mutation
    } finally {
      setIsLoading(false)
    }
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

  return (
    <div className='min-h-screen bg-background relative'>
      {/* Background decoration */}
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
        className='pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] opacity-15 blur-[140px] rounded-full bg-primary'
        aria-hidden='true'
      />

      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl'>
        <div className='max-w-5xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between gap-4'>
          <div className='flex items-center gap-4'>
            <button
              type='button'
              onClick={handleBack}
              className='flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors'
            >
              <ArrowLeft className='size-4' />
              <span className='hidden sm:inline'>Volver</span>
            </button>
            <div className='h-6 w-px bg-border/60' />
            <div className='flex flex-col'>
              <span className='text-xs text-muted-foreground'>Nueva Leccion</span>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              className='gap-2 text-muted-foreground'
              disabled={!title}
            >
              <Eye className='size-4' />
              <span className='hidden sm:inline'>Vista previa</span>
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || createLesson.isPending || !title.trim()}
              className='gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_16px_rgba(99,102,241,0.2)]'
            >
              {isLoading || createLesson.isPending ? (
                <>
                  <div className='size-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin' />
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

      {/* Main content */}
      <main className='relative z-10 max-w-5xl mx-auto px-4 lg:px-8 py-8'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
          {/* Title & basics */}
          <section className='flex flex-col gap-6 p-6 rounded-xl border border-border/60 bg-card animate-in fade-in-0 slide-in-from-bottom-4'>
            <div className='flex items-center gap-3'>
              <div className='flex items-center justify-center size-10 rounded-lg bg-primary/10'>
                <Sparkles className='size-5 text-primary' />
              </div>
              <div>
                <h1 className='text-lg font-semibold text-foreground'>Nueva Leccion</h1>
                <p className='text-sm text-muted-foreground'>
                  Agrega contenido educativo a tu curso
                </p>
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
                className='h-12 text-base bg-secondary/40 border-border/60 focus:border-primary/50'
                required
              />
            </div>

            <div className='grid sm:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='duration' className='text-sm font-medium'>
                  Duracion estimada
                </Label>
                <div className='relative'>
                  <Clock className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
                  <Input
                    id='duration'
                    type='number'
                    min='1'
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder='30'
                    className='pl-10 h-11 bg-secondary/40 border-border/60'
                  />
                  <span className='absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground'>
                    min
                  </span>
                </div>
              </div>

              <div className='flex items-center justify-between p-4 rounded-lg border border-border/60 bg-secondary/20'>
                <div className='space-y-0.5'>
                  <Label
                    htmlFor='is_free'
                    className='text-sm font-medium cursor-pointer'
                  >
                    Leccion gratuita
                  </Label>
                  <p className='text-xs text-muted-foreground'>
                    Disponible sin inscripcion
                  </p>
                </div>
                <Switch
                  id='is_free'
                  checked={isFree}
                  onCheckedChange={setIsFree}
                />
              </div>
            </div>
          </section>

          {/* Lesson type selector */}
          <section className='flex flex-col gap-4 p-6 rounded-xl border border-border/60 bg-card animate-in fade-in-0 slide-in-from-bottom-4 delay-100'>
            <Label className='text-sm font-medium'>
              Tipo de contenido <span className='text-destructive'>*</span>
            </Label>
            <div className='grid sm:grid-cols-3 gap-3'>
              {lessonTypeConfig.map((config) => {
                const Icon = config.icon
                const isSelected = lessonType === config.type
                return (
                  <button
                    key={config.type}
                    type='button'
                    onClick={() => setLessonType(config.type)}
                    className={cn(
                      'flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all duration-300',
                      'hover:border-primary/30 hover:bg-primary/5',
                      isSelected
                        ? `${config.borderColor} ${config.bgColor} shadow-[0_0_20px_rgba(99,102,241,0.1)]`
                        : 'border-border/60 bg-secondary/20'
                    )}
                  >
                    <div
                      className={cn(
                        'flex items-center justify-center size-12 rounded-xl transition-all duration-300',
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
                      <p
                        className={cn(
                          'font-medium transition-colors',
                          isSelected ? 'text-foreground' : 'text-muted-foreground'
                        )}
                      >
                        {config.label}
                      </p>
                      <p className='text-xs text-muted-foreground mt-0.5'>
                        {config.description}
                      </p>
                    </div>
                    {isSelected && (
                      <Badge className='bg-primary/20 text-primary border-0'>
                        Seleccionado
                      </Badge>
                    )}
                  </button>
                )
              })}
            </div>
          </section>

          {/* Content section */}
          <section className='flex flex-col gap-6 p-6 rounded-xl border border-border/60 bg-card animate-in fade-in-0 slide-in-from-bottom-4 delay-200'>
            {/* Video */}
            {lessonType === 'video' && (
              <>
                <div className='flex items-center gap-3'>
                  <div className='flex items-center justify-center size-10 rounded-lg bg-blue-500/10'>
                    <Video className='size-5 text-blue-400' />
                  </div>
                  <div>
                    <h2 className='text-base font-semibold text-foreground'>
                      Contenido de Video
                    </h2>
                    <p className='text-sm text-muted-foreground'>
                      Sube un video o usa una URL de YouTube/Vimeo
                    </p>
                  </div>
                </div>

                <RadioGroup
                  value={videoSource}
                  onValueChange={(v) => setVideoSource(v as VideoSourceType)}
                  className='grid sm:grid-cols-2 gap-3'
                >
                  <label
                    className={cn(
                      'flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all',
                      videoSource === 'url'
                        ? 'border-primary/50 bg-primary/5'
                        : 'border-border/60 bg-secondary/20 hover:border-border'
                    )}
                  >
                    <RadioGroupItem value='url' id='url' />
                    <LinkIcon className='size-4 text-muted-foreground' />
                    <div>
                      <p className='text-sm font-medium'>URL del video</p>
                      <p className='text-xs text-muted-foreground'>YouTube, Vimeo</p>
                    </div>
                  </label>
                  <label
                    className={cn(
                      'flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all',
                      videoSource === 'file'
                        ? 'border-primary/50 bg-primary/5'
                        : 'border-border/60 bg-secondary/20 hover:border-border'
                    )}
                  >
                    <RadioGroupItem value='file' id='file' />
                    <Upload className='size-4 text-muted-foreground' />
                    <div>
                      <p className='text-sm font-medium'>Subir archivo</p>
                      <p className='text-xs text-muted-foreground'>MP4, WebM</p>
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
                        <div className='relative aspect-video w-full overflow-hidden rounded-lg border border-border/60 bg-black'>
                          <iframe
                            src={videoPreview}
                            className='absolute inset-0 w-full h-full'
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
                        'flex flex-col items-center justify-center gap-4 p-8 rounded-lg border-2 border-dashed transition-all',
                        'hover:border-primary/50 hover:bg-primary/5',
                        videoFile ? 'border-primary/50 bg-primary/5' : 'border-border/60'
                      )}
                    >
                      {videoFile ? (
                        <>
                          <div className='flex items-center justify-center size-14 rounded-full bg-primary/10'>
                            <Video className='size-7 text-primary' />
                          </div>
                          <div className='text-center'>
                            <p className='font-medium text-foreground'>{videoFile.name}</p>
                            <p className='text-sm text-muted-foreground'>
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
                            <X className='size-4 mr-1' />
                            Quitar archivo
                          </Button>
                        </>
                      ) : (
                        <>
                          <div className='flex items-center justify-center size-14 rounded-full bg-secondary/60'>
                            <Upload className='size-7 text-muted-foreground' />
                          </div>
                          <div className='text-center'>
                            <p className='font-medium text-foreground'>
                              Arrastra un video aqui
                            </p>
                            <p className='text-sm text-muted-foreground'>
                              o haz clic para seleccionar
                            </p>
                          </div>
                          <Input
                            type='file'
                            accept='video/*'
                            onChange={(e) =>
                              setVideoFile(e.target.files?.[0] || null)
                            }
                            className='max-w-xs'
                          />
                        </>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Text/Reading */}
            {lessonType === 'text' && (
              <>
                <div className='flex items-center gap-3'>
                  <div className='flex items-center justify-center size-10 rounded-lg bg-emerald-500/10'>
                    <FileText className='size-5 text-emerald-400' />
                  </div>
                  <div>
                    <h2 className='text-base font-semibold text-foreground'>
                      Contenido de Lectura
                    </h2>
                    <p className='text-sm text-muted-foreground'>
                      Usa el editor para crear articulos con formato enriquecido
                    </p>
                  </div>
                </div>
                <RichTextEditor
                  content={textContent}
                  onChange={setTextContent}
                  placeholder='Escribe el contenido de tu leccion aqui... Puedes usar titulos, listas, codigo y mas.'
                />
              </>
            )}

            {/* Quiz */}
          </section>

          {/* Actions footer */}
          <div className='flex items-center justify-between pt-4 border-t border-border/40'>
            <Button type='button' variant='ghost' onClick={handleBack}>
              Cancelar
            </Button>
            <div className='flex items-center gap-3'>
              <Button
                type='button'
                variant='outline'
                disabled={!title}
              >
                <Eye className='size-4 mr-2' />
                Vista previa
              </Button>
              <Button
                type='submit'
                disabled={isLoading || createLesson.isPending || !title.trim()}
                className='gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_16px_rgba(99,102,241,0.2)]'
              >
                {isLoading || createLesson.isPending ? (
                  <>
                    <div className='size-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin' />
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
