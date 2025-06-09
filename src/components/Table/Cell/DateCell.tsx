import clsx from 'clsx'
import { FC, useMemo } from 'react'

import dayjs from '@/libs/dayjs'

type Props = {
  date: string | undefined
  alignCenter?: boolean
  withTime?: boolean
  className?: string | undefined
}

export const DateCell: FC<Props> = ({ alignCenter, date, withTime = true, className }) => {
  const formattedDate = useMemo(
    () => (date ? dayjs(date).defaultFormat(withTime) : '-'),
    // eslint-disable-next-line
    [date, withTime]
  )

  return (
    <div
      className={clsx(className, {
        'text-center': alignCenter,
      })}
    >
      {formattedDate}
    </div>
  )
}
