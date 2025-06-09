import axios, { AxiosResponse } from 'axios'

import { RequestQuery, Response, ResponseSuccess, WithFilter } from '@models/apiBase'
import { ID } from '@models/base'
import { LocationServiceModel } from '@models/locationService'

import { API_URL } from '@/constants/constant'

type ResponseLocationServicesWithFilter = Response<WithFilter<Array<LocationServiceModel>>>

type ResponseLocationService = Response<{
  location_service: LocationServiceModel
}>

type ResponseImage = Response<{ path: string }>

type PayloadLocationServiceCreate = {
  default_image_alt: string | null
  default_short_description: string
  default_title: string
  image_file_path: string
}

type PayloadLocationServiceImageUpdate = {
  image_file_path: string
}

const ADMIN_LOCATION_SERVICES_URL = `${API_URL}/admin/location-services`

const AdminLocationServicesAPI = {
  filter: async (payload: RequestQuery): Promise<AxiosResponse<ResponseLocationServicesWithFilter>> => {
    return axios.post(`${ADMIN_LOCATION_SERVICES_URL}/filter`, payload)
  },

  get: async (id: ID): Promise<AxiosResponse<ResponseLocationService>> => {
    return axios.get(`${ADMIN_LOCATION_SERVICES_URL}/${id}`)
  },

  create: async (payload: PayloadLocationServiceCreate): Promise<AxiosResponse<ResponseLocationService>> => {
    return axios.post(ADMIN_LOCATION_SERVICES_URL, payload)
  },

  delete: async (id: ID): Promise<AxiosResponse<ResponseSuccess>> => {
    return axios.delete(`${ADMIN_LOCATION_SERVICES_URL}/${id}`)
  },

  updateImage: async (id: ID, payload: PayloadLocationServiceImageUpdate) => {
    return axios.patch(`${ADMIN_LOCATION_SERVICES_URL}/${id}/image`, payload)
  },

  uploadImage: (file: File, onProgress?: (progress: ProgressEvent) => void): Promise<AxiosResponse<ResponseImage>> => {
    const formData = new FormData()
    formData.append('file', file)

    return axios.post(`${ADMIN_LOCATION_SERVICES_URL}/upload-image`, formData, {
      onUploadProgress: onProgress,
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
  },
}

export type { PayloadLocationServiceCreate, PayloadLocationServiceImageUpdate }

export default AdminLocationServicesAPI
