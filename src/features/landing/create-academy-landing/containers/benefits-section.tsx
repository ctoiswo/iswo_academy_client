import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Palette, BarChart3, Globe, Shield, CreditCard, Headphones } from 'lucide-react'

const benefitIcons = [Palette, BarChart3, Globe, Shield, CreditCard, Headphones]
const benefitAccents = [
  'from-indigo-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-sky-500 to-blue-600',
  'from-amber-500 to-orange-600',
  'from-pink-500 to-rose-600',
  'from-violet-500 to-purple-600',
]
const benefitKeys = ['branding', 'analytics', 'global', 'hosting', 'payments', 'support'] as const

export function BenefitsSection() {
  const { t } = useTranslation()

  const benefits = benefitKeys.map((key, i) => ({
    icon: benefitIcons[i],
    accent: benefitAccents[i],
    title: t(`createAcademyLanding.benefits.${key}.title`),
    description: t(`createAcademyLanding.benefits.${key}.description`),
  }))

  return (
    <section className='relative py-24'>
      <div className='max-w-7xl mx-auto px-4 lg:px-8 flex flex-col gap-12'>
        <div className='flex flex-col items-center gap-4 text-center'>
          <span className='text-xs font-semibold uppercase tracking-widest text-primary'>
            {t('createAcademyLanding.benefits.eyebrow')}
          </span>
          <h2
            className='text-3xl sm:text-4xl font-bold text-foreground tracking-tight text-balance'
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t('createAcademyLanding.benefits.title')}
          </h2>
          <p className='text-sm text-muted-foreground max-w-lg leading-relaxed'>
            {t('createAcademyLanding.benefits.subtitle')}
          </p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
          {benefits.map((b) => {
            const Icon = b.icon
            return (
              <article
                key={b.title}
                className='group relative flex flex-col gap-4 p-6 rounded-xl border border-border/40 bg-card/40 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-card/70 hover:shadow-[0_0_24px_rgba(99,102,241,0.06)]'
              >
                <div className={cn('flex items-center justify-center size-11 rounded-xl bg-gradient-to-br', b.accent)}>
                  <Icon className='size-5 text-foreground' />
                </div>
                <h3
                  className='text-base font-semibold text-foreground'
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {b.title}
                </h3>
                <p className='text-sm text-muted-foreground leading-relaxed'>{b.description}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
