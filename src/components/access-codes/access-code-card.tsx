import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  Copy,
  Eye,
  EyeOff,
  MoreHorizontal,
  Calendar,
  Users,
  Percent,
  CheckCircle,
  XCircle,
  Clock,
  Ban
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'

import { useDeleteAccessCode, useToggleAccessCodeStatus } from '@/hooks/use-access-codes'
import { type AccessCode } from '@/services/access-code-service'

interface AccessCodeCardProps {
  accessCode: AccessCode
  courseId: number
}

export function AccessCodeCard({ accessCode, courseId }: AccessCodeCardProps) {
  const [showCode, setShowCode] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const deleteAccessCode = useDeleteAccessCode(courseId)
  const toggleStatus = useToggleAccessCodeStatus(courseId)

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(accessCode.code)
      toast.success('Code copied to clipboard')
    } catch (error) {
      toast.error('Failed to copy code')
    }
  }

  const handleToggleStatus = () => {
    toggleStatus.mutate(accessCode.id)
  }

  const handleDelete = () => {
    deleteAccessCode.mutate(accessCode.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false)
      }
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>
      case 'inactive':
        return <Badge variant="secondary"><Ban className="w-3 h-3 mr-1" />Inactive</Badge>
      case 'expired':
        return <Badge variant="destructive"><Clock className="w-3 h-3 mr-1" />Expired</Badge>
      case 'exhausted':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Exhausted</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getExpiryText = () => {
    if (accessCode.expired) {
      return 'Expired'
    }
    
    if (accessCode.days_until_expiry <= 0) {
      return 'Expires today'
    }
    
    if (accessCode.days_until_expiry === 1) {
      return 'Expires tomorrow'
    }
    
    return `Expires in ${accessCode.days_until_expiry} days`
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="flex items-center gap-2">
                  {showCode ? (
                    <code className="bg-gray-100 px-2 py-1 rounded font-mono text-sm">
                      {accessCode.code}
                    </code>
                  ) : (
                    <code className="bg-gray-100 px-2 py-1 rounded font-mono text-sm">
                      {'•'.repeat(8)}
                    </code>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCode(!showCode)}
                  >
                    {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyCode}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                {accessCode.description || 'No description provided'}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(accessCode.status)}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={copyCode}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy code
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleToggleStatus}
                    disabled={toggleStatus.isPending}
                  >
                    {accessCode.status === 'active' ? (
                      <>
                        <Ban className="mr-2 h-4 w-4" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Activate
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Usage Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Usage</span>
              <span>{accessCode.usage_count} / {accessCode.usage_limit}</span>
            </div>
            <Progress value={accessCode.usage_percentage} className="h-2" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <div>
                <p className="font-medium">{accessCode.remaining_uses}</p>
                <p className="text-muted-foreground">Remaining uses</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-600" />
              <div>
                <p className="font-medium">{getExpiryText()}</p>
                <p className="text-muted-foreground">Expiry status</p>
              </div>
            </div>
          </div>

          {/* Enrollments */}
          <div className="pt-2 border-t">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Total enrollments: {accessCode.statistics.total_enrollments}</span>
              <span>Active: {accessCode.statistics.active_enrollments}</span>
            </div>
          </div>

          {/* Created info */}
          <div className="text-xs text-muted-foreground pt-2 border-t">
            Created by {accessCode.created_by.full_name} • {' '}
            {formatDistanceToNow(new Date(accessCode.created_at), { 
              addSuffix: true, 
              locale: es 
            })}
          </div>
        </CardContent>
      </Card>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the access code "{accessCode.code}".
              Students who already used this code will keep their enrollment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteAccessCode.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteAccessCode.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}