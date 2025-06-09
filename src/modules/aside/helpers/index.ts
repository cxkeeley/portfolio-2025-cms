import { AsideMenu } from '@modules/aside/model'

import { PermissionEnum } from '@/constants/permission'
import PathUtil from '@/utils/pathUtil'

export const extractPermissions = (menu: ReadonlyArray<AsideMenu>): Array<PermissionEnum> => {
  return menu.reduce((prev: Array<PermissionEnum>, m) => {
    const tempPermissions = [...prev]

    if (m.permissions) {
      tempPermissions.push(...m.permissions)
    }

    if (m.children) {
      tempPermissions.push(...extractPermissions(m.children))
    }

    return tempPermissions
  }, [])
}

export const extractPaths = (menu: ReadonlyArray<AsideMenu>): Array<string> => {
  return menu.reduce((prev: Array<string>, m) => {
    prev.push(m.to)

    if (m.children) {
      prev.push(...extractPaths(m.children))
    }

    return prev
  }, [])
}

export const filterAllowedMenu = (
  menu: ReadonlyArray<AsideMenu>,
  isAllowed: (permission: Array<PermissionEnum>) => boolean
) => {
  const clondedMenu = menu.map((m) => ({ ...m }))
  const filteredMenu: Array<AsideMenu> = []

  clondedMenu.forEach((m) => {
    if (m.children) {
      m.children = filterAllowedMenu(m.children, isAllowed)
    }
    if (!m.permissions || (m.permissions && isAllowed(m.permissions))) {
      if (!m.children || (m.children && m.children.length > 0)) {
        filteredMenu.push(m)
      }
    }
  })

  return filteredMenu
}

export function isMenuActive(pathname: string, url: string) {
  const current = PathUtil.clean(pathname)
  if (!current || !url) {
    return false
  }

  if (current === url) {
    return true
  }

  if (current.indexOf(url) > -1) {
    return true
  }

  return false
}
