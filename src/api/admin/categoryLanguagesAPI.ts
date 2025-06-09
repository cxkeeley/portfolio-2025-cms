import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

import { Response, ResponseSuccess } from '@models/apiBase'
import { ID } from '@models/base'
import CategoryLanguageModel from '@models/categoryLanguage'

import { API_URL } from '@/constants/constant'

const ADMIN_CATEGORY_URL = `${API_URL}/admin/category-languages`

type ResponseCategoryLanguage = Response<{
  category_language: CategoryLanguageModel
}>

type PayloadCreateCategoryLanguage = {
  category_id: ID
  language_id: ID
  name: string
}

type PayloadUpdateCategoryLanguage = {
  name: string
  slug: string
}

interface IAdminCategoryLanguagesAPI {
  create: (payload: PayloadCreateCategoryLanguage) => Promise<AxiosResponse<ResponseCategoryLanguage>>

  get: (id: ID, axiosConfig?: AxiosRequestConfig) => Promise<AxiosResponse<ResponseCategoryLanguage>>

  update: (id: ID, payload: PayloadUpdateCategoryLanguage) => Promise<AxiosResponse<ResponseCategoryLanguage>>

  delete: (id: ID) => Promise<ResponseSuccess>
}

const AdminCategoryLanguagesAPI: IAdminCategoryLanguagesAPI = {
  create: async (payload) => {
    return axios.post(ADMIN_CATEGORY_URL, payload)
  },

  get: async (id, axiosConfig) => {
    return axios.get(`${ADMIN_CATEGORY_URL}/${id}`, axiosConfig)
  },

  update: async (id, payload) => {
    return axios.put(`${ADMIN_CATEGORY_URL}/${id}`, payload)
  },

  delete: async (id) => {
    return axios.delete(`${ADMIN_CATEGORY_URL}/${id}`)
  },
}

export type { PayloadCreateCategoryLanguage, PayloadUpdateCategoryLanguage }

export default AdminCategoryLanguagesAPI
