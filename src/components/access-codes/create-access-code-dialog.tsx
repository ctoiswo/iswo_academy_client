import { useState } from 'react'
import { format } from 'date-fns'
import type { CreateAccessCodeRequest } from '@/types'
import { es } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCreateAccessCode } from '@/hooks/use-access-codes'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'

interface CreateAccessCodeDialogProps {
  courseSlug: number | string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateAccessCodeDialog({
  courseSlug,
  open,
  onOpenChange,
}: CreateAccessCodeDialogProps) {
  const [usageLimit, setUsageLimit] = useState<string>('20')
  const [expiresAt, setExpiresAt] = useState<Date>()
  const [description, setDescription] = useState('')
  const [datePickerOpen, setDatePickerOpen] = useState(false)

  const createAccessCode = useCreateAccessCode(courseSlug)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!expiresAt) {
      return
    }

    const data: CreateAccessCodeRequest = {
      usage_limit: parseInt(usageLimit),
      expires_at: expiresAt.toISOString(),
      description: description.trim() || undefined,
    }

    createAccessCode.mutate(data, {
      onSuccess: () => {
        onOpenChange(false)
        // Reset form
        setUsageLimit('20')
        setExpiresAt(undefined)
        setDescription('')
      },
    })
  }

  const setQuickExpiry = (days: number) => {
    const date = new Date()
    date.setDate(date.getDate() + days)
    setExpiresAt(date)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-xl'>
        <DialogHeader>
          <DialogTitle>Crear Código de Acceso</DialogTitle>
          <DialogDescription>
            Genera un nuevo código de acceso para permitir a los estudiantes
            inscribirse gratuitamente en este curso.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='usage_limit'>Límite de Uso</Label>
            <Input
              id='usage_limit'
              type='number'
              min='1'
              max='1000'
              value={usageLimit}
              onChange={(e) => setUsageLimit(e.target.value)}
              placeholder='¿Cuántas personas pueden usar este código?'
            />
            <p className='text-muted-foreground text-sm'>
              Número máximo de estudiantes que pueden usar este código
            </p>
          </div>

          <div className='space-y-2'>
            <Label>Fecha de Expiración</Label>
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  type='button'
                  variant='outline'
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !expiresAt && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className='mr-2 h-4 w-4' />
                  {expiresAt
                    ? format(expiresAt, 'PPP', { locale: es })
                    : 'Selecciona fecha de expiración'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='start'>
                <Calendar
                  mode='single'
                  selected={expiresAt}
                  onSelect={(date) => {
                    setExpiresAt(date)
                    setDatePickerOpen(false)
                  }}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {/* Quick date buttons */}
            <div className='flex gap-2 text-sm'>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => setQuickExpiry(2)}
              >
                2 días
              </Button>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => setQuickExpiry(7)}
              >
                1 semana
              </Button>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => setQuickExpiry(30)}
              >
                1 mes
              </Button>
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='description'>Descripción (opcional)</Label>
            <Textarea
              id='description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ej., 'Promoción especial para empleados de la empresa'"
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
              disabled={createAccessCode.isPending || !expiresAt || !usageLimit}
            >
              {createAccessCode.isPending ? 'Creando...' : 'Crear Código'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
