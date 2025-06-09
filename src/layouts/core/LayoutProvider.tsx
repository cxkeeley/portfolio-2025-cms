import { createContext, FC, useCallback, useContext, useState } from 'react'
import { PropsWithChildren } from 'react'

import { useSplashScreen } from '@modules/splash-screen/contexts/SplashScreenContext'

import {
  MenuComponent,
  ScrollComponent,
  ScrollTopComponent,
  StickyComponent,
  SwapperComponent,
} from '@/assets/ts/components'
import { ThemeModeComponent } from '@/assets/ts/layout'
import { DefaultLayoutConfig } from '@/constants/defaultLayoutConfig'
import { useFirstTimeEffect } from '@/hooks'
import { ILayout, ILayoutCSSClasses, ILayoutCSSVariables, ILayoutHTMLAttributes } from '@/interfaces/layout'
import { getEmptyCssClasses, getEmptyCSSVariables, getEmptyHTMLAttributes, LayoutSetup } from '@/utils/layoutSetup'

export interface LayoutContextModel {
  config: ILayout
  classes: ILayoutCSSClasses
  attributes: ILayoutHTMLAttributes
  cssVariables: ILayoutCSSVariables
  setLayout: (config: LayoutSetup) => void
}

const LayoutContext = createContext<LayoutContextModel>({
  config: DefaultLayoutConfig,
  classes: getEmptyCssClasses(),
  attributes: getEmptyHTMLAttributes(),
  cssVariables: getEmptyCSSVariables(),
  setLayout: (config: LayoutSetup) => {},
})

const LayoutProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const { show, hide } = useSplashScreen()
  const [config, setConfig] = useState(LayoutSetup.config)
  const [classes, setClasses] = useState(LayoutSetup.classes)
  const [attributes, setAttributes] = useState(LayoutSetup.attributes)
  const [cssVariables, setCSSVariables] = useState(LayoutSetup.cssVariables)

  const setLayout = useCallback(
    (_themeConfig: Partial<ILayout>) => {
      show()

      Array.from(document.body.classList).forEach((cl) => {
        document.body.classList.remove(cl)
      })

      LayoutSetup.updatePartialConfig(_themeConfig)
      setConfig(Object.assign({}, LayoutSetup.config))
      setClasses(LayoutSetup.classes)
      setAttributes(LayoutSetup.attributes)
      setCSSVariables(LayoutSetup.cssVariables)

      setTimeout(hide, 500)
    },
    [hide, show]
  )

  const value: LayoutContextModel = {
    config,
    classes,
    attributes,
    cssVariables,
    setLayout,
  }

  useFirstTimeEffect(
    (isFirstTime: boolean) => {
      let timeoutId: NodeJS.Timeout

      if (isFirstTime) {
        ThemeModeComponent.init()

        timeoutId = setTimeout(() => {
          ScrollTopComponent.bootstrap()
          StickyComponent.bootstrap()
          MenuComponent.bootstrap()
          ScrollComponent.bootstrap()
          SwapperComponent.bootstrap()
        }, 500)
      }

      return () => {
        clearTimeout(timeoutId)
      }
    },
    [config]
  )

  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
}

export { LayoutContext, LayoutProvider }

export function useLayout() {
  return useContext(LayoutContext)
}
