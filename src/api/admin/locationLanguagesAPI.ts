import axios, { AxiosResponse } from 'axios'

import { Response, ResponseSuccess } from '@models/apiBase'
import { ID } from '@models/base'
import { LocationLanguageModel } from '@models/locationLanguage'

import { API_URL } from '@/constants/constant'

type ResponseLocationLanguage = Response<{ location_language: LocationLanguageModel }>

type PayloadAdminLocationLanguageCreate = {
  address: string
  description: string
  location_id: ID
  language_id: ID
  name: string
  short_name: string
}

type PayloadAdminLocationLanguageUpdate = {
  address: string
  description: string
  name: string
  short_name: string
}

const ADMIN_LOCATION_LANGUAGES_URL = `${API_URL}/admin/location-languages`

const AdminLocationLanguagesAPI = {
  create: async (payload: PayloadAdminLocationLanguageCreate): Promise<AxiosResponse<ResponseLocationLanguage>> => {
    return axios.post(ADMIN_LOCATION_LANGUAGES_URL, payload)
  },

  get: async (locationLanguageId: ID): Promise<AxiosResponse<ResponseLocationLanguage>> => {
    return axios.get(`${ADMIN_LOCATION_LANGUAGES_URL}/${locationLanguageId}`)
  },

  update: async (
    locationLanguageId: ID,
    payload: PayloadAdminLocationLanguageUpdate
  ): Promise<AxiosResponse<ResponseLocationLanguage>> => {
    return axios.put(`${ADMIN_LOCATION_LANGUAGES_URL}/${locationLanguageId}`, payload)
  },

  delete: async (locationId: ID): Promise<AxiosResponse<ResponseSuccess>> => {
    return axios.delete(`${ADMIN_LOCATION_LANGUAGES_URL}/${locationId}`)
  },
}

export type { PayloadAdminLocationLanguageCreate, PayloadAdminLocationLanguageUpdate }

export default AdminLocationLanguagesAPI
