import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { toast } from 'sonner'

import { learningPathService, type LearningPath, type CreateLearningPathData, type UpdateLearningPathData } from '@/services/learning-path-service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { DialogFooter } from '@/components/ui/dialog'

const learningPathSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description must be less than 1000 characters'),
  estimated_duration_hours: z.number().min(1, 'Duration must be at least 1 hour').max(500, 'Duration must be less than 500 hours'),
  difficulty_level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  status: z.enum(['draft', 'published']).optional(),
})

type LearningPathFormData = z.infer<typeof learningPathSchema>

interface LearningPathFormProps {
  academyId: number
  learningPath?: LearningPath
  onSuccess: () => void
  onCancel: () => void
}

export function LearningPathForm({ academyId, learningPath, onSuccess, onCancel }: LearningPathFormProps) {
  const isEditing = !!learningPath
  
  const form = useForm<LearningPathFormData>({
    resolver: zodResolver(learningPathSchema),
    defaultValues: {
      title: learningPath?.title || '',
      description: learningPath?.description || '',
      estimated_duration_hours: learningPath?.estimated_duration_hours || 1,
      difficulty_level: learningPath?.difficulty_level as 'beginner' | 'intermediate' | 'advanced' || 'beginner',
      status: learningPath?.status === 'published' ? 'published' : 'draft',
    },
  })

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateLearningPathData) => learningPathService.createLearningPath(academyId, data),
    onSuccess: () => {
      toast.success('Learning Path created successfully')
      onSuccess()
    },
    onError: (error) => {
      toast.error(`Failed to create learning path: ${error.message}`)
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: UpdateLearningPathData) => 
      learningPathService.updateLearningPath(academyId, learningPath!.id, data),
    onSuccess: () => {
      toast.success('Learning Path updated successfully')
      onSuccess()
    },
    onError: (error) => {
      toast.error(`Failed to update learning path: ${error.message}`)
    },
  })

  const onSubmit = (data: LearningPathFormData) => {
    if (isEditing) {
      updateMutation.mutate(data)
    } else {
      createMutation.mutate(data)
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g., Frontend Development Mastery" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Give your learning path a clear, descriptive title
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe what students will learn in this path..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Explain the learning objectives and what students will achieve
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Duration and Difficulty Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Estimated Duration */}
          <FormField
            control={form.control}
            name="estimated_duration_hours"
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel>Estimated Duration (hours)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1"
                    max="500"
                    placeholder="40"
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Total hours to complete all courses
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Difficulty Level */}
          <FormField
            control={form.control}
            name="difficulty_level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Overall difficulty level of the learning path
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Status */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                {field.value === 'published' 
                  ? 'Learning path is visible to students' 
                  : 'Learning path is hidden from students'
                }
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Form Actions */}
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
          >
            {isLoading 
              ? (isEditing ? 'Updating...' : 'Creating...') 
              : (isEditing ? 'Update Learning Path' : 'Create Learning Path')
            }
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}