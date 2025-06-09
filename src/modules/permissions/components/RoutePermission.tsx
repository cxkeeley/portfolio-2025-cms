import { FC, useMemo } from 'react'
import { PropsWithChildren } from 'react'
import { Navigate } from 'react-router-dom'

import { PermissionEnum } from '../../../constants/permission'
import { usePermissions } from '../core/PermissionsProvider'

type Props = {
  allow: Array<PermissionEnum>
}

const RoutePermission: FC<PropsWithChildren<Props>> = ({ allow, children }) => {
  const { isAllowed } = usePermissions()
  const allowed: boolean = useMemo(() => isAllowed(allow), [allow, isAllowed])

  if (allowed) {
    return <>{children}</>
  }

  return <Navigate to="/" />
}

export { RoutePermission }
