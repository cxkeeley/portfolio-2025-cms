import { PermissionEnum } from '@/constants/permission'

export enum RoleTypeEnum {
  Super = 'SUPER',
  Doctor = 'DOCTOR',
  Nurse = 'NURSE',
  Global = 'GLOBAL',
}

export type RoleModel = {
  id: string
  title: string
  description: string
  is_super_admin: boolean
  is_active: boolean
  permissions: Array<PermissionEnum>
}
