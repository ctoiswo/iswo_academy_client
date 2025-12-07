/**
 * Academy Card Component
 * Displays a single academy card with link
 */
import { Link } from '@tanstack/react-router'
import type { AcademyFull, AcademySummary } from '@/types/entities/academy'
import { motion } from 'framer-motion'
import { BookOpen, Users } from 'lucide-react'
import { formatPrice } from '@/lib/formatters'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface AcademyCardProps {
  academy: AcademyFull | AcademySummary
  index?: number
}

export function AcademyCard({ academy, index = 0 }: AcademyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
    >
      <Link to='/academies/$slug' params={{ slug: academy.slug }}>
        <Card className='group h-full cursor-pointer overflow-hidden'>
          <div className='relative'>
            <img
              src={
                academy.logo_url ||
                'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2'
              }
              alt={academy.name}
              className='h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105'
            />
            <div className='absolute top-4 right-4'>
              <div className='rounded bg-black/70 px-2 py-1 text-xs font-medium text-white'>
                Desde {formatPrice(academy.monthly_price)}/mes
              </div>
            </div>
          </div>
          <CardHeader>
            <CardTitle className='line-clamp-1'>{academy.name}</CardTitle>
            <CardDescription className='line-clamp-2'>
              {academy.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-muted-foreground'>
                  Por {academy?.creator?.name}
                </span>
              </div>
              <div className='flex items-center justify-between text-sm'>
                <div className='flex items-center space-x-4'>
                  <div className='flex items-center space-x-1'>
                    <Users className='text-muted-foreground h-4 w-4' />
                    <span>
                      {(academy.enrolled_users_count || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className='flex items-center space-x-1'>
                    <BookOpen className='text-muted-foreground h-4 w-4' />
                    <span>{academy.courses_count || 0} cursos</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
