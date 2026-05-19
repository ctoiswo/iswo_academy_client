import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import academyAdminService, {
  type AcademyUser,
} from '@/services/academy-admin-service'
import courseService from '@/services/course-service'
import { Loader2, BookOpen } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslation } from '@/hooks/use-translation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

interface AssignTeacherCoursesDialogProps {
  user: AcademyUser | null
  academySlug: string
  /** When set, dialog is assigning role+courses. When undefined, only reassigning courses. */
  pendingRole?: 'teacher'
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AssignTeacherCoursesDialog({
  user,
  academySlug,
  pendingRole,
  open,
  onOpenChange,
}: AssignTeacherCoursesDialogProps) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  // Pre-select already assigned courses when dialog opens
  const prevOpen = useRef(false)
  if (open && !prevOpen.current && user?.teaching_course_ids) {
    setSelectedIds(user.teaching_course_ids)
  }
  prevOpen.current = open

  const { data: courses, isLoading: loadingCourses } = useQuery({
    queryKey: ['academy-courses', academySlug],
    queryFn: () => courseService.getCoursesByAcademy(academySlug),
    enabled: open && !!academySlug,
  })

  const mutation = useMutation({
    mutationFn: async () => {
      if (!user) return
      if (pendingRole === 'teacher') {
        await academyAdminService.updateUserRole(
          academySlug,
          user.id,
          'teacher',
          selectedIds
        )
      } else {
        await academyAdminService.assignTeacherCourses(
          academySlug,
          user.id,
          selectedIds
        )
      }
    },
    onSuccess: () => {
      toast.success(t('academyUsers.teacherCoursesAssigned'))
      queryClient.invalidateQueries({
        queryKey: ['academy-users', academySlug],
      })
      onOpenChange(false)
      setSelectedIds(selectedIds)
    },
    onError: () => toast.error(t('academyUsers.teacherCoursesError')),
  })

  function toggle(courseId: number) {
    setSelectedIds((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    )
  }

  function handleClose(open: boolean) {
    if (!open) setSelectedIds(user?.teaching_course_ids ?? [])
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>
            {t('academyUsers.assignCoursesDialog.title')}
          </DialogTitle>
          <DialogDescription>
            {t('academyUsers.assignCoursesDialog.description', {
              name: user?.name ?? '',
            })}
          </DialogDescription>
        </DialogHeader>

        {loadingCourses ? (
          <div className='flex items-center justify-center py-8'>
            <Loader2 className='text-muted-foreground h-6 w-6 animate-spin' />
          </div>
        ) : !courses?.length ? (
          <div className='text-muted-foreground flex flex-col items-center gap-2 py-8'>
            <BookOpen className='h-8 w-8' />
            <p className='text-sm'>
              {t('academyUsers.assignCoursesDialog.noCourses')}
            </p>
          </div>
        ) : (
          <ScrollArea className='max-h-72 pr-4'>
            <div className='space-y-2'>
              {courses.map((course) => (
                <label
                  key={course.id}
                  className='hover:bg-muted/50 flex cursor-pointer items-start gap-3 rounded-md border p-3'
                >
                  <Checkbox
                    checked={selectedIds.includes(course.id)}
                    onCheckedChange={() => toggle(course.id)}
                    className='mt-0.5'
                  />
                  <div className='flex-1 space-y-0.5'>
                    <p className='text-sm leading-none font-medium'>
                      {course.title}
                    </p>
                    {course.status && (
                      <Badge
                        variant={
                          course.status === 'published'
                            ? 'default'
                            : 'secondary'
                        }
                        className='text-xs'
                      >
                        {course.status}
                      </Badge>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </ScrollArea>
        )}

        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => handleClose(false)}
            disabled={mutation.isPending}
          >
            {t('common.cancel')}
          </Button>
          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || selectedIds.length === 0}
          >
            {mutation.isPending && (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            )}
            {t('academyUsers.assignCoursesDialog.confirm', {
              count: selectedIds.length,
            })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
