import axios, { AxiosResponse } from 'axios'

import { ResponseSuccess } from '@models/apiBase'
import { Response } from '@models/apiBase'
import { AuthToken } from '@models/auth'

import { API_URL } from '@/constants/constant'

type ResponseLogin = Response<AuthToken>

export type PayloadLoginGoogle = {
  code: string
}

export type PayloadLoginEmail = {
  email: string
}

export interface IAuthAPI {
  loginGoogle: (payload: PayloadLoginGoogle) => Promise<ResponseLogin>

  loginEmail: (payload: PayloadLoginEmail) => Promise<ResponseLogin>

  logout: () => Promise<ResponseSuccess>
}

const AUTH_URL = `${API_URL}/auth`

export const AuthAPI: IAuthAPI = {
  loginGoogle: async (payload) => {
    return axios.post(`${AUTH_URL}/google-login`, payload).then((r: AxiosResponse) => r.data)
  },

  loginEmail: async (payload: PayloadLoginEmail) => {
    return axios.post(`${AUTH_URL}/email-login`, payload).then((r: AxiosResponse) => r.data)
  },

  logout: async () => {
    return axios.post(`${AUTH_URL}/logout`).then((r: AxiosResponse) => r.data)
  },
}
