import { CtaButtons } from '../components/cta-buttons'
import { CtaContent } from '../components/cta-content'
import { CtaIconBadge } from '../components/cta-icon-badge'

export function CTASection() {
  return (
    <section className='relative py-24'>
      <div className='mx-auto max-w-7xl px-4 lg:px-8'>
        <div className='border-border/40 bg-card/40 relative overflow-hidden rounded-2xl border backdrop-blur-sm'>
          <div className='relative z-10 flex flex-col items-center gap-8 px-6 py-20 text-center'>
            <CtaIconBadge />
            <CtaContent />
            <CtaButtons />
          </div>
        </div>
      </div>
    </section>
  )
}
