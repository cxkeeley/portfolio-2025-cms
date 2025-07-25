import axios, { AxiosResponse } from 'axios'

import { Response, ResponseSuccess } from '@models/apiBase'
import { ID } from '@models/base'
import { ProjectLanguageModel } from '@models/projectLanguage'

import { API_URL } from '@/constants/constant'

type ResponseProjectLanguage = Response<{ project_language: ProjectLanguageModel }>

type PayloadAdminProjectLanguageCreate = {
  address: string
  description: string
  project_id: ID
  language_id: ID
  name: string
  short_name: string
}

type PayloadAdminProjectLanguageUpdate = {
  address: string
  description: string
  name: string
  short_name: string
}

const ADMIN_PROJECT_LANGUAGES_URL = `${API_URL}/admin/project-languages`

const AdminProjectLanguagesAPI = {
  create: async (payload: PayloadAdminProjectLanguageCreate): Promise<AxiosResponse<ResponseProjectLanguage>> => {
    return axios.post(ADMIN_PROJECT_LANGUAGES_URL, payload)
  },

  get: async (projectLanguageId: ID): Promise<AxiosResponse<ResponseProjectLanguage>> => {
    return axios.get(`${ADMIN_PROJECT_LANGUAGES_URL}/${projectLanguageId}`)
  },

  update: async (
    projectLanguageId: ID,
    payload: PayloadAdminProjectLanguageUpdate
  ): Promise<AxiosResponse<ResponseProjectLanguage>> => {
    return axios.put(`${ADMIN_PROJECT_LANGUAGES_URL}/${projectLanguageId}`, payload)
  },

  delete: async (projectId: ID): Promise<AxiosResponse<ResponseSuccess>> => {
    return axios.delete(`${ADMIN_PROJECT_LANGUAGES_URL}/${projectId}`)
  },
}

export type { PayloadAdminProjectLanguageCreate, PayloadAdminProjectLanguageUpdate }

export default AdminProjectLanguagesAPI
