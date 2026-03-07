import { useTranslation } from "@/hooks/use-translation"

export function CustomTooltip({ active, payload, label }: any) {
  const { t } = useTranslation()
  if (!active || !payload?.length) return null
  return (
    <div className='rounded-lg border border-border/60 bg-card px-3 py-2 shadow-sm text-sm'>
      <p className='text-muted-foreground mb-1'>{label}</p>
      <p className='font-semibold'>{payload[0].value.toLocaleString()} {t('super_admin.charts.users')}</p>
    </div>
  )
}