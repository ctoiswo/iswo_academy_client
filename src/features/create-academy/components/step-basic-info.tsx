import type { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api-client'
import type { AcademyCategory } from '@/types'
import { GraduationCap, FileText, LayoutGrid } from 'lucide-react'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { CreateAcademyFormValues } from './create-academy-form'

interface StepBasicInfoProps {
  form: UseFormReturn<CreateAcademyFormValues>
}

export function StepBasicInfo({ form }: StepBasicInfoProps) {
  const { t } = useTranslation()
  const [categories, setCategories] = useState<AcademyCategory[]>([])

  useEffect(() => {
    apiClient
      .get('/academy_categories')
      .then((res) => setCategories(res.data?.data ?? res.data ?? []))
      .catch(() => setCategories([]))
  }, [])

  return (
    <div className='flex flex-col gap-6 animate-in fade-in-0 slide-in-from-right-4 duration-500'>
      <div className='flex flex-col gap-1.5'>
        <h2 className='text-2xl font-bold tracking-tight'>
          {t('createAcademy.steps.basicInfo')}
        </h2>
        <p className='text-sm text-muted-foreground leading-relaxed'>
          {t('createAcademy.formDescription')}
        </p>
      </div>

      <div className='flex flex-col gap-5'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-2'>
              <FormLabel className='flex items-center gap-1.5 text-sm text-foreground'>
                <GraduationCap className='size-4 text-primary' />
                {t('createAcademy.fields.name')}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t('createAcademy.fields.namePlaceholder')}
                  className='h-11 bg-secondary/50 border-border focus-visible:border-primary focus-visible:ring-primary/20 placeholder:text-muted-foreground/50 transition-all duration-300'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-2'>
              <FormLabel className='flex items-center gap-1.5 text-sm text-foreground'>
                <FileText className='size-4 text-primary' />
                {t('createAcademy.fields.description')}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t(
                    'createAcademy.fields.descriptionPlaceholder'
                  )}
                  rows={4}
                  className='bg-secondary/50 border-border focus-visible:border-primary focus-visible:ring-primary/20 placeholder:text-muted-foreground/50 resize-none transition-all duration-300'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='academy_category_id'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-2'>
              <FormLabel className='flex items-center gap-1.5 text-sm text-foreground'>
                <LayoutGrid className='size-4 text-primary' />
                {t('createAcademy.fields.category')}
              </FormLabel>
              <Select
                onValueChange={(val) => field.onChange(Number(val))}
                value={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger className='h-11 w-full bg-secondary/50 border-border focus-visible:border-primary focus-visible:ring-primary/20 transition-all duration-300'>
                    <SelectValue
                      placeholder={t(
                        'createAcademy.fields.categoryPlaceholder'
                      )}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className='bg-card border-border'>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
