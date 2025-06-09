import { PluginFunc } from 'dayjs'

const ISO_DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ'
const ISO_DATE_FORMAT = 'YYYY-MM-DD'

const timezoneHelpers: PluginFunc = (option, dayjsClass, dayjsFactory) => {
  dayjsClass.prototype.toTzDate = function () {
    return this.add(this.timezoneDiff(), 'minutes').toDate()
  }

  dayjsClass.prototype.timezoneDiff = function () {
    return new Date().getTimezoneOffset() + this.utcOffset()
  }

  dayjsClass.prototype.toTzISOString = function (withTime = true) {
    return this.format(withTime ? ISO_DATETIME_FORMAT : ISO_DATE_FORMAT)
  }
}

export default timezoneHelpers
