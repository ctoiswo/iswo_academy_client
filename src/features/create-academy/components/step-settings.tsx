import type { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { DollarSign, Eye, Lock, Target, Telescope } from 'lucide-react'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import type { CreateAcademyFormValues } from './create-academy-form'

interface StepSettingsProps {
  form: UseFormReturn<CreateAcademyFormValues>
}

export function StepSettings({ form }: StepSettingsProps) {
  const { t } = useTranslation()
  const subscriptionRequired = form.watch('subscription_required')

  return (
    <div className='flex flex-col gap-6 animate-in fade-in-0 slide-in-from-right-4 duration-500'>
      <div className='flex flex-col gap-1.5'>
        <h2 className='text-2xl font-bold tracking-tight'>
          {t('createAcademy.steps.settings')}
        </h2>
        <p className='text-sm text-muted-foreground leading-relaxed'>
          Configura el acceso y la identidad de tu academia
        </p>
      </div>

      <div className='flex flex-col gap-5'>
        <FormField
          control={form.control}
          name='is_public'
          render={({ field }) => (
            <FormItem className='flex flex-row items-center justify-between rounded-xl border border-border bg-secondary/20 p-4 transition-all duration-300 hover:border-primary/30 hover:bg-secondary/30'>
              <div className='flex items-center gap-3'>
                <div className='flex items-center justify-center size-9 rounded-lg bg-primary/10'>
                  <Eye className='size-4 text-primary' />
                </div>
                <div className='flex flex-col gap-0.5'>
                  <FormLabel className='text-sm font-medium leading-none cursor-pointer'>
                    {t('createAcademy.fields.isPublic')}
                  </FormLabel>
                  <p className='text-xs text-muted-foreground'>
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
            <FormItem className='flex flex-row items-center justify-between rounded-xl border border-border bg-secondary/20 p-4 transition-all duration-300 hover:border-primary/30 hover:bg-secondary/30'>
              <div className='flex items-center gap-3'>
                <div className='flex items-center justify-center size-9 rounded-lg bg-primary/10'>
                  <Lock className='size-4 text-primary' />
                </div>
                <div className='flex flex-col gap-0.5'>
                  <FormLabel className='text-sm font-medium leading-none cursor-pointer'>
                    {t('createAcademy.fields.subscriptionRequired')}
                  </FormLabel>
                  <p className='text-xs text-muted-foreground'>
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
                <FormLabel className='flex items-center gap-1.5 text-sm text-foreground'>
                  <DollarSign className='size-4 text-primary' />
                  {t('createAcademy.fields.monthlyPrice')}
                </FormLabel>
                <FormControl>
                  <div className='relative'>
                    <span className='absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground select-none pointer-events-none'>
                      $
                    </span>
                    <Input
                      type='number'
                      min={0}
                      step={1000}
                      placeholder='50000'
                      className='h-11 pl-7 bg-secondary/50 border-border focus-visible:border-primary focus-visible:ring-primary/20 placeholder:text-muted-foreground/50 transition-all duration-300'
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </div>
                </FormControl>
                <p className='text-xs text-muted-foreground'>
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
              <FormLabel className='flex items-center gap-1.5 text-sm text-foreground'>
                <Target className='size-4 text-primary' />
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
              <FormLabel className='flex items-center gap-1.5 text-sm text-foreground'>
                <Telescope className='size-4 text-primary' />
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
