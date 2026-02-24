import { Link } from '@tanstack/react-router'
import { Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AcademyCta() {
  return (
    <section className='relative py-24 overflow-hidden'>
      {/* Background glow */}
      <div className='absolute inset-0 -z-10 pointer-events-none'>
        <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[100px]' />
      </div>

      <div className='max-w-7xl mx-auto px-4 lg:px-8'>
        <div className='relative rounded-2xl border border-primary/20 bg-card/60 backdrop-blur-sm overflow-hidden px-8 sm:px-16 py-16 sm:py-20 flex flex-col items-center gap-8 text-center'>
          {/* Decorative corner glows */}
          <div className='absolute top-0 left-0 w-64 h-64 rounded-full bg-primary/5 blur-[80px] pointer-events-none' />
          <div className='absolute bottom-0 right-0 w-64 h-64 rounded-full bg-primary/5 blur-[80px] pointer-events-none' />

          <div className='relative z-10 flex flex-col items-center gap-6'>
            <div className='flex items-center justify-center size-14 rounded-xl bg-primary/10 border border-primary/20'>
              <Zap className='size-7 text-primary' />
            </div>

            <div className='flex flex-col items-center gap-3'>
              <h2
                className='text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight text-balance'
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                No esperes mas.
                <br />
                <span className='bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent'>
                  Empieza hoy gratis.
                </span>
              </h2>

              <p className='text-sm sm:text-base text-muted-foreground max-w-lg leading-relaxed'>
                Unete a mas de 120 academias que ya estan transformando vidas y generando ingresos
                con ISWO Academy. Sin comisiones ocultas, sin contratos, sin riesgos.
              </p>
            </div>

            <div className='flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto'>
              <Button asChild size='lg' className='w-full sm:w-auto gap-2 px-8'>
                <Link to='/sign-in'>
                  <Zap className='size-4' />
                  Crear mi academia gratis
                </Link>
              </Button>
              <Button asChild size='lg' variant='outline' className='w-full sm:w-auto px-8'>
                <a href='#precios'>Comparar planes</a>
              </Button>
            </div>

            <p className='text-xs text-muted-foreground'>
              Sin tarjeta de credito · Prueba gratuita 14 dias · Cancela cuando quieras
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
