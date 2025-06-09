import axios, { AxiosResponse } from 'axios'

import { Response, ResponseSuccess } from '@models/apiBase'
import { ID } from '@models/base'
import { LocationImageLanguageModel } from '@models/locationImageLanguage'

import { API_URL } from '@/constants/constant'

type ResponseLocationImageLanguage = Response<{ location_image_language: LocationImageLanguageModel }>

type PayloadAdminLocationImageLanguageCreate = {
  image_alt: string
  image_caption: string
  language_id: ID
  location_image_id: ID
}

type PayloadAdminLocationImageLanguageUpdate = {
  image_alt: string
  image_caption: string
}

const ADMIN_LOCATION_IMAGE_LANGUAGES_URL = `${API_URL}/admin/location-image-languages`

const AdminLocationImageLanguagesAPI = {
  create: async (
    payload: PayloadAdminLocationImageLanguageCreate
  ): Promise<AxiosResponse<ResponseLocationImageLanguage>> => {
    return axios.post(ADMIN_LOCATION_IMAGE_LANGUAGES_URL, payload)
  },

  update: async (
    locationLanguageId: ID,
    payload: PayloadAdminLocationImageLanguageUpdate
  ): Promise<AxiosResponse<ResponseLocationImageLanguage>> => {
    return axios.put(`${ADMIN_LOCATION_IMAGE_LANGUAGES_URL}/${locationLanguageId}`, payload)
  },

  delete: async (locationLanguageId: ID): Promise<AxiosResponse<ResponseSuccess>> => {
    return axios.delete(`${ADMIN_LOCATION_IMAGE_LANGUAGES_URL}/${locationLanguageId}`)
  },
}

export type { PayloadAdminLocationImageLanguageCreate, PayloadAdminLocationImageLanguageUpdate }

export default AdminLocationImageLanguagesAPI
