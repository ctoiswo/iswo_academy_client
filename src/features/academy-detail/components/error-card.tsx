import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/features/home/components/header'

interface ErrorCardProps {
  error?: string | null
}

export function ErrorCard({ error }: ErrorCardProps) {
  return (
    <div className='bg-background min-h-screen'>
      <Header />
      <div className='container mx-auto px-4 py-8'>
        <Card className='mx-auto max-w-md'>
          <CardHeader>
            <CardTitle className='text-red-600'>
              Academia no encontrada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-muted-foreground mb-4'>
              {error ||
                'La academia que buscas no existe o no está disponible.'}
            </p>
            <Button asChild className='w-full'>
              <Link to='/academies'>
                <ArrowLeft className='mr-2 h-4 w-4' />
                Volver a Academias
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
