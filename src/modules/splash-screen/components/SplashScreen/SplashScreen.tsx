import { FC, useEffect } from 'react'

import { useSplashScreen } from '@modules/splash-screen/contexts/SplashScreenContext'

type Props = {
  isVisible?: boolean
}

const SplashScreen: FC<Props> = ({ isVisible = true }) => {
  // Everything are ready - remove splashscreen
  const { show, hide } = useSplashScreen()

  useEffect(() => {
    if (isVisible) {
      show()
    }
    return () => hide()
  }, [hide, isVisible, show])

  return null
}

export { SplashScreen }
