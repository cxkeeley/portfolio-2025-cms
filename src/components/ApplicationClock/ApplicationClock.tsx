import { Dayjs } from 'dayjs'
import { useEffect, useMemo, useState } from 'react'

import dayjs from '@/libs/dayjs'

const ApplicationClock = () => {
  const [date, setDate] = useState<Dayjs>(dayjs())

  const formattedDate = useMemo(() => date.format('DD MMM YYYY HH:mm:ss'), [date])

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(dayjs())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="btn bg-body btn-color-gray-600 btn-active-color-primary h-40px border-0 d-flex align-items-center fw-normal"
      style={{ width: 235 }}
    >
      <i className="fa-solid fa-clock fs-6 me-2" />
      {formattedDate}
    </div>
  )
}

export default ApplicationClock
