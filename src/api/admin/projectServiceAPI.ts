import axios, { AxiosResponse } from 'axios'

import { RequestQuery, Response, ResponseSuccess, WithFilter } from '@models/apiBase'
import { ID } from '@models/base'
import { ProjectServiceModel } from '@models/projectService'

import { API_URL } from '@/constants/constant'

type ResponseProjectServicesWithFilter = Response<WithFilter<Array<ProjectServiceModel>>>

type ResponseProjectService = Response<{
  project_service: ProjectServiceModel
}>

type ResponseImage = Response<{ path: string }>

type PayloadProjectServiceCreate = {
  default_image_alt: string | null
  default_short_description: string
  default_title: string
  image_file_path: string
}

type PayloadProjectServiceImageUpdate = {
  image_file_path: string
}

const ADMIN_PROJECT_SERVICES_URL = `${API_URL}/admin/project-services`

const AdminProjectServicesAPI = {
  filter: async (payload: RequestQuery): Promise<AxiosResponse<ResponseProjectServicesWithFilter>> => {
    return axios.post(`${ADMIN_PROJECT_SERVICES_URL}/filter`, payload)
  },

  get: async (id: ID): Promise<AxiosResponse<ResponseProjectService>> => {
    return axios.get(`${ADMIN_PROJECT_SERVICES_URL}/${id}`)
  },

  create: async (payload: PayloadProjectServiceCreate): Promise<AxiosResponse<ResponseProjectService>> => {
    return axios.post(ADMIN_PROJECT_SERVICES_URL, payload)
  },

  delete: async (id: ID): Promise<AxiosResponse<ResponseSuccess>> => {
    return axios.delete(`${ADMIN_PROJECT_SERVICES_URL}/${id}`)
  },

  updateImage: async (id: ID, payload: PayloadProjectServiceImageUpdate) => {
    return axios.patch(`${ADMIN_PROJECT_SERVICES_URL}/${id}/image`, payload)
  },

  uploadImage: (file: File, onProgress?: (progress: ProgressEvent) => void): Promise<AxiosResponse<ResponseImage>> => {
    const formData = new FormData()
    formData.append('file', file)

    return axios.post(`${ADMIN_PROJECT_SERVICES_URL}/upload-image`, formData, {
      onUploadProgress: onProgress,
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
  },
}

export type { PayloadProjectServiceCreate, PayloadProjectServiceImageUpdate }

export default AdminProjectServicesAPI
