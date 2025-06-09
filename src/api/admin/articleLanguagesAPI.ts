import axios, { AxiosResponse } from 'axios'

import { Response, ResponseSuccess } from '@models/apiBase'
import ArticleLanguageModel from '@models/articleLanguage'
import { ID } from '@models/base'

import { API_URL } from '@/constants/constant'

const ADMIN_ARTICLE_LANGUAGES_API = `${API_URL}/admin/article-languages`

type ResponseArticleLanguage = Response<{ article_language: ArticleLanguageModel }>

type PayloadCreateArticleLanguage = {
  article_id: ID
  image_caption: string | null
  language_id: ID
  lead: string | null
  reference: string | null
  title: string
}

type PayloadUpdateArticleLanguage = {
  image_caption: string | null
  lead: string | null
  reference: string | null
  slug: string
  title: string
}

interface IAdminArticleLanguagesAPI {
  create: (payload: PayloadCreateArticleLanguage) => Promise<AxiosResponse<ResponseArticleLanguage>>

  get: (articleLanguageId: ID) => Promise<AxiosResponse<ResponseArticleLanguage>>

  update: (articleLanguageId: ID, payload: PayloadUpdateArticleLanguage) => Promise<AxiosResponse>

  delete: (articleLanguageId: ID) => Promise<AxiosResponse<ResponseSuccess>>

  setContent: (articleLanguageId: ID, content: string) => Promise<AxiosResponse<ResponseArticleLanguage>>
}

const AdminArticleLanguageAPI: IAdminArticleLanguagesAPI = {
  create: (payload) => {
    return axios.post(`${ADMIN_ARTICLE_LANGUAGES_API}`, payload)
  },

  get: (articleLanguageId) => {
    return axios.get(`${ADMIN_ARTICLE_LANGUAGES_API}/${articleLanguageId}`)
  },

  update: (articleLanguageId, payload) => {
    return axios.put(`${ADMIN_ARTICLE_LANGUAGES_API}/${articleLanguageId}`, payload)
  },

  delete: (articleLanguageId) => {
    return axios.delete(`${ADMIN_ARTICLE_LANGUAGES_API}/${articleLanguageId}`)
  },

  setContent: (articleLanguageId, content) => {
    return axios.patch(`${ADMIN_ARTICLE_LANGUAGES_API}/${articleLanguageId}/content`, { content })
  },
}

export type { PayloadCreateArticleLanguage, PayloadUpdateArticleLanguage }

export default AdminArticleLanguageAPI
