import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Award, TrendingUp, Users, Trophy, Search, Filter } from 'lucide-react'
import superAdminGamificationService, { type GamificationOverview } from '@/services/super-admin-gamification-service'
import academyService from '@/services/academy-service'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function SuperAdminGamification() {
  const navigate = useNavigate()
  const [overview, setOverview] = useState<GamificationOverview | null>(null)
  const [academies, setAcademies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'enabled' | 'disabled'>('all')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [overviewData, academiesData] = await Promise.all([
        superAdminGamificationService.getOverview(),
        academyService.getFeaturedAcademies(),
      ])
      // Flatten academies from categories
      const allAcademies = academiesData.flatMap(cat => cat.academies)
      setOverview(overviewData)
      setAcademies(allAcademies)
    } catch (error) {
      console.error('Error fetching gamification data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleGamification = async (academySlug: string, currentStatus: boolean) => {
    try {
      await superAdminGamificationService.toggleGamification(academySlug, !currentStatus)
      // Refresh data
      fetchData()
    } catch (error) {
      console.error('Error toggling gamification:', error)
    }
  }

  const filteredAcademies = academies.filter((academy) => {
    const matchesSearch = academy.name.toLowerCase().includes(searchTerm.toLowerCase())
    const gamificationEnabled = academy.academy_configuration?.enable_gamification || false
    
    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'enabled' && gamificationEnabled) ||
      (filterStatus === 'disabled' && !gamificationEnabled)

    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gamification Management</h1>
          <p className="text-muted-foreground">
            Manage gamification settings and badges across all academies
          </p>
        </div>
      </div>

      {/* Overview Stats */}
      {overview && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Badges</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview.total_badges}</div>
              <p className="text-xs text-muted-foreground">Across all academies</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Badges Earned</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview.total_user_badges}</div>
              <p className="text-xs text-muted-foreground">By all users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Academies</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview.academies_with_gamification}</div>
              <p className="text-xs text-muted-foreground">With gamification enabled</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Points</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {overview.total_points_awarded.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Points awarded</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Academies Management */}
      <Card>
        <CardHeader>
          <CardTitle>Academy Gamification Settings</CardTitle>
          <CardDescription>
            Enable or disable gamification for each academy
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-4 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search academies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Academies</SelectItem>
                <SelectItem value="enabled">Gamification Enabled</SelectItem>
                <SelectItem value="disabled">Gamification Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Academies Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Academy</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Badges</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAcademies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No academies found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAcademies.map((academy) => {
                    const gamificationEnabled =
                      academy.academy_configuration?.enable_gamification || false
                    return (
                      <TableRow key={academy.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{academy.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {academy.slug}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={gamificationEnabled}
                              onCheckedChange={() =>
                                handleToggleGamification(academy.slug, gamificationEnabled)
                              }
                            />
                            <Badge variant={gamificationEnabled ? 'default' : 'secondary'}>
                              {gamificationEnabled ? 'Enabled' : 'Disabled'}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{academy.badges_count || 0} badges</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              navigate({
                                to: `/super-admin/gamification/academies/${academy.slug}`,
                              })
                            }
                          >
                            <Award className="mr-2 h-4 w-4" />
                            Manage Badges
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Top Academies */}
      {overview && overview.top_academies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Academies by Badges</CardTitle>
            <CardDescription>Academies with most badges created</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {overview.top_academies.map((academy, index) => (
                <div key={academy.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{academy.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {academy.badge_count} badges
                      </div>
                    </div>
                  </div>
                  <Trophy className="h-5 w-5 text-yellow-500" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
