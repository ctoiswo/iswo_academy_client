import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/use-translation'
import { Button } from '@/components/ui/button'

interface ActionsSectionProps {
  mounted: boolean
}

export function ActionsSection({ mounted }: ActionsSectionProps) {
  const { t } = useTranslation()

  return (
    <div
      className={cn(
        'flex w-full max-w-xs flex-col gap-3 transition-all delay-[1000ms] duration-700',
        mounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      )}
    >
      <Button
        asChild
        size='lg'
        className='h-12 w-full gap-2 text-sm font-semibold shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all duration-300 hover:shadow-[0_0_28px_rgba(99,102,241,0.35)]'
      >
        <Link to='/sign-in'>
          {t('auth.signUpSuccess.signInButton')}
          <ArrowRight className='size-4' />
        </Link>
      </Button>
      <Button asChild variant='ghost' size='lg' className='h-11 w-full text-sm'>
        <Link to='/'>{t('auth.signUpSuccess.backToHome')}</Link>
      </Button>
    </div>
  )
}
