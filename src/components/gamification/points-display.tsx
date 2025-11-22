import { useEffect, useState } from 'react'
import gamificationService, {
  type GamificationProfile,
} from '@/services/gamification-service'
import { Flame, TrendingUp } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface PointsDisplayProps {
  className?: string
  compact?: boolean
}

export function PointsDisplay({
  className,
  compact = false,
}: PointsDisplayProps) {
  const { user, isAuthenticated } = useAuthStore()
  const [profile, setProfile] = useState<GamificationProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const data = await gamificationService.getGamificationProfile()
        setProfile(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching gamification profile:', err)
        // Silently fail - gamification might not be enabled
        setError(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user, isAuthenticated])

  // Don't show anything if not authenticated or if there's an error
  if (!isAuthenticated || loading || error || !profile) {
    return null
  }

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              size='sm'
              className={cn('gap-2', className)}
              onClick={() => (window.location.href = '/dashboard/gamification')}
            >
              <Flame className='h-4 w-4 text-orange-500' />
              <span className='font-semibold'>{profile.points.total}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className='space-y-1'>
              <p className='font-semibold'>Nivel {profile.level.current}</p>
              <p className='text-muted-foreground text-xs'>
                {profile.points.total} puntos totales
              </p>
              <p className='text-muted-foreground text-xs'>
                {profile.counts.badges} insignias
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <div className={cn('flex items-center gap-4', className)}>
      {/* Points */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='sm'
              className='gap-2'
              onClick={() => (window.location.href = '/dashboard/gamification')}
            >
              <Flame className='h-4 w-4 text-orange-500' />
              <div className='flex flex-col items-start'>
                <span className='text-muted-foreground text-xs'>Puntos</span>
                <span className='font-semibold'>{profile.points.total}</span>
              </div>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className='space-y-1'>
              <p className='text-xs'>Disponibles: {profile.points.available}</p>
              <p className='text-xs'>Gastados: {profile.points.spent}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Level */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='sm'
              className='gap-2'
              onClick={() => (window.location.href = '/dashboard/gamification')}
            >
              <TrendingUp className='h-4 w-4 text-blue-500' />
              <div className='flex flex-col items-start'>
                <span className='text-muted-foreground text-xs'>Nivel</span>
                <span className='font-semibold'>{profile.level.current}</span>
              </div>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className='space-y-1'>
              <p className='text-xs'>
                Progreso: {profile.level.progress_percentage}%
              </p>
              <p className='text-xs'>
                XP: {profile.level.experience_points} /{' '}
                {profile.level.xp_for_next_level}
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
