import { Dispatch, SetStateAction, useMemo, useState } from 'react'

import { SortDirectionEnum, SortField } from '@models/apiBase'

type SortFields<T> = Map<keyof T, SortDirectionEnum>

type TableSorts<T> = {
  sorts: SortFields<T>
  setSorts: Dispatch<SetStateAction<SortFields<T>>>
  parsedSorts: Array<SortField>
  toggleSort: (key: keyof T) => void
}

const useTableSorts = <T = unknown>(initialSorts?: Array<SortField>): TableSorts<T> => {
  const [sorts, setSorts] = useState<SortFields<T>>(() => {
    const newMap = new Map<keyof T, SortDirectionEnum>()
    if (initialSorts) {
      initialSorts.forEach((sort) => {
        newMap.set(sort.field as keyof T, sort.direction)
      })
    }
    return newMap
  })

  const toggleSort = (key: keyof T) => {
    setSorts((prev) => {
      const copy = new Map(prev)

      if (copy.get(key) === SortDirectionEnum.ASC) {
        copy.set(key, SortDirectionEnum.DESC)
      } else if (copy.get(key) === SortDirectionEnum.DESC) {
        copy.delete(key)
      } else {
        copy.set(key, SortDirectionEnum.ASC)
      }

      return copy
    })
  }

  const parsedSorts = useMemo<Array<SortField>>(() => {
    const srts: Array<SortField> = []

    sorts.forEach((direction, field) => {
      srts.push({
        field: field.toString(),
        direction,
      })
    })

    return srts
  }, [sorts])

  return {
    sorts,
    setSorts,
    parsedSorts,
    toggleSort,
  }
}

export { useTableSorts }
