import axios, { AxiosResponse } from 'axios'

import { RequestQuery } from '@models/apiBase'
import { Response } from '@models/apiBase'
import { WithFilter } from '@models/apiBase'
import { ID } from '@models/base'
import { UserMeModel, UserModel } from '@models/user'

import { API_URL } from '@/constants/constant'

export const USERS_URL = `${API_URL}/admin/users`

export type ResponseUsers = Response<WithFilter<Array<UserModel>>>

export type ResponseUser = Response<{ user: UserModel }>

export type ResponseUserMe = Response<{ me: UserMeModel }>

export type QueryUsersFilter = {
  is_active?: boolean
  role_ids?: Array<ID>
}

export type PayloadVerifyProfileTwoFA = {
  otp: string
}

export type QueryFilterUsers = {
  role_ids?: Array<ID>
  clinic_ids?: Array<ID>
  is_active?: boolean
}

export interface IAdminUsersAPI {
  getMe: () => Promise<ResponseUserMe>

  getOptionsForEmailLoginForm: (query: RequestQuery) => Promise<ResponseUsers>
}

export const AdminUsersAPI: IAdminUsersAPI = {
  getMe: async () => {
    return axios.get(`${USERS_URL}/me`).then((r: AxiosResponse) => r.data)
  },

  getOptionsForEmailLoginForm: async (query) => {
    return axios.post(`${USERS_URL}/options/email-login-form`, query).then((r: AxiosResponse) => r.data)
  },
}
