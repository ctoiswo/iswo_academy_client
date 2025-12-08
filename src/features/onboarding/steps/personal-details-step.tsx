import { useState, useEffect } from 'react'
import * as z from 'zod'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import profileService, {
  type UserDetailInput,
} from '@/services/profile-service'
import { es } from 'date-fns/locale'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const personalDetailsSchema = z.object({
  birth_date: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  bio: z
    .string()
    .max(500, 'La biografía no puede exceder 500 caracteres')
    .optional()
    .nullable(),
  occupation: z.string().max(100).optional().nullable(),
  website_url: z
    .string()
    .url('URL inválida')
    .optional()
    .or(z.literal(''))
    .nullable(),
})

type PersonalDetailsFormData = z.infer<typeof personalDetailsSchema>

interface PersonalDetailsStepProps {
  onNext: () => void
  onSkip: () => void
}

export function PersonalDetailsStep({
  onNext,
  onSkip,
}: PersonalDetailsStepProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingData, setIsFetchingData] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()

  const form = useForm<PersonalDetailsFormData>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: {
      birth_date: null,
      gender: null,
      phone: null,
      bio: null,
      occupation: null,
      website_url: null,
    },
  })

  // Load existing data if any
  useEffect(() => {
    const loadExistingData = async () => {
      try {
        const userDetail = await profileService.getUserDetail()
        if (userDetail) {
          form.reset({
            birth_date: userDetail.birth_date,
            gender: userDetail.gender,
            phone: userDetail.phone,
            bio: userDetail.bio,
            occupation: userDetail.occupation,
            website_url: userDetail.website_url,
          })
          if (userDetail.birth_date) {
            setSelectedDate(new Date(userDetail.birth_date))
          }
        }
      } catch (_error) {
        // console.error('Error loading user details:', error)
      } finally {
        setIsFetchingData(false)
      }
    }
    loadExistingData()
  }, [form])

  const onSubmit = async (data: PersonalDetailsFormData) => {
    try {
      setIsLoading(true)

      // Convert empty strings to null
      const cleanData: UserDetailInput = {
        birth_date: data.birth_date || null,
        gender: data.gender || null,
        phone: data.phone || null,
        bio: data.bio || null,
        occupation: data.occupation || null,
        website_url: data.website_url || null,
      }

      // Try to update first, if not exists, create
      try {
        await profileService.updateUserDetail(cleanData)
      } catch (error: any) {
        if (error.response?.status === 404) {
          await profileService.createUserDetail(cleanData)
        } else {
          throw error
        }
      }

      toast.success('Detalles personales guardados')
      onNext()
    } catch (_error) {
      toast.error('Error al guardar los detalles')
      // console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetchingData) {
    return (
      <div className='flex items-center justify-center py-12'>
        <Loader2 className='text-muted-foreground h-8 w-8 animate-spin' />
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          {/* Birth Date */}
          <FormField
            control={form.control}
            name='birth_date'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>Fecha de Nacimiento</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant='outline'
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {selectedDate ? (
                          format(selectedDate, 'PPP', { locale: es })
                        ) : (
                          <span>Selecciona una fecha</span>
                        )}
                        <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                      mode='single'
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date)
                        field.onChange(date ? format(date, 'yyyy-MM-dd') : null)
                      }}
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>Opcional</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Gender */}
          <FormField
            control={form.control}
            name='gender'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Género</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Selecciona tu género' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='male'>Masculino</SelectItem>
                    <SelectItem value='female'>Femenino</SelectItem>
                    <SelectItem value='non_binary'>No binario</SelectItem>
                    <SelectItem value='prefer_not_to_say'>
                      Prefiero no decir
                    </SelectItem>
                    <SelectItem value='other'>Otro</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Opcional</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone */}
          <FormField
            control={form.control}
            name='phone'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input
                    placeholder='+52 123 456 7890'
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription>Opcional</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Occupation */}
          <FormField
            control={form.control}
            name='occupation'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ocupación</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Ej: Desarrollador, Estudiante, etc.'
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription>Opcional</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Website */}
          <FormField
            control={form.control}
            name='website_url'
            render={({ field }) => (
              <FormItem className='md:col-span-2'>
                <FormLabel>Sitio Web</FormLabel>
                <FormControl>
                  <Input
                    placeholder='https://tusitio.com'
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription>Opcional</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Bio */}
          <FormField
            control={form.control}
            name='bio'
            render={({ field }) => (
              <FormItem className='md:col-span-2'>
                <FormLabel>Biografía</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Cuéntanos un poco sobre ti...'
                    className='resize-none'
                    rows={4}
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription>
                  Máximo 500 caracteres ({field.value?.length || 0}/500)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='flex justify-between pt-4'>
          <Button type='button' variant='ghost' onClick={onSkip}>
            Saltar este paso
          </Button>
          <Button type='submit' disabled={isLoading}>
            {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Continuar
          </Button>
        </div>
      </form>
    </Form>
  )
}
