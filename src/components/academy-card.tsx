import * as React from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Academy membership interface based on the design document
export interface AcademyMembership {
  id: number
  name: string
  description: string
  logo_url: string | null
  user_role: string
  user_role_display: string
  created_at: string
  last_accessed: string | null
}

interface AcademyCardProps {
  academy: AcademyMembership
  onSelect: (academy: AcademyMembership) => void
  className?: string
}

// Default academy icon component for when no logo is available
function DefaultAcademyIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-6 w-6', className)}
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
      />
    </svg>
  )
}

// Utility function to format date for last accessed display
function formatLastAccessed(dateString: string | null): string {
  if (!dateString) return 'Never accessed'

  const date = new Date(dateString)
  const now = new Date()
  const diffInDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  )

  if (diffInDays === 0) return 'Today'
  if (diffInDays === 1) return 'Yesterday'
  if (diffInDays < 7) return `${diffInDays} days ago`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`

  return date.toLocaleDateString()
}

export function AcademyCard({
  academy,
  onSelect,
  className,
}: AcademyCardProps) {
  const handleClick = () => {
    onSelect(academy)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect(academy)
    }
  }

  return (
    <Card
      className={cn(
        'academy-card cursor-pointer transition-all duration-200 ease-in-out',
        'hover:shadow-primary/10 hover:-translate-y-1 hover:shadow-lg',
        'focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        'active:scale-[0.98]',
        className
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role='button'
      aria-label={`Select ${academy.name} academy where you are ${academy.user_role_display}`}
    >
      <CardHeader>
        <div className='flex items-center space-x-4'>
          {/* Academy Logo */}
          <div className='flex-shrink-0'>
            {academy.logo_url ? (
              <img
                src={academy.logo_url}
                alt={`${academy.name} logo`}
                className='border-border h-12 w-12 rounded-full border-2 object-cover'
                onError={(e) => {
                  // Fallback to default icon if image fails to load
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const fallback = target.nextElementSibling as HTMLElement
                  if (fallback) fallback.style.display = 'flex'
                }}
              />
            ) : null}
            <div
              className={cn(
                'bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full',
                academy.logo_url && 'hidden'
              )}
            >
              <DefaultAcademyIcon />
            </div>
          </div>

          {/* Academy Name and Role */}
          <div className='min-w-0 flex-1'>
            <CardTitle className='truncate text-lg font-semibold'>
              {academy.name}
            </CardTitle>
            <div className='mt-1'>
              <Badge
                variant='secondary'
                className='text-xs font-medium'
                data-testid='role-badge'
              >
                {academy.user_role_display}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Academy Description */}
        <p className='text-muted-foreground mb-3 line-clamp-2 text-sm leading-relaxed'>
          {academy.description || 'No description available'}
        </p>

        {/* Last Accessed Information */}
        <div className='text-muted-foreground flex items-center justify-between text-xs'>
          <span>Last accessed:</span>
          <span className='font-medium'>
            {formatLastAccessed(academy.last_accessed)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
