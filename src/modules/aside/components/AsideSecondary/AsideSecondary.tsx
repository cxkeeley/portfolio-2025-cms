import { FC, useEffect } from 'react'

import { AsideMenu } from '@modules/aside/model'

import { MenuComponent, ScrollComponent } from '@/assets/ts/components'

import { AsideMenuList } from '../AsideMenuList'
import { AsideUserProfile } from '../AsideUserProfile'

type Props = {
  menu: ReadonlyArray<AsideMenu>
}

const AsideSecondary: FC<Props> = ({ menu }) => {
  useEffect(() => {
    setTimeout(() => {
      MenuComponent.reinitialization()
      ScrollComponent.reinitialization()
    }, 50)
  }, [])

  return (
    <div className="aside-secondary d-flex flex-row-fluid">
      <div className="aside-menu">
        <div className="d-flex h-100 flex-column">
          {/* begin::User Profile */}
          <AsideUserProfile />
          {/* end::User Profile */}

          {/* begin::Wrapper */}
          <div className="flex-equal hover-scroll-y">
            {/* begin::Tab content */}
            <div
              className="menu menu-column menu-title-gray-700 fs-5 menu-active-bg py-5"
              data-kt-menu="true"
            >
              <div id="kt_aside_menu_wrapper">
                <AsideMenuList menuList={menu} />
              </div>
            </div>
            {/* end::Tab content */}
          </div>
          {/* end::Wrapper */}
        </div>
      </div>
    </div>
  )
}

export { AsideSecondary }
