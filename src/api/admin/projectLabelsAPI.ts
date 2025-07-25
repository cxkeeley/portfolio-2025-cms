import axios, { AxiosResponse } from 'axios'

import { RequestQuery, Response, ResponseSuccess, WithFilter } from '@models/apiBase'
import { ID } from '@models/base'
import { ProjectLabelModel } from '@models/projectLabel'

import { API_URL } from '@/constants/constant'

type ResponseProjectLabelsWithFilter = Response<WithFilter<ProjectLabelModel[]>>

type ResponseProjectLabel = Response<{ project_label: ProjectLabelModel }>

type ResponseImage = Response<{ path: string }>

type PayloadCreateProjectLabel = {
  default_name: string
  map_icon_file_path: string
}

type PayloadUpdateProjectLabelMapIcon = {
  map_icon_file_path: string
}

type PayloadAdminProjectLabelsGetOptionsForProjectForm = RequestQuery<{}>

const ADMIN_PROJECT_LABELS_URL = `${API_URL}/admin/project-labels`

const AdminProjectLabelsAPI = {
  filter: async (payload: RequestQuery<{}>): Promise<AxiosResponse<ResponseProjectLabelsWithFilter>> => {
    return axios.post(`${ADMIN_PROJECT_LABELS_URL}/filter`, payload)
  },

  create: async (payload: PayloadCreateProjectLabel): Promise<AxiosResponse<ResponseProjectLabel>> => {
    return axios.post(`${ADMIN_PROJECT_LABELS_URL}`, payload)
  },

  delete: async (id: ID): Promise<AxiosResponse<ResponseSuccess>> => {
    return axios.delete(`${ADMIN_PROJECT_LABELS_URL}/${id}`)
  },

  get: async (id: ID): Promise<AxiosResponse<ResponseProjectLabel>> => {
    return axios.get(`${ADMIN_PROJECT_LABELS_URL}/${id}`)
  },

  updateMapIcon: async (
    id: ID,
    payload: PayloadUpdateProjectLabelMapIcon
  ): Promise<AxiosResponse<ResponseProjectLabel>> => {
    return axios.put(`${ADMIN_PROJECT_LABELS_URL}/${id}/map-icon`, payload)
  },

  uploadMapIcon: async (
    file: File,
    onProgress?: (progress: ProgressEvent) => void
  ): Promise<AxiosResponse<ResponseImage>> => {
    const formData = new FormData()
    formData.append('file', file)

    return axios.post(`${ADMIN_PROJECT_LABELS_URL}/upload-map-icon`, formData, {
      onUploadProgress: onProgress,
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
  },

  getOptionsForProjectForm: async (
    payload: PayloadAdminProjectLabelsGetOptionsForProjectForm
  ): Promise<AxiosResponse<ResponseProjectLabelsWithFilter>> => {
    return axios.post(`${ADMIN_PROJECT_LABELS_URL}/options/project-form`, payload)
  },
}

export type {
  PayloadAdminProjectLabelsGetOptionsForProjectForm,
  PayloadCreateProjectLabel,
  PayloadUpdateProjectLabelMapIcon,
}

export default AdminProjectLabelsAPI
