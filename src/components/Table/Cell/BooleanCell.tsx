import clsx from 'clsx'
import { FC } from 'react'

import { Check } from '@components/Check'

type Props = {
  check: boolean
  alignCenter?: boolean
}

export const BooleanCell: FC<Props> = ({ check, alignCenter }) => {
  return (
    <div
      className={clsx({
        'text-center': alignCenter,
      })}
    >
      <Check check={check} />
    </div>
  )
}
