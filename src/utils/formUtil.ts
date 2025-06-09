/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormikErrors } from 'formik'

import { ErrorField } from '@models/apiBase'
import { Option } from '@models/option'

type Entries<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][]

type ObjectFormatFunctionMap<T> = {
  [key in keyof T]: (v: T[key]) => any
}

type Obj<T> = {
  [Key in keyof T]: any
}

type FormDisabledFlags<Type> = {
  [Key in keyof Type]-?: boolean
}

type FormHiddenFlags<Type> = {
  [Key in keyof Type]-?: boolean
}

type FormShape<Type> = {
  [key in keyof Type]?: Type[key] | null
}

interface IFormUtil {
  parseValues: <T>(values: Obj<unknown>) => T
  formatValues: <T>(values: T, functions: Partial<ObjectFormatFunctionMap<T>>) => T
  parseErrorResponse: (errors?: Array<ErrorField>) => FormikErrors<Record<string, any>> | undefined
}

const parseError = (error: ErrorField, dest: any) => {
  const matches = error.domain.match(/\[\d+\]/s)

  // check if it's an array domain
  if (matches && matches.length > 0) {
    const arrKey = matches[0]
    const [domain, ...nextDomain] = error.domain.split('.')
    const key = domain.split(arrKey)[0]
    const index = Number(arrKey.substring(1, arrKey.length - 1))

    if (!Array.isArray(dest[key])) {
      dest[key] = []
    }

    if (nextDomain.length === 0) {
      dest[key][index] = error.message
    } else {
      if (!dest[key][index]) {
        dest[key][index] = {}
      }

      parseError({ ...error, domain: nextDomain.join('.') }, dest[key][index])
    }
  } else {
    dest[error.domain] = error.message
  }
}

const FormUtil: IFormUtil = {
  parseValues: <T>(values: Record<string, any>): T => {
    return Object.entries(values).reduce((prev, [k, value]) => {
      const key = k as keyof T

      if (Array.isArray(value)) {
        prev[key] = value.map((v) => {
          if (v instanceof Option) {
            return v.value
          } else if (v instanceof Object) {
            return FormUtil.parseValues(v)
          }
          return v
        })
      } else if (value instanceof Option) {
        prev[key] = value.value
      } else {
        prev[key] = value
      }

      return prev
    }, Object())
  },

  formatValues: <T>(values: Record<keyof T, any>, functions: Partial<ObjectFormatFunctionMap<T>>): T => {
    for (const [k, func] of Object.entries(functions) as Entries<Partial<ObjectFormatFunctionMap<T>>>) {
      if (func) {
        values[k] = func(values[k])
      }
    }
    return values
  },

  parseErrorResponse: (errors) => {
    if (!errors || errors.length < 1) {
      return undefined
    }

    const errorsBag: Record<string, any> = {}
    errors.forEach((error) => {
      parseError(error, errorsBag)
    })

    return errorsBag
  },
}

export type { FormShape, FormDisabledFlags, FormHiddenFlags }

export default FormUtil
