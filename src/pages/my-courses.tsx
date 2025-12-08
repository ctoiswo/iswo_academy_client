import { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearch } from '@tanstack/react-router'
import { BookOpen, Filter, Grid, List, Search, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useUserEnrollments } from '@/hooks/use-enrollments'
import { useWishlist } from '@/hooks/use-wishlist'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

export default function MyCoursesPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, currentAcademy } = useAuthStore()
  const { academySlug } = useParams({ strict: false }) as {
    academySlug?: string
  }
  const searchParams = useSearch({ strict: false }) as { status?: string }
  const [filters, setFilters] = useState<EnrollmentFilters>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isWishlistView, setIsWishlistView] = useState(false)

  const {
    data: enrollmentsData,
    isLoading,
    error,
  } = useUserEnrollments(filters)
  const { isLoading: wishlistLoading, getCourses } = useWishlist()

  // Update filter based on URL search params
  useEffect(() => {
    if (searchParams?.status === 'wishlist') {
      setIsWishlistView(true)
    } else {
      setIsWishlistView(false)
      if (searchParams?.status) {
        setFilters({ status: searchParams.status as any })
      }
    }
  }, [searchParams])

  const handleFilterChange = (status: string) => {
    setFilters({
      ...filters,
      status: status === 'all' ? undefined : (status as any),
    })
  }

  const handleContinueCourse = (courseSlug: string, academySlug: string) => {
    navigate({
      to: '/academy/$academySlug/courses/$courseSlug/content',
      params: { academySlug, courseSlug },
    })
  }

  const handleViewCertificate = (enrollmentId: number) => {
    navigate({ to: `/certificates/${enrollmentId}` })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'active':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'suspended':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`
    }
    return `${remainingMinutes}m`
  }

  if (isLoading || wishlistLoading) {
    return (
      <DashboardLayout
        user={user}
        academy={currentAcademy}
        variant='full'
        dashboardType='student'
      >
        <div className='container mx-auto py-8'>
          <div className='space-y-6'>
            <Skeleton className='h-8 w-64' />
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
              <Skeleton className='h-64' />
              <Skeleton className='h-64' />
              <Skeleton className='h-64' />
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!isWishlistView && error) {
    return (
      <DashboardLayout
        user={user}
        academy={currentAcademy}
        variant='full'
        dashboardType='student'
      >
        <div className='container mx-auto py-8'>
          <div className='py-12 text-center'>
            <h3 className='mb-2 text-lg font-bold text-red-600'>
              {t('myCourses.errorTitle')}
            </h3>
            <p className='text-gray-600'>{t('myCourses.errorDescription')}</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const enrollments: Enrollment[] = Array.isArray(enrollmentsData)
    ? enrollmentsData
    : enrollmentsData?.data || enrollmentsData?.enrollments || []

  // Get wishlist courses
  const wishlistCourses = getCourses()

  // Filter by search query
  const filteredEnrollments = isWishlistView
    ? [] // Will show wishlist items instead
    : enrollments.filter(
        (enrollment) =>
          enrollment.course.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          enrollment.course.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      )

  return (
    <DashboardLayout
      user={user}
      academy={currentAcademy}
      variant='full'
      dashboardType='student'
    >
      <div className='flex-1 space-y-6 px-4'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>
              {t('myCourses.title')}
            </h1>
            <p className='text-muted-foreground'>{t('myCourses.subtitle')}</p>
          </div>
          <Button onClick={() => navigate({ to: '/redeem-code' })}>
            <Plus className='mr-2 h-4 w-4' />
            {t('myCourses.redeemCode')}
          </Button>
        </div>

        {/* Filters and Search */}
        <div className='flex flex-col gap-4 sm:flex-row'>
          <div className='flex-1'>
            <div className='relative'>
              <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400' />
              <Input
                placeholder={t('myCourses.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pl-10'
              />
            </div>
          </div>
          <div className='flex gap-2'>
            <Select
              value={filters.status || 'all'}
              onValueChange={handleFilterChange}
            >
              <SelectTrigger className='w-[150px]'>
                <Filter className='mr-2 h-4 w-4' />
                <SelectValue placeholder='Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>
                  {t('myCourses.allStatuses')}
                </SelectItem>
                <SelectItem value='active'>{t('myCourses.active')}</SelectItem>
                <SelectItem value='completed'>
                  {t('myCourses.completed')}
                </SelectItem>
                <SelectItem value='suspended'>
                  {t('myCourses.suspended')}
                </SelectItem>
              </SelectContent>
            </Select>
            <div className='flex rounded-md border'>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size='sm'
                onClick={() => setViewMode('grid')}
                className='rounded-r-none'
              >
                <Grid className='h-4 w-4' />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size='sm'
                onClick={() => setViewMode('list')}
                className='rounded-l-none'
              >
                <List className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>

        {/* Courses Grid/List */}
        {isWishlistView ? (
          // Wishlist View
          wishlistCourses.length === 0 ? (
            <Card className='py-12 text-center'>
              <CardContent>
                <BookOpen className='mx-auto mb-4 h-12 w-12 text-gray-400' />
                <h3 className='mb-2 text-lg font-medium text-gray-900'>
                  {t('myCourses.wishlist.title')}
                </h3>
                <p className='mb-4 text-gray-500'>
                  {t('myCourses.wishlist.description')}
                </p>
                <Button
                  onClick={() =>
                    navigate({
                      to: '/academy/$academySlug/courses',
                      params: { academySlug: academySlug || 'default' },
                    })
                  }
                >
                  {t('myCourses.exploreCourses')}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3'
                  : 'space-y-4'
              }
            >
              {wishlistCourses.map((item) => (
                <Card
                  key={`${item.type}-${item.id}`}
                  className='transition-shadow hover:shadow-lg'
                >
                  <CardHeader className='pb-3'>
                    <div className='flex items-start justify-between'>
                      <div className='flex-1 space-y-2'>
                        <CardTitle className='text-lg leading-tight'>
                          {item.name}
                        </CardTitle>
                        <Badge
                          variant='outline'
                          className='bg-pink-100 text-pink-800'
                        >
                          {t('myCourses.wishlist.saved')}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className='space-y-4'>
                    <p className='text-sm text-gray-600'>
                      {t('myCourses.wishlist.addedOn')}{' '}
                      {new Date(item.addedAt).toLocaleDateString()}
                    </p>

                    <div className='flex gap-2 pt-2'>
                      <Button
                        size='sm'
                        onClick={() =>
                          navigate({
                            to: '/academy/$academySlug/courses',
                            params: { academySlug: academySlug || 'default' },
                          })
                        }
                        className='flex-1'
                      >
                        {t('myCourses.wishlist.viewDetails')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )
        ) : // Enrollments View
        filteredEnrollments.length === 0 ? (
          <Card className='py-12 text-center'>
            <CardContent>
              <BookOpen className='mx-auto mb-4 h-12 w-12 text-gray-400' />
              <h3 className='mb-2 text-lg font-medium text-gray-900'>
                {t('myCourses.noCoursesTitle')}
              </h3>
              <p className='mb-4 text-gray-500'>
                {searchQuery || filters.status
                  ? t('myCourses.noCoursesDescription')
                  : t('myCourses.notEnrolledYet')}
              </p>
              <div className='flex justify-center gap-2'>
                <Button
                  onClick={() =>
                    navigate({
                      to: '/academy/$academySlug/courses',
                      params: { academySlug: academySlug || 'default' },
                    })
                  }
                >
                  {t('myCourses.exploreCourses')}
                </Button>
                <Button
                  variant='outline'
                  onClick={() => navigate({ to: '/redeem-code' })}
                >
                  {t('myCourses.redeemCode')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3'
                : 'space-y-4'
            }
          >
            {filteredEnrollments.map((enrollment) => (
              <Card
                key={enrollment.id}
                className='group overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl'
              >
                {/* Promotional Image */}
                {enrollment.course.promotional_image_url && (
                  <div className='relative h-48 w-full overflow-hidden'>
                    <img
                      src={enrollment.course.promotional_image_url}
                      alt={enrollment.course.title}
                      className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
                    {/* Status badges over image */}
                    <div className='absolute bottom-3 left-3 flex gap-2'>
                      <Badge className={getStatusColor(enrollment.status)}>
                        {t(`myCourses.${enrollment.status}`)}
                      </Badge>
                      <Badge
                        variant='outline'
                        className={`${getDifficultyColor(enrollment.course.difficulty_level)} backdrop-blur-sm`}
                      >
                        {t(
                          `myCourses.difficulty.${enrollment.course.difficulty_level}`
                        )}
                      </Badge>
                    </div>
                  </div>
                )}

                <CardHeader className='pb-3'>
                  <div className='flex items-start justify-between'>
                    <div className='flex-1 space-y-2'>
                      <CardTitle className='text-lg leading-tight'>
                        {enrollment.course.title}
                      </CardTitle>
                      {!enrollment.course.promotional_image_url && (
                        <div className='flex gap-2'>
                          <Badge className={getStatusColor(enrollment.status)}>
                            {t(`myCourses.${enrollment.status}`)}
                          </Badge>
                          <Badge
                            variant='outline'
                            className={getDifficultyColor(
                              enrollment.course.difficulty_level
                            )}
                          >
                            {t(
                              `myCourses.difficulty.${enrollment.course.difficulty_level}`
                            )}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className='space-y-4'>
                  <CardDescription className='line-clamp-2'>
                    {enrollment.course.description}
                  </CardDescription>

                  {/* Progress */}
                  <div className='space-y-2'>
                    <div className='flex justify-between text-sm'>
                      <span>{t('myCourses.progress')}</span>
                      <span className='font-medium'>
                        {enrollment.progress_percentage || 0}%
                      </span>
                    </div>
                    <Progress
                      value={enrollment.progress_percentage || 0}
                      className='h-2'
                    />
                  </div>

                  {/* Course Info */}
                  <div className='flex justify-between text-sm text-gray-500'>
                    <span>
                      {t('myCourses.duration')}:{' '}
                      {formatDuration(enrollment.course.duration_minutes)}
                    </span>
                    <span>
                      {t('myCourses.enrolled')}:{' '}
                      {new Date(enrollment.enrolled_at).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className='pt-2'>
                    {enrollment.status === 'completed' ? (
                      <Button
                        size='sm'
                        onClick={() => handleViewCertificate(enrollment.id)}
                        className='w-full'
                      >
                        {t('myCourses.certificateButton')}
                      </Button>
                    ) : (
                      <Button
                        size='sm'
                        onClick={() =>
                          handleContinueCourse(
                            enrollment.course.slug,
                            enrollment.course.academy_slug!
                          )
                        }
                        className='w-full'
                      >
                        {t('myCourses.continueButton')}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
