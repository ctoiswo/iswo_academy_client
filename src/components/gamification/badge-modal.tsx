import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import type { UserBadge } from '@/types'
import { Sparkles, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { BadgeIcon, getVisualConfig } from './badge-visual-config'

interface BadgeModalProps {
  badge: UserBadge | null
  open: boolean
  onClose: () => void
}

// ─── Confetti ─────────────────────────────────────────────────────────────────

function Confetti({ show }: { show: boolean }) {
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; delay: number; color: string }>
  >([])

  useEffect(() => {
    if (show) {
      const colors = [
        '#818cf8',
        '#a78bfa',
        '#c084fc',
        '#f472b6',
        '#fb923c',
        '#fbbf24',
        '#34d399',
      ]
      setParticles(
        Array.from({ length: 30 }, (_, i) => ({
          id: i,
          x: Math.random() * 100,
          delay: Math.random() * 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
        }))
      )
    }
  }, [show])

  if (!show) return null

  return (
    <div className='pointer-events-none absolute inset-0 overflow-hidden'>
      {particles.map((p) => (
        <div
          key={p.id}
          className='animate-confetti absolute h-2 w-2 rounded-full'
          style={{
            left: `${p.x}%`,
            top: '-8px',
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

export function BadgeModal({ badge, open, onClose }: BadgeModalProps) {
  const [animateIn, setAnimateIn] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const navigate = useNavigate()
  const { t } = useTranslation()

  useEffect(() => {
    if (open && badge) {
      const t1 = setTimeout(() => setAnimateIn(true), 100)
      const t2 = setTimeout(() => setShowConfetti(true), 400)
      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
      }
    } else {
      setAnimateIn(false)
      setShowConfetti(false)
    }
  }, [open, badge])

  if (!badge) return null

  const badgeData = badge.badge ?? (badge as any)
  const slug: string = badgeData?.slug ?? ''
  const tier: string = badgeData?.tier ?? 'bronze'
  const config = getVisualConfig(slug, tier)
  const badgeName = slug
    ? t(`badges.${slug}.name`, { defaultValue: badgeData?.name })
    : badgeData?.name
  const badgeDescription = slug
    ? t(`badges.${slug}.description`, { defaultValue: badgeData?.description })
    : badgeData?.description

  const getAcademySlug = () => {
    const match = window.location.pathname.match(/\/academy\/([^/]+)/)
    return match ? match[1] : null
  }

  const handleViewAllBadges = () => {
    const academySlug = getAcademySlug()
    if (academySlug) {
      onClose()
      navigate({
        to: '/academy/$academySlug/my-badges',
        params: { academySlug },
      })
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent
          showCloseButton={false}
          className='bg-card/95 border-border/50 max-w-md overflow-hidden p-0 backdrop-blur-xl'
        >
          <DialogTitle className='sr-only'>{badgeName}</DialogTitle>

          {/* Confetti */}
          <Confetti show={showConfetti} />

          {/* Close button */}
          <button
            onClick={onClose}
            className='bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground absolute top-4 right-4 z-20 flex size-8 items-center justify-center rounded-full transition-colors'
          >
            <X className='size-4' />
          </button>

          {/* Glow background */}
          <div
            className='absolute top-0 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-[100px]'
            style={{ backgroundColor: config.glowColor }}
          />

          {/* Content */}
          <div className='relative z-10 flex flex-col items-center px-8 pt-12 pb-8 text-center'>
            {/* Badge icon */}
            <div
              className={cn(
                'relative transition-all duration-700 ease-out',
                animateIn ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
              )}
            >
              {/* Animated rings */}
              <div
                className={cn(
                  'absolute inset-[-24px] animate-ping rounded-full border-2 opacity-20',
                  config.ringColor
                )}
                style={{ animationDuration: '2s' }}
              />
              <div
                className={cn(
                  'absolute inset-[-12px] animate-pulse rounded-full border opacity-30',
                  config.ringColor
                )}
              />

              {/* Badge container */}
              {badgeData?.icon_url ? (
                <div
                  className={cn(
                    'relative size-32 rounded-full bg-gradient-to-br p-1',
                    config.gradient
                  )}
                >
                  <div className='bg-card flex size-full items-center justify-center rounded-full'>
                    <img
                      src={badgeData.icon_url}
                      alt={badgeName}
                      className='size-20 object-contain'
                    />
                  </div>
                </div>
              ) : (
                <div
                  className={cn(
                    'relative size-32 rounded-full bg-gradient-to-br p-1',
                    config.gradient
                  )}
                >
                  <div className='bg-card flex size-full items-center justify-center rounded-full'>
                    <BadgeIcon slug={slug} className='text-primary size-20' />
                  </div>
                </div>
              )}

              {/* Sparkles */}
              <Sparkles
                className={cn(
                  'text-primary absolute -top-2 -right-2 size-6 transition-all delay-500 duration-500',
                  animateIn ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                )}
              />
              <Sparkles
                className={cn(
                  'text-primary/60 absolute -bottom-1 -left-3 size-4 transition-all delay-700 duration-500',
                  animateIn ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                )}
              />
            </div>

            {/* Celebration text */}
            <div
              className={cn(
                'mt-8 flex flex-col items-center gap-2 transition-all delay-200 duration-700',
                animateIn
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-4 opacity-0'
              )}
            >
              <span className='text-primary text-xs font-semibold tracking-widest uppercase'>
                {t('gamification.badgeModal.newAchievement')}
              </span>
              <h2 className='text-foreground text-2xl font-bold sm:text-3xl'>
                {badgeName}
              </h2>
            </div>

            {/* Description */}
            <p
              className={cn(
                'text-muted-foreground mt-4 max-w-xs text-sm leading-relaxed transition-all delay-300 duration-700',
                animateIn
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-4 opacity-0'
              )}
            >
              {badgeDescription}
            </p>

            {/* Points reward */}
            {badgeData?.points_reward > 0 && (
              <div
                className={cn(
                  'bg-primary/10 border-primary/20 mt-6 rounded-full border px-4 py-2 transition-all delay-400 duration-700',
                  animateIn
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-4 opacity-0'
                )}
              >
                <span className='text-primary text-sm font-medium'>
                  {t('gamification.badgeModal.points', {
                    count: badgeData.points_reward,
                  })}
                </span>
              </div>
            )}

            {/* Trigger context */}
            {badge.triggered_by && (
              <div
                className={cn(
                  'text-muted-foreground mt-3 text-xs transition-all delay-400 duration-700',
                  animateIn
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-4 opacity-0'
                )}
              >
                {t('gamification.badgeModal.earnedBy')}{' '}
                <span className='text-foreground font-medium'>
                  {badge.triggered_by.name}
                </span>
              </div>
            )}

            {/* Actions */}
            <div
              className={cn(
                'mt-8 flex w-full flex-col items-center gap-3 transition-all delay-500 duration-700 sm:flex-row',
                animateIn
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-4 opacity-0'
              )}
            >
              <Button
                onClick={handleViewAllBadges}
                className='bg-primary text-primary-foreground hover:bg-primary/90 h-11 w-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] sm:flex-1'
              >
                {t('gamification.badgeModal.viewBadges')}
              </Button>

            </div>
          </div>
        </DialogContent>
      </Dialog>

      <style>{`
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(400px) rotate(720deg); opacity: 0; }
        }
        .animate-confetti {
          animation: confetti 2.5s ease-out forwards;
        }
      `}</style>
    </>
  )
}
