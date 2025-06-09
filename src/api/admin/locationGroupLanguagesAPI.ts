import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

import { Response, ResponseSuccess } from '@models/apiBase'
import { ID } from '@models/base'
import { LocationGroupLanguageModel } from '@models/locationGroupLanguage'

import { API_URL } from '@/constants/constant'

type ResponseLocationGroupLanguage = Response<{ location_group_language: LocationGroupLanguageModel }>

type PayloadLocationGroupLanguageCreate = {
  image_alt: string
  language_id: ID
  location_group_id: ID
  name: string
}

type PayloadLocationGroupLanguageUpdate = {
  image_alt: string
  name: string
}

interface IAdminLocationGroupLanguagesAPI {
  create: (payload: PayloadLocationGroupLanguageCreate) => Promise<AxiosResponse<ResponseLocationGroupLanguage>>

  get: (
    locationGroupLanguageId: ID,
    axiosConfig?: AxiosRequestConfig
  ) => Promise<AxiosResponse<ResponseLocationGroupLanguage>>

  update: (
    locationGroupLanguageId: ID,
    payload: PayloadLocationGroupLanguageUpdate
  ) => Promise<AxiosResponse<ResponseLocationGroupLanguage>>

  delete: (locationGroupLanguageId: ID) => Promise<AxiosResponse<ResponseSuccess>>
}

const ADMIN_LOCATION_GROUP_LANGUAGES_URL = `${API_URL}/admin/location-group-languages`

const AdminLocationGroupLanguagesAPI: IAdminLocationGroupLanguagesAPI = {
  create: async (payload) => {
    return axios.post(ADMIN_LOCATION_GROUP_LANGUAGES_URL, payload)
  },

  get: async (locationGroupLanguageId, axiosConfig) => {
    return axios.get(`${ADMIN_LOCATION_GROUP_LANGUAGES_URL}/${locationGroupLanguageId}`, axiosConfig)
  },

  update: async (locationGroupLanguageId, payload) => {
    return axios.put(`${ADMIN_LOCATION_GROUP_LANGUAGES_URL}/${locationGroupLanguageId}`, payload)
  },

  delete: async (locationGroupLanguageId) => {
    return axios.delete(`${ADMIN_LOCATION_GROUP_LANGUAGES_URL}/${locationGroupLanguageId}`)
  },
}

export type { PayloadLocationGroupLanguageCreate, PayloadLocationGroupLanguageUpdate }

export default AdminLocationGroupLanguagesAPI
