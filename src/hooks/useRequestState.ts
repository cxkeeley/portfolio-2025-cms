import { Dispatch, SetStateAction, useMemo, useState } from 'react'

import { initialQueryState, Pagination, SearchState, SortDirectionEnum, SortState } from '@models/apiBase'

import { useQueryString } from '@modules/query-string/core/QueryStringProvider'

import FormUtil from '@/utils/formUtil'
import SearchParamsUtil from '@/utils/searchParamsUtil'

import { useFirstTimeEffect } from './useFirstTimeEffect'
import { useTableSorts } from './useTableSorts'

export type QueryState<Filter = unknown> = Omit<Pagination, 'total'> &
  SearchState &
  SortState & {
    filters?: Filter
  }

type Query<T = unknown> = Omit<QueryState, 'filters'> & T

type Request<T, Model> = {
  limit: number
  setLimit: Dispatch<SetStateAction<number>>
  page: number
  setPage: Dispatch<SetStateAction<number>>
  phrase?: string
  setPhrase: Dispatch<SetStateAction<string | undefined>>
  filters: T | undefined
  setFilters: Dispatch<SetStateAction<T | undefined>>
  sorts: Map<keyof Model, SortDirectionEnum>
  setSorts: Dispatch<SetStateAction<Map<keyof Model, SortDirectionEnum>>>
  toggleSort: (key: keyof Model) => void
  searchParams: QueryState<T>
  query: Query<T>
}

type Options = {
  withQueryString?: boolean
}

const SEARCH_PARAM_KEY = 'q'

const useRequestState = <Model = unknown, Filter extends Object = {}>(
  initialState?: QueryState<Filter>,
  options: Options = {
    withQueryString: true,
  }
): Request<Filter, Model> => {
  const { setSearchParam, getSearchParam } = useQueryString()

  const initialQuery = useMemo<QueryState<Filter>>(() => {
    if (options.withQueryString) {
      const params = getSearchParam(SEARCH_PARAM_KEY)
      if (params) {
        const parsedSearchParams = SearchParamsUtil.decode<Filter>(params)
        return {
          ...initialState,
          ...parsedSearchParams,
        }
      }
    }

    return {
      ...initialQueryState,
      ...initialState,
    }
  }, [getSearchParam, initialState, options.withQueryString])

  const [phrase, setPhrase] = useState<string | undefined>(initialQuery.phrase)
  const [limit, setLimit] = useState<number>(initialQuery.limit || 10)
  const [page, setPage] = useState<number>(initialQuery.page || 1)
  const [filters, setFilters] = useState<Filter | undefined>(initialQuery.filters)
  const { sorts, setSorts, parsedSorts, toggleSort } = useTableSorts<Model>(initialQuery.sorts)

  const searchParams = useMemo<QueryState<Filter>>(() => {
    return {
      limit,
      page,
      phrase,
      sorts: parsedSorts,
      filters,
    }
  }, [filters, limit, page, parsedSorts, phrase])

  // parse the current query to query that supported by the server
  const query = useMemo<Query<Filter>>(() => {
    const state = {
      limit,
      page,
      phrase: phrase === '' ? undefined : phrase,
      sorts: parsedSorts,
    } as Query<Filter>

    if (filters) {
      return {
        ...state,
        ...FormUtil.parseValues<Filter>(filters),
      }
    }

    return state
  }, [filters, limit, page, parsedSorts, phrase])

  useFirstTimeEffect(
    (firstTime) => {
      if (options.withQueryString && !firstTime) {
        setSearchParam(SEARCH_PARAM_KEY, SearchParamsUtil.encode(searchParams), {
          replace: true,
        })
      }
    },
    [searchParams, options.withQueryString, setSearchParam]
  )

  return {
    limit,
    setLimit,
    filters,
    setFilters,
    phrase,
    setPhrase,
    page,
    setPage,
    sorts,
    setSorts,
    toggleSort,
    searchParams,
    query,
  }
}

export { useRequestState }
