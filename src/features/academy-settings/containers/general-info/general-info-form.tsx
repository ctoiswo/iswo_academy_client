import { useRef, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import academyCategoryService from '@/services/academy-category-service'
import academyService from '@/services/academy-service'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { useTranslation } from '@/hooks/use-translation'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

const generalInfoSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres.'),
  description: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres.'),
  slug: z.string().optional(),
  website_url: z
    .string()
    .url('Ingresa una URL válida.')
    .optional()
    .or(z.literal('')),
  mission: z.string().optional(),
  vision: z.string().optional(),
  academy_category_id: z.string().optional(),
  is_public: z.boolean(),
  subscription_required: z.boolean(),
  monthly_price: z.string().optional(),
  annual_price: z.string().optional(),
})

type GeneralInfoValues = z.infer<typeof generalInfoSchema>

export function GeneralInfoForm() {
  const { academySlug } = useParams({ strict: false })
  const { currentAcademy } = useAuthStore()
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const logoInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)

  const { data: academy, isLoading: isLoadingAcademy } = useQuery({
    queryKey: ['academy', academySlug, 'full'],
    queryFn: () => academyService.getAcademyBySlug(academySlug!, 'full'),
    enabled: !!academySlug,
  })

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ['academy-categories', 'minimal'],
    queryFn: () => academyCategoryService.getCategories('minimal'),
  })

  const form = useForm<GeneralInfoValues>({
    resolver: zodResolver(generalInfoSchema),
    values: academy
      ? {
          name: academy.name,
          description: academy.description,
          slug: academy.slug,
          website_url: academy.website_url ?? '',
          mission: academy.mission ?? '',
          vision: academy.vision ?? '',
          academy_category_id: academy.academy_category
            ? String(academy.academy_category.id)
            : undefined,
          is_public: academy.is_public,
          subscription_required: academy.subscription_required,
          monthly_price: academy.monthly_price
            ? String(academy.monthly_price)
            : '0',
          annual_price: academy.annual_price
            ? String(academy.annual_price)
            : '0',
        }
      : undefined,
  })

  const mutation = useMutation({
    mutationFn: async (data: GeneralInfoValues) => {
      const academyId = currentAcademy?.id
      if (!academyId || !academySlug) throw new Error('Academy not found')

      if (logoFile || bannerFile) {
        const formData = new FormData()
        formData.append('academy[name]', data.name)
        formData.append('academy[description]', data.description)
        if (data.slug) formData.append('academy[slug]', data.slug)
        if (data.website_url)
          formData.append('academy[website_url]', data.website_url)
        if (data.mission) formData.append('academy[mission]', data.mission)
        if (data.vision) formData.append('academy[vision]', data.vision)
        if (data.academy_category_id)
          formData.append(
            'academy[academy_category_id]',
            data.academy_category_id
          )
        formData.append('academy[is_public]', String(data.is_public))
        formData.append(
          'academy[subscription_required]',
          String(data.subscription_required)
        )
        formData.append(
          'academy[monthly_price]',
          String(parseFloat(data.monthly_price ?? '0') || 0)
        )
        formData.append(
          'academy[annual_price]',
          String(parseFloat(data.annual_price ?? '0') || 0)
        )
        if (logoFile) formData.append('academy[logo]', logoFile)
        if (bannerFile) formData.append('academy[banner]', bannerFile)
        return academyService.updateAcademyWithFiles(academySlug, formData)
      }

      return academyService.updateAcademy(academySlug, {
        name: data.name,
        description: data.description,
        slug: data.slug,
        website_url: data.website_url,
        mission: data.mission,
        vision: data.vision,
        academy_category_id: data.academy_category_id
          ? Number(data.academy_category_id)
          : undefined,
        is_public: data.is_public,
        subscription_required: data.subscription_required,
        monthly_price: parseFloat(data.monthly_price ?? '0') || 0,
      })
    },
    onSuccess: () => {
      toast.success(t('academySettings.generalInfo.saveSuccess'))
      queryClient.invalidateQueries({ queryKey: ['academy', academySlug] })
      setLogoFile(null)
      setBannerFile(null)
      setLogoPreview(null)
      setBannerPreview(null)
    },
    onError: () => {
      toast.error(t('academySettings.generalInfo.saveError'))
    },
  })

  function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'logo' | 'banner'
  ) {
    const file = e.target.files?.[0]
    if (!file) return
    const preview = URL.createObjectURL(file)
    if (type === 'logo') {
      setLogoFile(file)
      setLogoPreview(preview)
    } else {
      setBannerFile(file)
      setBannerPreview(preview)
    }
  }

  if (isLoadingAcademy) {
    return (
      <div className='space-y-4'>
        <Skeleton className='h-10 w-full' />
        <Skeleton className='h-24 w-full' />
        <Skeleton className='h-10 w-full' />
        <Skeleton className='h-10 w-full' />
      </div>
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
        className='space-y-6'
      >
        {/* Name */}
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('academySettings.generalInfo.name')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('academySettings.generalInfo.namePlaceholder')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('academySettings.generalInfo.description')}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t(
                    'academySettings.generalInfo.descriptionPlaceholder'
                  )}
                  className='resize-none'
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Slug */}
        <FormField
          control={form.control}
          name='slug'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('academySettings.generalInfo.slug')}</FormLabel>
              <FormControl>
                <Input placeholder='mi-academia' {...field} />
              </FormControl>
              <FormDescription className='text-xs'>
                {t('academySettings.generalInfo.slugDescription', {
                  slug: field.value || 'slug',
                })}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Website URL */}
        <FormField
          control={form.control}
          name='website_url'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('academySettings.generalInfo.website')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t(
                    'academySettings.generalInfo.websitePlaceholder'
                  )}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category */}
        <FormField
          control={form.control}
          name='academy_category_id'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('academySettings.generalInfo.category')}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger disabled={isLoadingCategories}>
                    <SelectValue
                      placeholder={t(
                        'academySettings.generalInfo.categoryPlaceholder'
                      )}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        {/* Mission */}
        <FormField
          control={form.control}
          name='mission'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('academySettings.generalInfo.mission')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t(
                    'academySettings.generalInfo.missionPlaceholder'
                  )}
                  className='resize-none'
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Vision */}
        <FormField
          control={form.control}
          name='vision'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('academySettings.generalInfo.vision')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t(
                    'academySettings.generalInfo.visionPlaceholder'
                  )}
                  className='resize-none'
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        {/* Visibility */}
        <FormField
          control={form.control}
          name='is_public'
          render={({ field }) => (
            <FormItem className='flex items-center justify-between rounded-lg border p-4'>
              <div className='space-y-0.5'>
                <FormLabel>
                  {t('academySettings.generalInfo.isPublic')}
                </FormLabel>
                <FormDescription className='text-xs'>
                  {t('academySettings.generalInfo.isPublicDescription')}
                </FormDescription>
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

        {/* Subscription */}
        <FormField
          control={form.control}
          name='subscription_required'
          render={({ field }) => (
            <FormItem className='flex items-center justify-between rounded-lg border p-4'>
              <div className='space-y-0.5'>
                <FormLabel>
                  {t('academySettings.generalInfo.subscriptionRequired')}
                </FormLabel>
                <FormDescription className='text-xs'>
                  {t(
                    'academySettings.generalInfo.subscriptionRequiredDescription'
                  )}
                </FormDescription>
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

        {form.watch('subscription_required') && (
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <FormField
              control={form.control}
              name='monthly_price'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('academySettings.generalInfo.monthlyPrice')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      min={0}
                      step={0.01}
                      placeholder='0.00'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='annual_price'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('academySettings.generalInfo.annualPrice')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      min={0}
                      step={0.01}
                      placeholder='0.00'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <Separator />

        {/* Logo */}
        <div className='space-y-2'>
          <FormLabel>{t('academySettings.generalInfo.logo')}</FormLabel>
          {(logoPreview ?? academy?.logo_url) && (
            <img
              src={logoPreview ?? academy?.logo_url ?? ''}
              alt='Logo preview'
              className='h-16 w-16 rounded-lg border object-cover'
            />
          )}
          <input
            ref={logoInputRef}
            type='file'
            accept='image/*'
            className='hidden'
            onChange={(e) => handleFileChange(e, 'logo')}
          />
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => logoInputRef.current?.click()}
          >
            {academy?.logo_url
              ? t('academySettings.generalInfo.changeLogo')
              : t('academySettings.generalInfo.uploadLogo')}
          </Button>
          {logoFile && (
            <p className='text-muted-foreground text-xs'>{logoFile.name}</p>
          )}
        </div>

        {/* Banner */}
        <div className='space-y-2'>
          <FormLabel>{t('academySettings.generalInfo.banner')}</FormLabel>
          {(bannerPreview ?? academy?.banner_url) && (
            <img
              src={bannerPreview ?? academy?.banner_url ?? ''}
              alt='Banner preview'
              className='h-24 w-full max-w-sm rounded-lg border object-cover'
            />
          )}
          <input
            ref={bannerInputRef}
            type='file'
            accept='image/*'
            className='hidden'
            onChange={(e) => handleFileChange(e, 'banner')}
          />
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => bannerInputRef.current?.click()}
          >
            {academy?.banner_url
              ? t('academySettings.generalInfo.changeBanner')
              : t('academySettings.generalInfo.uploadBanner')}
          </Button>
          {bannerFile && (
            <p className='text-muted-foreground text-xs'>{bannerFile.name}</p>
          )}
        </div>

        <Button type='submit' disabled={mutation.isPending}>
          {mutation.isPending
            ? t('academySettings.generalInfo.saving')
            : t('academySettings.generalInfo.save')}
        </Button>
      </form>
    </Form>
  )
}
