import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/use-translation'

interface HelpTextProps {
  mounted: boolean
  onResend: () => void
}

export function HelpText({ mounted, onResend }: HelpTextProps) {
  const { t } = useTranslation()

  return (
    <p
      className={cn(
        'text-xs text-muted-foreground/60 transition-all duration-700 delay-[1100ms]',
        mounted ? 'opacity-100' : 'opacity-0'
      )}
    >
      {t('auth.signUpSuccess.noEmail')}{' '}
      <button
        onClick={onResend}
        className='text-primary/70 hover:text-primary underline underline-offset-2 transition-colors'
      >
        {t('auth.signUpSuccess.resendVerification')}
      </button>
    </p>
  )
}
