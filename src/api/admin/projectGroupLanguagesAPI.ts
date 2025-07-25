import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

import { Response, ResponseSuccess } from '@models/apiBase'
import { ID } from '@models/base'
import { ProjectGroupLanguageModel } from '@models/projectGroupLanguage'

import { API_URL } from '@/constants/constant'

type ResponseProjectGroupLanguage = Response<{ project_group_language: ProjectGroupLanguageModel }>

type PayloadProjectGroupLanguageCreate = {
  image_alt: string
  language_id: ID
  project_group_id: ID
  name: string
}

type PayloadProjectGroupLanguageUpdate = {
  image_alt: string
  name: string
}

interface IAdminProjectGroupLanguagesAPI {
  create: (payload: PayloadProjectGroupLanguageCreate) => Promise<AxiosResponse<ResponseProjectGroupLanguage>>

  get: (
    projectGroupLanguageId: ID,
    axiosConfig?: AxiosRequestConfig
  ) => Promise<AxiosResponse<ResponseProjectGroupLanguage>>

  update: (
    projectGroupLanguageId: ID,
    payload: PayloadProjectGroupLanguageUpdate
  ) => Promise<AxiosResponse<ResponseProjectGroupLanguage>>

  delete: (projectGroupLanguageId: ID) => Promise<AxiosResponse<ResponseSuccess>>
}

const ADMIN_PROJECT_GROUP_LANGUAGES_URL = `${API_URL}/admin/project-group-languages`

const AdminProjectGroupLanguagesAPI: IAdminProjectGroupLanguagesAPI = {
  create: async (payload) => {
    return axios.post(ADMIN_PROJECT_GROUP_LANGUAGES_URL, payload)
  },

  get: async (projectGroupLanguageId, axiosConfig) => {
    return axios.get(`${ADMIN_PROJECT_GROUP_LANGUAGES_URL}/${projectGroupLanguageId}`, axiosConfig)
  },

  update: async (projectGroupLanguageId, payload) => {
    return axios.put(`${ADMIN_PROJECT_GROUP_LANGUAGES_URL}/${projectGroupLanguageId}`, payload)
  },

  delete: async (projectGroupLanguageId) => {
    return axios.delete(`${ADMIN_PROJECT_GROUP_LANGUAGES_URL}/${projectGroupLanguageId}`)
  },
}

export type { PayloadProjectGroupLanguageCreate, PayloadProjectGroupLanguageUpdate }

export default AdminProjectGroupLanguagesAPI
