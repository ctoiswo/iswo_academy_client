import { useState, useRef, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import type { AcademySearchResult, CourseSearchResult } from '@/types'
import {
  Search,
  GraduationCap,
  BookOpen,
  Users,
  Clock,
  X,
  Loader2,
} from 'lucide-react'
import { formatPrice, formatDifficulty } from '@/lib/formatters'
import { useGlobalSearch } from '@/hooks/use-global-search'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

export function GlobalSearchBar() {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 300) // 300ms delay

    return () => clearTimeout(timer)
  }, [query])

  const { data, isLoading } = useGlobalSearch(debouncedQuery, {
    enabled: debouncedQuery.length >= 2,
  })

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Open dropdown when typing
  useEffect(() => {
    if (query.length >= 2) {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }, [query])

  const handleClear = () => {
    setQuery('')
    setIsOpen(false)
  }

  const handleResultClick = () => {
    setIsOpen(false)
    setQuery('')
  }

  const totalResults = data?.total_count || 0
  const hasResults = totalResults > 0

  return (
    <div ref={searchRef} className='relative w-full max-w-2xl'>
      {/* Search Input */}
      <div className='relative flex gap-2'>
        <div className='relative flex-1'>
          <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
          <Input
            type='text'
            placeholder='Buscar cursos, academias...'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className='h-12 pr-10 pl-10 text-lg'
          />
          {query && (
            <button
              onClick={handleClear}
              className='text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors'
            >
              <X className='h-4 w-4' />
            </button>
          )}
          {isLoading && (
            <div className='absolute top-1/2 right-3 -translate-y-1/2'>
              <Loader2 className='h-4 w-4 animate-spin' />
            </div>
          )}
        </div>
      </div>

      {/* Results Dropdown */}
      {isOpen && query.length >= 2 && (
        <div className='bg-background border-border absolute top-full z-50 mt-2 w-full overflow-hidden rounded-lg border shadow-lg'>
          {isLoading ? (
            <div className='flex items-center justify-center py-8'>
              <Loader2 className='h-6 w-6 animate-spin' />
              <span className='text-muted-foreground ml-2'>Buscando...</span>
            </div>
          ) : !hasResults ? (
            <div className='text-muted-foreground py-8 text-center'>
              <p>No se encontraron resultados para "{query}"</p>
            </div>
          ) : (
            <div className='max-h-[500px] overflow-y-auto'>
              {/* Academies Section */}
              {data?.academies && data.academies.length > 0 && (
                <div className='border-b p-4'>
                  <div className='mb-3 flex items-center gap-2'>
                    <GraduationCap className='text-primary h-5 w-5' />
                    <h3 className='font-semibold'>
                      Academias ({data.academies.length})
                    </h3>
                  </div>
                  <div className='space-y-2'>
                    {data.academies.map((academy: AcademySearchResult) => (
                      <Link
                        key={academy.id}
                        to='/academies/$slug'
                        params={{ slug: academy.slug }}
                        onClick={handleResultClick}
                      >
                        <div className='hover:bg-muted flex items-start gap-3 rounded-lg p-3 transition-colors'>
                          <img
                            src={
                              academy.logo_url ||
                              'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=100'
                            }
                            alt={academy.name}
                            className='h-12 w-12 rounded object-cover'
                          />
                          <div className='min-w-0 flex-1'>
                            <h4 className='line-clamp-1 font-medium'>
                              {academy.name}
                            </h4>
                            <p className='text-muted-foreground line-clamp-1 text-sm'>
                              {academy.description}
                            </p>
                            <div className='mt-1 flex items-center justify-center gap-3 text-xs'>
                              <div className='flex items-center gap-1'>
                                <BookOpen className='h-3 w-3' />
                                <span>{academy.course_count} cursos</span>
                              </div>
                              <div className='flex items-center gap-1'>
                                <Users className='h-3 w-3' />
                                <span>{academy.student_count} estudiantes</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Courses Section */}
              {data?.courses && data.courses.length > 0 && (
                <div className='p-4'>
                  <div className='mb-3 flex items-center gap-2'>
                    <BookOpen className='text-primary h-5 w-5' />
                    <h3 className='font-semibold'>
                      Cursos ({data.courses.length})
                    </h3>
                  </div>
                  <div className='space-y-2'>
                    {data.courses.map((course: CourseSearchResult) => (
                      <Link
                        key={course.id}
                        to='/courses/$courseSlug'
                        params={{ courseSlug: course.slug }}
                        onClick={handleResultClick}
                      >
                        <div className='hover:bg-muted flex items-start gap-3 rounded-lg p-3 transition-colors'>
                          <img
                            src={
                              course.thumbnail_url ||
                              'https://images.pexels.com/photos/574077/pexels-photo-574077.jpeg?auto=compress&cs=tinysrgb&w=100'
                            }
                            alt={course.title}
                            className='h-12 w-16 rounded object-cover'
                          />
                          <div className='min-w-0 flex-1'>
                            <h4 className='line-clamp-1 font-medium'>
                              {course.title}
                            </h4>
                            <p className='text-muted-foreground text-xs'>
                              por {course.creator?.name} •{' '}
                              {course.academy?.name}
                            </p>
                            <div className='mt-1 flex items-center justify-center gap-2'>
                              {course.difficulty_level && (
                                <Badge variant='secondary' className='text-xs'>
                                  {formatDifficulty(course.difficulty_level)}
                                </Badge>
                              )}
                              <span className='text-xs'>
                                {course.is_free
                                  ? 'Gratis'
                                  : formatPrice(course.price || '0')}
                              </span>
                              {course.duration_minutes && (
                                <div className='flex items-center gap-1 text-xs'>
                                  <Clock className='h-3 w-3' />
                                  <span>
                                    {Math.round(course.duration_minutes / 60)}h
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
