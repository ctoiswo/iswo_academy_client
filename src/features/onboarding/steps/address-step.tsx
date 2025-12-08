import { useState, useEffect } from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import profileService from '@/services/profile-service'
import type { UserAddressRequest } from '@/types'
import { Loader2, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
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

const addressSchema = z.object({
  street: z
    .string()
    .min(1, 'La calle es requerida')
    .optional()
    .or(z.literal('')),
  city: z
    .string()
    .min(1, 'La ciudad es requerida')
    .optional()
    .or(z.literal('')),
  state: z.string().optional().or(z.literal('')),
  postal_code: z.string().optional().or(z.literal('')),
  country: z
    .string()
    .length(2, 'Código de país inválido (2 caracteres)')
    .optional()
    .or(z.literal('')),
  address_type: z.enum(['home', 'work', 'other']).optional(),
})

type AddressFormData = z.infer<typeof addressSchema>

interface AddressStepProps {
  onNext: () => void
  onBack: () => void
  onSkip: () => void
}

export function AddressStep({ onNext, onBack, onSkip }: AddressStepProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingData, setIsFetchingData] = useState(true)
  const [existingAddressId, setExistingAddressId] = useState<number | null>(
    null
  )

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'MX',
      address_type: 'home',
    },
  })

  // Load existing data if any
  useEffect(() => {
    const loadExistingData = async () => {
      try {
        const addresses = await profileService.getUserAddresses()
        if (addresses.length > 0) {
          // Get the primary address or the first one
          const primaryAddress =
            addresses.find((addr) => addr.is_primary) || addresses[0]
          setExistingAddressId(primaryAddress.id)
          form.reset({
            street: primaryAddress.street || '',
            city: primaryAddress.city || '',
            state: primaryAddress.state || '',
            postal_code: primaryAddress.postal_code || '',
            country: primaryAddress.country || 'MX',
            address_type: primaryAddress.address_type,
          })
        }
      } catch (_error) {
        // console.error('Error loading addresses:', error)
      } finally {
        setIsFetchingData(false)
      }
    }
    loadExistingData()
  }, [form])

  const onSubmit = async (data: AddressFormData) => {
    try {
      setIsLoading(true)

      // Check if user filled at least city
      const hasData = data.city && data.city.length > 0

      if (!hasData) {
        // No data provided, just skip
        onNext()
        return
      }

      const addressData: UserAddressRequest = {
        street: data.street || undefined,
        city: data.city || undefined,
        state: data.state || undefined,
        postal_code: data.postal_code || undefined,
        country: data.country || 'MX',
        address_type: data.address_type || 'home',
        is_primary: true,
      }

      if (existingAddressId) {
        await profileService.updateUserAddress(existingAddressId, addressData)
      } else {
        await profileService.createUserAddress(addressData)
      }

      toast.success('Dirección guardada')
      onNext()
    } catch (_error) {
      toast.error('Error al guardar la dirección')
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
          {/* Address Type */}
          <FormField
            control={form.control}
            name='address_type'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Dirección</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || 'home'}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Selecciona el tipo' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='home'>Casa</SelectItem>
                    <SelectItem value='work'>Trabajo</SelectItem>
                    <SelectItem value='other'>Otro</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Country */}
          <FormField
            control={form.control}
            name='country'
            render={({ field }) => (
              <FormItem>
                <FormLabel>País</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || 'MX'}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Selecciona el país' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='MX'>México</SelectItem>
                    <SelectItem value='US'>Estados Unidos</SelectItem>
                    <SelectItem value='CA'>Canadá</SelectItem>
                    <SelectItem value='ES'>España</SelectItem>
                    <SelectItem value='AR'>Argentina</SelectItem>
                    <SelectItem value='CO'>Colombia</SelectItem>
                    <SelectItem value='CL'>Chile</SelectItem>
                    <SelectItem value='PE'>Perú</SelectItem>
                    <SelectItem value='VE'>Venezuela</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Street */}
          <FormField
            control={form.control}
            name='street'
            render={({ field }) => (
              <FormItem className='md:col-span-2'>
                <FormLabel>Calle y Número</FormLabel>
                <FormControl>
                  <Input placeholder='Ej: Av. Principal 123' {...field} />
                </FormControl>
                <FormDescription>Opcional</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* City */}
          <FormField
            control={form.control}
            name='city'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ciudad</FormLabel>
                <FormControl>
                  <Input placeholder='Ej: Guadalajara' {...field} />
                </FormControl>
                <FormDescription>Opcional</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* State */}
          <FormField
            control={form.control}
            name='state'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado/Provincia</FormLabel>
                <FormControl>
                  <Input placeholder='Ej: Jalisco' {...field} />
                </FormControl>
                <FormDescription>Opcional</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Postal Code */}
          <FormField
            control={form.control}
            name='postal_code'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código Postal</FormLabel>
                <FormControl>
                  <Input placeholder='Ej: 44100' {...field} />
                </FormControl>
                <FormDescription>Opcional</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='flex justify-between pt-4'>
          <div className='flex gap-2'>
            <Button type='button' variant='outline' onClick={onBack}>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Atrás
            </Button>
            <Button type='button' variant='ghost' onClick={onSkip}>
              Saltar
            </Button>
          </div>
          <Button type='submit' disabled={isLoading}>
            {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Continuar
          </Button>
        </div>
      </form>
    </Form>
  )
}
