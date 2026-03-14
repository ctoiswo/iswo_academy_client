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
          <DialogDescription className='text-sm text-muted-foreground'>
            ¿Cómo quieres continuar?
          </DialogDescription>
        </DialogHeader>

        <div className='flex flex-col gap-3 pt-2'>
          {/* Option 1: Already has account */}
          <Link
            to='/sign-in'
            search={{ redirect: '/create-academy' }}
            onClick={() => onOpenChange(false)}
          >
            <Button
              variant='outline'
              className='w-full h-auto py-4 flex items-start gap-4 text-left border-border/60 hover:border-primary/40 hover:bg-secondary/50 transition-all duration-200'
            >
              <div className='flex items-center justify-center size-9 rounded-lg bg-secondary shrink-0 mt-0.5'>
                <LogIn className='size-4 text-muted-foreground' />
              </div>
              <div className='flex flex-col gap-0.5'>
                <span className='text-sm font-semibold text-foreground'>
                  Ya tengo una cuenta
                </span>
                <span className='text-xs text-muted-foreground font-normal leading-relaxed'>
                  Inicia sesión y te llevamos directamente al wizard de creación
                </span>
              </div>
            </Button>
          </Link>

          {/* Option 2: Create new account */}
          <Link
            to='/create-academy'
            onClick={() => onOpenChange(false)}
          >
            <Button
              className='w-full h-auto py-4 flex items-start gap-4 text-left bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_28px_rgba(99,102,241,0.35)] transition-all duration-200'
            >
              <div className='flex items-center justify-center size-9 rounded-lg bg-primary-foreground/10 shrink-0 mt-0.5'>
                <UserPlus className='size-4' />
              </div>
              <div className='flex flex-col gap-0.5'>
                <span className='text-sm font-semibold'>
                  Crear cuenta nueva
                </span>
                <span className='text-xs text-primary-foreground/70 font-normal leading-relaxed'>
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
