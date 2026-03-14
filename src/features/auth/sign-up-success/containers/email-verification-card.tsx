import { Mail, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/use-translation'

interface EmailVerificationCardProps {
  mounted: boolean
}

export function EmailVerificationCard({ mounted }: EmailVerificationCardProps) {
  const { t } = useTranslation()

  return (
    <div
      className={cn(
        'border-border/50 bg-card/60 w-full rounded-2xl border p-6 backdrop-blur-sm transition-all delay-500 duration-700',
        mounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      )}
    >
      <div className='flex flex-col items-center gap-4'>
        <div className='bg-primary/10 border-primary/20 flex size-12 items-center justify-center rounded-full border'>
          <Mail className='text-primary size-6' />
        </div>
        <div className='flex flex-col items-center gap-2'>
          <h2
            className='text-foreground text-lg font-semibold'
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t('auth.signUpSuccess.verifyEmail')}
          </h2>
          <p className='text-muted-foreground max-w-sm text-sm leading-relaxed'>
            {t('auth.signUpSuccess.verifyEmailDescription')}
          </p>
        </div>
        <div className='bg-secondary/50 border-border/40 mt-1 flex items-center gap-2 rounded-full border px-3 py-1.5'>
          <Clock className='text-muted-foreground size-3.5' />
          <span className='text-muted-foreground text-xs'>
            {t('auth.signUpSuccess.linkExpires')}
          </span>
        </div>
      </div>
    </div>
  )
}
