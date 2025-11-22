import { useState, useEffect } from 'react'
import type { Section, UpdateSectionData } from '@/services/section-service'
import { useUpdateSection } from '@/hooks/use-sections'
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

interface EditSectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  academySlug: string
  courseSlug: string
  section: Section | null
}

export function EditSectionDialog({
  open,
  onOpenChange,
  academySlug,
  courseSlug,
  section,
}: EditSectionDialogProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const updateSection = useUpdateSection(academySlug, courseSlug)

  // Update form when section changes
  useEffect(() => {
    if (section) {
      setTitle(section.title)
      setDescription(section.description || '')
    }
  }, [section])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!section || !title.trim()) return

    const data: UpdateSectionData = {
      title: title.trim(),
    }

    if (description.trim()) {
      data.description = description.trim()
    }

    updateSection.mutate(
      { sectionId: section.id, data },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-xl'>
        <DialogHeader>
          <DialogTitle>Editar Sección</DialogTitle>
          <DialogDescription>
            Actualiza el título y descripción de la sección
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='edit-title'>
              Título de la Sección <span className='text-destructive'>*</span>
            </Label>
            <Input
              id='edit-title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='ej. Introducción al curso'
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='edit-description'>Descripción (opcional)</Label>
            <Textarea
              id='edit-description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Descripción de la sección'
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
            <Button type='submit' disabled={updateSection.isPending}>
              {updateSection.isPending ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
