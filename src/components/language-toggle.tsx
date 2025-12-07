import { Globe } from 'lucide-react'
import { useLocaleStore } from '@/stores/locale-store'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface LanguageToggleProps {
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
}

export function LanguageToggle({
  variant = 'ghost',
  size = 'icon',
  className,
}: LanguageToggleProps) {
  const { locale, setLocale } = useLocaleStore()

  const languages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
  ] as const

  const currentLanguage = languages.find((lang) => lang.code === locale)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn('relative', className)}
          aria-label='Cambiar idioma'
        >
          <Globe className='h-[1.2rem] w-[1.2rem]' />
          {currentLanguage && (
            <span className='absolute -right-0.5 -bottom-0.5 text-xs'>
              {currentLanguage.flag}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => setLocale(language.code)}
            className={cn(
              'cursor-pointer',
              locale === language.code && 'bg-accent'
            )}
          >
            <span className='mr-2 text-lg'>{language.flag}</span>
            <span>{language.name}</span>
            {locale === language.code && (
              <span className='text-muted-foreground ml-auto text-xs'>✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
