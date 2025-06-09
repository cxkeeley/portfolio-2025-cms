import { AxiosError } from 'axios'

import { ErrorField } from '@models/apiBase'

import TypeUtil from './typeUtil'

export type ResponseError = {
  code: number
  message: string
  errors: Array<ErrorField>
}

interface IAxiosUtil {
  isAxiosError: (err: unknown) => err is AxiosError<ResponseError>
}

const AxiosUtil: IAxiosUtil = {
  isAxiosError: (err): err is AxiosError<ResponseError> => {
    return TypeUtil.isObject(err) && err.isAxiosError
  },
}

export default AxiosUtil
