import axios, { AxiosResponse } from 'axios'

import { RequestQuery, Response, ResponseSuccess } from '@models/apiBase'
import { ID } from '@models/base'
import { ProjectImageModel } from '@models/projectImage'

import { API_URL } from '@/constants/constant'

type ResponseProjectImages = Response<{ project_images: ProjectImageModel[] }>

type ResponseProjectImage = Response<{ project_image: ProjectImageModel }>

type ResponseImage = Response<{ path: string }>

type PayloadAdminProjectImageFilter = RequestQuery<{
  project_id: ID
}>

type PayloadAdminProjectImageCreate = {
  default_image_alt: string
  default_image_caption: string
  image_file_path: string
  project_id: ID
}

type PayloadAdminProjectImageUpdate = {
  image_file_path: string
}

type PayloadAdminProjectImageMove = {
  project_id: ID
  position: number
}

const ADMIN_PROJECT_IMAGES_URL = `${API_URL}/admin/project-images`

const AdminProjectImagesAPI = {
  filter: async (query: PayloadAdminProjectImageFilter): Promise<AxiosResponse<ResponseProjectImages>> => {
    return axios.post(`${ADMIN_PROJECT_IMAGES_URL}/filter`, query)
  },

  get: async (projectId: ID): Promise<AxiosResponse<ResponseProjectImage>> => {
    return axios.get(`${ADMIN_PROJECT_IMAGES_URL}/${projectId}`)
  },

  create: async (payload: PayloadAdminProjectImageCreate): Promise<AxiosResponse<ResponseProjectImage>> => {
    return axios.post(ADMIN_PROJECT_IMAGES_URL, payload)
  },

  updateImage: async (
    projectImageId: ID,
    payload: PayloadAdminProjectImageUpdate
  ): Promise<AxiosResponse<ResponseProjectImage>> => {
    return axios.patch(`${ADMIN_PROJECT_IMAGES_URL}/${projectImageId}/image`, payload)
  },

  delete: async (projectImageId: ID): Promise<AxiosResponse<ResponseSuccess>> => {
    return axios.delete(`${ADMIN_PROJECT_IMAGES_URL}/${projectImageId}`)
  },

  move: async (
    projectImageId: ID,
    payload: PayloadAdminProjectImageMove
  ): Promise<AxiosResponse<ResponseProjectImage>> => {
    return axios.patch(`${ADMIN_PROJECT_IMAGES_URL}/${projectImageId}/move`, payload)
  },

  uploadImage: async (
    file: File,
    onProgress?: (progress: ProgressEvent) => void
  ): Promise<AxiosResponse<ResponseImage>> => {
    const formData = new FormData()
    formData.append('file', file)
    return axios.post(`${ADMIN_PROJECT_IMAGES_URL}/upload-image`, formData, {
      onUploadProgress: onProgress,
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
  },
}

export type { PayloadAdminProjectImageCreate, PayloadAdminProjectImageUpdate, PayloadAdminProjectImageFilter }

export default AdminProjectImagesAPI
