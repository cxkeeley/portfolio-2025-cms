import { ThemeModeComponent } from '@/assets/ts/layout'
import PathUtil from '@/utils/pathUtil'

import { ThemeModeEnum } from '../models'

export const themeModeSwitchHelper = (_mode: ThemeModeEnum) => {
  // change background image url
  const mode = _mode !== ThemeModeEnum.SYSTEM ? _mode : ThemeModeComponent.getSystemMode()
  const imageUrl = '/media/patterns/header-bg' + (mode === ThemeModeEnum.LIGHT ? '.jpg' : '-dark.png')
  document.body.style.backgroundImage = `url("${PathUtil.toAbsoluteURL(imageUrl)}")`
}

export const getThemeModeFromLocalStorage = (lsKey: string): ThemeModeEnum => {
  if (!localStorage) {
    return ThemeModeEnum.LIGHT
  }

  const data = localStorage.getItem(lsKey)
  if (!data) {
    return ThemeModeEnum.LIGHT
  }

  if (data === 'light') {
    return ThemeModeEnum.LIGHT
  }

  if (data === 'dark') {
    return ThemeModeEnum.DARK
  }

  return ThemeModeEnum.SYSTEM
}
