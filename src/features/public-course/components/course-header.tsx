import { Link, useRouter } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

interface CourseHeaderProps {
  academy?: {
    name: string
    slug: string
  }
  courseTitle: string
}

export function CourseHeader({ academy, courseTitle }: CourseHeaderProps) {
  const router = useRouter()

  return (
    <>
      {/* Breadcrumb */}
      <div className='bg-muted/30 border-b'>
        <div className='container py-4'>
          <div className='flex items-center gap-2 text-sm'>
            <Link
              to='/courses'
              className='text-muted-foreground hover:text-foreground'
            >
              Cursos
            </Link>
            {academy && (
              <>
                <span className='text-muted-foreground'>•</span>
                <Link
                  to='/academies/$slug'
                  params={{ slug: academy.slug }}
                  className='text-muted-foreground hover:text-foreground'
                >
                  {academy.name}
                </Link>
              </>
            )}
            <span className='text-muted-foreground'>•</span>
            <span className='text-muted-foreground'>{courseTitle}</span>
          </div>
        </div>
      </div>

      {/* Back button */}
      <div className='container pt-8'>
        <button
          onClick={() => router.history.back()}
          className='text-muted-foreground hover:text-foreground group mb-6 inline-flex items-center'
        >
          <ArrowLeft className='mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1' />
          Volver
        </button>
      </div>
    </>
  )
}
