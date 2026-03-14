import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import authService from '@/services/auth-service'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { useTranslation } from '@/hooks/use-translation'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

const profileFormSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters.'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters.'),
  email: z.email('Please enter a valid email address.'),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export function ProfileForm() {
  const { user, setUser } = useAuthStore()
  const { t } = useTranslation()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      first_name: user?.first_name ?? '',
      last_name: user?.last_name ?? '',
      email: user?.email ?? '',
    },
    mode: 'onChange',
  })

  async function onSubmit(data: ProfileFormValues) {
    try {
      const updated = await authService.updateProfile(data)
      setUser(updated)
      toast.success(t('settings.profile.updateSuccess'))
    } catch {
      toast.error(t('settings.profile.updateError'))
    }
  }

  async function handleDeleteAccount() {
    try {
      await authService.deleteAccount()
      const { logout } = useAuthStore.getState()
      await logout()
    } catch {
      toast.error(t('settings.profile.dangerZone.error'))
    }
  }

  return (
    <div className='space-y-8'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <FormField
              control={form.control}
              name='first_name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('settings.profile.firstName')}</FormLabel>
                  <FormControl>
                    <Input placeholder='John' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='last_name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('settings.profile.lastName')}</FormLabel>
                  <FormControl>
                    <Input placeholder='Doe' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('settings.profile.email')}</FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='john@example.com'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit' disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? t('settings.profile.saving')
              : t('settings.profile.updateProfile')}
          </Button>
        </form>
      </Form>

      {!user?.is_super_admin && (
        <>
          <Separator />
          <div className='space-y-2'>
            <h3 className='text-destructive font-medium'>
              {t('settings.profile.dangerZone.title')}
            </h3>
            <p className='text-muted-foreground text-sm'>
              {t('settings.profile.dangerZone.description')}
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant='destructive' size='sm'>
                  {t('settings.profile.dangerZone.trigger')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {t('settings.profile.dangerZone.dialogTitle')}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('settings.profile.dangerZone.dialogDescription')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    {t('settings.profile.dangerZone.cancel')}
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                  >
                    {t('settings.profile.dangerZone.confirm')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </>
      )}
    </div>
  )
}
