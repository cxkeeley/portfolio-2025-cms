import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

import { RequestQuery, Response, ResponseSuccess, WithFilter } from '@models/apiBase'
import { ID } from '@models/base'
import { LocationGroupModel } from '@models/locationGroup'

import { API_URL } from '@/constants/constant'

const ADMIN_LOCATION_GROUPS_URL = `${API_URL}/admin/location-groups`

type ResponseLocationGroup = Response<{ location_group: LocationGroupModel }>

type ResponseLocationGroups = Response<WithFilter<Array<LocationGroupModel>>>

type ResponseLocationGroupOptions = Response<WithFilter<LocationGroupModel[]>>

type ResponseImage = Response<{ path: string }>

type PayloadLocationGroupCreate = {
  image_file_path: string
  default_name: string
  default_image_alt: string
}

type PayloadLocationGroupUpdateImage = {
  image_file_path: string
}

interface IAdminLocationGroupsAPI {
  filter: (query: RequestQuery) => Promise<AxiosResponse<ResponseLocationGroups>>

  create: (payload: PayloadLocationGroupCreate) => Promise<AxiosResponse<ResponseLocationGroup>>

  get: (id: ID, axiosConfig?: AxiosRequestConfig) => Promise<AxiosResponse<ResponseLocationGroup>>

  delete: (id: ID) => Promise<AxiosResponse<ResponseSuccess>>

  getOptionsForLocationFilter: (query: RequestQuery) => Promise<AxiosResponse<ResponseLocationGroupOptions>>

  getOptionsForLocationForm: (payload: RequestQuery) => Promise<AxiosResponse<ResponseLocationGroupOptions>>

  getOptionsForMainPageLocationGroupForm: (
    payload: RequestQuery
  ) => Promise<AxiosResponse<ResponseLocationGroupOptions>>

  updateImage: (id: ID, payload: PayloadLocationGroupUpdateImage) => Promise<AxiosResponse<ResponseImage>>

  uploadImage: (file: File, onProgress?: (progress: ProgressEvent) => void) => Promise<AxiosResponse<ResponseImage>>
}

const AdminLocationGroupsAPI: IAdminLocationGroupsAPI = {
  filter: async (query) => {
    return axios.post(`${ADMIN_LOCATION_GROUPS_URL}/filter`, query)
  },

  create: async (payload) => {
    return axios.post(`${ADMIN_LOCATION_GROUPS_URL}`, payload)
  },

  get: async (id, axiosConfig) => {
    return axios.get(`${ADMIN_LOCATION_GROUPS_URL}/${id}`, axiosConfig)
  },

  delete: async (id) => {
    return axios.delete(`${ADMIN_LOCATION_GROUPS_URL}/${id}`)
  },

  getOptionsForLocationFilter: async (query) => {
    return axios.post(`${ADMIN_LOCATION_GROUPS_URL}/options/location-filter`, query)
  },

  getOptionsForLocationForm: async (payload) => {
    return axios.post(`${ADMIN_LOCATION_GROUPS_URL}/options/location-form`, payload)
  },

  getOptionsForMainPageLocationGroupForm: async (payload) => {
    return axios.post(`${ADMIN_LOCATION_GROUPS_URL}/options/main-page-location-form`, payload)
  },

  updateImage: async (id, payload) => {
    return axios.patch(`${ADMIN_LOCATION_GROUPS_URL}/${id}/image`, payload)
  },

  uploadImage: (file, onProgress) => {
    const formData = new FormData()
    formData.append('file', file)

    return axios.post(`${ADMIN_LOCATION_GROUPS_URL}/upload-image`, formData, {
      onUploadProgress: onProgress,
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
  },
}

export type { PayloadLocationGroupCreate, PayloadLocationGroupUpdateImage }

export default AdminLocationGroupsAPI
