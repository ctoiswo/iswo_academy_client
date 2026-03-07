import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { UserPlus, Upload, Megaphone, Banknote } from 'lucide-react'

const stepIcons = [UserPlus, Upload, Megaphone, Banknote]
const stepNumbers = ['01', '02', '03', '04'] as const
const stepKeys = ['step1', 'step2', 'step3', 'step4'] as const

export function HowItWorks() {
  const { t } = useTranslation()

  const steps = stepKeys.map((key, i) => ({
    icon: stepIcons[i],
    number: stepNumbers[i],
    title: t(`createAcademyLanding.howItWorks.${key}.title`),
    description: t(`createAcademyLanding.howItWorks.${key}.description`),
  }))

  return (
    <section className='relative py-24 overflow-hidden'>
      <div className='max-w-7xl mx-auto px-4 lg:px-8 flex flex-col gap-16'>
        <div className='flex flex-col items-center gap-4 text-center'>
          <span className='text-xs font-semibold uppercase tracking-widest text-primary'>
            {t('createAcademyLanding.howItWorks.eyebrow')}
          </span>
          <h2
            className='text-3xl sm:text-4xl font-bold text-foreground tracking-tight text-balance'
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t('createAcademyLanding.howItWorks.title')}
          </h2>
          <p className='text-sm text-muted-foreground max-w-lg leading-relaxed'>
            {t('createAcademyLanding.howItWorks.subtitle')}
          </p>
        </div>

        <div className='relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {/* Connecting line (desktop) */}
          <div className='hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent' aria-hidden='true' />

          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={step.number} className='relative flex flex-col items-center text-center gap-6'>
                <div className='relative'>
                  <div
                    className={cn(
                      'flex items-center justify-center size-16 rounded-2xl border bg-card transition-all duration-300',
                      'border-primary/20 hover:border-primary/50 hover:shadow-[0_0_24px_rgba(99,102,241,0.12)]'
                    )}
                  >
                    <Icon className='size-7 text-primary' />
                  </div>
                  <span
                    className='absolute -top-2 -right-2 flex items-center justify-center size-7 rounded-lg bg-primary text-primary-foreground text-xs font-bold'
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {step.number}
                  </span>
                </div>

                <div className='flex flex-col gap-2'>
                  <h3
                    className='text-lg font-semibold text-foreground'
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {step.title}
                  </h3>
                  <p className='text-sm text-muted-foreground leading-relaxed max-w-[250px] mx-auto'>
                    {step.description}
                  </p>
                </div>

                {i < steps.length - 1 && (
                  <div className='lg:hidden w-px h-8 bg-primary/20' aria-hidden='true' />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
