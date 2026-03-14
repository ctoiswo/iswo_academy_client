import { useState } from 'react'
import { Check, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { PlanCtaModal } from './plan-cta-modal'

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
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('')

  const openModal = (planName: string) => {
    setSelectedPlan(planName)
    setModalOpen(true)
  }

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
      <div className='mx-auto flex max-w-7xl flex-col gap-12 px-4 lg:px-8'>
        <div className='flex flex-col items-center gap-5 text-center'>
          <span className='text-primary text-xs font-semibold tracking-widest uppercase'>
            {t('createAcademyLanding.pricing.eyebrow')}
          </span>
          <h2
            className='text-foreground text-3xl font-bold tracking-tight text-balance sm:text-4xl'
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t('createAcademyLanding.pricing.title')}
          </h2>
          <p className='text-muted-foreground max-w-lg text-sm leading-relaxed'>
            {t('createAcademyLanding.pricing.subtitle')}
          </p>

          {/* Toggle */}
          <div className='border-border/50 bg-secondary/30 flex items-center gap-3 rounded-full border p-1'>
            <button
              onClick={() => setYearly(false)}
              className={cn(
                'rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200',
                !yearly
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {t('createAcademyLanding.pricing.monthly')}
            </button>
            <button
              onClick={() => setYearly(true)}
              className={cn(
                'flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200',
                yearly
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {t('createAcademyLanding.pricing.yearly')}
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 text-[10px] font-bold transition-colors',
                  yearly
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'bg-primary/10 text-primary'
                )}
              >
                {t('createAcademyLanding.pricing.discount')}
              </span>
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className='grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8'>
          {plans.map((plan) => (
            <article
              key={plan.key}
              className={cn(
                'relative flex flex-col gap-6 rounded-2xl border p-7 transition-all duration-300',
                plan.popular
                  ? 'border-primary/40 bg-card scale-[1.02] shadow-[0_0_40px_rgba(99,102,241,0.08)] lg:scale-105'
                  : 'border-border/40 bg-card/40 hover:border-primary/20 hover:bg-card/60'
              )}
            >
              {plan.popular && (
                <div className='bg-primary text-primary-foreground absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full px-4 py-1 text-xs font-semibold shadow-lg'>
                  <Sparkles className='size-3' />
                  {t('createAcademyLanding.pricing.mostPopular')}
                </div>
              )}

              <div className='flex flex-col gap-2'>
                <h3
                  className='text-foreground text-xl font-bold'
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {plan.name}
                </h3>
                <p className='text-muted-foreground text-sm'>
                  {plan.description}
                </p>
              </div>

              <div className='flex items-baseline gap-1'>
                <span
                  className='text-foreground text-4xl font-bold'
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  ${plan.price}
                </span>
                <span className='text-muted-foreground text-sm'>
                  {t('createAcademyLanding.pricing.perMonth')}
                </span>
              </div>
              {yearly && (
                <p className='text-muted-foreground -mt-4 text-xs'>
                  {t('createAcademyLanding.pricing.billedYearly', {
                    total: plan.price * 12,
                  })}
                </p>
              )}

              <ul className='flex flex-1 flex-col gap-3'>
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className='text-foreground/80 flex items-start gap-2.5 text-sm'
                  >
                    <Check className='text-primary mt-0.5 size-4 shrink-0' />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => openModal(plan.name)}
                className={cn(
                  'h-11 w-full text-sm font-semibold transition-all duration-300',
                  plan.popular
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                    : 'bg-secondary/60 text-foreground border-border/50 hover:bg-secondary hover:border-primary/30 border'
                )}
              >
                {plan.cta}
              </Button>
            </article>
          ))}
        </div>
      </div>

      <PlanCtaModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        planName={selectedPlan}
      />
    </section>
  )
}
