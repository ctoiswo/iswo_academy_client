import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import profileService from '@/services/profile-service'
import type { UserDetail, UserAddress, SocialNetwork } from '@/types'
import { es } from 'date-fns/locale'
import {
  Loader2,
  ArrowLeft,
  CheckCircle2,
  User,
  MapPin,
  Share2,
} from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ReviewStepProps {
  onComplete: () => void
  onBack: () => void
  isSubmitting: boolean
}

const platformLabels: Record<string, string> = {
  facebook: 'Facebook',
  twitter: 'Twitter/X',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  github: 'GitHub',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  twitch: 'Twitch',
  discord: 'Discord',
  telegram: 'Telegram',
  whatsapp: 'WhatsApp',
  other: 'Otro',
}

export function ReviewStep({
  onComplete,
  onBack,
  isSubmitting,
}: ReviewStepProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null)
  const [addresses, setAddresses] = useState<UserAddress[]>([])
  const [socialNetworks, setSocialNetworks] = useState<SocialNetwork[]>([])
  const { user } = useAuthStore()

  useEffect(() => {
    const loadData = async () => {
      try {
        const [detail, addrs, socials] = await Promise.all([
          profileService.getUserDetail(),
          profileService.getUserAddresses(),
          profileService.getSocialNetworks(),
        ])
        setUserDetail(detail)
        setAddresses(addrs)
        setSocialNetworks(socials)
      } catch (_error) {
        // console.error('Error loading profile data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <Loader2 className='text-muted-foreground h-8 w-8 animate-spin' />
      </div>
    )
  }

  const hasPersonalDetails = userDetail !== null
  const hasAddress = addresses.length > 0
  const hasSocialNetworks = socialNetworks.length > 0
  const completionCount = [
    hasPersonalDetails,
    hasAddress,
    hasSocialNetworks,
  ].filter(Boolean).length
  const completionPercentage = (completionCount / 3) * 100

  return (
    <div className='space-y-6'>
      {/* Summary Card */}
      <Card className='border-primary/20 bg-primary/5'>
        <CardContent className='pt-6'>
          <div className='mb-4 flex items-center justify-between'>
            <div>
              <h3 className='text-lg font-semibold'>Estado de tu Perfil</h3>
              <p className='text-muted-foreground text-sm'>
                Has completado {completionCount} de 3 secciones
              </p>
            </div>
            <Badge
              variant={completionCount === 3 ? 'default' : 'secondary'}
              className='px-4 py-2 text-lg'
            >
              {Math.round(completionPercentage)}%
            </Badge>
          </div>
          <div className='flex gap-4'>
            <div
              className={`flex items-center gap-2 ${hasPersonalDetails ? 'text-green-600' : 'text-muted-foreground'}`}
            >
              <CheckCircle2 className='h-4 w-4' />
              <span className='text-sm'>Detalles Personales</span>
            </div>
            <div
              className={`flex items-center gap-2 ${hasAddress ? 'text-green-600' : 'text-muted-foreground'}`}
            >
              <CheckCircle2 className='h-4 w-4' />
              <span className='text-sm'>Dirección</span>
            </div>
            <div
              className={`flex items-center gap-2 ${hasSocialNetworks ? 'text-green-600' : 'text-muted-foreground'}`}
            >
              <CheckCircle2 className='h-4 w-4' />
              <span className='text-sm'>Redes Sociales</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Info */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <User className='text-primary h-5 w-5' />
              <CardTitle>Información de Usuario</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className='space-y-3'>
          <div className='grid grid-cols-2 gap-4 text-sm'>
            <div>
              <p className='text-muted-foreground'>Nombre</p>
              <p className='font-medium'>{user?.full_name}</p>
            </div>
            <div>
              <p className='text-muted-foreground'>Email</p>
              <p className='font-medium'>{user?.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Details */}
      {userDetail && (
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <User className='text-primary h-5 w-5' />
                <CardTitle>Detalles Personales</CardTitle>
              </div>
              <Badge variant='outline'>Completado</Badge>
            </div>
          </CardHeader>
          <CardContent className='space-y-3'>
            {userDetail.birth_date && (
              <div>
                <p className='text-muted-foreground text-sm'>
                  Fecha de Nacimiento
                </p>
                <p className='font-medium'>
                  {format(new Date(userDetail.birth_date), 'PPP', {
                    locale: es,
                  })}
                </p>
              </div>
            )}
            {userDetail.gender && (
              <div>
                <p className='text-muted-foreground text-sm'>Género</p>
                <p className='font-medium capitalize'>{userDetail.gender}</p>
              </div>
            )}
            {userDetail.phone && (
              <div>
                <p className='text-muted-foreground text-sm'>Teléfono</p>
                <p className='font-medium'>{userDetail.phone}</p>
              </div>
            )}
            {userDetail.occupation && (
              <div>
                <p className='text-muted-foreground text-sm'>Ocupación</p>
                <p className='font-medium'>{userDetail.occupation}</p>
              </div>
            )}
            {userDetail.website_url && (
              <div>
                <p className='text-muted-foreground text-sm'>Sitio Web</p>
                <p className='text-primary font-medium'>
                  <a
                    href={userDetail.website_url}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {userDetail.website_url}
                  </a>
                </p>
              </div>
            )}
            {userDetail.bio && (
              <div>
                <p className='text-muted-foreground text-sm'>Biografía</p>
                <p className='text-sm'>{userDetail.bio}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Address */}
      {addresses.length > 0 && (
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <MapPin className='text-primary h-5 w-5' />
                <CardTitle>Dirección</CardTitle>
              </div>
              <Badge variant='outline'>Completado</Badge>
            </div>
          </CardHeader>
          <CardContent className='space-y-4'>
            {addresses.map((address) => (
              <div key={address.id} className='space-y-2'>
                {address.is_primary && (
                  <Badge variant='secondary'>Principal</Badge>
                )}
                <div className='space-y-1'>
                  {address.street && (
                    <p className='font-medium'>{address.street}</p>
                  )}
                  <p className='text-muted-foreground text-sm'>
                    {[address.city, address.state, address.postal_code]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                  {address.country && (
                    <p className='text-muted-foreground text-sm'>
                      {address.country}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Social Networks */}
      {socialNetworks.length > 0 && (
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <Share2 className='text-primary h-5 w-5' />
                <CardTitle>Redes Sociales</CardTitle>
              </div>
              <Badge variant='outline'>Completado</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              {socialNetworks.map((social) => (
                <div
                  key={social.id}
                  className='flex items-center justify-between rounded-lg border p-2'
                >
                  <div className='flex items-center gap-3'>
                    <Badge variant='secondary'>
                      {platformLabels[social.platform]}
                    </Badge>
                    {social.username && (
                      <span className='text-muted-foreground text-sm'>
                        @{social.username}
                      </span>
                    )}
                  </div>
                  <a
                    href={social.profile_url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-primary text-sm hover:underline'
                  >
                    Ver perfil →
                  </a>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className='flex justify-between pt-4'>
        <Button type='button' variant='outline' onClick={onBack}>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Atrás
        </Button>
        <Button onClick={onComplete} disabled={isSubmitting} size='lg'>
          {isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          <CheckCircle2 className='mr-2 h-4 w-4' />
          Completar Perfil
        </Button>
      </div>
    </div>
  )
}
