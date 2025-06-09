import clsx from 'clsx'
import { FC } from 'react'

type Props = {
  icon: string
  isActive?: boolean
}

const AsideMenuFontIcon: FC<Props> = ({ icon, isActive }) => {
  return (
    <span className="d-flex justify-content-center w-25px">
      <i
        className={clsx('fs-4 me-3', icon, {
          'text-primary': isActive,
          'text-gray-600': !isActive,
        })}
      />
    </span>
  )
}

export { AsideMenuFontIcon }
