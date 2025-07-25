import axios, { AxiosResponse } from 'axios'

import { Response, ResponseSuccess } from '@models/apiBase'
import { ID } from '@models/base'
import { ProjectServiceLanguageModel } from '@models/projectServiceLanguage'

import { API_URL } from '@/constants/constant'

type ResponseProjectServiceLanguage = Response<{
  project_service_language: ProjectServiceLanguageModel
}>

type PayloadProjectServiceLanguageCreate = {
  image_alt: string
  language_id: ID
  project_service_id: ID
  short_description: string
  title: string
}

type PayloadProjectServiceLanguageUpdate = {
  image_alt: string
  short_description: string
  title: string
}

const ADMIN_PROJECT_SERVICE_LANGUAGES_URL = `${API_URL}/admin/project-service-languages`

const AdminProjectServiceLanguagesAPI = {
  get: async (id: ID): Promise<AxiosResponse<ResponseProjectServiceLanguage>> => {
    return axios.get(`${ADMIN_PROJECT_SERVICE_LANGUAGES_URL}/${id}`)
  },

  create: async (payload: PayloadProjectServiceLanguageCreate): Promise<AxiosResponse<ResponseSuccess>> => {
    return axios.post(ADMIN_PROJECT_SERVICE_LANGUAGES_URL, payload)
  },

  update: async (
    id: ID,
    payload: PayloadProjectServiceLanguageUpdate
  ): Promise<AxiosResponse<ResponseProjectServiceLanguage>> => {
    return axios.put(`${ADMIN_PROJECT_SERVICE_LANGUAGES_URL}/${id}`, payload)
  },

  delete: async (id: ID): Promise<AxiosResponse<ResponseSuccess>> => {
    return axios.delete(`${ADMIN_PROJECT_SERVICE_LANGUAGES_URL}/${id}`)
  },
}

export type { PayloadProjectServiceLanguageCreate, PayloadProjectServiceLanguageUpdate }

export default AdminProjectServiceLanguagesAPI
