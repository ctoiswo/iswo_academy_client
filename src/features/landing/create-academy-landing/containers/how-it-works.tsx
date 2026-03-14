import { UserPlus, Upload, Megaphone, Banknote } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

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
    <section className='relative overflow-hidden py-24'>
      <div className='mx-auto flex max-w-7xl flex-col gap-16 px-4 lg:px-8'>
        <div className='flex flex-col items-center gap-4 text-center'>
          <span className='text-primary text-xs font-semibold tracking-widest uppercase'>
            {t('createAcademyLanding.howItWorks.eyebrow')}
          </span>
          <h2
            className='text-foreground text-3xl font-bold tracking-tight text-balance sm:text-4xl'
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t('createAcademyLanding.howItWorks.title')}
          </h2>
          <p className='text-muted-foreground max-w-lg text-sm leading-relaxed'>
            {t('createAcademyLanding.howItWorks.subtitle')}
          </p>
        </div>

        <div className='relative grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
          {/* Connecting line (desktop) */}
          <div
            className='via-primary/30 absolute top-16 right-[12.5%] left-[12.5%] hidden h-px bg-gradient-to-r from-transparent to-transparent lg:block'
            aria-hidden='true'
          />

          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <div
                key={step.number}
                className='relative flex flex-col items-center gap-6 text-center'
              >
                <div className='relative'>
                  <div
                    className={cn(
                      'bg-card flex size-16 items-center justify-center rounded-2xl border transition-all duration-300',
                      'border-primary/20 hover:border-primary/50 hover:shadow-[0_0_24px_rgba(99,102,241,0.12)]'
                    )}
                  >
                    <Icon className='text-primary size-7' />
                  </div>
                  <span
                    className='bg-primary text-primary-foreground absolute -top-2 -right-2 flex size-7 items-center justify-center rounded-lg text-xs font-bold'
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {step.number}
                  </span>
                </div>

                <div className='flex flex-col gap-2'>
                  <h3
                    className='text-foreground text-lg font-semibold'
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {step.title}
                  </h3>
                  <p className='text-muted-foreground mx-auto max-w-[250px] text-sm leading-relaxed'>
                    {step.description}
                  </p>
                </div>

                {i < steps.length - 1 && (
                  <div
                    className='bg-primary/20 h-8 w-px lg:hidden'
                    aria-hidden='true'
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
