import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import type { UserBadge } from '@/services/gamification-service'
import { Award, Sparkles, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface BadgeModalProps {
  badge: UserBadge | null
  open: boolean
  onClose: () => void
}

const tierColors = {
  bronze: 'from-orange-600 to-amber-700',
  silver: 'from-gray-400 to-gray-600',
  gold: 'from-yellow-400 to-yellow-600',
  platinum: 'from-cyan-300 to-cyan-500',
  diamond: 'from-blue-400 to-purple-600',
}

const tierIcons = {
  bronze: Award,
  silver: Award,
  gold: Trophy,
  platinum: Trophy,
  diamond: Trophy,
}

export function BadgeModal({ badge, open, onClose }: BadgeModalProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (open && badge) {
      setIsAnimating(true)
      // Play celebration animation
      const timer = setTimeout(() => setIsAnimating(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [open, badge])

  if (!badge) return null

  const TierIcon = tierIcons[badge.badge.tier] || Award
  const tierGradient = tierColors[badge.badge.tier] || tierColors.bronze

  // Extract academy slug from current URL (format: /academies/:slug/...)
  const getAcademySlug = () => {
    const path = window.location.pathname
    const match = path.match(/\/academies\/([^/]+)/)
    return match ? match[1] : null
  }

  const handleViewAllBadges = () => {
    const academySlug = getAcademySlug()
    if (academySlug) {
      navigate({ to: `/academies/${academySlug}/badges` })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader className='space-y-3'>
          <div className='flex items-center justify-between'>
            <DialogTitle className='text-2xl font-bold'>
              ¡Felicidades! 🎉
            </DialogTitle>
          </div>
          <DialogDescription className='text-base'>
            Has ganado una nueva insignia
          </DialogDescription>
        </DialogHeader>

        <div className='flex flex-col items-center justify-center space-y-6 py-6'>
          {/* Badge Icon with Animation */}
          <div className='relative'>
            {isAnimating && (
              <div className='absolute inset-0 flex items-center justify-center'>
                <Sparkles className='h-24 w-24 animate-pulse text-yellow-400' />
              </div>
            )}
            <div
              className={cn(
                'relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br shadow-xl transition-transform',
                tierGradient,
                isAnimating && 'scale-110 animate-bounce'
              )}
            >
              {badge.badge.icon_url ? (
                <img
                  src={badge.badge.icon_url}
                  alt={badge.badge.name}
                  className='h-20 w-20 object-contain'
                />
              ) : (
                <TierIcon className='h-20 w-20 text-white' />
              )}
            </div>
          </div>

          {/* Badge Details */}
          <div className='space-y-3 text-center'>
            <div className='space-y-1'>
              <h3 className='text-2xl font-bold'>{badge.badge.name}</h3>
              <div className='flex items-center justify-center gap-2'>
                <Badge variant='secondary' className='capitalize'>
                  {badge.badge.tier}
                </Badge>
                <Badge variant='outline' className='capitalize'>
                  {badge.badge.category}
                </Badge>
              </div>
            </div>

            {badge.badge.description && (
              <p className='text-muted-foreground max-w-sm text-sm'>
                {badge.badge.description}
              </p>
            )}

            {badge.badge.points_reward > 0 && (
              <div className='flex items-center justify-center gap-2 text-lg font-semibold'>
                <Trophy className='h-5 w-5 text-yellow-500' />
                <span>+{badge.badge.points_reward} puntos</span>
              </div>
            )}
          </div>

          {/* Trigger Context (if available) */}
          {badge.triggered_by && (
            <div className='bg-muted w-full rounded-lg p-3 text-sm'>
              <p className='text-muted-foreground text-center'>
                Ganada por:{' '}
                <span className='font-medium'>{badge.triggered_by.name}</span>
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className='flex gap-2'>
          <Button variant='outline' className='flex-1' onClick={onClose}>
            Cerrar
          </Button>
          <Button className='flex-1' onClick={handleViewAllBadges}>
            Ver todas mis insignias
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
