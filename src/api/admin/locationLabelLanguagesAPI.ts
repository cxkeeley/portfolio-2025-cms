import axios, { AxiosResponse } from 'axios'

import { Response, ResponseSuccess } from '@models/apiBase'
import { ID } from '@models/base'
import { LocationLabelLanguageModel } from '@models/locationLabelLanguage'

import { API_URL } from '@/constants/constant'

type ResponseLocationLabelLanguage = Response<{ location_label_language: LocationLabelLanguageModel }>

type PayloadLocationLabelLanguageCreate = {
  language_id: ID
  location_label_id: ID
  name: string
}

type PayloadLocationLabelLanguageUpdate = {
  name: string
}

const ADMIN_LOCATION_LABEL_LANGUAGES_URL = `${API_URL}/admin/location-label-languages`

const AdminLocationLabelLanguageAPI = {
  create: async (
    payload: PayloadLocationLabelLanguageCreate
  ): Promise<AxiosResponse<ResponseLocationLabelLanguage>> => {
    return axios.post(ADMIN_LOCATION_LABEL_LANGUAGES_URL, payload)
  },

  update: async (
    id: ID,
    payload: PayloadLocationLabelLanguageUpdate
  ): Promise<AxiosResponse<ResponseLocationLabelLanguage>> => {
    return axios.put(`${ADMIN_LOCATION_LABEL_LANGUAGES_URL}/${id}`, payload)
  },

  delete: async (id: ID): Promise<AxiosResponse<ResponseSuccess>> => {
    return axios.delete(`${ADMIN_LOCATION_LABEL_LANGUAGES_URL}/${id}`)
  },
}

export type { PayloadLocationLabelLanguageCreate, PayloadLocationLabelLanguageUpdate }

export default AdminLocationLabelLanguageAPI
