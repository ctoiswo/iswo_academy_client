import { useState } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface DemoDialogProps {
  trigger: React.ReactNode
  idPrefix?: string
}

export function DemoDialog({ trigger, idPrefix = '' }: DemoDialogProps) {
  const [demoFormData, setDemoFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
  })
  const [isSubmittingDemo, setIsSubmittingDemo] = useState(false)
  const [demoSubmitted, setDemoSubmitted] = useState(false)

  const handleDemoFormChange = (field: string, value: string) => {
    setDemoFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingDemo(true)

    // Simulate API call - in real implementation, this would call the backend
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setDemoSubmitted(true)
    setIsSubmittingDemo(false)

    // Reset form after 3 seconds
    setTimeout(() => {
      setDemoSubmitted(false)
      setDemoFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        message: '',
      })
    }, 3000)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Solicitar una Demo</DialogTitle>
          <DialogDescription>
            Obtén una demostración personalizada de ISWO Academy y descubre cómo
            puede transformar tu negocio educativo.
          </DialogDescription>
        </DialogHeader>
        {demoSubmitted ? (
          <div className='py-6 text-center'>
            <Check className='mx-auto mb-4 h-12 w-12 text-green-500' />
            <h3 className='mb-2 text-lg font-semibold'>
              ¡Solicitud de Demo Enviada!
            </h3>
            <p className='text-muted-foreground'>
              Gracias por tu interés. Nuestro equipo se pondrá en contacto
              contigo en las próximas 24 horas para programar tu demostración
              personalizada.
            </p>
          </div>
        ) : (
          <form onSubmit={handleDemoSubmit} className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor={`${idPrefix}demo-name`}>Nombre *</Label>
                <Input
                  id={`${idPrefix}demo-name`}
                  value={demoFormData.name}
                  onChange={(e) => handleDemoFormChange('name', e.target.value)}
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor={`${idPrefix}demo-email`}>Email *</Label>
                <Input
                  id={`${idPrefix}demo-email`}
                  type='email'
                  value={demoFormData.email}
                  onChange={(e) =>
                    handleDemoFormChange('email', e.target.value)
                  }
                  required
                />
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor={`${idPrefix}demo-company`}>Empresa</Label>
                <Input
                  id={`${idPrefix}demo-company`}
                  value={demoFormData.company}
                  onChange={(e) =>
                    handleDemoFormChange('company', e.target.value)
                  }
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor={`${idPrefix}demo-phone`}>Teléfono</Label>
                <Input
                  id={`${idPrefix}demo-phone`}
                  type='tel'
                  value={demoFormData.phone}
                  onChange={(e) =>
                    handleDemoFormChange('phone', e.target.value)
                  }
                />
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor={`${idPrefix}demo-message`}>
                Cuéntanos sobre tus necesidades
              </Label>
              <Textarea
                id={`${idPrefix}demo-message`}
                placeholder='¿Qué tipo de academia buscas crear? ¿Cuántos estudiantes esperas?'
                value={demoFormData.message}
                onChange={(e) =>
                  handleDemoFormChange('message', e.target.value)
                }
                rows={3}
              />
            </div>
            <Button
              type='submit'
              className='w-full'
              disabled={isSubmittingDemo}
            >
              {isSubmittingDemo ? 'Enviando...' : 'Solicitar Demo'}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
