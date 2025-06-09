import '@formatjs/intl-relativetimeformat/locale-data/en'
import '@formatjs/intl-relativetimeformat/locale-data/id'
import '@formatjs/intl-relativetimeformat/polyfill'
import { PropsWithChildren } from 'react'
import { FC, useCallback, useEffect, useState } from 'react'
import { IntlProvider } from 'react-intl'

import { I18nContext } from '@modules/i18n/contexts/I18nContext'
import { Language } from '@modules/i18n/models'

import enMessages from '@/i18n/en.json'
import idMessages from '@/i18n/id.json'
import dayjs from '@/libs/dayjs'
import StorageUtil, { StorageKeyEnum } from '@/utils/StorageUtil'

const allMessages = {
  en: enMessages,
  id: idMessages,
}

const I18nProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const searchParams = new URLSearchParams(window.location.search)
  const [lang, setLang] = useState<Language>(
    (searchParams.get('lang') as Language) || StorageUtil.get<Language>(StorageKeyEnum.I18N_CONFIG) || 'en'
  )
  const messages = allMessages[lang]

  const setLanguage = useCallback((nextLang: Language) => {
    setLang(nextLang)
    StorageUtil.set(StorageKeyEnum.I18N_CONFIG, nextLang)
    window.location.reload()
  }, [])

  useEffect(() => {
    StorageUtil.set(StorageKeyEnum.I18N_CONFIG, lang)
    dayjs.locale(lang)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const value = {
    language: lang,
    setLanguage,
  }

  return (
    <I18nContext.Provider value={value}>
      <IntlProvider
        locale={lang}
        messages={messages}
      >
        {children}
      </IntlProvider>
    </I18nContext.Provider>
  )
}

export { I18nProvider }
