import { PermissionEnum } from '@/constants/permission'

export enum AsideTabTypeEnum {
  DEFAULT = 'DEFAULT',
}

export type AsideTab = {
  type: AsideTabTypeEnum
  icon: string
  intlMessage: string
  includedPaths?: Array<string>
  children: ReadonlyArray<AsideMenu>
  link?: string
}

export type AsideMenu = {
  to: string
  intlMessage: string
  hasBullet?: boolean
  icon?: string
  fontIcon?: string
  permissions?: Array<PermissionEnum>
  children?: Array<AsideMenu>
}
