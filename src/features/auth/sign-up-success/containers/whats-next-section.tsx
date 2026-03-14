import { BookOpen, GraduationCap, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/use-translation'
import { FeatureCard } from '../components/feature-card'

interface WhatsNextSectionProps {
  mounted: boolean
}

export function WhatsNextSection({ mounted }: WhatsNextSectionProps) {
  const { t } = useTranslation()

  const features = [
    {
      icon: BookOpen,
      title: t('auth.signUpSuccess.featureCoursesTitle'),
      desc: t('auth.signUpSuccess.featureCoursesDesc'),
    },
    {
      icon: GraduationCap,
      title: t('auth.signUpSuccess.featureCertsTitle'),
      desc: t('auth.signUpSuccess.featureCertsDesc'),
    },
    {
      icon: ShieldCheck,
      title: t('auth.signUpSuccess.featureAccessTitle'),
      desc: t('auth.signUpSuccess.featureAccessDesc'),
    },
  ]

  return (
    <div
      className={cn(
        'flex w-full flex-col gap-4 transition-all delay-700 duration-700',
        mounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      )}
    >
      <p className='text-muted-foreground text-xs font-medium tracking-wider uppercase'>
        {t('auth.signUpSuccess.whatAwaits')}
      </p>
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
        {features.map((item, i) => (
          <FeatureCard
            key={item.title}
            icon={item.icon}
            title={item.title}
            desc={item.desc}
            mounted={mounted}
            delay={800 + i * 100}
          />
        ))}
      </div>
    </div>
  )
}
