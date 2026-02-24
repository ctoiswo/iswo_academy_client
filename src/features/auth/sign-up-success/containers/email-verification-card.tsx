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
        'w-full rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-6 transition-all duration-700 delay-500',
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      )}
    >
      <div className='flex flex-col items-center gap-4'>
        <div className='flex items-center justify-center size-12 rounded-full bg-primary/10 border border-primary/20'>
          <Mail className='size-6 text-primary' />
        </div>
        <div className='flex flex-col items-center gap-2'>
          <h2
            className='text-lg font-semibold text-foreground'
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t('auth.signUpSuccess.verifyEmail')}
          </h2>
          <p className='text-sm text-muted-foreground leading-relaxed max-w-sm'>
            {t('auth.signUpSuccess.verifyEmailDescription')}
          </p>
        </div>
        <div className='flex items-center gap-2 mt-1 px-3 py-1.5 rounded-full bg-secondary/50 border border-border/40'>
          <Clock className='size-3.5 text-muted-foreground' />
          <span className='text-xs text-muted-foreground'>
            {t('auth.signUpSuccess.linkExpires')}
          </span>
        </div>
      </div>
    </div>
  )
}
