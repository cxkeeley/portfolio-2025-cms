/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, FC, useCallback, useContext, useEffect } from 'react'
import { PropsWithChildren } from 'react'
import { NavigateOptions, useSearchParams } from 'react-router-dom'

import { useI18n } from '@modules/i18n/contexts/I18nContext'

type QueryStringContextProps = {
  searchParams: URLSearchParams
  setSearchParam: (key: string, value: string, options?: NavigateOptions) => void
  getSearchParam: (key: string) => string | null
  removeSearchParam: (key: string) => void
}

const initialSearchParamsState: QueryStringContextProps = {
  searchParams: new URLSearchParams(),
  setSearchParam: () => null,
  getSearchParam: () => null,
  removeSearchParam: () => null,
}

const QueryStringContext = createContext<QueryStringContextProps>(initialSearchParamsState)

const useQueryString = () => useContext(QueryStringContext)

const QueryStringProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { language } = useI18n()

  const setSearchParam = useCallback(
    (key: string, value: string, options?: NavigateOptions) => {
      searchParams.set(key, value)
      setSearchParams(searchParams, options)
    },
    [searchParams, setSearchParams]
  )

  const getSearchParam = useCallback(
    (key: string): string | null => {
      return searchParams.get(key)
    },
    [searchParams]
  )

  const removeSearchParam = useCallback(
    (key: string) => {
      return searchParams.delete(key)
    },
    [searchParams]
  )

  useEffect(() => {
    if (language) {
      searchParams.set('lang', language)
    }
    setSearchParams(searchParams, {
      replace: true,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, setSearchParams])

  return (
    <QueryStringContext.Provider
      value={{
        searchParams,
        setSearchParam,
        getSearchParam,
        removeSearchParam,
      }}
    >
      {children}
    </QueryStringContext.Provider>
  )
}

export { QueryStringProvider, useQueryString }
