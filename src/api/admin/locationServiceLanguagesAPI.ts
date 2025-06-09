import axios, { AxiosResponse } from 'axios'

import { Response, ResponseSuccess } from '@models/apiBase'
import { ID } from '@models/base'
import { LocationServiceLanguageModel } from '@models/locationServiceLanguage'

import { API_URL } from '@/constants/constant'

type ResponseLocationServiceLanguage = Response<{
  location_service_language: LocationServiceLanguageModel
}>

type PayloadLocationServiceLanguageCreate = {
  image_alt: string
  language_id: ID
  location_service_id: ID
  short_description: string
  title: string
}

type PayloadLocationServiceLanguageUpdate = {
  image_alt: string
  short_description: string
  title: string
}

const ADMIN_LOCATION_SERVICE_LANGUAGES_URL = `${API_URL}/admin/location-service-languages`

const AdminLocationServiceLanguagesAPI = {
  get: async (id: ID): Promise<AxiosResponse<ResponseLocationServiceLanguage>> => {
    return axios.get(`${ADMIN_LOCATION_SERVICE_LANGUAGES_URL}/${id}`)
  },

  create: async (payload: PayloadLocationServiceLanguageCreate): Promise<AxiosResponse<ResponseSuccess>> => {
    return axios.post(ADMIN_LOCATION_SERVICE_LANGUAGES_URL, payload)
  },

  update: async (
    id: ID,
    payload: PayloadLocationServiceLanguageUpdate
  ): Promise<AxiosResponse<ResponseLocationServiceLanguage>> => {
    return axios.put(`${ADMIN_LOCATION_SERVICE_LANGUAGES_URL}/${id}`, payload)
  },

  delete: async (id: ID): Promise<AxiosResponse<ResponseSuccess>> => {
    return axios.delete(`${ADMIN_LOCATION_SERVICE_LANGUAGES_URL}/${id}`)
  },
}

export type { PayloadLocationServiceLanguageCreate, PayloadLocationServiceLanguageUpdate }

export default AdminLocationServiceLanguagesAPI
