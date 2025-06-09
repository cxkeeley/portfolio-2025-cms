import { PermissionEnum } from '@/constants/permission'

import { BaseModel, ID } from './base'
import { RoleModel } from './role'

export enum ViewModeEnum {}

export type UserModel = BaseModel & {
  email: string
  name: string
  roles: Array<RoleModel>
}

export type UserMeModel = {
  id: ID
  email: string
  name: string
  permissions: PermissionEnum
  preferred_timezone: string
  roles: Array<RoleModel>
}
