import { useRef } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Globe, ImageIcon, RectangleHorizontal, Upload, X } from 'lucide-react'
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
  logoFile: File | null
  onLogoChange: (file: File | null) => void
  bannerFile: File | null
  onBannerChange: (file: File | null) => void
}

export function StepBranding({
  form,
  logoFile,
  onLogoChange,
  bannerFile,
  onBannerChange,
}: StepBrandingProps) {
  const { t } = useTranslation()
  const slug = form.watch('slug') || ''
  const logoInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (file: File | null) => void
  ) => {
    const file = e.target.files?.[0] ?? null
    onChange(file)
    e.target.value = ''
  }

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
        {/* Slug */}
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

        {/* Logo upload */}
        <div className='flex flex-col gap-2'>
          <label className='flex items-center gap-1.5 text-sm font-medium text-foreground'>
            <ImageIcon className='size-4 text-primary' />
            {t('createAcademy.fields.logoUrl')}
          </label>
          <input
            ref={logoInputRef}
            type='file'
            accept='image/jpeg,image/png,image/gif,image/webp,image/svg+xml'
            className='hidden'
            onChange={(e) => handleFileSelect(e, onLogoChange)}
          />
          {logoFile ? (
            <div className='relative'>
              <img
                src={URL.createObjectURL(logoFile)}
                alt='Logo preview'
                className='h-32 w-full rounded-lg object-cover border border-border'
              />
              <button
                type='button'
                onClick={() => onLogoChange(null)}
                className='absolute top-2 right-2 flex items-center justify-center size-5 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors'
              >
                <X className='size-3' />
              </button>
            </div>
          ) : (
            <button
              type='button'
              onClick={() => logoInputRef.current?.click()}
              className='flex h-32 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-secondary/30 hover:border-primary/50 hover:bg-secondary/50 transition-colors'
            >
              <Upload className='size-5 text-muted-foreground' />
              <span className='text-sm text-muted-foreground'>Subir logo</span>
            </button>
          )}
          <p className='text-xs text-muted-foreground'>
            {t('createAcademy.fields.logoUrlHelp')}
          </p>
        </div>

        {/* Banner upload */}
        <div className='flex flex-col gap-2'>
          <label className='flex items-center gap-1.5 text-sm font-medium text-foreground'>
            <RectangleHorizontal className='size-4 text-primary' />
            {t('createAcademy.fields.bannerUrl')}
          </label>
          <input
            ref={bannerInputRef}
            type='file'
            accept='image/jpeg,image/png,image/gif,image/webp'
            className='hidden'
            onChange={(e) => handleFileSelect(e, onBannerChange)}
          />
          {bannerFile ? (
            <div className='relative'>
              <img
                src={URL.createObjectURL(bannerFile)}
                alt='Banner preview'
                className='h-32 w-full rounded-lg object-cover border border-border'
              />
              <button
                type='button'
                onClick={() => onBannerChange(null)}
                className='absolute top-2 right-2 flex items-center justify-center size-5 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors'
              >
                <X className='size-3' />
              </button>
            </div>
          ) : (
            <button
              type='button'
              onClick={() => bannerInputRef.current?.click()}
              className='flex h-32 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-secondary/30 hover:border-primary/50 hover:bg-secondary/50 transition-colors'
            >
              <Upload className='size-5 text-muted-foreground' />
              <span className='text-sm text-muted-foreground'>Subir banner</span>
            </button>
          )}
          <p className='text-xs text-muted-foreground'>
            Imagen de portada de la academia (JPG, PNG, GIF, WebP)
          </p>
        </div>
      </div>
    </div>
  )
}

