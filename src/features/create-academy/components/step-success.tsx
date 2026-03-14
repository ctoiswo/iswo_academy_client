import { Link } from '@tanstack/react-router'
import type { Academy } from '@/types'
import { CheckCircle2, ExternalLink, Settings, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

interface StepSuccessProps {
  academy: Academy
}

export function StepSuccess({ academy }: StepSuccessProps) {
  const { t } = useTranslation()

  return (
    <div className='animate-in fade-in-0 zoom-in-95 flex flex-col items-center justify-center gap-8 py-4 duration-700'>
      {/* Success icon with glow */}
      <div className='relative'>
        <div className='bg-primary/30 absolute inset-0 animate-pulse rounded-full blur-2xl' />
        <div className='bg-primary/10 border-primary/30 relative flex size-24 items-center justify-center rounded-full border-2'>
          <CheckCircle2 className='text-primary animate-in zoom-in-0 size-12 delay-300 duration-500' />
        </div>
        {/* Floating particles */}
        <Sparkles className='text-primary absolute -top-2 -right-2 size-5 animate-bounce' />
        <Sparkles className='text-primary/60 absolute -bottom-1 -left-3 size-4 animate-bounce delay-150' />
      </div>

      {/* Success text */}
      <div className='flex flex-col items-center gap-3 text-center'>
        <h2 className='text-3xl font-bold tracking-tight'>
          {t('createAcademy.success.title')}
        </h2>
        <p className='text-muted-foreground max-w-sm leading-relaxed'>
          <span className='text-primary font-semibold'>{academy.name}</span>{' '}
          {t('createAcademy.success.subtitle')}
        </p>
        {academy.slug && (
          <div className='bg-secondary/30 border-border mt-1 rounded-lg border px-4 py-2 font-mono text-sm'>
            <span className='text-muted-foreground'>🌐 </span>
            <span className='text-primary font-semibold'>{academy.slug}</span>
            <span className='text-muted-foreground'>.iswoacademy.com</span>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className='flex w-full max-w-xs flex-col gap-3'>
        <Button
          size='lg'
          className='bg-primary text-primary-foreground hover:bg-primary/90 h-12 w-full gap-2 text-sm font-semibold transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.35)]'
          asChild
        >
          <Link to='/'>
            <Settings className='size-4' />
            {t('createAcademy.success.goHome')}
          </Link>
        </Button>
        <Button
          variant='outline'
          size='lg'
          className='border-border hover:border-primary/50 hover:bg-secondary/50 h-12 w-full gap-2 text-sm font-medium transition-all duration-300'
          asChild
        >
          <a
            href={`/academies/${academy.slug}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <ExternalLink className='size-4' />
            {t('createAcademy.success.viewAcademy')}
          </a>
        </Button>
      </div>

      {/* Stats preview */}
      <div className='flex items-center gap-6 pt-2'>
        {[
          { label: t('createAcademy.success.courses') ?? 'Cursos', value: '0' },
          {
            label: t('createAcademy.success.students') ?? 'Estudiantes',
            value: '0',
          },
          { label: t('createAcademy.success.inactiveBadge'), value: '—' },
        ].map((stat) => (
          <div key={stat.label} className='flex flex-col items-center gap-1'>
            <span className='text-foreground text-lg font-bold'>
              {stat.value}
            </span>
            <span className='text-muted-foreground text-xs'>{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
