import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import enTranslations from './locales/en.json'
import esTranslations from './locales/es.json'
import frTranslations from './locales/fr.json'
import itTranslations from './locales/it.json'

// Configuración de i18next
i18n
  // Detectar idioma del usuario
  .use(LanguageDetector)
  // Pasar instancia de i18n a react-i18next
  .use(initReactI18next)
  // Inicializar i18next
  .init({
    // Configurar traducciones
    resources: {
      es: { translation: esTranslations },
      en: { translation: enTranslations },
      fr: { translation: frTranslations },
      it: { translation: itTranslations },
    },

    // Idioma por defecto
    fallbackLng: 'es',

    // Idiomas soportados
    supportedLngs: ['es', 'en', 'fr', 'it'],

    // Configuración del detector de idioma
    detection: {
      // Orden de detección: localStorage > navegador
      order: ['localStorage', 'navigator'],
      // Cache en localStorage
      caches: ['localStorage'],
      // Key para localStorage (debe coincidir con locale-store)
      lookupLocalStorage: 'i18nextLng',
    },

    // Debug en desarrollo
    debug: import.meta.env.DEV,

    // Interpolación
    interpolation: {
      escapeValue: false, // React ya escapa por defecto
    },

    // React specific
    react: {
      useSuspense: false, // Evitar suspense para mejor control
    },
  })

export default i18n
