import axios, { AxiosResponse } from 'axios'

import { Response, ResponseSuccess } from '@models/apiBase'
import { ID } from '@models/base'
import { ProjectImageLanguageModel } from '@models/projectImageLanguage'

import { API_URL } from '@/constants/constant'

type ResponseProjectImageLanguage = Response<{ project_image_language: ProjectImageLanguageModel }>

type PayloadAdminProjectImageLanguageCreate = {
  image_alt: string
  image_caption: string
  language_id: ID
  project_image_id: ID
}

type PayloadAdminProjectImageLanguageUpdate = {
  image_alt: string
  image_caption: string
}

const ADMIN_PROJECT_IMAGE_LANGUAGES_URL = `${API_URL}/admin/project-image-languages`

const AdminProjectImageLanguagesAPI = {
  create: async (
    payload: PayloadAdminProjectImageLanguageCreate
  ): Promise<AxiosResponse<ResponseProjectImageLanguage>> => {
    return axios.post(ADMIN_PROJECT_IMAGE_LANGUAGES_URL, payload)
  },

  update: async (
    projectLanguageId: ID,
    payload: PayloadAdminProjectImageLanguageUpdate
  ): Promise<AxiosResponse<ResponseProjectImageLanguage>> => {
    return axios.put(`${ADMIN_PROJECT_IMAGE_LANGUAGES_URL}/${projectLanguageId}`, payload)
  },

  delete: async (projectLanguageId: ID): Promise<AxiosResponse<ResponseSuccess>> => {
    return axios.delete(`${ADMIN_PROJECT_IMAGE_LANGUAGES_URL}/${projectLanguageId}`)
  },
}

export type { PayloadAdminProjectImageLanguageCreate, PayloadAdminProjectImageLanguageUpdate }

export default AdminProjectImageLanguagesAPI
