import { createContext, useContext } from 'react'

type SplashScreenContextProps = {
  show: () => void
  hide: () => void
}

const SplashScreenContext = createContext<SplashScreenContextProps>({
  show: () => null,
  hide: () => null,
})

const useSplashScreen = () => useContext(SplashScreenContext)

export { SplashScreenContext, useSplashScreen }
