import { useState } from 'react'
import { Plus, Key, Filter } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'

import { useAccessCodes } from '@/hooks/use-access-codes'
import { AccessCodeCard } from './access-code-card'
import { CreateAccessCodeDialog } from './create-access-code-dialog'
import { type AccessCodeFilters } from '@/services/access-code-service'

interface AccessCodeListProps {
  courseId: number
}

export function AccessCodeList({ courseId }: AccessCodeListProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [filters, setFilters] = useState<AccessCodeFilters>({})

  const { data: accessCodesData, isLoading, error } = useAccessCodes(courseId, filters)

  const handleFilterChange = (status: string) => {
    setFilters({
      ...filters,
      status: status === 'all' ? undefined : status as any
    })
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Access Codes</CardTitle>
              <CardDescription>
                Generate access codes to allow free enrollment in this course
              </CardDescription>
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-red-600">Failed to load access codes</p>
        </CardContent>
      </Card>
    )
  }

  // Handle different response structures
  console.log('AccessCodesData received:', accessCodesData)
  const accessCodes = Array.isArray(accessCodesData) 
    ? accessCodesData 
    : accessCodesData?.data || []
  console.log('Processed accessCodes:', accessCodes)

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Access Codes</CardTitle>
              <CardDescription>
                Generate access codes to allow free enrollment in this course
              </CardDescription>
            </div>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Access Code
            </Button>
          </div>
          
          {/* Filters */}
          {accessCodes.length > 0 && (
            <div className="flex items-center gap-2 pt-4">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select
                value={filters.status || 'all'}
                onValueChange={handleFilterChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="exhausted">Exhausted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          {accessCodes.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Key className="mx-auto h-12 w-12 mb-4" />
              <h3 className="text-lg font-medium mb-2">No access codes yet</h3>
              <p className="mb-4">Create access codes to give students free access to this course</p>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Access Code
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {accessCodes.map((accessCode: any) => (
                <AccessCodeCard
                  key={accessCode.id}
                  accessCode={accessCode}
                  courseId={courseId}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create dialog */}
      <CreateAccessCodeDialog
        courseId={courseId}
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </>
  )
}