import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { toast } from 'sonner'

import { courseService, type Course, type CreateCourseData, type UpdateCourseData } from '@/services/course-service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { DialogFooter } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'

const courseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description must be less than 1000 characters'),
  duration_minutes: z.number().min(1, 'Duration must be at least 1 minute').max(10000, 'Duration must be less than 10000 minutes'),
  difficulty_level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  status: z.enum(['draft', 'published']).optional(),
  is_free: z.boolean().optional(),
  price: z.string().optional(),
})

type CourseFormData = z.infer<typeof courseSchema>

interface CourseFormProps {
  academyId: number
  course?: Course
  onSuccess: () => void
  onCancel: () => void
}

export function CourseForm({ academyId, course, onSuccess, onCancel }: CourseFormProps) {
  const isEditing = !!course
  
  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: course?.title || '',
      description: course?.description || '',
      duration_minutes: course?.duration_minutes || 60,
      difficulty_level: course?.difficulty_level as 'beginner' | 'intermediate' | 'advanced' || 'beginner',
      status: course?.status === 'published' ? 'published' : 'draft',
      is_free: course?.is_free ?? true,
      price: course?.price || '0',
    },
  })

  const isFree = form.watch('is_free')

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateCourseData) => courseService.createCourse(academyId, data),
    onSuccess: () => {
      toast.success('Course created successfully')
      onSuccess()
    },
    onError: (error) => {
      toast.error(`Failed to create course: ${error.message}`)
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: UpdateCourseData) => {
      if (!course?.id) throw new Error('Course ID is required for update')
      return courseService.updateCourse(academyId, course.id, data)
    },
    onSuccess: () => {
      toast.success('Course updated successfully')
      onSuccess()
    },
    onError: (error) => {
      toast.error(`Failed to update course: ${error.message}`)
    },
  })

  const onSubmit = (data: CourseFormData) => {
    const courseData = {
      ...data,
      // If course is free, set price to "0"
      price: data.is_free ? '0' : data.price,
    }

    if (isEditing) {
      updateMutation.mutate(courseData)
    } else {
      createMutation.mutate(courseData)
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Title Field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter course title" {...field} />
              </FormControl>
              <FormDescription>
                A clear, descriptive title for your course
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe what students will learn in this course"
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Explain the course content, objectives, and what students will achieve
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Duration Field */}
        <FormField
          control={form.control}
          name="duration_minutes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (minutes)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="1" 
                  max="10000"
                  placeholder="60"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Estimated time to complete the course in minutes
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Difficulty Level Field */}
        <FormField
          control={form.control}
          name="difficulty_level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Difficulty Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the appropriate difficulty level for your target audience
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Is Free Checkbox */}
        <FormField
          control={form.control}
          name="is_free"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Free Course
                </FormLabel>
                <FormDescription>
                  Check this if the course should be free for all students
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {/* Price Field (only show if not free) */}
        {!isFree && (
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="29.99"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Course price (e.g., 29.99, 100, 199.50)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Status Field */}
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
                Draft courses are only visible to instructors, published courses are visible to students
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : isEditing ? 'Update Course' : 'Create Course'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}