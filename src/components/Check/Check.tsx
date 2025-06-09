import clsx from 'clsx'
import { FC } from 'react'

import { KTSVG } from '@components/KTSVG'

type Props = {
  check: boolean | undefined
}

export const Check: FC<Props> = ({ check }) => {
  return (
    <KTSVG
      svgClassName={clsx({
        'text-success': check,
        'text-danger': !check,
      })}
      path={check ? '/media/icons/duotune/general/gen037.svg' : '/media/icons/duotune/general/gen034.svg'}
      className="svg-icon-1"
    />
  )
}
