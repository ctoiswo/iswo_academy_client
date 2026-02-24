import type { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Globe, ImageIcon, RectangleHorizontal } from 'lucide-react'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import type { CreateAcademyFormValues } from './create-academy-form'

interface StepBrandingProps {
  form: UseFormReturn<CreateAcademyFormValues>
}

export function StepBranding({ form }: StepBrandingProps) {
  const { t } = useTranslation()
  const slug = form.watch('slug') || ''

  return (
    <div className='flex flex-col gap-6 animate-in fade-in-0 slide-in-from-right-4 duration-500'>
      <div className='flex flex-col gap-1.5'>
        <h2 className='text-2xl font-bold tracking-tight'>
          {t('createAcademy.steps.branding')}
        </h2>
        <p className='text-sm text-muted-foreground leading-relaxed'>
          Define la identidad y presencia de tu academia
        </p>
      </div>

      <div className='flex flex-col gap-5'>
        <FormField
          control={form.control}
          name='slug'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-2'>
              <FormLabel className='flex items-center gap-1.5 text-sm text-foreground'>
                <Globe className='size-4 text-primary' />
                {t('createAcademy.fields.slug')}
              </FormLabel>
              <FormControl>
                <div className='relative'>
                  <span className='absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground select-none pointer-events-none'>
                    iswo/
                  </span>
                  <Input
                    placeholder='mi-academia'
                    className='h-11 pl-14 bg-secondary/50 border-border focus-visible:border-primary focus-visible:ring-primary/20 placeholder:text-muted-foreground/50 transition-all duration-300'
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9-]/g, '-')
                          .replace(/-+/g, '-')
                      )
                    }
                  />
                </div>
              </FormControl>
              {slug && (
                <div className='bg-secondary/30 border border-border rounded-lg px-3 py-2 font-mono text-sm'>
                  <span className='text-muted-foreground'>🌐 </span>
                  <span className='text-primary font-semibold'>{slug}</span>
                  <span className='text-muted-foreground'>.iswoacademy.com</span>
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='logo_url'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-2'>
              <FormLabel className='flex items-center gap-1.5 text-sm text-foreground'>
                <ImageIcon className='size-4 text-primary' />
                {t('createAcademy.fields.logoUrl')}
              </FormLabel>
              <FormControl>
                <div className='relative'>
                  <span className='absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground select-none pointer-events-none'>
                    https://
                  </span>
                  <Input
                    type='url'
                    placeholder='ejemplo.com/logo.png'
                    className='h-11 pl-16 bg-secondary/50 border-border focus-visible:border-primary focus-visible:ring-primary/20 placeholder:text-muted-foreground/50 transition-all duration-300'
                    {...field}
                  />
                </div>
              </FormControl>
              <p className='text-xs text-muted-foreground'>
                {t('createAcademy.fields.logoUrlHelp')}
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='banner_url'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-2'>
              <FormLabel className='flex items-center gap-1.5 text-sm text-foreground'>
                <RectangleHorizontal className='size-4 text-primary' />
                {t('createAcademy.fields.bannerUrl')}
              </FormLabel>
              <FormControl>
                <div className='relative'>
                  <span className='absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground select-none pointer-events-none'>
                    https://
                  </span>
                  <Input
                    type='url'
                    placeholder='ejemplo.com/banner.jpg'
                    className='h-11 pl-16 bg-secondary/50 border-border focus-visible:border-primary focus-visible:ring-primary/20 placeholder:text-muted-foreground/50 transition-all duration-300'
                    {...field}
                  />
                </div>
              </FormControl>
              <p className='text-xs text-muted-foreground'>
                {t('createAcademy.fields.bannerUrlHelp')}
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}

