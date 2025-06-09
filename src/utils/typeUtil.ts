/* eslint-disable @typescript-eslint/no-explicit-any */
interface ITypeUtil {
  isFunction: (obj: unknown) => obj is Function

  isEmpty: <T>(value: NonNullable<T>) => boolean

  isDefined: <T>(value: T) => value is NonNullable<T>

  isImgURL: (url: string) => boolean

  isPdfURL: (url: string) => boolean

  isString: (obj: unknown) => obj is string

  isObject: (obj: unknown) => obj is Record<string, any>

  isNumber: (obj: unknown) => obj is number

  isArray: (obj: unknown) => obj is Array<any>
}

const TypeUtil: ITypeUtil = {
  isFunction: (obj: unknown): obj is Function => {
    return typeof obj === 'function'
  },

  isEmpty: <T>(value: NonNullable<T>): boolean => {
    if (TypeUtil.isString(value)) {
      return value === ''
    }

    if (TypeUtil.isNumber(value)) {
      return value === 0
    }

    if (TypeUtil.isArray(value)) {
      return value.length === 0
    }

    if (TypeUtil.isObject(value)) {
      return Object.keys(value).length === 0
    }

    throw Error('Unhandled datatype')
  },

  isDefined: <T>(value: T): value is NonNullable<T> => {
    return value !== undefined && value !== null
  },

  isImgURL: (url) => {
    return /\.(jpg|jpeg|png|webp|avif|gif|jfif)($|\?)/.test(url)
  },

  isPdfURL: (url) => {
    return /\.(pdf)($|\?)/.test(url)
  },

  isString: (obj): obj is string => {
    return typeof obj === 'string'
  },

  isObject: (obj): obj is Record<string, any> => {
    return typeof obj === 'object'
  },

  isNumber: (obj): obj is number => {
    return typeof obj === 'number'
  },

  isArray: (obj): obj is Array<any> => {
    return Array.isArray(obj)
  },
}

export default TypeUtil
