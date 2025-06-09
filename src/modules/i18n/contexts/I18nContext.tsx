import { createContext, useContext } from 'react'

import { Language } from '../models'

export type I18nContextProps = {
  language: Language
  setLanguage: (lang: Language) => void
}

const I18nContext = createContext<I18nContextProps>({
  language: 'id',
  setLanguage: () => {},
})

const useI18n = () => useContext(I18nContext)

export { I18nContext, useI18n }
