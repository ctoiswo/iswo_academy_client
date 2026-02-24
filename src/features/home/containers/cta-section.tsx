import { CtaIconBadge } from '../components/cta-icon-badge'
import { CtaContent } from '../components/cta-content'
import { CtaButtons } from '../components/cta-buttons'

export function CTASection() {
  return (
    <section className='relative py-24'>
      <div className='max-w-7xl mx-auto px-4 lg:px-8'>
        <div className='relative rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm overflow-hidden'>

          <div className='relative z-10 flex flex-col items-center gap-8 py-20 px-6 text-center'>
            <CtaIconBadge />
            <CtaContent />
            <CtaButtons />
          </div>
        </div>
      </div>
    </section>
  )
}
