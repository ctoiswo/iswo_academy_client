import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth-store'
import { 
  Building, 
  Users, 
  GraduationCap,
  ArrowRight,
  Plus
} from 'lucide-react'

// TypeScript interfaces for academy data
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

export interface AcademyData {
  count: number
  academies: AcademyMembership[]
}

interface AcademyCardProps {
  academy: AcademyMembership
  onSelect: (academy: AcademyMembership) => void
  isSelecting: boolean
}

function AcademyCard({ academy, onSelect }: AcademyCardProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <Card 
      className="academy-card cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-2 hover:border-primary/20"
      onClick={() => onSelect(academy)}
    >
      <CardHeader>
        <div className="flex items-center space-x-4">
          {academy.logo_url ? (
            <img 
              src={academy.logo_url} 
              alt={`${academy.name} logo`}
              className="w-12 h-12 rounded-full object-cover border-2 border-muted"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
              <Building className="w-6 h-6 text-primary" data-testid="building-icon" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">{academy.name}</CardTitle>
            <Badge variant="secondary" className="mt-1">
              {academy.user_role_display}
            </Badge>
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-muted-foreground text-sm leading-relaxed mb-3">
          {academy.description || 'No description available'}
        </p>
        {academy.last_accessed && (
          <p className="text-xs text-muted-foreground flex items-center">
            <Users className="w-3 h-3 mr-1" />
            Last accessed: {formatDate(academy.last_accessed)}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
        <GraduationCap className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No Academies Found</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        You don't belong to any academies yet. Create your own academy or ask an administrator to invite you to an existing one.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Academy
        </Button>
        <Button variant="outline">
          Request Invitation
        </Button>
      </div>
    </div>
  )
}

export function AcademySelectionPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [isSelecting, setIsSelecting] = useState(false)
  
  // Mock academy data for now - this will be replaced with actual data from auth store
  const [academyData] = useState<AcademyData>({
    count: 2,
    academies: [
      {
        id: 1,
        name: "Technology Academy",
        description: "Learn cutting-edge technology skills and advance your career in software development",
        logo_url: null,
        user_role: "admin",
        user_role_display: "Administrator",
        created_at: "2024-01-01T00:00:00Z",
        last_accessed: "2024-02-01T10:30:00Z"
      },
      {
        id: 2,
        name: "Cooking Academy", 
        description: "Master culinary arts and techniques from professional chefs around the world",
        logo_url: null,
        user_role: "student",
        user_role_display: "Student",
        created_at: "2024-01-15T00:00:00Z",
        last_accessed: null
      }
    ]
  })

  const handleAcademySelect = async (academy: AcademyMembership) => {
    try {
      setIsSelecting(true)
      
      // TODO: Implement academy selection logic in auth store
      // await selectAcademy(academy.id)
      
      // Navigate to academy dashboard
      navigate({ to: `/academy/${academy.id}/dashboard` })
    } catch (error) {
      console.error('Failed to select academy:', error)
      // TODO: Add proper error handling with toast notifications
    } finally {
      setIsSelecting(false)
    }
  }

  // Show loading state if user data is not available
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" role="status" aria-label="Loading"></div>
          <p className="text-muted-foreground">Loading your academies...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <GraduationCap className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Select Your Academy</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Welcome back, {user.first_name}! Choose which academy you'd like to access today.
          </p>
        </header>

        {/* Academy Grid or Empty State */}
        {academyData.count === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                You have access to {academyData.count} {academyData.count === 1 ? 'academy' : 'academies'}
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {academyData.academies.map((academy) => (
                <AcademyCard
                  key={academy.id}
                  academy={academy}
                  onSelect={handleAcademySelect}
                  isSelecting={isSelecting}
                />
              ))}
            </div>
          </>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            Need help? Contact your academy administrator or{' '}
            <Button variant="link" className="p-0 h-auto text-sm">
              visit our help center
            </Button>
          </p>
        </footer>
      </div>
    </div>
  )
}