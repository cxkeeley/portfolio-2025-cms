import axios, { AxiosResponse } from 'axios'

import { RequestQuery, Response, ResponseSuccess } from '@models/apiBase'
import { ID } from '@models/base'
import { LocationImageModel } from '@models/locationImage'

import { API_URL } from '@/constants/constant'

type ResponseLocationImages = Response<{ location_images: LocationImageModel[] }>

type ResponseLocationImage = Response<{ location_image: LocationImageModel }>

type ResponseImage = Response<{ path: string }>

type PayloadAdminLocationImageFilter = RequestQuery<{
  location_id: ID
}>

type PayloadAdminLocationImageCreate = {
  default_image_alt: string
  default_image_caption: string
  image_file_path: string
  location_id: ID
}

type PayloadAdminLocationImageUpdate = {
  image_file_path: string
}

type PayloadAdminLocationImageMove = {
  location_id: ID
  position: number
}

const ADMIN_LOCATION_IMAGES_URL = `${API_URL}/admin/location-images`

const AdminLocationImagesAPI = {
  filter: async (query: PayloadAdminLocationImageFilter): Promise<AxiosResponse<ResponseLocationImages>> => {
    return axios.post(`${ADMIN_LOCATION_IMAGES_URL}/filter`, query)
  },

  get: async (locationId: ID): Promise<AxiosResponse<ResponseLocationImage>> => {
    return axios.get(`${ADMIN_LOCATION_IMAGES_URL}/${locationId}`)
  },

  create: async (payload: PayloadAdminLocationImageCreate): Promise<AxiosResponse<ResponseLocationImage>> => {
    return axios.post(ADMIN_LOCATION_IMAGES_URL, payload)
  },

  updateImage: async (
    locationImageId: ID,
    payload: PayloadAdminLocationImageUpdate
  ): Promise<AxiosResponse<ResponseLocationImage>> => {
    return axios.patch(`${ADMIN_LOCATION_IMAGES_URL}/${locationImageId}/image`, payload)
  },

  delete: async (locationImageId: ID): Promise<AxiosResponse<ResponseSuccess>> => {
    return axios.delete(`${ADMIN_LOCATION_IMAGES_URL}/${locationImageId}`)
  },

  move: async (
    locationImageId: ID,
    payload: PayloadAdminLocationImageMove
  ): Promise<AxiosResponse<ResponseLocationImage>> => {
    return axios.patch(`${ADMIN_LOCATION_IMAGES_URL}/${locationImageId}/move`, payload)
  },

  uploadImage: async (
    file: File,
    onProgress?: (progress: ProgressEvent) => void
  ): Promise<AxiosResponse<ResponseImage>> => {
    const formData = new FormData()
    formData.append('file', file)
    return axios.post(`${ADMIN_LOCATION_IMAGES_URL}/upload-image`, formData, {
      onUploadProgress: onProgress,
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
  },
}

export type { PayloadAdminLocationImageCreate, PayloadAdminLocationImageUpdate, PayloadAdminLocationImageFilter }

export default AdminLocationImagesAPI
