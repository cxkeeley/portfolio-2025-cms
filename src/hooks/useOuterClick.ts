import { RefObject, useEffect } from 'react'

const useOuterClick = (ref: RefObject<HTMLElement>, callback: (e: MouseEvent) => void) => {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !!callback && !ref.current.contains(e.target as Node)) {
        callback(e)
      }
    }
    document.addEventListener('click', handleClick)

    return () => document.removeEventListener('click', handleClick)
  }, [callback, ref])
}

export default useOuterClick
