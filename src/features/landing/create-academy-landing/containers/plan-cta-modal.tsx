import { Link } from '@tanstack/react-router'
import { LogIn, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface PlanCtaModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  planName: string
}

export function PlanCtaModal({
  open,
  onOpenChange,
  planName,
}: PlanCtaModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold'>
            Empezar con {planName}
          </DialogTitle>
          <DialogDescription className='text-muted-foreground text-sm'>
            ¿Cómo quieres continuar?
          </DialogDescription>
        </DialogHeader>

        <div className='flex flex-col gap-3 pt-2'>
          {/* Option 1: Already has account */}
          <Link
            to='/create-academy'
            search={{ mode: 'login' }}
            onClick={() => onOpenChange(false)}
          >
            <Button
              variant='outline'
              className='border-border/60 hover:border-primary/40 hover:bg-secondary/50 flex h-auto w-full items-start gap-4 py-4 text-left transition-all duration-200'
            >
              <div className='bg-secondary mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg'>
                <LogIn className='text-muted-foreground size-4' />
              </div>
              <div className='flex flex-col gap-0.5'>
                <span className='text-foreground text-sm font-semibold'>
                  Ya tengo una cuenta
                </span>
                <span className='text-muted-foreground text-xs leading-relaxed font-normal'>
                  Inicia sesión y te llevamos directamente al wizard de creación
                </span>
              </div>
            </Button>
          </Link>

          {/* Option 2: Create new account */}
          <Link to='/create-academy' onClick={() => onOpenChange(false)}>
            <Button className='bg-primary text-primary-foreground hover:bg-primary/90 flex h-auto w-full items-start gap-4 py-4 text-left shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all duration-200 hover:shadow-[0_0_28px_rgba(99,102,241,0.35)]'>
              <div className='bg-primary-foreground/10 mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg'>
                <UserPlus className='size-4' />
              </div>
              <div className='flex flex-col gap-0.5'>
                <span className='text-sm font-semibold'>
                  Crear cuenta nueva
                </span>
                <span className='text-primary-foreground/70 text-xs leading-relaxed font-normal'>
                  Regístrate y configura tu academia en un solo flujo
                </span>
              </div>
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  )
}
