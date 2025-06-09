import clsx from 'clsx'
import { FC } from 'react'
import { useIntl } from 'react-intl'

import { Tooltip } from '@components/Tooltip'

import { useAside } from '@modules/aside/contexts/AsideContext'
import { AsideTab } from '@modules/aside/model'

type Props = AsideTab

const AsideTabItem: FC<Props> = (props) => {
  const { activeTab, setActiveTab, toggleMinimize, maximize } = useAside()
  const isActive = activeTab?.type === props.type
  const intl = useIntl()

  const handleClick = () => {
    if (isActive) {
      toggleMinimize()
    } else {
      setActiveTab(props)
      maximize()
    }
  }

  return (
    <Tooltip text={intl.formatMessage({ id: props.intlMessage })}>
      <button
        type="button"
        className={clsx('nav-link btn btn-icon btn-active-color-primary btn-color-gray-600 btn-active-light', {
          active: isActive,
        })}
        onClick={handleClick}
      >
        <i className={clsx(props.icon, 'fs-2')} />
      </button>
    </Tooltip>
  )
}

export { AsideTabItem }
