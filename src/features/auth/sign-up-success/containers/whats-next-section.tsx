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
        'w-full flex flex-col gap-4 transition-all duration-700 delay-700',
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      )}
    >
      <p className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>
        {t('auth.signUpSuccess.whatAwaits')}
      </p>
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
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
