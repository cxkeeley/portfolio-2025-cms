import { PluginFunc } from 'dayjs'

declare const plugin: PluginFunc
export = plugin

declare module 'dayjs' {
  interface Dayjs {
    defaultFormat(withTime?: boolean): string // format by the app
    customFormat(options?: CustomFormatOptions): string // format by the app
    timezoneDiff(): number // minues
    toTzDate(): Date
    toTzISOString(withTime?: boolean): string
  }
}
