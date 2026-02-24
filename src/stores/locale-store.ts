import i18n from '@/i18n'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Locale = 'en' | 'es' | 'fr' | 'it'

interface LocaleState {
  locale: Locale
  setLocale: (locale: Locale) => void
}

/**
 * Store para manejar el idioma de la aplicación
 * Persiste en localStorage y se sincroniza con i18next y el backend
 */
export const useLocaleStore = create<LocaleState>()(
  persist(
    (set: (partial: Partial<LocaleState>) => void) => ({
      locale: 'es', // Default español

      setLocale: (locale: Locale) => {
        set({ locale })

        // Actualizar i18next
        i18n.changeLanguage(locale)

        // Actualizar el html lang attribute
        document.documentElement.lang = locale

        // Guardar en localStorage para i18next
        localStorage.setItem('i18nextLng', locale)
      },
    }),
    {
      name: 'iswo-locale-storage',
      onRehydrateStorage: () => (state: LocaleState | undefined) => {
        // Cuando se restaura del localStorage, sincronizar con i18next
        if (state?.locale) {
          i18n.changeLanguage(state.locale)
          document.documentElement.lang = state.locale
          localStorage.setItem('i18nextLng', state.locale)
        }
      },
    }
  )
)

/**
 * Get current locale outside of React components.
 * Use this in API clients, interceptors, etc. to avoid coupling
 * those modules to Zustand's internal persist storage format.
 */
export const getLocale = (): Locale => {
  return useLocaleStore.getState().locale
}
