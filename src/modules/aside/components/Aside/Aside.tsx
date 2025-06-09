import clsx from 'clsx'
import { useMemo, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { KTSVG } from '@components/KTSVG'
import { Overlay, OverlayHandle } from '@components/Overlay'
import { Portal } from '@components/Portal'

import { AsideContext, AsideContextProps } from '@modules/aside/contexts/AsideContext'
import { filterAllowedMenu, isMenuActive } from '@modules/aside/helpers'
import { AsideTab } from '@modules/aside/model'
import { usePermissions } from '@modules/permissions/core/PermissionsProvider'

import { AsideTabsList } from '@/constants/asideMenu'
import { useLayout } from '@/layouts/core'

import { AsideFooter } from '../AsideFooter'
import { AsideSecondary } from '../AsideSecondary'
import { AsideTabs } from '../AsideTabs'

export const ASIDE_MINIMIZE_ATTRIBUTE = 'data-kt-aside-minimize'

const Aside = () => {
  const { config, classes } = useLayout()
  const body = useRef(document.body).current
  const overlay = useRef<OverlayHandle>(null)
  const { pathname } = useLocation()
  const { hasPermissions } = usePermissions()

  const tabs = useMemo(() => {
    const filteredTabMenu = AsideTabsList.map((tab) => ({
      ...tab,
      children: filterAllowedMenu(tab.children, hasPermissions),
    }))
    return filteredTabMenu.filter((tab) => tab.children.length > 0)
  }, [hasPermissions])

  const [activeTab, setActiveTab] = useState<AsideTab | undefined>(() => {
    const active = tabs.find((tab) => {
      return tab.includedPaths?.some((path) => isMenuActive(pathname, path))
    })
    return active ?? tabs.at(0)
  })

  const maximize = () => {
    body.setAttribute(ASIDE_MINIMIZE_ATTRIBUTE, 'off')

    if (config.aside.float) {
      overlay.current?.show()
    }
  }

  const minimize = () => {
    body.setAttribute(ASIDE_MINIMIZE_ATTRIBUTE, 'on')

    if (config.aside.float) {
      overlay.current?.hide()
    }
  }

  const toggleMinimize = () => {
    const attr = body.getAttribute(ASIDE_MINIMIZE_ATTRIBUTE)
    if (attr === 'on') {
      maximize()
    } else {
      minimize()
    }
  }

  const value: AsideContextProps = {
    tabs,
    activeTab,
    setActiveTab,
    maximize,
    minimize,
    toggleMinimize,
  }

  return (
    <AsideContext.Provider value={value}>
      <div className={clsx('aside aside-extended', classes.aside.join(' '))}>
        {/* begin::Primary */}
        <div className="aside-primary d-flex flex-column align-items-lg-center flex-row-auto">
          {/* begin::Logo */}
          <div className="aside-logo d-none d-lg-flex flex-column justify-content-center align-items-center flex-column-auto h-100px mb-5">
            <Link to="/dashboard">
              <KTSVG
                path="/media/logos/logo.svg"
                svgClassName="w-75px h-100"
              />
            </Link>
          </div>
          {/* end::Logo */}

          {/* begin::Nav */}
          <div className="aside-nav d-flex flex-column align-items-center flex-column-fluid w-100 pt-5 pt-lg-0">
            <AsideTabs tabs={tabs} />
          </div>
          {/* end::Nav */}

          <AsideFooter />
        </div>

        {/* end::Primary */}
        {config.aside.secondaryDisplay && <AsideSecondary menu={activeTab?.children ?? []} />}
      </div>

      {config.aside.float && (
        <Portal>
          <Overlay
            ref={overlay}
            overlayClassName="aside-overlay"
            onClick={minimize}
          />
        </Portal>
      )}
    </AsideContext.Provider>
  )
}

export { Aside }
