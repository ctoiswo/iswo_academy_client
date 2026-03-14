import { Cpu, HardDrive, MemoryStick } from 'lucide-react'
import type { SystemLoad } from '@/lib/super-admin-api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface SystemMetricsCardProps {
  load: SystemLoad
}

function MetricRow({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Cpu
  label: string
  value: number
  color: string
}) {
  return (
    <div className='space-y-1.5'>
      <div className='flex items-center justify-between text-sm'>
        <div className='flex items-center gap-2'>
          <Icon className={`h-4 w-4 ${color}`} />
          <span>{label}</span>
        </div>
        <span className='font-medium'>{value}%</span>
      </div>
      <Progress value={value} className='h-2' />
    </div>
  )
}

export function SystemMetricsCard({ load }: SystemMetricsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-sm font-medium'>
          Recursos del sistema
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <MetricRow
          icon={MemoryStick}
          label='Memoria RAM'
          value={load.memory_usage}
          color='text-purple-500'
        />
        <MetricRow
          icon={Cpu}
          label='CPU'
          value={load.cpu_usage}
          color='text-blue-500'
        />
        <MetricRow
          icon={HardDrive}
          label='Disco'
          value={load.disk_usage}
          color='text-orange-500'
        />
      </CardContent>
    </Card>
  )
}
