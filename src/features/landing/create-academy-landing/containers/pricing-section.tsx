import { useState } from 'react'
import { Check, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ADMIN_SUBSCRIPTION_PLANS } from '@/constants/admin-subscription-plans'
import { Button } from '@/components/ui/button'
import { PlanCtaModal } from './plan-cta-modal'

export function PricingSection() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('')

  const openModal = (planName: string) => {
    setSelectedPlan(planName)
    setModalOpen(true)
  }

  return (
    <section id='precios' className='relative py-24'>
      <div className='mx-auto flex max-w-7xl flex-col gap-12 px-4 lg:px-8'>
        <div className='flex flex-col items-center gap-5 text-center'>
          <span className='text-primary text-xs font-semibold tracking-widest uppercase'>
            Precios
          </span>
          <h2
            className='text-foreground text-3xl font-bold tracking-tight text-balance sm:text-4xl'
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Dos planes anuales, claros y directos
          </h2>
          <p className='text-muted-foreground max-w-lg text-sm leading-relaxed'>
            Elige el plan que mejor se ajuste a tu academia. Ambos se pagan una
            vez al ano y activan tu academia en ISWO.
          </p>
        </div>

        {/* Cards */}
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8'>
          {ADMIN_SUBSCRIPTION_PLANS.map((plan) => (
            <article
              key={plan.code}
              className={cn(
                'relative flex flex-col gap-6 rounded-2xl border p-7 transition-all duration-300',
                plan.code === 'pro'
                  ? 'border-primary/40 bg-card scale-[1.02] shadow-[0_0_40px_rgba(99,102,241,0.08)] lg:scale-105'
                  : 'border-border/40 bg-card/40 hover:border-primary/20 hover:bg-card/60'
              )}
            >
              {plan.badge && (
                <div className='bg-primary text-primary-foreground absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full px-4 py-1 text-xs font-semibold shadow-lg'>
                  <Sparkles className='size-3' />
                  {plan.badge}
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
                  ${plan.price.toLocaleString('es-CO')}
                </span>
                <span className='text-muted-foreground text-sm'>/ ano</span>
              </div>
              <p className='text-muted-foreground -mt-4 text-xs'>
                Facturado anualmente en pesos colombianos.
              </p>

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
                  plan.code === 'pro'
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                    : 'bg-secondary/60 text-foreground border-border/50 hover:bg-secondary hover:border-primary/30 border'
                )}
              >
                Empezar con {plan.name}
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
