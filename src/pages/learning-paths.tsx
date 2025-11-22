import { useState } from 'react'
import { Plus, Edit, Trash2, Book, Clock, Users } from 'lucide-react'

import { type LearningPath } from '@/services'
import { useLearningPaths, useDeleteLearningPath } from '@/hooks/use-learning-paths'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { LearningPathForm } from '@/components/learning-paths'

export default function LearningPathsPage() {
  const { currentAcademy } = useAuthStore()
  
  // State management
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingLearningPath, setEditingLearningPath] = useState<LearningPath | null>(null)
  const [learningPathToDelete, setLearningPathToDelete] = useState<LearningPath | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all')

  // Use hooks
  const academySlug = currentAcademy?.slug || ''
  const { data: learningPathsData, isLoading, error } = useLearningPaths(academySlug)
  const deleteMutation = useDeleteLearningPath(academySlug)

  // Handle success callbacks
  const handleFormSuccess = () => {
    setIsCreateModalOpen(false)
    setEditingLearningPath(null)
  }

  // Handle delete
  const handleDeleteConfirm = () => {
    if (learningPathToDelete) {
      deleteMutation.mutate(learningPathToDelete.slug)
      setLearningPathToDelete(null)
    }
  }

  // Get data
  // Handle both array response and object with data property
  const learningPaths = Array.isArray(learningPathsData) 
    ? learningPathsData 
    : (learningPathsData?.data || [])
  
  console.log('Learning paths data:', learningPathsData)
  console.log('Processed learning paths:', learningPaths)
  
  // Filter learning paths
  const filteredLearningPaths = learningPaths.filter(path => {
    const matchesSearch = path.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         path.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || path.status === statusFilter
    const matchesDifficulty = difficultyFilter === 'all' || path.difficulty_level === difficultyFilter

    return matchesSearch && matchesStatus && matchesDifficulty
  })

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Beginner</Badge>
      case 'intermediate':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Intermediate</Badge>
      case 'advanced':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Advanced</Badge>
      default:
        return <Badge variant="outline">{difficulty}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800">Published</Badge>
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>
      case 'archived':
        return <Badge variant="outline">Archived</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // No academy selected
  if (!currentAcademy) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-12">
          <Book className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Academy Selected</h3>
          <p className="text-gray-500">Please select an academy to manage learning paths</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-12">
          <h3 className="text-lg font-bold text-red-600 mb-2">Error Loading Learning Paths</h3>
          <p className="text-gray-600">Please try refreshing the page</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Learning Paths</h1>
          <p className="text-gray-600 mt-2">Create and manage structured learning journeys for your students</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Learning Path
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search learning paths..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredLearningPaths.length === 0 && learningPaths.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
          <Book className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No learning paths yet</h3>
          <p className="text-gray-500 mb-6">Create your first learning path to get started</p>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Learning Path
          </Button>
        </div>
      )}

      {/* No Results State */}
      {!isLoading && filteredLearningPaths.length === 0 && learningPaths.length > 0 && (
        <div className="text-center py-12">
          <Book className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No learning paths found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Learning Paths Grid */}
      {!isLoading && filteredLearningPaths.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredLearningPaths.map((learningPath) => (
            <Card key={learningPath.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{learningPath.title}</CardTitle>
                    <div className="flex gap-2 mb-2">
                      {getStatusBadge(learningPath.status)}
                      {getDifficultyBadge(learningPath.difficulty_level)}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingLearningPath(learningPath)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setLearningPathToDelete(learningPath)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription className="line-clamp-2">
                  {learningPath.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Book className="w-4 h-4" />
                    <span>{learningPath.courses_count} courses</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{learningPath.estimated_duration_hours}h</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>0 students</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Learning Path</DialogTitle>
            <DialogDescription>
              Create a new learning path to guide students through a structured curriculum
            </DialogDescription>
          </DialogHeader>
          {academySlug && (
            <LearningPathForm
              academySlug={academySlug}
              onSuccess={handleFormSuccess}
              onCancel={() => setIsCreateModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={!!editingLearningPath} onOpenChange={() => setEditingLearningPath(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Learning Path</DialogTitle>
            <DialogDescription>
              Update the learning path information
            </DialogDescription>
          </DialogHeader>
          {editingLearningPath && academySlug && (
            <LearningPathForm
              academySlug={academySlug}
              learningPath={editingLearningPath}
              onSuccess={handleFormSuccess}
              onCancel={() => setEditingLearningPath(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!learningPathToDelete} onOpenChange={() => setLearningPathToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Learning Path</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{learningPathToDelete?.title}"? This action cannot be undone.
              {learningPathToDelete?.courses_count && learningPathToDelete.courses_count > 0 && (
                <span className="block mt-2 font-medium text-amber-600">
                  Warning: This learning path has {learningPathToDelete.courses_count} course(s) assigned to it.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}