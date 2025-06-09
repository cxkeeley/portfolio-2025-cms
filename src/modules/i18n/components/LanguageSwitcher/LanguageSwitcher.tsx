/* eslint-disable jsx-a11y/anchor-is-valid */
import clsx from 'clsx'
import { FC } from 'react'

import { useI18n } from '@modules/i18n/contexts/I18nContext'
import { Language } from '@modules/i18n/models'
import { useQueryString } from '@modules/query-string/core/QueryStringProvider'

import PathUtil from '@/utils/pathUtil'

type LanguageProps = {
  lang: Language
  name: string
  flagIcon: string
}

const languages: Array<LanguageProps> = [
  {
    lang: 'en',
    name: 'English',
    flagIcon: PathUtil.toAbsoluteURL('/media/flags/united-states.svg'),
  },
  {
    lang: 'id',
    name: 'Indonesia',
    flagIcon: PathUtil.toAbsoluteURL('/media/flags/indonesia.svg'),
  },
]

const LanguageSwitcher: FC = () => {
  const { language, setLanguage } = useI18n()
  const { setSearchParam } = useQueryString()
  const currentLanguage = languages.find((x) => x.lang === language)

  const handleClick = (nextLang: Language) => {
    setSearchParam('lang', nextLang)
    setLanguage(nextLang)
  }

  return (
    <div
      className="menu-item px-5"
      data-kt-menu-trigger="hover"
      data-kt-menu-placement="left-start"
      data-kt-menu-flip="bottom"
    >
      <a
        href="#"
        className="menu-link px-5"
      >
        <span className="menu-title position-relative">
          Language
          <span className="fs-8 rounded bg-light px-3 py-2 position-absolute translate-middle-y top-50 end-0">
            {currentLanguage?.name}
            <img
              className="w-15px h-15px rounded-1 ms-2"
              src={currentLanguage?.flagIcon}
              alt="metronic"
            />
          </span>
        </span>
      </a>

      <div className="menu-sub menu-sub-dropdown w-175px fs-base py-4">
        {languages.map((l) => (
          <div
            key={l.lang}
            className="menu-item px-3"
          >
            <a
              href="#"
              onClick={() => handleClick(l.lang)}
              className={clsx('menu-link d-flex px-5', {
                active: l.lang === currentLanguage?.lang,
              })}
            >
              <span className="symbol symbol-20px me-4">
                <img
                  className="rounded-1"
                  src={l.flagIcon}
                  alt="metronic"
                />
              </span>
              <div className="menu-text">{l.name}</div>
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

export { LanguageSwitcher }
