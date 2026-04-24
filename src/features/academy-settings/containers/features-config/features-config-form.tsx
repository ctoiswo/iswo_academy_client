import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import academyConfigurationService from '@/services/academy-configuration-service'
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
} from '@/components/ui/form'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'

const featuresSchema = z.object({
  enable_certificates: z.boolean(),
  enable_discussions: z.boolean(),
  enable_progress_tracking: z.boolean(),
  enable_gamification: z.boolean(),
})

type FeaturesValues = z.infer<typeof featuresSchema>

export function FeaturesConfigForm() {
  const { currentAcademy } = useAuthStore()
  const academyId = currentAcademy?.id
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const featureItems: {
    name: keyof FeaturesValues
    labelKey: string
    descriptionKey: string
  }[] = [
    {
      name: 'enable_gamification',
      labelKey: 'academySettings.features.gamification',
      descriptionKey: 'academySettings.features.gamificationDescription',
    },
    {
      name: 'enable_certificates',
      labelKey: 'academySettings.features.certificates',
      descriptionKey: 'academySettings.features.certificatesDescription',
    },
    {
      name: 'enable_discussions',
      labelKey: 'academySettings.features.discussions',
      descriptionKey: 'academySettings.features.discussionsDescription',
    },
    {
      name: 'enable_progress_tracking',
      labelKey: 'academySettings.features.progressTracking',
      descriptionKey: 'academySettings.features.progressTrackingDescription',
    },
  ]

  const { data: config, isLoading } = useQuery({
    queryKey: ['academy-configuration', academyId],
    queryFn: () => academyConfigurationService.getConfiguration(academyId!),
    enabled: !!academyId,
  })

  const form = useForm<FeaturesValues>({
    resolver: zodResolver(featuresSchema),
    defaultValues: {
      enable_certificates: false,
      enable_discussions: false,
      enable_progress_tracking: false,
      enable_gamification: false,
    },
  })

  useEffect(() => {
    if (config) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const featuresConfig = config as any
      const features = featuresConfig.features || featuresConfig
      form.reset({
        enable_certificates: features.certificates ?? false,
        enable_discussions: features.discussions ?? false,
        enable_progress_tracking: features.progress_tracking ?? false,
        enable_gamification: features.gamification ?? false,
      })
    }
  }, [config, form])

  const mutation = useMutation({
    mutationFn: (data: FeaturesValues) =>
      academyConfigurationService.updateFeatures(academyId!, data),
    onSuccess: () => {
      toast.success(t('academySettings.features.saveSuccess'))
      queryClient.invalidateQueries({
        queryKey: ['academy-configuration', academyId],
      })
    },
    onError: () => {
      toast.error(t('academySettings.features.saveError'))
    },
  })

  if (isLoading) {
    return (
      <div className='space-y-4'>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className='h-16 w-full rounded-lg' />
        ))}
      </div>
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
        className='space-y-4'
      >
        {featureItems.map((item) => (
          <FormField
            key={item.name}
            control={form.control}
            name={item.name}
            render={({ field }) => (
              <FormItem className='flex items-center justify-between rounded-lg border p-4'>
                <div className='space-y-0.5'>
                  <FormLabel>{t(item.labelKey)}</FormLabel>
                  <FormDescription className='text-xs'>
                    {t(item.descriptionKey)}
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
        ))}

        <Button type='submit' disabled={mutation.isPending}>
          {mutation.isPending
            ? t('academySettings.features.saving')
            : t('academySettings.features.save')}
        </Button>
      </form>
    </Form>
  )
}
