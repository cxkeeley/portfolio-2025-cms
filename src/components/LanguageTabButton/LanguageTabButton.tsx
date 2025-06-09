import clsx from 'clsx'
import { FC, ReactNode } from 'react'

import { LanguageCodeEnum } from '@models/language'

import PathUtil from '@/utils/pathUtil'

const flagIcons = {
  [LanguageCodeEnum.EN]: PathUtil.toAbsoluteURL('/media/flags/united-states.svg'),
  [LanguageCodeEnum.ID]: PathUtil.toAbsoluteURL('/media/flags/indonesia.svg'),
}

type LanguageTabButtonProps = {
  title: string
  isActive: boolean
  code: LanguageCodeEnum
  onClick: () => void
  toolbar?: ReactNode
}

const LanguageTabButton: FC<LanguageTabButtonProps> = ({ title, isActive, code, onClick, toolbar }) => {
  return (
    <button
      type="button"
      className={clsx('btn btn-active-light fw-medium fs-6 py-3 px-6 d-flex align-items-center', {
        'btn-light-primary': isActive,
      })}
      onClick={onClick}
    >
      <img
        className="w-20px h-20px rounded-1 me-3 border-1"
        src={flagIcons[code]}
        alt={title}
      />
      {title}

      <div className="ms-4">
        {toolbar}
      </div>
    </button>
  )
}

export type { LanguageTabButtonProps }

export default LanguageTabButton
