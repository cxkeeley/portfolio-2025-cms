import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

import { RequestQuery, Response, ResponseSuccess, WithFilter } from '@models/apiBase'
import { ID } from '@models/base'
import CategoryModel from '@models/category'

import { API_URL } from '@/constants/constant'

const ADMIN_CATEGORIES_API = `${API_URL}/admin/categories`

type ResponseCategoryOptions = Response<WithFilter<CategoryModel[]>>

type ResponseCategories = Response<{
  categories: Array<CategoryModel>
}>

type ResponseCategory = Response<{
  category: CategoryModel
}>

type ResponseFilePath = Response<{
  path: string
}>

type PayloadCreateCategory = {
  image_file_path: string
  default_name: string
}

type PayloadUpdateCategory = {
  image_file_path: string
}

type PayloadMoveCategory = {
  position: number
}

interface IAdminCategoriesAPI {
  filter: () => Promise<AxiosResponse<ResponseCategories>>

  create: (payload: PayloadCreateCategory) => Promise<AxiosResponse<ResponseCategory>>

  get: (id: ID, axiosConfig?: AxiosRequestConfig) => Promise<AxiosResponse<ResponseCategory>>

  update: (id: ID, payload: PayloadUpdateCategory) => Promise<AxiosResponse<ResponseCategory>>

  delete: (id: ID) => Promise<AxiosResponse<ResponseSuccess>>

  move: (id: ID, payload: PayloadMoveCategory) => Promise<AxiosResponse<ResponseCategory>>

  uploadImage: (
    file: File,
    onUploadProgress?: (ProgressEvent: ProgressEvent) => void,
    controller?: AbortController
  ) => Promise<AxiosResponse<ResponseFilePath>>

  getOptionsForArticleForm: (payload: RequestQuery) => Promise<AxiosResponse<ResponseCategoryOptions>>
}

const AdminCategoriesAPI: IAdminCategoriesAPI = {
  filter: async () => {
    return axios.post(`${ADMIN_CATEGORIES_API}/filter`)
  },

  create: async (payload) => {
    return axios.post(`${ADMIN_CATEGORIES_API}`, payload)
  },

  get: async (id, axiosConfig) => {
    return axios.get(`${ADMIN_CATEGORIES_API}/${id}`, axiosConfig)
  },

  update: async (id, payload) => {
    return axios.put(`${ADMIN_CATEGORIES_API}/${id}`, payload)
  },

  delete: async (id) => {
    return axios.delete(`${ADMIN_CATEGORIES_API}/${id}`)
  },

  move: async (id, payload) => {
    return axios.patch(`${ADMIN_CATEGORIES_API}/${id}/move`, payload)
  },

  uploadImage: async (file, onUploadProgress, controller) => {
    var bodyFormData = new FormData()
    bodyFormData.append('file', file)

    return axios.post(`${ADMIN_CATEGORIES_API}/upload-image`, bodyFormData, {
      signal: controller?.signal,
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onUploadProgress,
    })
  },

  getOptionsForArticleForm: (payload) => {
    return axios.post(`${ADMIN_CATEGORIES_API}/options/article-form`, payload)
  },
}

export type { PayloadCreateCategory, PayloadUpdateCategory, PayloadMoveCategory, ResponseCategories, ResponseCategory }

export default AdminCategoriesAPI
