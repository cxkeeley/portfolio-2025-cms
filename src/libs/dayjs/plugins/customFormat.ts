import { PluginFunc } from 'dayjs'

const APP_DATETIME_FORMAT = 'DD MMM YYYY HH:mm'
const APP_DATE_FORMAT = 'DD MMM YYYY'

const initialFormatDateOptions = {
  day: 'long',
  month: 'short',
  year: 'long',
  withTime: true,
  withDay: true,
}

const customFormat: PluginFunc = (option, dayjsClass, dayjsFactory) => {
  dayjsClass.prototype.defaultFormat = function (withTime = true) {
    return this.format(withTime ? APP_DATETIME_FORMAT : APP_DATE_FORMAT)
  }

  dayjsClass.prototype.customFormat = function (options) {
    const opts = { ...initialFormatDateOptions, ...options }

    let formatString: string = ''
    formatString += opts.withDay ? (opts.day === 'long' ? 'DD ' : 'D ') : ''
    formatString += opts.month === 'long' ? 'MMMM ' : 'MMM '
    formatString += opts.year === 'long' ? 'YYYY ' : 'YY '
    formatString += opts.withTime ? 'HH:mm' : ''

    return this.format(formatString)
  }
}

export default customFormat
