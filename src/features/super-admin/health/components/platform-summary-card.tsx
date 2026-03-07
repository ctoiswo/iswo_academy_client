import { BookOpen, Building2, CreditCard, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { SystemHealth } from '@/lib/super-admin-api'

interface PlatformSummaryCardProps {
  health: SystemHealth
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function PlatformSummaryCard({ health }: PlatformSummaryCardProps) {
  const stats = [
    { label: 'Usuarios', value: health.total_users, icon: Users, color: 'text-blue-500' },
    { label: 'Academias', value: health.total_academies, icon: Building2, color: 'text-purple-500' },
    { label: 'Cursos', value: health.total_courses, icon: BookOpen, color: 'text-emerald-500' },
    { label: 'Pagos totales', value: health.total_payments, icon: CreditCard, color: 'text-amber-500' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-sm font-medium'>Resumen de plataforma</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className='text-center'>
              <Icon className={`mx-auto mb-1 h-5 w-5 ${color}`} />
              <p className='text-xl font-bold'>{value}</p>
              <p className='text-muted-foreground text-xs'>{label}</p>
            </div>
          ))}
        </div>
        <div className='text-muted-foreground mt-4 border-t pt-4 flex items-center justify-between text-sm'>
          <span>Pagos hoy: <strong className='text-foreground'>{health.payments_today}</strong></span>
          <span>Ingresos hoy: <strong className='text-foreground'>{formatCurrency(health.revenue_today)}</strong></span>
        </div>
      </CardContent>
    </Card>
  )
}
