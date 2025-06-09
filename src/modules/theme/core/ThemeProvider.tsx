import React, { useEffect, useState } from 'react'

import { ThemeContext } from '@modules/theme/contexts/ThemeContext'
import { getThemeModeFromLocalStorage } from '@modules/theme/helpers'

import { ThemeModeComponent } from '@/assets/ts/layout'

import { THEME_MODE_MENU_KEY, THEME_MODE_VALUE_KEY, ThemeModeEnum } from '../models'

const systemMode = ThemeModeComponent.getSystemMode()

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<ThemeModeEnum>(getThemeModeFromLocalStorage(THEME_MODE_VALUE_KEY))
  const [menuMode, setMenuMode] = useState<ThemeModeEnum>(getThemeModeFromLocalStorage(THEME_MODE_MENU_KEY))

  const updateMode = (_mode: ThemeModeEnum) => {
    const updatedMode = _mode === ThemeModeEnum.SYSTEM ? systemMode : _mode
    setMode(updatedMode)
    if (localStorage) {
      localStorage.setItem(THEME_MODE_VALUE_KEY, updatedMode)
    }
    document.documentElement.setAttribute('data-theme', updatedMode)
    ThemeModeComponent.init()
  }

  const updateMenuMode = (_menuMode: ThemeModeEnum) => {
    setMenuMode(_menuMode)
    if (localStorage) {
      localStorage.setItem(THEME_MODE_MENU_KEY, _menuMode)
    }
  }

  useEffect(() => {
    updateMode(mode)
    updateMenuMode(menuMode)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ThemeContext.Provider value={{ mode, menuMode, updateMode, updateMenuMode }}>{children}</ThemeContext.Provider>
  )
}

export { ThemeProvider, systemMode }
