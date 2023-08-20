import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '/src/lang/en'
import tw from '/src/lang/tw'
import zh from '/src/lang/zh'

const resources = {
    en: {
      translation: en
    },
    tw: {
      translation: tw
    },
    zh: {
      translation: zh
    }
  };

i18n
.use(initReactI18next)
.init({
  resources,
  lng: 'en',
  interpolation: {
    escapeValue: false
  }
})

export default i18n