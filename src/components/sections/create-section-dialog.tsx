import { useState } from 'react'
import { useCreateSection } from '@/hooks/use-sections'
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
import { Textarea } from '@/components/ui/textarea'

interface CreateSectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  academySlug: string
  courseSlug: string
}

export function CreateSectionDialog({
  open,
  onOpenChange,
  academySlug,
  courseSlug,
}: CreateSectionDialogProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const createSection = useCreateSection(academySlug, courseSlug)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      return
    }

    createSection.mutate(
      {
        title: title.trim(),
        description: description.trim() || undefined,
      },
      {
        onSuccess: () => {
          setTitle('')
          setDescription('')
          onOpenChange(false)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle>Crear Nueva Sección</DialogTitle>
          <DialogDescription>
            Las secciones ayudan a organizar el contenido del curso en bloques
            temáticos
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='title'>
              Título de la Sección <span className='text-destructive'>*</span>
            </Label>
            <Input
              id='title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='ej. Introducción a React'
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='description'>Descripción (opcional)</Label>
            <Textarea
              id='description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Breve descripción de lo que cubre esta sección'
              rows={3}
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
              disabled={createSection.isPending || !title.trim()}
            >
              {createSection.isPending ? 'Creando...' : 'Crear Sección'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
