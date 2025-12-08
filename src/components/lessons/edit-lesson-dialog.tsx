import { useState, useEffect } from 'react'
import type { Lesson, UpdateLessonRequest } from '@/types'
import { useUpdateLesson } from '@/hooks/use-lessons'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

interface EditLessonDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  academySlug: string
  courseSlug: string
  sectionId: number
  lesson: Lesson | null
}

export function EditLessonDialog({
  open,
  onOpenChange,
  academySlug,
  courseSlug,
  sectionId,
  lesson,
}: EditLessonDialogProps) {
  const [formData, setFormData] = useState<UpdateLessonRequest>({
    title: '',
    lesson_type: 'video',
    content: '',
    video_provider: 'youtube',
    video_identifier: '',
    duration_minutes: 0,
    is_free: false,
  })

  const updateLesson = useUpdateLesson(academySlug, courseSlug, sectionId)

  // Update form when lesson changes
  useEffect(() => {
    if (lesson) {
      setFormData({
        title: lesson.title,
        lesson_type: lesson.lesson_type,
        content: lesson.content || '',
        video_provider: lesson.video_provider || 'youtube',
        video_identifier: lesson.video_identifier || '',
        duration_minutes: lesson.duration_minutes || 0,
        is_free: lesson.is_free,
      })
    }
  }, [lesson])

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!lesson || !formData.title?.trim()) return

    const dataToSubmit: UpdateLessonRequest = {
      title: formData.title.trim(),
      lesson_type: formData.lesson_type,
      is_free: formData.is_free,
    }

    if (formData.lesson_type === 'video' && formData.video_identifier) {
      dataToSubmit.video_provider = formData.video_provider
      dataToSubmit.video_identifier = extractVideoId(
        formData.video_identifier,
        formData.video_provider || 'youtube'
      )
    }

    if (formData.lesson_type === 'text' && formData.content) {
      dataToSubmit.content = formData.content.trim()
    }

    if (formData.duration_minutes && formData.duration_minutes > 0) {
      dataToSubmit.duration_minutes = formData.duration_minutes
    }

    updateLesson.mutate(
      { lessonId: lesson.id, data: dataToSubmit },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] max-w-2xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Editar Lección</DialogTitle>
          <DialogDescription>
            Actualiza la información de la lección
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='edit-lesson-title'>
              Título de la Lección <span className='text-destructive'>*</span>
            </Label>
            <Input
              id='edit-lesson-title'
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder='ej. Introducción a los Hooks'
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='edit-lesson-type'>
              Tipo de Lección <span className='text-destructive'>*</span>
            </Label>
            <Select
              value={formData.lesson_type}
              onValueChange={(value: any) =>
                setFormData({ ...formData, lesson_type: value })
              }
            >
              <SelectTrigger id='edit-lesson-type'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='video'>Video</SelectItem>
                <SelectItem value='text'>Texto</SelectItem>
                <SelectItem value='quiz'>Quiz</SelectItem>
                <SelectItem value='assignment'>Tarea</SelectItem>
                <SelectItem value='interactive'>Interactivo</SelectItem>
                <SelectItem value='document'>Documento</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.lesson_type === 'video' && (
            <>
              <div className='space-y-2'>
                <Label htmlFor='edit-video-provider'>Proveedor de Video</Label>
                <Select
                  value={formData.video_provider}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, video_provider: value })
                  }
                >
                  <SelectTrigger id='edit-video-provider'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='youtube'>YouTube</SelectItem>
                    <SelectItem value='vimeo'>Vimeo</SelectItem>
                    <SelectItem value='google_drive'>Google Drive</SelectItem>
                    <SelectItem value='bunny_cdn'>Bunny CDN</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='edit-video-identifier'>ID del Video</Label>
                <Input
                  id='edit-video-identifier'
                  value={formData.video_identifier}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      video_identifier: e.target.value,
                    })
                  }
                  placeholder={
                    formData.video_provider === 'youtube'
                      ? 'ej. dQw4w9WgXcQ'
                      : 'ID del video'
                  }
                />
                <p className='text-muted-foreground text-xs'>
                  {formData.video_provider === 'youtube' &&
                    'El ID del video de YouTube (después de ?v=)'}
                  {formData.video_provider === 'vimeo' &&
                    'El ID numérico del video de Vimeo'}
                  {formData.video_provider === 'google_drive' &&
                    'El ID del archivo de Google Drive'}
                </p>
              </div>
            </>
          )}

          {formData.lesson_type === 'text' && (
            <div className='space-y-2'>
              <Label htmlFor='edit-content'>Contenido</Label>
              <Textarea
                id='edit-content'
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder='Contenido de la lección'
                rows={6}
              />
            </div>
          )}

          <div className='space-y-2'>
            <Label htmlFor='edit-duration'>Duración (minutos)</Label>
            <Input
              id='edit-duration'
              type='number'
              min='0'
              value={formData.duration_minutes || 0}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  duration_minutes: Number.parseInt(e.target.value) || 0,
                })
              }
            />
          </div>

          <div className='flex items-center space-x-2'>
            <Switch
              id='edit-is-free'
              checked={formData.is_free}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_free: checked })
              }
            />
            <Label htmlFor='edit-is-free' className='cursor-pointer'>
              Lección gratuita (disponible sin inscripción)
            </Label>
          </div>

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type='submit' disabled={updateLesson.isPending}>
              {updateLesson.isPending ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
