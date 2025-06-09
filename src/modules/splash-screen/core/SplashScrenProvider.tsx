import { FC, PropsWithChildren, useCallback, useEffect, useState } from 'react'

import { SplashScreenContext } from '@modules/splash-screen/contexts/SplashScreenContext'

type Props = {}

const SplashScreenProvider: FC<PropsWithChildren<Props>> = ({ children }) => {
  const [count, setCount] = useState(0)
  let visible = count > 0

  const show = useCallback(() => {
    setCount((prev) => prev + 1)
  }, [])

  const hide = useCallback(() => {
    setCount((prev) => (prev > 0 ? prev - 1 : 0))
  }, [])

  const value = {
    show,
    hide,
  }

  useEffect(() => {
    const splashScreen = document.getElementById('splash-screen')

    // Show SplashScreen
    if (splashScreen && visible) {
      splashScreen.classList.remove('hidden')

      return () => {
        splashScreen.classList.add('hidden')
      }
    }

    // Hide SplashScreen
    let timeout: number
    if (splashScreen && !visible) {
      timeout = window.setTimeout(() => {
        splashScreen.classList.add('hidden')
      }, 1000)
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [visible])

  return <SplashScreenContext.Provider value={value}>{children}</SplashScreenContext.Provider>
}

export { SplashScreenProvider }
