import type { CreateLessonRequest } from '@/types'
import { useState, useEffect } from 'react'
import { Upload, Link as LinkIcon, Video } from 'lucide-react'
import { useCreateLesson } from '@/hooks/use-lessons'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

interface CreateLessonDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  academySlug: string
  courseSlug: string
  sectionId: number
}

export function CreateLessonDialog({
  open,
  onOpenChange,
  academySlug,
  courseSlug,
  sectionId,
}: CreateLessonDialogProps) {
  const [formData, setFormData] = useState<CreateLessonRequest>({
    title: '',
    lesson_type: 'video',
    content: '',
    video_provider: 'youtube',
    video_identifier: '',
    duration_minutes: 0,
    is_free: false,
  })

  const [videoType, setVideoType] = useState<'file' | 'url'>('url')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [videoUrlPreview, setVideoUrlPreview] = useState<string | null>(null)

  const createLesson = useCreateLesson(academySlug, courseSlug, sectionId)

  // Convert URL to embed format for preview
  useEffect(() => {
    if (videoType === 'url' && videoUrl) {
      setVideoUrlPreview(convertToEmbedUrl(videoUrl))
    } else {
      setVideoUrlPreview(null)
    }
  }, [videoUrl, videoType])

  const convertToEmbedUrl = (url: string): string => {
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId =
        new URL(url).searchParams.get('v') ||
        url.split('youtu.be/')[1]?.split('?')[0]
      if (videoId) return `https://www.youtube.com/embed/${videoId}`
    }
    // Vimeo
    if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0]
      if (videoId) return `https://player.vimeo.com/video/${videoId}`
    }
    return url
  }

  const extractVideoId = (identifier: string, provider: string): string => {
    const cleaned = identifier.trim()

    if (provider === 'youtube') {
      // Extract YouTube ID from various formats:
      // - Full URL: https://www.youtube.com/watch?v=VIDEO_ID
      // - Short URL: https://youtu.be/VIDEO_ID
      // - With playlist: VIDEO_ID&list=...
      // - Just ID: VIDEO_ID
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
      // Extract Vimeo ID from URL or just return the number
      const match = cleaned.match(/(?:vimeo\.com\/)(\d+)/)
      if (match) return match[1]
      // If it's already just numbers, return it
      if (/^\d+$/.test(cleaned)) return cleaned
    }

    return cleaned
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) return

    const dataToSubmit: CreateLessonRequest = {
      title: formData.title.trim(),
      lesson_type: formData.lesson_type,
      is_free: formData.is_free,
    }
    // Validar video si es tipo video
    if (formData.lesson_type === 'video') {
      if (videoType === 'file' && !videoFile) {
        alert('Por favor sube un archivo de video')
        return
      }
      if (videoType === 'url' && !videoUrl.trim()) {
        alert('Por favor ingresa una URL de video')
        return
      }
    }

    const formDataToSend = new FormData()

    // Datos básicos
    formDataToSend.append('lesson[title]', formData.title.trim())
    formDataToSend.append('lesson[lesson_type]', formData.lesson_type)
    formDataToSend.append('lesson[is_free]', String(formData.is_free))

    if (formData.duration_minutes && formData.duration_minutes > 0) {
      formDataToSend.append(
        'lesson[duration_minutes]',
        String(formData.duration_minutes)
      )
    }

    // Video
    if (formData.lesson_type === 'video') {
      if (videoType === 'file' && videoFile) {
        // Subir video directo (S3/GCS)
        formDataToSend.append('lesson[video_provider]', 's3_direct')
        formDataToSend.append('lesson[video_file]', videoFile)
      } else if (videoType === 'url' && videoUrl.trim()) {
        // URL de video (YouTube/Vimeo)
        const provider = detectProvider(videoUrl)
        const videoId = extractVideoId(videoUrl, provider)

        formDataToSend.append('lesson[video_provider]', provider)
        formDataToSend.append('lesson[video_identifier]', videoId)
        formDataToSend.append('lesson[video_url]', videoUrl.trim())
      }
    }

    // Contenido de texto
    if (formData.lesson_type === 'text' && formData.content) {
      const contentJson = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: formData.content.trim() }],
          },
        ],
      }
      formDataToSend.append('lesson[content_json]', JSON.stringify(contentJson))
    }

    try {
      await createLesson.mutateAsync(formDataToSend as any)

      // Reset form
      setFormData({
        title: '',
        lesson_type: 'video',
        content: '',
        video_provider: 'youtube',
        video_identifier: '',
        duration_minutes: 0,
        is_free: false,
      })
      setVideoFile(null)
      setVideoUrl('')
      setVideoType('url')
      onOpenChange(false)
    } catch (error) {
      console.error('Error creating lesson:', error)
    }
  }

  const detectProvider = (url: string): string => {
    if (url.includes('youtube.com') || url.includes('youtu.be'))
      return 'youtube'
    if (url.includes('vimeo.com')) return 'vimeo'
    return 'youtube'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] max-w-2xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Crear Nueva Lección</DialogTitle>
          <DialogDescription>
            Añade una nueva lección a la sección del curso
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='title'>
              Título de la Lección <span className='text-destructive'>*</span>
            </Label>
            <Input
              id='title'
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder='ej. Introducción a los Hooks'
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='lesson_type'>
              Tipo de Lección <span className='text-destructive'>*</span>
            </Label>
            <Select
              value={formData.lesson_type}
              onValueChange={(value: any) =>
                setFormData({ ...formData, lesson_type: value })
              }
            >
              <SelectTrigger id='lesson_type'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='video'>Video</SelectItem>
                <SelectItem value='text'>Texto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.lesson_type === 'video' && (
            <>
              <div className='space-y-3'>
                <Label>Tipo de Video</Label>
                <RadioGroup
                  value={videoType}
                  onValueChange={(v: any) => setVideoType(v)}
                >
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='url' id='url' />
                    <Label
                      htmlFor='url'
                      className='flex cursor-pointer items-center gap-2 font-normal'
                    >
                      <LinkIcon className='h-4 w-4' />
                      URL (YouTube, Vimeo, etc.)
                    </Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='file' id='file' />
                    <Label
                      htmlFor='file'
                      className='flex cursor-pointer items-center gap-2 font-normal'
                    >
                      <Upload className='h-4 w-4' />
                      Subir Video Directamente
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {videoType === 'url' ? (
                <>
                  <div className='space-y-2'>
                    <Label htmlFor='video_url'>
                      URL del Video <span className='text-destructive'>*</span>
                    </Label>
                    <Input
                      id='video_url'
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder='https://www.youtube.com/watch?v=...'
                    />
                    <p className='text-muted-foreground text-sm'>
                      Soporta YouTube y Vimeo
                    </p>
                  </div>

                  {videoUrlPreview && (
                    <div className='space-y-2'>
                      <Label>Vista Previa</Label>
                      <div className='bg-muted aspect-video w-full overflow-hidden rounded-lg border'>
                        <iframe
                          src={videoUrlPreview}
                          className='h-full w-full'
                          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                          allowFullScreen
                        />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className='space-y-2'>
                  <Label htmlFor='video_file'>
                    Archivo de Video <span className='text-destructive'>*</span>
                  </Label>
                  <div className='flex items-center gap-2'>
                    <Input
                      id='video_file'
                      type='file'
                      accept='video/*'
                      onChange={(e) =>
                        setVideoFile(e.target.files?.[0] || null)
                      }
                      className='cursor-pointer'
                    />
                    {videoFile && (
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        onClick={() => setVideoFile(null)}
                      >
                        Limpiar
                      </Button>
                    )}
                  </div>
                  {videoFile && (
                    <div className='bg-muted flex items-center gap-2 rounded-lg border p-3'>
                      <Video className='text-muted-foreground h-4 w-4' />
                      <span className='text-sm'>{videoFile.name}</span>
                      <span className='text-muted-foreground text-sm'>
                        ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                  )}
                  <p className='text-muted-foreground text-sm'>
                    El video se subirá a Google Cloud Storage
                  </p>
                </div>
              )}
            </>
          )}

          {formData.lesson_type === 'text' && (
            <div className='space-y-2'>
              <Label htmlFor='content'>Contenido</Label>
              <Textarea
                id='content'
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder='Escribe el contenido de la lección...'
                rows={8}
              />
            </div>
          )}

          <div className='space-y-2'>
            <Label htmlFor='duration_minutes'>Duración (minutos)</Label>
            <Input
              id='duration_minutes'
              type='number'
              min='0'
              value={formData.duration_minutes || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  duration_minutes: parseInt(e.target.value) || 0,
                })
              }
              placeholder='ej. 30'
            />
          </div>

          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label htmlFor='is_free'>Lección Gratuita</Label>
              <p className='text-muted-foreground text-sm'>
                Permitir acceso sin inscripción al curso
              </p>
            </div>
            <Switch
              id='is_free'
              checked={formData.is_free}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_free: checked })
              }
            />
          </div>

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type='submit'
              disabled={createLesson.isPending || !formData.title.trim()}
            >
              {createLesson.isPending ? 'Creando...' : 'Crear Lección'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
