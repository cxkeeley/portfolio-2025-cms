import { FC, ReactNode } from 'react'
import { useIntl } from 'react-intl'

import { AsideMenu } from '@modules/aside/model'

import { AsideMenuDropdown } from '../AsideMenuDropdown'
import { AsideMenuItem } from '../AsideMenuItem'

type Props = {
  menuList?: ReadonlyArray<AsideMenu>
}

const AsideMenuList: FC<Props> = ({ menuList }) => {
  const intl = useIntl()

  const renderMenu = (menu: AsideMenu, index: number): ReactNode | Array<ReactNode> => {
    return menu.children ? (
      <AsideMenuDropdown
        key={`aside-menu-sub-item-${index}`}
        withPath={menu.children.map((child) => child.to)}
        icon={menu.icon}
        fontIcon={menu.fontIcon}
        hasBullet={menu.hasBullet}
        title={intl.formatMessage({ id: menu.intlMessage })}
      >
        {menu.children.map(renderMenu)}
      </AsideMenuDropdown>
    ) : (
      <AsideMenuItem
        key={`aside-menu-item-${index}`}
        to={menu.to}
        icon={menu.icon}
        fontIcon={menu.fontIcon}
        hasBullet={menu.hasBullet}
        title={intl.formatMessage({ id: menu.intlMessage })}
      />
    )
  }

  return <>{menuList?.map(renderMenu)}</>
}

export { AsideMenuList }
