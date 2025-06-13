import { setDefaultOptions, format as dateFormat } from "date-fns"
import { enUS, id } from "date-fns/locale"
import { create } from "zustand"

// Available locales
export const locales = {
  enUS,
  id,
}

export type LocaleKey = keyof typeof locales

// Set default locale
setDefaultOptions({ locale: id })

// Create a store to manage locale state
interface LocaleState {
  currentLocale: LocaleKey
  setLocale: (locale: LocaleKey) => void
}

export const useLocaleStore = create<LocaleState>((set) => ({
  currentLocale: "id",
  setLocale: (locale) => {
    setDefaultOptions({ locale: locales[locale] })
    set({ currentLocale: locale })
  },
}))

// Helper function to get the current locale object
export function getCurrentLocale() {
  const currentLocale = useLocaleStore.getState().currentLocale
  return locales[currentLocale]
}

// Helper function to format dates with the current locale
export function formatWithLocale(date: Date | number, formatStr: string) {
  return dateFormat(date, formatStr, { locale: getCurrentLocale() })
}
