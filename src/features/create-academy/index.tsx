import { GraduationCap } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { CreateAcademyForm } from './components/create-academy-form'
import { Particles } from '@/components/ui/particles'

export function CreateAcademyPage() {
  const { t } = useTranslation()

  return (
    <main className='relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-background overflow-hidden'>
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
        className='pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-20 blur-[120px] rounded-full bg-primary'
        aria-hidden='true'
      />

      <div className='relative z-10 flex flex-col items-center gap-8 w-full max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl'>
        {/* Header */}
        <div className='flex flex-col items-center gap-3 text-center'>
          <div className='flex items-center justify-center size-14 rounded-2xl bg-primary/10 border border-primary/20'>
            <GraduationCap className='size-7 text-primary' />
          </div>
          <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance'>
            {t('createAcademy.title')}
          </h1>
          <p className='text-sm md:text-base text-muted-foreground max-w-md lg:max-w-lg leading-relaxed'>
            {t('createAcademy.subtitle')}
          </p>
        </div>

        {/* Wizard form */}
        <CreateAcademyForm />
      </div>
    </main>
  )
}