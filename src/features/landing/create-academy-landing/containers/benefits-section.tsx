import {
  Palette,
  BarChart3,
  Globe,
  Shield,
  CreditCard,
  Headphones,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

const benefitIcons = [Palette, BarChart3, Globe, Shield, CreditCard, Headphones]
const benefitAccents = [
  'from-indigo-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-sky-500 to-blue-600',
  'from-amber-500 to-orange-600',
  'from-pink-500 to-rose-600',
  'from-violet-500 to-purple-600',
]
const benefitKeys = [
  'branding',
  'analytics',
  'global',
  'hosting',
  'payments',
  'support',
] as const

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
      <div className='mx-auto flex max-w-7xl flex-col gap-12 px-4 lg:px-8'>
        <div className='flex flex-col items-center gap-4 text-center'>
          <span className='text-primary text-xs font-semibold tracking-widest uppercase'>
            {t('createAcademyLanding.benefits.eyebrow')}
          </span>
          <h2
            className='text-foreground text-3xl font-bold tracking-tight text-balance sm:text-4xl'
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t('createAcademyLanding.benefits.title')}
          </h2>
          <p className='text-muted-foreground max-w-lg text-sm leading-relaxed'>
            {t('createAcademyLanding.benefits.subtitle')}
          </p>
        </div>

        <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
          {benefits.map((b) => {
            const Icon = b.icon
            return (
              <article
                key={b.title}
                className='group border-border/40 bg-card/40 hover:border-primary/30 hover:bg-card/70 relative flex flex-col gap-4 rounded-xl border p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_24px_rgba(99,102,241,0.06)]'
              >
                <div
                  className={cn(
                    'flex size-11 items-center justify-center rounded-xl bg-gradient-to-br',
                    b.accent
                  )}
                >
                  <Icon className='text-foreground size-5' />
                </div>
                <h3
                  className='text-foreground text-base font-semibold'
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {b.title}
                </h3>
                <p className='text-muted-foreground text-sm leading-relaxed'>
                  {b.description}
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
