import axios, { AxiosResponse } from 'axios'

import { RequestQuery, Response, ResponseSuccess, WithFilter } from '@models/apiBase'
import { ArticleModel } from '@models/article'
import { ID } from '@models/base'

import { API_URL } from '@/constants/constant'

const ADMIN_ARTICLES_API = `${API_URL}/admin/articles`

type ResponseArticle = Response<{ article: ArticleModel }>

type ResponseArticles = Response<WithFilter<ArticleModel[]>>

type ResponseImage = Response<{ path: string }>

type PayloadFilterArticles = RequestQuery

type PayloadCreateArticle = {
  author_name: string
  category_id: ID
  default_image_caption: string | null
  default_lead: string | null
  default_reference: string | null
  default_title: string
  image_file_path: string
  reviewer: string | null
}

type PayloadUpdateArticle = {
  author_name: string
  category_id: ID
  image_file_path: string | null
  reviewer: string | null
}

interface IAdminArticlesAPI {
  create: (payload: PayloadCreateArticle) => Promise<AxiosResponse<ResponseArticle>>

  filter: (payload: PayloadFilterArticles) => Promise<AxiosResponse<ResponseArticles>>

  uploadImage: (file: File, onProgress?: (progress: ProgressEvent) => void) => Promise<AxiosResponse<ResponseImage>>

  get: (articleId: ID) => Promise<AxiosResponse<ResponseArticle>>

  update: (articleId: ID, payload: PayloadUpdateArticle) => Promise<AxiosResponse<ResponseArticle>>

  delete: (articleId: ID) => Promise<AxiosResponse<ResponseSuccess>>

  publish: (articleId: ID) => Promise<AxiosResponse<ResponseArticle>>

  unpublish: (articleId: ID) => Promise<AxiosResponse<ResponseArticle>>
}

const AdminArticlesAPI: IAdminArticlesAPI = {
  create: (payload) => {
    return axios.post(`${ADMIN_ARTICLES_API}`, payload)
  },

  filter: (payload) => {
    return axios.post(`${ADMIN_ARTICLES_API}/filter`, payload)
  },

  uploadImage: (file, onProgress) => {
    const formData = new FormData()
    formData.append('file', file)

    return axios.post(`${ADMIN_ARTICLES_API}/upload-image`, formData, {
      onUploadProgress: onProgress,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  get: (articleId) => {
    return axios.get(`${ADMIN_ARTICLES_API}/${articleId}`)
  },

  update: (articleId, payload) => {
    return axios.put(`${ADMIN_ARTICLES_API}/${articleId}`, payload)
  },

  delete: (articleId) => {
    return axios.delete(`${ADMIN_ARTICLES_API}/${articleId}`)
  },

  publish: (articleId) => {
    return axios.patch(`${ADMIN_ARTICLES_API}/${articleId}/publish`)
  },

  unpublish: (articleId: string) => {
    return axios.patch(`${ADMIN_ARTICLES_API}/${articleId}/unpublish`)
  },
}

export type { PayloadCreateArticle, PayloadFilterArticles, PayloadUpdateArticle, ResponseArticle }

export default AdminArticlesAPI
