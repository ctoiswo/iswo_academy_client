import { useTranslation as useI18nTranslation } from 'react-i18next'
import { useLocaleStore } from '@/stores/locale-store'

/**
 * Hook personalizado para usar traducciones
 * Combina react-i18next con nuestro locale store
 */
export function useTranslation(namespace?: string) {
  const { t, i18n } = useI18nTranslation(namespace)
  const { locale, setLocale } = useLocaleStore()

  // Sincronizar i18next con locale store al montar
  if (i18n.language !== locale) {
    i18n.changeLanguage(locale)
  }

  return {
    t,
    i18n,
    locale,
    changeLanguage: setLocale,
  }
}
