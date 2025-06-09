import dayjsInstance from 'dayjs'
import 'dayjs/locale/en'
import 'dayjs/locale/id'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import duration from 'dayjs/plugin/duration'
import isToday from 'dayjs/plugin/isToday'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

import customFormat from './plugins/customFormat'
import timezoneHelpers from './plugins/timezoneHelpers'

dayjsInstance.extend(utc)
dayjsInstance.extend(timezone)
dayjsInstance.extend(duration)
dayjsInstance.extend(relativeTime)
dayjsInstance.extend(timezone)
dayjsInstance.extend(timezoneHelpers)
dayjsInstance.extend(customFormat)
dayjsInstance.extend(customParseFormat)
dayjsInstance.extend(localizedFormat)
dayjsInstance.extend(isToday)

dayjsInstance.tz.setDefault('Asia/Jakarta')

const dayjs = (...args: Parameters<typeof dayjsInstance>) => {
  return dayjsInstance(...args).tz()
}

const timezonedUnix = (value: number) => {
  return dayjsInstance.unix(value).tz()
}

dayjs.unix = timezonedUnix
dayjs.duration = dayjsInstance.duration
dayjs.locale = dayjsInstance.locale
dayjs.setDefault = dayjsInstance.tz.setDefault

export default dayjs
