import { FC } from 'react'

import { AsideTab } from '@modules/aside/model'

import { AsideTabItem } from '../AsideTabItem/AsideTabItem'

type Props = {
  tabs: Array<AsideTab>
}

const AsideTabs: FC<Props> = ({ tabs }) => {
  return (
    <div className="hover-scroll-y mb-10 h-100">
      {/* begin::Nav */}
      <ul
        className="nav flex-column gap-3"
        id="kt_aside_nav_tabs"
      >
        {/* begin::Nav item */}
        {tabs.map((tab) => (
          <li key={tab.type}>
            <AsideTabItem {...tab} />
          </li>
        ))}
        {/* end::Nav link */}
      </ul>
      {/* end::Tabs */}
    </div>
  )
}

export { AsideTabs }
