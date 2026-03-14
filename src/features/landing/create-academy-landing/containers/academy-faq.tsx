import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

interface FaqItem {
  question: string
  answer: string
}

export function AcademyFaq() {
  const { t } = useTranslation()
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = t('createAcademyLanding.faq.items', {
    returnObjects: true,
  }) as FaqItem[]

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  return (
    <section className='bg-muted/20 relative py-24'>
      <div className='mx-auto flex max-w-7xl flex-col gap-12 px-4 lg:px-8'>
        <div className='flex flex-col items-center gap-4 text-center'>
          <span className='text-primary text-xs font-semibold tracking-widest uppercase'>
            {t('createAcademyLanding.faq.eyebrow')}
          </span>
          <h2
            className='text-foreground text-3xl font-bold tracking-tight text-balance sm:text-4xl'
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t('createAcademyLanding.faq.title')}
          </h2>
          <p className='text-muted-foreground max-w-lg text-sm leading-relaxed'>
            {t('createAcademyLanding.faq.subtitle')}
          </p>
        </div>

        <div className='mx-auto flex w-full max-w-3xl flex-col gap-3'>
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={index}
                className={cn(
                  'rounded-xl border transition-colors duration-200',
                  isOpen
                    ? 'border-primary/30 bg-card/80'
                    : 'border-border/40 bg-card/40'
                )}
              >
                <button
                  className='flex w-full items-center justify-between gap-4 px-6 py-5 text-left'
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                >
                  <span
                    className={cn(
                      'text-sm leading-snug font-semibold transition-colors sm:text-base',
                      isOpen ? 'text-primary' : 'text-foreground'
                    )}
                  >
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      'text-muted-foreground size-4 shrink-0 transition-transform duration-300',
                      isOpen && 'text-primary rotate-180'
                    )}
                  />
                </button>

                <div
                  className={cn(
                    'overflow-hidden transition-all duration-300 ease-in-out',
                    isOpen ? 'max-h-96' : 'max-h-0'
                  )}
                >
                  <p className='text-muted-foreground px-6 pb-5 text-sm leading-relaxed'>
                    {faq.answer}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
