import { ArrowRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'
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
        'flex flex-col gap-3 w-full max-w-xs transition-all duration-700 delay-[1000ms]',
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      )}
    >
      <Button
        asChild
        size='lg'
        className='w-full h-12 text-sm font-semibold gap-2 shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_28px_rgba(99,102,241,0.35)] transition-all duration-300'
      >
        <Link to='/sign-in'>
          {t('auth.signUpSuccess.signInButton')}
          <ArrowRight className='size-4' />
        </Link>
      </Button>
      <Button asChild variant='ghost' size='lg' className='w-full h-11 text-sm'>
        <Link to='/'>
          {t('auth.signUpSuccess.backToHome')}
        </Link>
      </Button>
    </div>
  )
}
