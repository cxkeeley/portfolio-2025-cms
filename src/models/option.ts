/* eslint-disable @typescript-eslint/no-explicit-any */
import { ID } from '@models/base'

export type Value = string | null | undefined

export type ArrayOption = [string, Value, undefined | boolean, any | undefined]

export type OptionProps<T> = {
  label: string
  value: Value
  isFixed?: boolean
  data?: T
  __isNew__?: boolean
}

// TODO: set type strict to unknown
export class Option<T = any> {
  label: string

  value: Value

  isFixed?: boolean

  data?: T

  // Supplied by React Select for 'Creatable'
  __isNew__?: boolean

  constructor({ label, value, isFixed, data, __isNew__ }: OptionProps<T>) {
    if (data && Array.isArray(data)) {
      throw new Error(`array is not allowed for 'data'`)
    }

    this.label = label
    this.value = value
    this.isFixed = isFixed
    this.data = data
    this.__isNew__ = __isNew__
  }

  encodeValues(): ArrayOption {
    return [this.label, this.value, this.isFixed, this.data]
  }

  static parse(values: Array<Option> | Option): Array<Option> | Option {
    if (Array.isArray(values)) {
      return values.map((value) => new Option({ ...value }))
    } else {
      return new Option({ ...values })
    }
  }

  static fromArray(values: ArrayOption): Option {
    return new Option({
      label: values[0],
      value: values[1],
      isFixed: values[2],
      data: values[3],
    })
  }

  static fromObject<T>(obj: { [K in keyof T]: any }, value: keyof T, label: keyof T) {
    return new Option({
      label: obj[label] ?? '',
      value: obj[value] ?? '',
      data: obj,
    })
  }

  static fromString(valueAndLabel: string, data?: any): Option {
    return new Option({
      label: valueAndLabel,
      value: valueAndLabel,
      data: data,
    })
  }

  static fromNumberString(value: string, label: string) {
    return new Option({
      label,
      value,
    })
  }

  static fromVariable(value: string | ID, label: string) {
    return new Option({
      label,
      value,
    })
  }

  static isArrayOption(values: unknown): values is ArrayOption {
    if (Array.isArray(values) && values.length > 0) {
      if (
        typeof values[0] === 'string' &&
        (values[1] === null || values[1] === undefined || typeof values[1] === 'string') &&
        (values[2] === undefined || typeof values[2] === 'boolean')
      ) {
        return true
      }
    }

    return false
  }
}

export type WithDesc = {
  description?: string
}

export type WithId = {
  id?: ID
}
