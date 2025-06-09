import axios, { AxiosResponse } from 'axios'

import { RequestQuery, Response, ResponseSuccess, WithFilter } from '@models/apiBase'
import { ID } from '@models/base'
import { LocationLabelModel } from '@models/locationLabel'

import { API_URL } from '@/constants/constant'

type ResponseLocationLabelsWithFilter = Response<WithFilter<LocationLabelModel[]>>

type ResponseLocationLabel = Response<{ location_label: LocationLabelModel }>

type ResponseImage = Response<{ path: string }>

type PayloadCreateLocationLabel = {
  default_name: string
  map_icon_file_path: string
}

type PayloadUpdateLocationLabelMapIcon = {
  map_icon_file_path: string
}

type PayloadAdminLocationLabelsGetOptionsForLocationForm = RequestQuery<{}>

const ADMIN_LOCATION_LABELS_URL = `${API_URL}/admin/location-labels`

const AdminLocationLabelsAPI = {
  filter: async (payload: RequestQuery<{}>): Promise<AxiosResponse<ResponseLocationLabelsWithFilter>> => {
    return axios.post(`${ADMIN_LOCATION_LABELS_URL}/filter`, payload)
  },

  create: async (payload: PayloadCreateLocationLabel): Promise<AxiosResponse<ResponseLocationLabel>> => {
    return axios.post(`${ADMIN_LOCATION_LABELS_URL}`, payload)
  },

  delete: async (id: ID): Promise<AxiosResponse<ResponseSuccess>> => {
    return axios.delete(`${ADMIN_LOCATION_LABELS_URL}/${id}`)
  },

  get: async (id: ID): Promise<AxiosResponse<ResponseLocationLabel>> => {
    return axios.get(`${ADMIN_LOCATION_LABELS_URL}/${id}`)
  },

  updateMapIcon: async (
    id: ID,
    payload: PayloadUpdateLocationLabelMapIcon
  ): Promise<AxiosResponse<ResponseLocationLabel>> => {
    return axios.put(`${ADMIN_LOCATION_LABELS_URL}/${id}/map-icon`, payload)
  },

  uploadMapIcon: async (
    file: File,
    onProgress?: (progress: ProgressEvent) => void
  ): Promise<AxiosResponse<ResponseImage>> => {
    const formData = new FormData()
    formData.append('file', file)

    return axios.post(`${ADMIN_LOCATION_LABELS_URL}/upload-map-icon`, formData, {
      onUploadProgress: onProgress,
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
  },

  getOptionsForLocationForm: async (
    payload: PayloadAdminLocationLabelsGetOptionsForLocationForm
  ): Promise<AxiosResponse<ResponseLocationLabelsWithFilter>> => {
    return axios.post(`${ADMIN_LOCATION_LABELS_URL}/options/location-form`, payload)
  },
}

export type {
  PayloadAdminLocationLabelsGetOptionsForLocationForm,
  PayloadCreateLocationLabel,
  PayloadUpdateLocationLabelMapIcon,
}

export default AdminLocationLabelsAPI
