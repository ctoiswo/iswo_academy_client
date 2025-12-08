import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2 } from 'lucide-react'
import { useCreateCertificateTemplate } from '@/hooks/use-certificate-templates'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

const formSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  is_default: z.boolean().default(false),
  layout: z.enum(['portrait', 'landscape']),
  background_color: z.string().default('#ffffff'),
  border_style: z.string(),
  font_family: z.string(),
  logo_position: z.string(),
  signature_count: z.number().min(1).max(4),
  title: z.string().min(1, 'El título es requerido'),
  subtitle: z.string().optional(),
  body: z.string().min(1, 'El cuerpo es requerido'),
  footer: z.string().optional(),
  lessons_completion: z.number().min(0).max(100).optional(),
  minimum_score: z.number().min(0).max(100).optional(),
})

type FormValues = z.infer<typeof formSchema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  academySlug: string
}

export function CreateCertificateTemplateDialog({
  open,
  onOpenChange,
  academySlug,
}: Props) {
  const createTemplate = useCreateCertificateTemplate(academySlug)
  const [signatures, setSignatures] = useState([
    { title: 'Instructor', name_placeholder: '{{course_instructor}}' },
  ])
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null)
  const [logo, setLogo] = useState<File | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      is_default: false,
      layout: 'landscape',
      background_color: '#ffffff',
      border_style: 'classic',
      font_family: 'Georgia, serif',
      logo_position: 'top-center',
      signature_count: 1,
      title: 'Certificado de Finalización',
      subtitle: 'Se certifica que',
      body: '{{student_name}} ha completado exitosamente el curso {{course_title}} el {{completion_date}}',
      footer: 'Emitido por {{academy_name}}',
      lessons_completion: 100,
      minimum_score: 70,
    },
  })

  const onSubmit = async (values: FormValues) => {
    const data = {
      name: values.name,
      description: values.description,
      is_default: values.is_default,
      design: {
        layout: values.layout,
        background_color: values.background_color,
        border_style: values.border_style,
        font_family: values.font_family,
        logo_position: values.logo_position,
        signature_count: values.signature_count,
      },
      content: {
        title: values.title,
        subtitle: values.subtitle || '',
        body: values.body,
        footer: values.footer || '',
        signatures: signatures,
      },
      requirements: {
        lessons_completion: values.lessons_completion,
        minimum_score: values.minimum_score,
      },
      background_image: backgroundImage || undefined,
      logo: logo || undefined,
    }

    await createTemplate.mutateAsync(data)
    onOpenChange(false)
    form.reset()
    setSignatures([
      { title: 'Instructor', name_placeholder: '{{course_instructor}}' },
    ])
    setBackgroundImage(null)
    setLogo(null)
  }

  const addSignature = () => {
    if (signatures.length < 4) {
      setSignatures([...signatures, { title: '', name_placeholder: '' }])
      form.setValue('signature_count', signatures.length + 1)
    }
  }

  const removeSignature = (index: number) => {
    const newSignatures = signatures.filter((_, i) => i !== index)
    setSignatures(newSignatures)
    form.setValue('signature_count', newSignatures.length)
  }

  const updateSignature = (
    index: number,
    field: 'title' | 'name_placeholder',
    value: string
  ) => {
    const newSignatures = [...signatures]
    newSignatures[index][field] = value
    setSignatures(newSignatures)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] max-w-3xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Nueva Plantilla de Certificado</DialogTitle>
          <DialogDescription>
            Configura una nueva plantilla para generar certificados
            profesionales
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <Tabs defaultValue='basic' className='w-full'>
              <TabsList className='grid w-full grid-cols-4'>
                <TabsTrigger value='basic'>Básico</TabsTrigger>
                <TabsTrigger value='design'>Diseño</TabsTrigger>
                <TabsTrigger value='content'>Contenido</TabsTrigger>
                <TabsTrigger value='requirements'>Requisitos</TabsTrigger>
              </TabsList>

              <TabsContent value='basic' className='space-y-4'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre de la Plantilla</FormLabel>
                      <FormControl>
                        <Input placeholder='Certificado Estándar' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Describe cuándo usar esta plantilla...'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='is_default'
                  render={({ field }) => (
                    <FormItem className='flex items-center justify-between rounded-lg border p-4'>
                      <div className='space-y-0.5'>
                        <FormLabel className='text-base'>
                          Plantilla Predeterminada
                        </FormLabel>
                        <FormDescription>
                          Usar esta plantilla por defecto para nuevos
                          certificados
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
              </TabsContent>

              <TabsContent value='design' className='space-y-4'>
                <FormField
                  control={form.control}
                  name='layout'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Orientación</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='landscape'>
                            Horizontal (Landscape)
                          </SelectItem>
                          <SelectItem value='portrait'>
                            Vertical (Portrait)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Recomendado: Horizontal para mejor visualización
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='background_color'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color de Fondo</FormLabel>
                      <div className='flex gap-2'>
                        <FormControl>
                          <Input
                            type='color'
                            {...field}
                            className='h-10 w-20'
                          />
                        </FormControl>
                        <Input
                          value={field.value}
                          onChange={field.onChange}
                          placeholder='#ffffff'
                          className='flex-1'
                        />
                      </div>
                      <FormDescription>
                        Se recomienda usar fondo blanco (#ffffff) para mejor
                        impresión
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='border_style'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estilo de Borde</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='classic'>Clásico</SelectItem>
                          <SelectItem value='modern'>Moderno</SelectItem>
                          <SelectItem value='minimal'>Minimalista</SelectItem>
                          <SelectItem value='none'>Sin Borde</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='font_family'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fuente</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='Georgia, serif'>
                            Georgia (Serif)
                          </SelectItem>
                          <SelectItem value='Times New Roman, serif'>
                            Times New Roman
                          </SelectItem>
                          <SelectItem value='Arial, sans-serif'>
                            Arial (Sans-serif)
                          </SelectItem>
                          <SelectItem value='Helvetica, sans-serif'>
                            Helvetica
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='logo_position'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Posición del Logo</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='top-left'>
                            Arriba Izquierda
                          </SelectItem>
                          <SelectItem value='top-center'>
                            Arriba Centro
                          </SelectItem>
                          <SelectItem value='top-right'>
                            Arriba Derecha
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='space-y-4'>
                  <div>
                    <Label>Imagen de Fondo (Opcional)</Label>
                    <div className='mt-2'>
                      <Input
                        type='file'
                        accept='image/*'
                        onChange={(e) =>
                          setBackgroundImage(e.target.files?.[0] || null)
                        }
                      />
                      {backgroundImage && (
                        <p className='mt-1 text-sm text-gray-600'>
                          {backgroundImage.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label>Logo de la Academia (Opcional)</Label>
                    <div className='mt-2'>
                      <Input
                        type='file'
                        accept='image/*'
                        onChange={(e) => setLogo(e.target.files?.[0] || null)}
                      />
                      {logo && (
                        <p className='mt-1 text-sm text-gray-600'>
                          {logo.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value='content' className='space-y-4'>
                <FormField
                  control={form.control}
                  name='title'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Certificado de Finalización'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='subtitle'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtítulo</FormLabel>
                      <FormControl>
                        <Input placeholder='Se certifica que' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='body'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cuerpo del Certificado</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Usa placeholders como {{student_name}}, {{course_title}}, {{completion_date}}'
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Placeholders disponibles: {'{{student_name}}'},{' '}
                        {'{{course_title}}'},{'{{completion_date}}'},{' '}
                        {'{{academy_name}}'}, {'{{final_score}}'}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='footer'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pie de Página</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Emitido por {{academy_name}}'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <Label>Firmas ({signatures.length}/4)</Label>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={addSignature}
                      disabled={signatures.length >= 4}
                    >
                      <Plus className='mr-2 h-4 w-4' />
                      Agregar Firma
                    </Button>
                  </div>
                  {signatures.map((sig, index) => (
                    <div
                      key={index}
                      className='flex gap-2 rounded-lg border p-3'
                    >
                      <div className='flex-1 space-y-2'>
                        <Input
                          placeholder='Título (ej: Director)'
                          value={sig.title}
                          onChange={(e) =>
                            updateSignature(index, 'title', e.target.value)
                          }
                        />
                        <Input
                          placeholder='Nombre o placeholder (ej: {{course_instructor}})'
                          value={sig.name_placeholder}
                          onChange={(e) =>
                            updateSignature(
                              index,
                              'name_placeholder',
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        onClick={() => removeSignature(index)}
                        disabled={signatures.length === 1}
                      >
                        <Trash2 className='h-4 w-4 text-red-600' />
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value='requirements' className='space-y-4'>
                <div className='rounded-lg border border-blue-200 bg-blue-50 p-4'>
                  <p className='text-sm text-blue-800'>
                    Los estudiantes recibirán el certificado automáticamente
                    cuando cumplan estos requisitos.
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name='lessons_completion'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Porcentaje de Lecciones Completadas</FormLabel>
                      <FormControl>
                        <div className='flex items-center gap-2'>
                          <Input
                            type='number'
                            min={0}
                            max={100}
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                          <span className='text-gray-600'>%</span>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Porcentaje mínimo de lecciones que debe completar
                        (0-100)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='minimum_score'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Puntaje Mínimo</FormLabel>
                      <FormControl>
                        <div className='flex items-center gap-2'>
                          <Input
                            type='number'
                            min={0}
                            max={100}
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                          <span className='text-gray-600'>%</span>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Puntaje mínimo requerido en evaluaciones (0-100)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type='submit' disabled={createTemplate.isPending}>
                {createTemplate.isPending ? 'Creando...' : 'Crear Plantilla'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
