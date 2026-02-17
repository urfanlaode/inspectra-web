import en from '@/locales/en.json'
import { localeService } from '@/shared/services/locale.service'
import { createI18n } from 'vue-i18n'

const messages = {
  en
}

export const locale = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages
})

const saved = localeService.get()
if (saved) {
  locale.global.locale.value = saved as any
}
