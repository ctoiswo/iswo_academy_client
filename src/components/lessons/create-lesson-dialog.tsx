import { useState } from 'react'
import type { CreateLessonData } from '@/services/lesson-service'
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
  const [formData, setFormData] = useState<CreateLessonData>({
    title: '',
    lesson_type: 'video',
    content: '',
    video_provider: 'youtube',
    video_identifier: '',
    duration_minutes: 0,
    is_free: false,
  })

  const createLesson = useCreateLesson(academySlug, courseSlug, sectionId)

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) return

    const dataToSubmit: CreateLessonData = {
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

    createLesson.mutate(dataToSubmit, {
      onSuccess: () => {
        setFormData({
          title: '',
          lesson_type: 'video',
          content: '',
          video_provider: 'youtube',
          video_identifier: '',
          duration_minutes: 0,
          is_free: false,
        })
        onOpenChange(false)
      },
    })
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
                <Label htmlFor='video_provider'>Proveedor de Video</Label>
                <Select
                  value={formData.video_provider}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, video_provider: value })
                  }
                >
                  <SelectTrigger id='video_provider'>
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
                <Label htmlFor='video_identifier'>ID del Video</Label>
                <Input
                  id='video_identifier'
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
              <Label htmlFor='content'>Contenido</Label>
              <Textarea
                id='content'
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder='Escribe el contenido de la lección...'
                rows={6}
              />
            </div>
          )}

          <div className='space-y-2'>
            <Label htmlFor='duration_minutes'>Duración (minutos)</Label>
            <Input
              id='duration_minutes'
              type='number'
              min='0'
              value={formData.duration_minutes}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  duration_minutes: parseInt(e.target.value) || 0,
                })
              }
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
