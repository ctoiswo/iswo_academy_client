import type { UseFormReturn } from 'react-hook-form'
import { DollarSign, Eye, Lock, Target, Telescope } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import type { CreateAcademyFormValues } from './create-academy-form'

interface StepSettingsProps {
  form: UseFormReturn<CreateAcademyFormValues>
}

export function StepSettings({ form }: StepSettingsProps) {
  const { t } = useTranslation()
  const subscriptionRequired = form.watch('subscription_required')

  return (
    <div className='animate-in fade-in-0 slide-in-from-right-4 flex flex-col gap-6 duration-500'>
      <div className='flex flex-col gap-1.5'>
        <h2 className='text-2xl font-bold tracking-tight'>
          {t('createAcademy.steps.settings')}
        </h2>
        <p className='text-muted-foreground text-sm leading-relaxed'>
          Configura el acceso y la identidad de tu academia
        </p>
      </div>

      <div className='flex flex-col gap-5'>
        <FormField
          control={form.control}
          name='is_public'
          render={({ field }) => (
            <FormItem className='border-border bg-secondary/20 hover:border-primary/30 hover:bg-secondary/30 flex flex-row items-center justify-between rounded-xl border p-4 transition-all duration-300'>
              <div className='flex items-center gap-3'>
                <div className='bg-primary/10 flex size-9 items-center justify-center rounded-lg'>
                  <Eye className='text-primary size-4' />
                </div>
                <div className='flex flex-col gap-0.5'>
                  <FormLabel className='cursor-pointer text-sm leading-none font-medium'>
                    {t('createAcademy.fields.isPublic')}
                  </FormLabel>
                  <p className='text-muted-foreground text-xs'>
                    {t('createAcademy.fields.isPublicHelp')}
                  </p>
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='subscription_required'
          render={({ field }) => (
            <FormItem className='border-border bg-secondary/20 hover:border-primary/30 hover:bg-secondary/30 flex flex-row items-center justify-between rounded-xl border p-4 transition-all duration-300'>
              <div className='flex items-center gap-3'>
                <div className='bg-primary/10 flex size-9 items-center justify-center rounded-lg'>
                  <Lock className='text-primary size-4' />
                </div>
                <div className='flex flex-col gap-0.5'>
                  <FormLabel className='cursor-pointer text-sm leading-none font-medium'>
                    {t('createAcademy.fields.subscriptionRequired')}
                  </FormLabel>
                  <p className='text-muted-foreground text-xs'>
                    {t('createAcademy.fields.subscriptionRequiredHelp')}
                  </p>
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {subscriptionRequired && (
          <FormField
            control={form.control}
            name='monthly_price'
            render={({ field }) => (
              <FormItem className='flex flex-col gap-2'>
                <FormLabel className='text-foreground flex items-center gap-1.5 text-sm'>
                  <DollarSign className='text-primary size-4' />
                  {t('createAcademy.fields.monthlyPrice')}
                </FormLabel>
                <FormControl>
                  <div className='relative'>
                    <span className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm select-none'>
                      $
                    </span>
                    <Input
                      type='number'
                      min={0}
                      step={1000}
                      placeholder='50000'
                      className='bg-secondary/50 border-border focus-visible:border-primary focus-visible:ring-primary/20 placeholder:text-muted-foreground/50 h-11 pl-7 transition-all duration-300'
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </div>
                </FormControl>
                <p className='text-muted-foreground text-xs'>
                  {t('createAcademy.fields.monthlyPriceHelp')}
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name='mission'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-2'>
              <FormLabel className='text-foreground flex items-center gap-1.5 text-sm'>
                <Target className='text-primary size-4' />
                {t('createAcademy.fields.mission')}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('createAcademy.fields.missionPlaceholder')}
                  rows={3}
                  className='bg-secondary/50 border-border focus-visible:border-primary focus-visible:ring-primary/20 placeholder:text-muted-foreground/50 resize-none transition-all duration-300'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='vision'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-2'>
              <FormLabel className='text-foreground flex items-center gap-1.5 text-sm'>
                <Telescope className='text-primary size-4' />
                {t('createAcademy.fields.vision')}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('createAcademy.fields.visionPlaceholder')}
                  rows={3}
                  className='bg-secondary/50 border-border focus-visible:border-primary focus-visible:ring-primary/20 placeholder:text-muted-foreground/50 resize-none transition-all duration-300'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
