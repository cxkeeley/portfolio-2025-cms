import axios, { AxiosResponse } from 'axios'

import { RequestQuery, Response, ResponseSuccess, WithFilter } from '@models/apiBase'
import { ID } from '@models/base'
import { LocationReviewModel } from '@models/locationReview'

import { API_URL } from '@/constants/constant'

type ResponseLocationReviewsWithFilter = Response<WithFilter<LocationReviewModel[]>>

type ResponseLocationReview = Response<{ location_review: LocationReviewModel }>

type ResponseImage = Response<{ path: string }>

type PayloadAdminLocationReviewFilter = RequestQuery<{
  location_id: ID
}>

type PayloadAdminLocationReviewCreate = {
  client_image_alt: string | null
  client_image_file_path: string
  client_name: string
  location_id: string
  story: string
}

type PayloadAdminLocationReviewUpdate = {
  client_image_alt: string | null
  client_image_file_path: string | null
  client_name: string
  story: string
}

const ADMIN_LOCATION_REVIEWS_URL = `${API_URL}/admin/location-reviews`

const AdminLocationReviewsAPI = {
  filter: async (
    query: PayloadAdminLocationReviewFilter
  ): Promise<AxiosResponse<ResponseLocationReviewsWithFilter>> => {
    return axios.post(`${ADMIN_LOCATION_REVIEWS_URL}/filter`, query)
  },

  get: async (locationReviewId: ID): Promise<AxiosResponse<ResponseLocationReview>> => {
    return axios.get(`${ADMIN_LOCATION_REVIEWS_URL}/${locationReviewId}`)
  },

  create: async (payload: PayloadAdminLocationReviewCreate): Promise<AxiosResponse<ResponseLocationReview>> => {
    return axios.post(ADMIN_LOCATION_REVIEWS_URL, payload)
  },

  delete: async (locationImageId: ID): Promise<AxiosResponse<ResponseSuccess>> => {
    return axios.delete(`${ADMIN_LOCATION_REVIEWS_URL}/${locationImageId}`)
  },

  update: async (
    locationImageId: ID,
    payload: PayloadAdminLocationReviewUpdate
  ): Promise<AxiosResponse<ResponseLocationReview>> => {
    return axios.put(`${ADMIN_LOCATION_REVIEWS_URL}/${locationImageId}`, payload)
  },

  uploadImage: async (
    file: File,
    onProgress?: (progress: ProgressEvent) => void
  ): Promise<AxiosResponse<ResponseImage>> => {
    const formData = new FormData()
    formData.append('file', file)
    return axios.post(`${ADMIN_LOCATION_REVIEWS_URL}/upload-image`, formData, {
      onUploadProgress: onProgress,
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
  },
}

export type { PayloadAdminLocationReviewCreate, PayloadAdminLocationReviewFilter, PayloadAdminLocationReviewUpdate }

export default AdminLocationReviewsAPI
