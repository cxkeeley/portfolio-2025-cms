import clsx from 'clsx'
import { FC, MouseEvent } from 'react'
import { PropsWithChildren } from 'react'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

import { KTSVG } from '@components/KTSVG'

import { isMenuActive } from '@modules/aside/helpers'
import { AsideMenu } from '@modules/aside/model'

import { useLayout } from '@/layouts/core'

import { AsideMenuFontIcon } from '../AsideMenuFontIcon'

type Props = Omit<AsideMenu, 'intlMessage'> & {
  title: string
}

const AsideMenuItem: FC<PropsWithChildren<Props>> = ({ children, to, title, icon, fontIcon, hasBullet = false }) => {
  const { pathname } = useLocation()
  const isActive = isMenuActive(pathname, to)
  const { config } = useLayout()
  const { aside } = config

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget.parentElement?.classList.contains('menu-sub')) {
      return
    }

    const wrapper = document.querySelector('#kt_aside_menu_wrapper')
    if (wrapper) {
      Array.from(wrapper.querySelectorAll('.menu-accordion, .menu-sub-accordion'))
        .filter((el) => !el.parentElement?.classList.contains('menu-sub'))
        .forEach((el) => {
          el.classList.remove('show', 'hover')
        })
    }
  }

  return (
    <div
      className="menu-item"
      onClick={handleClick}
    >
      <Link
        className={clsx('menu-link without-sub px-10 py-4', { active: isActive })}
        to={to}
      >
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
      </Link>
      {children}
    </div>
  )
}

export { AsideMenuItem }
