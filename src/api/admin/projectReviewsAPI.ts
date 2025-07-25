import axios, { AxiosResponse } from 'axios'

import { RequestQuery, Response, ResponseSuccess, WithFilter } from '@models/apiBase'
import { ID } from '@models/base'
import { ProjectReviewModel } from '@models/projectReview'

import { API_URL } from '@/constants/constant'

type ResponseProjectReviewsWithFilter = Response<WithFilter<ProjectReviewModel[]>>

type ResponseProjectReview = Response<{ project_review: ProjectReviewModel }>

type ResponseImage = Response<{ path: string }>

type PayloadAdminProjectReviewFilter = RequestQuery<{
  project_id: ID
}>

type PayloadAdminProjectReviewCreate = {
  client_image_alt: string | null
  client_image_file_path: string
  client_name: string
  project_id: string
  story: string
}

type PayloadAdminProjectReviewUpdate = {
  client_image_alt: string | null
  client_image_file_path: string | null
  client_name: string
  story: string
}

const ADMIN_PROJECT_REVIEWS_URL = `${API_URL}/admin/project-reviews`

const AdminProjectReviewsAPI = {
  filter: async (query: PayloadAdminProjectReviewFilter): Promise<AxiosResponse<ResponseProjectReviewsWithFilter>> => {
    return axios.post(`${ADMIN_PROJECT_REVIEWS_URL}/filter`, query)
  },

  get: async (projectReviewId: ID): Promise<AxiosResponse<ResponseProjectReview>> => {
    return axios.get(`${ADMIN_PROJECT_REVIEWS_URL}/${projectReviewId}`)
  },

  create: async (payload: PayloadAdminProjectReviewCreate): Promise<AxiosResponse<ResponseProjectReview>> => {
    return axios.post(ADMIN_PROJECT_REVIEWS_URL, payload)
  },

  delete: async (projectImageId: ID): Promise<AxiosResponse<ResponseSuccess>> => {
    return axios.delete(`${ADMIN_PROJECT_REVIEWS_URL}/${projectImageId}`)
  },

  update: async (
    projectImageId: ID,
    payload: PayloadAdminProjectReviewUpdate
  ): Promise<AxiosResponse<ResponseProjectReview>> => {
    return axios.put(`${ADMIN_PROJECT_REVIEWS_URL}/${projectImageId}`, payload)
  },

  uploadImage: async (
    file: File,
    onProgress?: (progress: ProgressEvent) => void
  ): Promise<AxiosResponse<ResponseImage>> => {
    const formData = new FormData()
    formData.append('file', file)
    return axios.post(`${ADMIN_PROJECT_REVIEWS_URL}/upload-image`, formData, {
      onUploadProgress: onProgress,
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
  },
}

export type { PayloadAdminProjectReviewCreate, PayloadAdminProjectReviewFilter, PayloadAdminProjectReviewUpdate }

export default AdminProjectReviewsAPI
