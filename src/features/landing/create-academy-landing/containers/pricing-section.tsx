import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Check, Sparkles } from 'lucide-react'

const planPrices = {
  starter: { monthly: 29, yearly: 19 },
  pro: { monthly: 79, yearly: 59 },
  enterprise: { monthly: 199, yearly: 149 },
}

const planKeys = ['starter', 'pro', 'enterprise'] as const
type PlanKey = (typeof planKeys)[number]

const popularPlan: PlanKey = 'pro'

export function PricingSection() {
  const { t } = useTranslation()
  const [yearly, setYearly] = useState(true)

  const plans = planKeys.map((key) => {
    const prices = planPrices[key]
    const price = yearly ? prices.yearly : prices.monthly
    const features = t(`createAcademyLanding.pricing.${key}.features`, {
      returnObjects: true,
    }) as string[]
    return {
      key,
      name: t(`createAcademyLanding.pricing.${key}.name`),
      description: t(`createAcademyLanding.pricing.${key}.description`),
      cta: t(`createAcademyLanding.pricing.${key}.cta`),
      price,
      features,
      popular: key === popularPlan,
    }
  })

  return (
    <section id='precios' className='relative py-24'>
      <div className='max-w-7xl mx-auto px-4 lg:px-8 flex flex-col gap-12'>
        <div className='flex flex-col items-center gap-5 text-center'>
          <span className='text-xs font-semibold uppercase tracking-widest text-primary'>
            {t('createAcademyLanding.pricing.eyebrow')}
          </span>
          <h2
            className='text-3xl sm:text-4xl font-bold text-foreground tracking-tight text-balance'
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t('createAcademyLanding.pricing.title')}
          </h2>
          <p className='text-sm text-muted-foreground max-w-lg leading-relaxed'>
            {t('createAcademyLanding.pricing.subtitle')}
          </p>

          {/* Toggle */}
          <div className='flex items-center gap-3 p-1 rounded-full border border-border/50 bg-secondary/30'>
            <button
              onClick={() => setYearly(false)}
              className={cn(
                'px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-200',
                !yearly ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {t('createAcademyLanding.pricing.monthly')}
            </button>
            <button
              onClick={() => setYearly(true)}
              className={cn(
                'px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-200 flex items-center gap-1.5',
                yearly ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {t('createAcademyLanding.pricing.yearly')}
              <span
                className={cn(
                  'text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-colors',
                  yearly ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-primary/10 text-primary'
                )}
              >
                {t('createAcademyLanding.pricing.discount')}
              </span>
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8'>
          {plans.map((plan) => (
            <article
              key={plan.key}
              className={cn(
                'relative flex flex-col gap-6 p-7 rounded-2xl border transition-all duration-300',
                plan.popular
                  ? 'border-primary/40 bg-card shadow-[0_0_40px_rgba(99,102,241,0.08)] scale-[1.02] lg:scale-105'
                  : 'border-border/40 bg-card/40 hover:border-primary/20 hover:bg-card/60'
              )}
            >
              {plan.popular && (
                <div className='absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-lg'>
                  <Sparkles className='size-3' />
                  {t('createAcademyLanding.pricing.mostPopular')}
                </div>
              )}

              <div className='flex flex-col gap-2'>
                <h3
                  className='text-xl font-bold text-foreground'
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {plan.name}
                </h3>
                <p className='text-sm text-muted-foreground'>{plan.description}</p>
              </div>

              <div className='flex items-baseline gap-1'>
                <span
                  className='text-4xl font-bold text-foreground'
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  ${plan.price}
                </span>
                <span className='text-sm text-muted-foreground'>
                  {t('createAcademyLanding.pricing.perMonth')}
                </span>
              </div>
              {yearly && (
                <p className='text-xs text-muted-foreground -mt-4'>
                  {t('createAcademyLanding.pricing.billedYearly', { total: plan.price * 12 })}
                </p>
              )}

              <ul className='flex flex-col gap-3 flex-1'>
                {plan.features.map((f) => (
                  <li key={f} className='flex items-start gap-2.5 text-sm text-foreground/80'>
                    <Check className='size-4 text-primary mt-0.5 shrink-0' />
                    {f}
                  </li>
                ))}
              </ul>

              <Link to='/sign-in' className='w-full'>
                <Button
                  className={cn(
                    'w-full h-11 text-sm font-semibold transition-all duration-300',
                    plan.popular
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                      : 'bg-secondary/60 text-foreground border border-border/50 hover:bg-secondary hover:border-primary/30'
                  )}
                >
                  {plan.cta}
                </Button>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
