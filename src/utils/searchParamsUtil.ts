import { SortDirectionEnum, SortField } from '@models/apiBase'
import { Option } from '@models/option'

import { QueryState } from '@/hooks/useRequestState'

type RequestQuery<T = unknown> = {
  limit?: number
  sorts?: Array<Array<string>>
  page?: number
  phrase?: string
  filters?: T
}

interface ISearchParamsUtil {
  decode: <T>(query: string) => QueryState<T>

  encode: (query: QueryState) => string
}

const SearchParamsUtil: ISearchParamsUtil = {
  decode: <T>(query: string): QueryState<T> => {
    const parsed = JSON.parse(decodeURI(window.atob(query)))

    if (parsed.filters) {
      parsed.filters = Object.entries(parsed.filters).reduce((prev, [key, value]) => {
        if (key.startsWith('o:')) {
          const k = key.split(':')[1]
          if (Array.isArray(value) && Array.isArray(value[0])) {
            if (Array.isArray(value[0])) {
              prev[k] = value.map(
                (o) =>
                  new Option({
                    label: o[0],
                    value: o[1],
                    isFixed: o[2],
                    data: o[3],
                  })
              )
            }
          } else if (Array.isArray(value)) {
            prev[k] = new Option({
              label: value[0],
              value: value[1],
              isFixed: value[2],
              data: value[3],
            })
          }
        } else {
          prev[key] = value
        }
        return prev
      }, Object())
    }

    if (parsed.sorts && Array.isArray(parsed.sorts)) {
      parsed.sorts = parsed.sorts.map(
        (sort: Array<string>): SortField => ({
          field: sort[0],
          direction: sort[1] as SortDirectionEnum,
        })
      )
    }

    return parsed
  },

  encode: ({ sorts, filters, ...query }): string => {
    // limit, page, phrase
    const queryBag: RequestQuery = { ...query }

    // sorts
    if (sorts) {
      queryBag.sorts = sorts.map((sort) => [sort.field, sort.direction])
    }

    // filters
    if (filters instanceof Object) {
      queryBag.filters = Object.entries(filters).reduce((prev, [key, value]) => {
        if (value instanceof Option) {
          prev[`o:${key}`] = value.encodeValues()
        } else if (Array.isArray(value) && value[0] instanceof Option) {
          prev[`o:${key}`] = value.map((o) => o.encodeValues())
        } else {
          prev[key] = value
        }
        return prev
      }, Object())
    }

    return window.btoa(encodeURI(JSON.stringify(queryBag)))
  },
}

export default SearchParamsUtil
