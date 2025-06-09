import { FC, useEffect } from 'react'

import { LoggedUserProfile } from '@modules/auth/components/LoggedUserProfile'
import { LogoutButton } from '@modules/auth/components/LogoutButton'
import { LanguageSwitcher } from '@modules/i18n/components/LanguageSwitcher'
import { ThemeModeSwitcher } from '@modules/theme/components/ThemeModeSwitcher'

import { MenuComponent } from '@/assets/ts/components'

const AsideUserMenu: FC = () => {
  useEffect(() => {
    MenuComponent.reinitialization()
  }, [])

  return (
    <div
      className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg menu-state-primary fw-medium py-4 fs-6 w-275px"
      data-kt-menu="true"
    >
      {/* begin::Profile */}
      <LoggedUserProfile />
      {/* end::Profile */}

      <div className="separator my-2"></div>

      {/* begin::Theme Mode */}
      <ThemeModeSwitcher />
      {/* end::Theme Mode */}

      {/* begin::Language */}
      <LanguageSwitcher />
      {/* end::Language */}

      {/* begin::Logout */}
      <LogoutButton />
      {/* end::Logout */}
    </div>
  )
}

export { AsideUserMenu }
