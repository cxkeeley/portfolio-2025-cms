import { useEffect, useRef } from 'react'

export const useFirstTimeEffect = (func: (isFirstTime: boolean) => void, deps: Array<unknown>) => {
  const didMount = useRef(false)

  useEffect(() => {
    if (didMount.current) func(false)
    else {
      didMount.current = true
      func(true)
    }
    // eslint-disable-next-line
  }, deps)
}
