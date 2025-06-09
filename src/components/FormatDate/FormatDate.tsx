import { FC, useMemo } from 'react'

import dayjs from '@/libs/dayjs'

type Props = {
  date: string | Date
  withTime?: boolean
}

const FormatDate: FC<Props> = ({ date, withTime = false }) => {
  const formattedDate = useMemo(
    () => dayjs(date).defaultFormat(withTime),
    // eslint-disable-next-line
    [date, withTime]
  )

  return <>{formattedDate}</>
}

export { FormatDate }
