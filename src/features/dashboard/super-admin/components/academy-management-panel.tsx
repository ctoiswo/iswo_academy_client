import { useState } from 'react'
import { DashboardCard } from '@/components/dashboard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { 
  Building2, 
  Users, 
  BookOpen, 
  DollarSign, 
  MoreHorizontal,
  Search,
  Plus,
  Eye,
  Settings,
  Ban
} from 'lucide-react'
import type { AcademyOverview } from '../index'

interface AcademyManagementPanelProps {
  academies: AcademyOverview[]
  loading?: boolean
  error?: string | null
}

export function AcademyManagementPanel({ 
  academies, 
  loading = false, 
  error 
}: AcademyManagementPanelProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all')

  // Filter academies based on search and status
  const filteredAcademies = academies.filter(academy => {
    const matchesSearch = academy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         academy.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || academy.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default'
      case 'inactive':
        return 'secondary'
      case 'suspended':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (error) {
    return (
      <DashboardCard title="Academy Management">
        <div className="text-center py-8">
          <p className="text-destructive">Error loading academies: {error}</p>
        </div>
      </DashboardCard>
    )
  }

  return (
    <DashboardCard 
      title="Academy Management"
      description="Manage all academies on the platform"
      action={
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Academy
        </Button>
      }
    >
      {/* Search and Filter Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search academies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Status: {statusFilter === 'all' ? 'All' : statusFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                All Statuses
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('active')}>
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('inactive')}>
                Inactive
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('suspended')}>
                Suspended
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="text-sm text-muted-foreground">
          {filteredAcademies.length} of {academies.length} academies
        </div>
      </div>

      {/* Academy Table */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      ) : filteredAcademies.length === 0 ? (
        <div className="text-center py-8">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            {searchTerm || statusFilter !== 'all' 
              ? 'No academies match your filters' 
              : 'No academies found'
            }
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Academy</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Users</TableHead>
                <TableHead className="text-right">Courses</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Created</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAcademies.map((academy) => (
                <TableRow key={academy.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {academy.logo_url ? (
                          <img 
                            src={academy.logo_url} 
                            alt={academy.name}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{academy.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {academy.description}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(academy.status)}>
                      {academy.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{academy.total_users.toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span>{academy.total_courses}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>{formatCurrency(academy.total_revenue)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {formatDate(academy.created_at)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Settings className="h-4 w-4 mr-2" />
                          Manage Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Ban className="h-4 w-4 mr-2" />
                          Suspend Academy
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </DashboardCard>
  )
}