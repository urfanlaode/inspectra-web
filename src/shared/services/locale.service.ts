const LOCALE = 'locale'

export const localeService = {
  get: () => {
    return localStorage.getItem(LOCALE || 'en')
  },

  set: (lang: string) => {
    localStorage.setItem(LOCALE, lang)
  }
}
