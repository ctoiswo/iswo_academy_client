import { CheckCircle2, ExternalLink, Settings, Sparkles } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import type { Academy } from '@/types'

interface StepSuccessProps {
  academy: Academy
}

export function StepSuccess({ academy }: StepSuccessProps) {
  const { t } = useTranslation()

  return (
    <div className='flex flex-col items-center justify-center gap-8 py-4 animate-in fade-in-0 zoom-in-95 duration-700'>
      {/* Success icon with glow */}
      <div className='relative'>
        <div className='absolute inset-0 blur-2xl bg-primary/30 rounded-full animate-pulse' />
        <div className='relative flex items-center justify-center size-24 rounded-full bg-primary/10 border-2 border-primary/30'>
          <CheckCircle2 className='size-12 text-primary animate-in zoom-in-0 duration-500 delay-300' />
        </div>
        {/* Floating particles */}
        <Sparkles className='absolute -top-2 -right-2 size-5 text-primary animate-bounce' />
        <Sparkles className='absolute -bottom-1 -left-3 size-4 text-primary/60 animate-bounce delay-150' />
      </div>

      {/* Success text */}
      <div className='flex flex-col items-center gap-3 text-center'>
        <h2 className='text-3xl font-bold tracking-tight'>
          {t('createAcademy.success.title')}
        </h2>
        <p className='text-muted-foreground leading-relaxed max-w-sm'>
          <span className='text-primary font-semibold'>{academy.name}</span>{' '}
          {t('createAcademy.success.subtitle')}
        </p>
        {academy.slug && (
          <div className='bg-secondary/30 border border-border rounded-lg px-4 py-2 font-mono text-sm mt-1'>
            <span className='text-muted-foreground'>🌐 </span>
            <span className='text-primary font-semibold'>{academy.slug}</span>
            <span className='text-muted-foreground'>.iswoacademy.com</span>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className='flex flex-col gap-3 w-full max-w-xs'>
        <Button
          size='lg'
          className='w-full h-12 text-sm font-semibold gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.35)]'
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
          className='w-full h-12 text-sm font-medium gap-2 border-border hover:border-primary/50 hover:bg-secondary/50 transition-all duration-300'
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
          { label: t('createAcademy.success.students') ?? 'Estudiantes', value: '0' },
          { label: t('createAcademy.success.inactiveBadge'), value: '—' },
        ].map((stat) => (
          <div key={stat.label} className='flex flex-col items-center gap-1'>
            <span className='text-lg font-bold text-foreground'>
              {stat.value}
            </span>
            <span className='text-xs text-muted-foreground'>{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
