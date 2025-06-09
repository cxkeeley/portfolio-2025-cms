/* eslint-disable jsx-a11y/anchor-is-valid */
import clsx from 'clsx'
import { useIntl } from 'react-intl'

import { KTSVG } from '@components/KTSVG'

import { useTheme } from '@modules/theme/contexts/ThemeContext'
import { ThemeModeEnum } from '@modules/theme/models'

type ThemeModeProps = {
  mode: ThemeModeEnum
  icon: string
}

const themeModes: Array<ThemeModeProps> = [
  {
    mode: ThemeModeEnum.LIGHT,
    icon: '/media/icons/duotune/general/gen060.svg',
  },
  {
    mode: ThemeModeEnum.DARK,
    icon: '/media/icons/duotune/general/gen061.svg',
  },
  {
    mode: ThemeModeEnum.SYSTEM,
    icon: '/media/icons/duotune/general/gen062.svg',
  },
]

const ThemeModeSwitcher = () => {
  const intl = useIntl()
  const { mode, menuMode, updateMode, updateMenuMode } = useTheme()

  const handleSwitchMode = (_mode: ThemeModeEnum) => {
    updateMenuMode(_mode)
    updateMode(_mode)
  }

  return (
    <div
      className="menu-item px-5"
      data-kt-menu-trigger="hover"
      data-kt-menu-placement="left-start"
      data-kt-menu-flip="bottom"
    >
      {/* begin::Menu toggle */}
      <a
        href="#"
        className="menu-link px-5 btn-color-gray-600 btn-active-color-primary"
      >
        <span className="menu-title position-relative">
          Theme
          <span className="fs-8 rounded bg-light px-3 py-2 position-absolute translate-middle-y top-50 end-0 text-capitalize">
            {mode}

            <KTSVG
              path={
                mode === ThemeModeEnum.LIGHT
                  ? '/media/icons/duotune/general/gen060.svg'
                  : '/media/icons/duotune/general/gen061.svg'
              }
              className={clsx('ms-2', {
                'theme-light-hide': mode === ThemeModeEnum.LIGHT,
                'theme-light-dark': mode === ThemeModeEnum.DARK,
              })}
            />
          </span>
        </span>
      </a>
      {/* begin::Menu toggle */}

      {/* begin::Menu */}
      <div className="menu-sub menu-sub-dropdown w-175px color-icon-muted fs-base py-4">
        {/* begin::Menu item */}
        {themeModes.map((theme) => (
          <div
            className="menu-item px-3 my-0"
            key={theme.mode}
          >
            <a
              href="#"
              onClick={() => handleSwitchMode(theme.mode)}
              className={clsx('menu-link px-3 py-2', {
                active: menuMode === theme.mode,
              })}
            >
              <span
                className="menu-icon"
                data-kt-element="icon"
              >
                <KTSVG
                  path={theme.icon}
                  className="svg-icon-3 text-muted"
                />
              </span>
              <span className="menu-text">{intl.formatMessage({ id: `enum.theme.${theme.mode}` })}</span>
            </a>
          </div>
        ))}
        {/* end::Menu item */}
      </div>
      {/* end::Menu */}
    </div>
  )
}

export { ThemeModeSwitcher }
