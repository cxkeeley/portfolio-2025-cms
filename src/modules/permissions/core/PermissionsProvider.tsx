import { createContext, FC, useCallback, useContext, useMemo } from 'react'
import { PropsWithChildren } from 'react'

import { useAuth } from '@modules/auth/contexts/AuthContext'

import { PermissionEnum } from '../../../constants/permission'

type PermissionsState = Set<string>

type PermissionsContextProps = {
  permissions: PermissionsState
  /**
   * Check permisssions provided, if array of permissions was provided
   * then function will return true if one of the permissions is granted
   * @deprecated
   * @param permissions
   * @returns
   */
  isAllowed: (permissions: Array<PermissionEnum> | PermissionEnum) => boolean
  hasPermissions: (permissions: Array<PermissionEnum> | PermissionEnum) => boolean
  hasAllPermissions: (permissions: Array<PermissionEnum>) => boolean
}

const PermissionContext = createContext<PermissionsContextProps>({
  permissions: new Set(),
  isAllowed: () => false,
  hasPermissions: () => false,
  hasAllPermissions: () => false,
})

const usePermissions = () => useContext(PermissionContext)

const PermissionsProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const { currentUser } = useAuth()

  const permissions = useMemo(() => {
    if (currentUser && currentUser.permissions) {
      return new Set(currentUser.permissions)
    }

    return new Set<string>()
  }, [currentUser])

  const hasPermissions = useCallback(
    (perms: Array<PermissionEnum> | PermissionEnum): boolean => {
      if (Array.isArray(perms)) {
        return perms.length === 0 || perms.some((p) => permissions.has(p))
      }
      return permissions.has(perms)
    },
    [permissions]
  )

  const hasAllPermissions = useCallback(
    (perms: Array<PermissionEnum>): boolean => {
      return perms.length === 0 || perms.every((p) => permissions.has(p))
    },
    [permissions]
  )

  const isAllowed = hasPermissions

  return (
    <PermissionContext.Provider value={{ permissions, isAllowed, hasPermissions, hasAllPermissions }}>
      {children}
    </PermissionContext.Provider>
  )
}

export { PermissionsProvider, usePermissions }
