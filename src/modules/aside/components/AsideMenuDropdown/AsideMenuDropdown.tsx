import clsx from 'clsx'
import { FC, useMemo, useRef } from 'react'
import { PropsWithChildren } from 'react'
// eslint-disable-next-line
import { useLocation } from 'react-router'

import { KTSVG } from '@components/KTSVG'

import { isMenuActive } from '@modules/aside/helpers'

import { useLayout } from '@/layouts/core'

import { AsideMenuFontIcon } from '../AsideMenuFontIcon'

type Props = {
  withPath: Array<string>
  title: string
  icon?: string
  fontIcon?: string
  hasBullet?: boolean
}

const AsideMenuDropdown: FC<PropsWithChildren<Props>> = ({ children, withPath, title, icon, fontIcon, hasBullet }) => {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()
  const { config } = useLayout()
  const { aside } = config

  const isActive = useMemo(() => withPath.some((path) => isMenuActive(pathname, path)), [pathname, withPath])

  return (
    <div
      className={clsx('menu-item menu-accordion', { show: isActive })}
      data-kt-menu-trigger="click"
    >
      <span className="menu-link px-10 py-4">
        {hasBullet && (
          <span className="menu-bullet">
            <span className="bullet bullet-dot"></span>
          </span>
        )}
        {icon && aside.menuIcon === 'svg' && (
          <span className="menu-icon">
            <KTSVG
              path={icon}
              className="svg-icon-2"
            />
          </span>
        )}
        {fontIcon && aside.menuIcon === 'font' && (
          <AsideMenuFontIcon
            icon={fontIcon}
            isActive={isActive}
          />
        )}
        <span className={clsx('menu-title', { 'text-primary': isActive })}>{title}</span>
        <span className="menu-arrow"></span>
      </span>
      <div
        ref={dropdownRef}
        className="menu-sub menu-sub-accordion"
      >
        {children}
      </div>
    </div>
  )
}

export { AsideMenuDropdown }
