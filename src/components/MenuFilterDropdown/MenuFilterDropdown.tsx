import { FC, PropsWithChildren, ReactNode, RefObject } from 'react'

import { MenuDropdown } from '../MenuDropdown'

type Props = {
  title: ReactNode
  isShow: boolean
  targetRef: RefObject<HTMLElement>
  onOuterClick: () => void
}

const MenuFilterDropdown: FC<PropsWithChildren<Props>> = ({ title, isShow, children, targetRef, onOuterClick }) => {
  return (
    <MenuDropdown
      isShow={isShow}
      placement="bottom-end"
      targetRef={targetRef}
      onOuterClick={onOuterClick}
      width={350}
    >
      <div className="px-7 py-5">
        <div className="fs-5 text-dark fw-medium">{title}</div>
      </div>

      <div className="separator border-gray-200" />

      <div className="px-7 py-5">{isShow ? children : null}</div>
    </MenuDropdown>
  )
}

export { MenuFilterDropdown }
