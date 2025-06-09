import { Dispatch, SetStateAction, useState } from 'react'

export type MatchFN<T> = (x: T, item: T) => boolean

export type ListStateReturnType<T> = {
  list: Array<T>
  setList: Dispatch<SetStateAction<Array<T>>>
  isEmpty: () => boolean
  add: (item: T) => void
  addAtIndex: (index: number, item: T) => void
  update: (item: T, matchFn: MatchFN<T>) => void
  updateAtIndex: (index: number, item: T) => void
  remove: (item: T, matchFn: MatchFN<T>) => void
  removeAtIndex: (index: number) => void
  clear: () => void
}

const DEFAULT_MATCH_FN = <T>(x: T, y: T) => x === y

const useListState = <T>(initial: Array<T>): ListStateReturnType<T> => {
  const [list, setList] = useState<Array<T>>(initial)

  const add = (item: T) => {
    setList((prev) => [...prev, item])
  }

  const isEmpty = () => {
    if (list.length > 0) return false
    else return true
  }

  const addAtIndex = (index: number, item: T) => {
    setList((prev) => [...prev.slice(0, index), item, ...prev.slice(index)])
  }

  const update = (item: T, matchFn: MatchFN<T> = DEFAULT_MATCH_FN) => {
    setList((prev) =>
      prev.map((v) => {
        if (matchFn(v, item)) {
          return item
        } else {
          return v
        }
      })
    )
  }

  const updateAtIndex = (index: number, item: T) => {
    setList((prev) => {
      const copy = [...prev]
      copy[index] = item
      return copy
    })
  }

  const remove = (item: T, matchFn: MatchFN<T> = DEFAULT_MATCH_FN) => {
    setList((prev) => prev.filter((v) => !matchFn(v, item)))
  }

  const removeAtIndex = (index: number) => {
    setList((prev) => {
      if (index < 0 || index >= prev.length) {
        return prev
      }

      return [...prev.slice(0, index), ...prev.slice(index + 1)]
    })
  }

  const clear = () => {
    setList([])
  }

  return {
    list,
    setList,
    isEmpty,
    add,
    addAtIndex,
    update,
    updateAtIndex,
    remove,
    removeAtIndex,
    clear,
  }
}

export { useListState }
