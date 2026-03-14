import { GraduationCap } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Particles } from '@/components/ui/particles'
import { CreateAcademyForm } from './components/create-academy-form'

export function CreateAcademyPage() {
  const { t } = useTranslation()

  return (
    <main className='bg-background relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-12 sm:px-6 lg:px-8'>
      {/* Particles background */}
      <Particles
        className='pointer-events-none fixed inset-0 z-0'
        quantity={120}
        staticity={50}
        ease={70}
        size={0.5}
        color={'#818cf8'}
      />

      {/* Subtle background grid */}
      <div
        className='pointer-events-none fixed inset-0 opacity-[0.03]'
        style={{
          backgroundImage:
            'linear-gradient(rgba(128,128,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(128,128,255,.15) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
        aria-hidden='true'
      />

      {/* Top glow */}
      <div
        className='bg-primary pointer-events-none fixed top-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full opacity-20 blur-[120px]'
        aria-hidden='true'
      />

      <div className='relative z-10 flex w-full max-w-lg flex-col items-center gap-8 md:max-w-xl lg:max-w-2xl xl:max-w-3xl'>
        {/* Header */}
        <div className='flex flex-col items-center gap-3 text-center'>
          <div className='bg-primary/10 border-primary/20 flex size-14 items-center justify-center rounded-2xl border'>
            <GraduationCap className='text-primary size-7' />
          </div>
          <h1 className='text-3xl font-bold tracking-tight text-balance md:text-4xl lg:text-5xl'>
            {t('createAcademy.title')}
          </h1>
          <p className='text-muted-foreground max-w-md text-sm leading-relaxed md:text-base lg:max-w-lg'>
            {t('createAcademy.subtitle')}
          </p>
        </div>

        {/* Wizard form */}
        <CreateAcademyForm />
      </div>
    </main>
  )
}
