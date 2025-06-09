import { createContext, useContext } from 'react'

import { getThemeModeFromLocalStorage } from '../helpers'
import { THEME_MODE_MENU_KEY, THEME_MODE_VALUE_KEY, ThemeModeEnum } from '../models'

type ThemeContextProps = {
  mode: ThemeModeEnum
  menuMode: ThemeModeEnum
  updateMode: (_mode: ThemeModeEnum) => void
  updateMenuMode: (_mode: ThemeModeEnum) => void
}

const ThemeContext = createContext<ThemeContextProps>({
  mode: getThemeModeFromLocalStorage(THEME_MODE_VALUE_KEY),
  menuMode: getThemeModeFromLocalStorage(THEME_MODE_MENU_KEY),
  updateMode: (_mode: ThemeModeEnum) => {},
  updateMenuMode: (_menuMode: ThemeModeEnum) => {},
})

const useTheme = () => useContext(ThemeContext)

export { ThemeContext, useTheme }
