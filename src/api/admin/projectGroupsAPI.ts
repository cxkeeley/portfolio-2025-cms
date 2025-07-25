import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

import { RequestQuery, Response, ResponseSuccess, WithFilter } from '@models/apiBase'
import { ID } from '@models/base'
import { ProjectGroupModel } from '@models/projectGroup'

import { API_URL } from '@/constants/constant'

const ADMIN_PROJECT_GROUPS_URL = `${API_URL}/admin/project-groups`

type ResponseProjectGroup = Response<{ project_group: ProjectGroupModel }>

type ResponseProjectGroups = Response<WithFilter<Array<ProjectGroupModel>>>

type ResponseProjectGroupOptions = Response<WithFilter<ProjectGroupModel[]>>

type ResponseImage = Response<{ path: string }>

type PayloadProjectGroupCreate = {
  image_file_path: string
  default_name: string
  default_image_alt: string
}

type PayloadProjectGroupUpdateImage = {
  image_file_path: string
}

interface IAdminProjectGroupsAPI {
  filter: (query: RequestQuery) => Promise<AxiosResponse<ResponseProjectGroups>>

  create: (payload: PayloadProjectGroupCreate) => Promise<AxiosResponse<ResponseProjectGroup>>

  get: (id: ID, axiosConfig?: AxiosRequestConfig) => Promise<AxiosResponse<ResponseProjectGroup>>

  delete: (id: ID) => Promise<AxiosResponse<ResponseSuccess>>

  getOptionsForProjectFilter: (query: RequestQuery) => Promise<AxiosResponse<ResponseProjectGroupOptions>>

  getOptionsForProjectForm: (payload: RequestQuery) => Promise<AxiosResponse<ResponseProjectGroupOptions>>

  getOptionsForMainPageProjectGroupForm: (payload: RequestQuery) => Promise<AxiosResponse<ResponseProjectGroupOptions>>

  updateImage: (id: ID, payload: PayloadProjectGroupUpdateImage) => Promise<AxiosResponse<ResponseImage>>

  uploadImage: (file: File, onProgress?: (progress: ProgressEvent) => void) => Promise<AxiosResponse<ResponseImage>>
}

const AdminProjectGroupsAPI: IAdminProjectGroupsAPI = {
  filter: async (query) => {
    return axios.post(`${ADMIN_PROJECT_GROUPS_URL}/filter`, query)
  },

  create: async (payload) => {
    return axios.post(`${ADMIN_PROJECT_GROUPS_URL}`, payload)
  },

  get: async (id, axiosConfig) => {
    return axios.get(`${ADMIN_PROJECT_GROUPS_URL}/${id}`, axiosConfig)
  },

  delete: async (id) => {
    return axios.delete(`${ADMIN_PROJECT_GROUPS_URL}/${id}`)
  },

  getOptionsForProjectFilter: async (query) => {
    return axios.post(`${ADMIN_PROJECT_GROUPS_URL}/options/project-filter`, query)
  },

  getOptionsForProjectForm: async (payload) => {
    return axios.post(`${ADMIN_PROJECT_GROUPS_URL}/options/project-form`, payload)
  },

  getOptionsForMainPageProjectGroupForm: async (payload) => {
    return axios.post(`${ADMIN_PROJECT_GROUPS_URL}/options/main-page-project-form`, payload)
  },

  updateImage: async (id, payload) => {
    return axios.patch(`${ADMIN_PROJECT_GROUPS_URL}/${id}/image`, payload)
  },

  uploadImage: (file, onProgress) => {
    const formData = new FormData()
    formData.append('file', file)

    return axios.post(`${ADMIN_PROJECT_GROUPS_URL}/upload-image`, formData, {
      onUploadProgress: onProgress,
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
  },
}

export type { PayloadProjectGroupCreate, PayloadProjectGroupUpdateImage }

export default AdminProjectGroupsAPI
