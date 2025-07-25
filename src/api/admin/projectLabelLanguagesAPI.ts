import axios, { AxiosResponse } from 'axios'

import { Response, ResponseSuccess } from '@models/apiBase'
import { ID } from '@models/base'
import { ProjectLabelLanguageModel } from '@models/projectLabelLanguage'

import { API_URL } from '@/constants/constant'

type ResponseProjectLabelLanguage = Response<{ project_label_language: ProjectLabelLanguageModel }>

type PayloadProjectLabelLanguageCreate = {
  language_id: ID
  project_label_id: ID
  name: string
}

type PayloadProjectLabelLanguageUpdate = {
  name: string
}

const ADMIN_PROJECT_LABEL_LANGUAGES_URL = `${API_URL}/admin/project-label-languages`

const AdminProjectLabelLanguageAPI = {
  create: async (payload: PayloadProjectLabelLanguageCreate): Promise<AxiosResponse<ResponseProjectLabelLanguage>> => {
    return axios.post(ADMIN_PROJECT_LABEL_LANGUAGES_URL, payload)
  },

  update: async (
    id: ID,
    payload: PayloadProjectLabelLanguageUpdate
  ): Promise<AxiosResponse<ResponseProjectLabelLanguage>> => {
    return axios.put(`${ADMIN_PROJECT_LABEL_LANGUAGES_URL}/${id}`, payload)
  },

  delete: async (id: ID): Promise<AxiosResponse<ResponseSuccess>> => {
    return axios.delete(`${ADMIN_PROJECT_LABEL_LANGUAGES_URL}/${id}`)
  },
}

export type { PayloadProjectLabelLanguageCreate, PayloadProjectLabelLanguageUpdate }

export default AdminProjectLabelLanguageAPI
