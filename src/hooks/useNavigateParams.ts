import { createSearchParams, useNavigate } from 'react-router-dom'

import { useI18n } from '@modules/i18n/contexts/I18nContext'

const useNavigateParams = () => {
  const navigate = useNavigate()
  const { language } = useI18n()

  return (pathname: string, params?: URLSearchParams) => {
    const searchParams = params || new URLSearchParams()
    searchParams.append('lang', language)

    const path = {
      pathname,
      search: createSearchParams(searchParams).toString(),
    }

    navigate(path)
  }
}

export { useNavigateParams }
