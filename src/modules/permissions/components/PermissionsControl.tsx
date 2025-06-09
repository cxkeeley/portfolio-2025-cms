import React, { FC, useMemo } from 'react'
import { PropsWithChildren } from 'react'
import { useIntl } from 'react-intl'

import { PermissionEnum } from '@/constants/permission'
import TypeUtil from '@/utils/typeUtil'

import { usePermissions } from '../core/PermissionsProvider'

type RenderErrorFunction = (permissionString: string) => React.ReactNode

type Props = {
  allow?: Array<PermissionEnum> | PermissionEnum
  allowIfAll?: Array<PermissionEnum>
  renderError?: RenderErrorFunction | boolean
}

const PermissionsControl: FC<PropsWithChildren<Props>> = ({ children, allow, allowIfAll, renderError }) => {
  const intl = useIntl()

  if (allow && allowIfAll) {
    throw new Error('Only allow or allowIfAll props may be provided')
  }

  const { hasPermissions, hasAllPermissions } = usePermissions()

  const allowedPermissions: boolean = useMemo(
    () => allow !== undefined && hasPermissions(allow),
    [allow, hasPermissions]
  )

  const allowedAllPermissions: boolean = useMemo(
    () => allowIfAll !== undefined && hasAllPermissions(allowIfAll),
    [allowIfAll, hasAllPermissions]
  )

  if (allowedPermissions) {
    return <React.Fragment>{children}</React.Fragment>
  }

  if (allowedAllPermissions) {
    return <React.Fragment>{children}</React.Fragment>
  }

  if (renderError) {
    let permissionString: string
    if (allowIfAll) {
      permissionString = allowIfAll.join(', ')
    } else {
      if (Array.isArray(allow)) {
        permissionString = allow.join(' or ')
      } else {
        permissionString = allow as PermissionEnum
      }
    }

    if (TypeUtil.isFunction(renderError)) {
      return <>{renderError(permissionString)}</>
    } else {
      return (
        <div
          className="alert alert-danger"
          style={{
            wordBreak: 'break-all',
          }}
        >
          {intl.formatMessage(
            {
              id: 'permissions_control.permission_needed',
            },
            {
              permissionString,
            }
          )}
        </div>
      )
    }
  }

  return null
}

export { PermissionsControl }
