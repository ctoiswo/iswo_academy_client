import { useRef } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { Globe, ImageIcon, RectangleHorizontal, Upload, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
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
    <div className='animate-in fade-in-0 slide-in-from-right-4 flex flex-col gap-6 duration-500'>
      <div className='flex flex-col gap-1.5'>
        <h2 className='text-2xl font-bold tracking-tight'>
          {t('createAcademy.steps.branding')}
        </h2>
        <p className='text-muted-foreground text-sm leading-relaxed'>
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
              <FormLabel className='text-foreground flex items-center gap-1.5 text-sm'>
                <Globe className='text-primary size-4' />
                {t('createAcademy.fields.slug')}
              </FormLabel>
              <FormControl>
                <div className='relative'>
                  <span className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm select-none'>
                    iswo/
                  </span>
                  <Input
                    placeholder='mi-academia'
                    className='bg-secondary/50 border-border focus-visible:border-primary focus-visible:ring-primary/20 placeholder:text-muted-foreground/50 h-11 pl-14 transition-all duration-300'
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
                <div className='bg-secondary/30 border-border rounded-lg border px-3 py-2 font-mono text-sm'>
                  <span className='text-muted-foreground'>🌐 </span>
                  <span className='text-primary font-semibold'>{slug}</span>
                  <span className='text-muted-foreground'>
                    .iswoacademy.com
                  </span>
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Logo upload */}
        <div className='flex flex-col gap-2'>
          <label className='text-foreground flex items-center gap-1.5 text-sm font-medium'>
            <ImageIcon className='text-primary size-4' />
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
                className='border-border h-32 w-full rounded-lg border object-cover'
              />
              <button
                type='button'
                onClick={() => onLogoChange(null)}
                className='bg-destructive text-destructive-foreground hover:bg-destructive/90 absolute top-2 right-2 flex size-5 items-center justify-center rounded-full transition-colors'
              >
                <X className='size-3' />
              </button>
            </div>
          ) : (
            <button
              type='button'
              onClick={() => logoInputRef.current?.click()}
              className='border-border bg-secondary/30 hover:border-primary/50 hover:bg-secondary/50 flex h-32 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors'
            >
              <Upload className='text-muted-foreground size-5' />
              <span className='text-muted-foreground text-sm'>Subir logo</span>
            </button>
          )}
          <p className='text-muted-foreground text-xs'>
            {t('createAcademy.fields.logoUrlHelp')}
          </p>
        </div>

        {/* Banner upload */}
        <div className='flex flex-col gap-2'>
          <label className='text-foreground flex items-center gap-1.5 text-sm font-medium'>
            <RectangleHorizontal className='text-primary size-4' />
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
                className='border-border h-32 w-full rounded-lg border object-cover'
              />
              <button
                type='button'
                onClick={() => onBannerChange(null)}
                className='bg-destructive text-destructive-foreground hover:bg-destructive/90 absolute top-2 right-2 flex size-5 items-center justify-center rounded-full transition-colors'
              >
                <X className='size-3' />
              </button>
            </div>
          ) : (
            <button
              type='button'
              onClick={() => bannerInputRef.current?.click()}
              className='border-border bg-secondary/30 hover:border-primary/50 hover:bg-secondary/50 flex h-32 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors'
            >
              <Upload className='text-muted-foreground size-5' />
              <span className='text-muted-foreground text-sm'>
                Subir banner
              </span>
            </button>
          )}
          <p className='text-muted-foreground text-xs'>
            Imagen de portada de la academia (JPG, PNG, GIF, WebP)
          </p>
        </div>
      </div>
    </div>
  )
}
