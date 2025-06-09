import { useEffect, useMemo, useState } from 'react'

import dayjs from '@/libs/dayjs'

type UseTimeCounter = {
  hours: number
  minutes: number
  seconds: number
}

type UseTimeCounterProps = {
  startAt?: string
}

const useTimeCounter = ({ startAt }: UseTimeCounterProps): UseTimeCounter => {
  const [counter, setCounter] = useState<number>(0)

  useEffect(() => {
    let interval: NodeJS.Timer

    if (startAt) {
      const diffSeconds = dayjs().diff(startAt, 'seconds')
      setCounter(diffSeconds < 0 ? 0 : diffSeconds)
      interval = setInterval(() => {
        setCounter((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      interval && clearInterval(interval)
    }
  }, [startAt])

  const time = useMemo(() => {
    let hours = Math.floor(counter / 3600)
    let minutes = Math.floor((counter - hours * 3600) / 60)
    let seconds = counter - hours * 3600 - minutes * 60

    return { hours, minutes, seconds }
  }, [counter])

  return time
}

export { useTimeCounter }
