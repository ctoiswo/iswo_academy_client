import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

export function CTASection() {
  const { t } = useTranslation()

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      variants={headerVariants}
      initial='hidden'
      animate='visible'
      className='mt-20 rounded-3xl border bg-slate-100 py-16 text-center dark:bg-slate-800'
    >
      <h2 className='text-foreground mb-4 text-3xl font-bold'>
        {t('academies.cta.title')}
      </h2>
      <p className='text-muted-foreground mx-auto mb-8 max-w-2xl text-xl'>
        {t('academies.cta.description')}
      </p>
      <Button size='lg' variant='default' className='px-8'>
        {t('academies.cta.button')}
      </Button>
    </motion.div>
  )
}
