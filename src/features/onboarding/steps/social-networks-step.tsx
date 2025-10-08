import { useState, useEffect } from 'react'
import profileService, {
  type SocialNetworkInput,
  type SocialPlatform,
} from '@/services/profile-service'
import {
  Loader2,
  ArrowLeft,
  Plus,
  Trash2,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Youtube,
  Globe,
} from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

interface SocialNetworkForm {
  id?: number
  platform: SocialPlatform
  username: string
  profile_url: string
  is_public: boolean
}

const platformIcons: Record<SocialPlatform, React.ElementType> = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  github: Github,
  youtube: Youtube,
  tiktok: Globe,
  twitch: Globe,
  discord: Globe,
  telegram: Globe,
  whatsapp: Globe,
  other: Globe,
}

const platformLabels: Record<SocialPlatform, string> = {
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

interface SocialNetworksStepProps {
  onNext: () => void
  onBack: () => void
  onSkip: () => void
}

export function SocialNetworksStep({
  onNext,
  onBack,
  onSkip,
}: SocialNetworksStepProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingData, setIsFetchingData] = useState(true)
  const [socialNetworks, setSocialNetworks] = useState<SocialNetworkForm[]>([])
  const [existingIds, setExistingIds] = useState<Set<number>>(new Set())

  // Load existing data
  useEffect(() => {
    const loadExistingData = async () => {
      try {
        const networks = await profileService.getSocialNetworks()
        if (networks.length > 0) {
          setSocialNetworks(
            networks.map((net) => ({
              id: net.id,
              platform: net.platform,
              username: net.username || '',
              profile_url: net.profile_url,
              is_public: net.is_public,
            }))
          )
          setExistingIds(new Set(networks.map((n) => n.id)))
        }
      } catch (error) {
        console.error('Error loading social networks:', error)
      } finally {
        setIsFetchingData(false)
      }
    }
    loadExistingData()
  }, [])

  const addSocialNetwork = () => {
    setSocialNetworks([
      ...socialNetworks,
      {
        platform: 'twitter',
        username: '',
        profile_url: '',
        is_public: true,
      },
    ])
  }

  const removeSocialNetwork = async (index: number) => {
    const network = socialNetworks[index]
    if (network.id && existingIds.has(network.id)) {
      try {
        await profileService.deleteSocialNetwork(network.id)
        toast.success('Red social eliminada')
      } catch (error) {
        toast.error('Error al eliminar la red social')
        return
      }
    }
    setSocialNetworks(socialNetworks.filter((_, i) => i !== index))
  }

  const updateSocialNetwork = (
    index: number,
    field: keyof SocialNetworkForm,
    value: any
  ) => {
    const updated = [...socialNetworks]
    updated[index] = { ...updated[index], [field]: value }
    setSocialNetworks(updated)
  }

  const handleSubmit = async () => {
    try {
      setIsLoading(true)

      // Filter out empty entries
      const validNetworks = socialNetworks.filter(
        (net) => net.profile_url.trim().length > 0
      )

      // Save each network
      for (const network of validNetworks) {
        const data: SocialNetworkInput = {
          platform: network.platform,
          username: network.username || null,
          profile_url: network.profile_url,
          is_public: network.is_public,
        }

        if (network.id && existingIds.has(network.id)) {
          await profileService.updateSocialNetwork(network.id, data)
        } else {
          await profileService.createSocialNetwork(data)
        }
      }

      if (validNetworks.length > 0) {
        toast.success('Redes sociales guardadas')
      }
      onNext()
    } catch (error) {
      toast.error('Error al guardar las redes sociales')
      console.error(error)
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
    <div className='space-y-6'>
      {/* Social Networks List */}
      <div className='space-y-4'>
        {socialNetworks.length === 0 ? (
          <Card className='border-dashed p-8 text-center'>
            <p className='text-muted-foreground mb-4'>
              No has agregado ninguna red social todavía
            </p>
            <Button type='button' variant='outline' onClick={addSocialNetwork}>
              <Plus className='mr-2 h-4 w-4' />
              Agregar Red Social
            </Button>
          </Card>
        ) : (
          socialNetworks.map((network, index) => {
            const Icon = platformIcons[network.platform]
            return (
              <Card key={index} className='p-4'>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <Icon className='text-muted-foreground h-5 w-5' />
                      <Badge variant='secondary'>
                        {platformLabels[network.platform]}
                      </Badge>
                    </div>
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      onClick={() => removeSocialNetwork(index)}
                    >
                      <Trash2 className='text-destructive h-4 w-4' />
                    </Button>
                  </div>

                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    {/* Platform */}
                    <div className='space-y-2'>
                      <Label>Plataforma</Label>
                      <Select
                        value={network.platform}
                        onValueChange={(value) =>
                          updateSocialNetwork(
                            index,
                            'platform',
                            value as SocialPlatform
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(platformLabels).map(
                            ([key, label]) => (
                              <SelectItem key={key} value={key}>
                                {label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Username */}
                    <div className='space-y-2'>
                      <Label>Usuario (opcional)</Label>
                      <Input
                        placeholder='@usuario'
                        value={network.username}
                        onChange={(e) =>
                          updateSocialNetwork(index, 'username', e.target.value)
                        }
                      />
                    </div>

                    {/* Profile URL */}
                    <div className='space-y-2 md:col-span-2'>
                      <Label>URL del Perfil</Label>
                      <Input
                        placeholder='https://ejemplo.com/tuperfil'
                        value={network.profile_url}
                        onChange={(e) =>
                          updateSocialNetwork(
                            index,
                            'profile_url',
                            e.target.value
                          )
                        }
                      />
                    </div>

                    {/* Is Public */}
                    <div className='flex items-center justify-between md:col-span-2'>
                      <Label htmlFor={`public-${index}`}>Perfil público</Label>
                      <Switch
                        id={`public-${index}`}
                        checked={network.is_public}
                        onCheckedChange={(checked) =>
                          updateSocialNetwork(index, 'is_public', checked)
                        }
                      />
                    </div>
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>

      {/* Add Button */}
      {socialNetworks.length > 0 && (
        <Button
          type='button'
          variant='outline'
          onClick={addSocialNetwork}
          className='w-full'
        >
          <Plus className='mr-2 h-4 w-4' />
          Agregar Otra Red Social
        </Button>
      )}

      {/* Actions */}
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
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          Continuar
        </Button>
      </div>
    </div>
  )
}
