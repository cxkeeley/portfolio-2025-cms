import { API_URL } from '@/constants/constant'
import { Response, ResponseSuccess } from '@/models/apiBase'
import { ID } from '@/models/base'
import { PromotionLanguageModel } from '@/models/promotionLanguage'
import axios, { AxiosResponse } from 'axios'

type ResponsePromotionLanguage = Response<{
  promotion_language: PromotionLanguageModel
}>

type PayloadCreatePromotionLanguage = {
  language_id: ID
  lead: string | null
  promotion_id: ID
  reference: string | null
  title: string
}

type PayloadUpdatePromotionLanguage = {
  lead: string | null
  reference: string | null
  slug: string
  title: string
}

type PayloadUpdatePromotionLanguageContent = {
  content: string
}

type PayloadUpdatePromotionLanguageTermAndConditions = {
  term_and_conditions: string
}

interface IAdminPromotionLanguagesAPI {
  create: (payload: PayloadCreatePromotionLanguage) => Promise<AxiosResponse<ResponsePromotionLanguage>>

  delete: (id: ID) => Promise<AxiosResponse<ResponseSuccess>>

  get: (id: ID) => Promise<AxiosResponse<ResponsePromotionLanguage>>

  update: (id: ID, payload: PayloadUpdatePromotionLanguage) => Promise<AxiosResponse<ResponsePromotionLanguage>>

  updateContent: (
    id: ID,
    payload: PayloadUpdatePromotionLanguageContent
  ) => Promise<AxiosResponse<ResponsePromotionLanguage>>

  updateTermAndConditions: (
    id: ID,
    payload: PayloadUpdatePromotionLanguageTermAndConditions
  ) => Promise<AxiosResponse<ResponsePromotionLanguage>>
}

const ADMIN_PROMOTION_LANGUAGES_API_URL = `${API_URL}/admin/promotion-languages`

const AdminPromotionLanguageAPI: IAdminPromotionLanguagesAPI = {
  create: (payload) => {
    return axios.post(ADMIN_PROMOTION_LANGUAGES_API_URL, payload)
  },

  delete: (id) => {
    return axios.delete(`${ADMIN_PROMOTION_LANGUAGES_API_URL}/${id}`)
  },

  get: (id) => {
    return axios.get(`${ADMIN_PROMOTION_LANGUAGES_API_URL}/${id}`)
  },

  update: (id, payload) => {
    return axios.put(`${ADMIN_PROMOTION_LANGUAGES_API_URL}/${id}`, payload)
  },

  updateContent: (id, payload) => {
    return axios.patch(`${ADMIN_PROMOTION_LANGUAGES_API_URL}/${id}/content`, payload)
  },

  updateTermAndConditions: (id, payload) => {
    return axios.patch(`${ADMIN_PROMOTION_LANGUAGES_API_URL}/${id}/term-and-conditions`, payload)
  },
}

export type { PayloadCreatePromotionLanguage, PayloadUpdatePromotionLanguage, PayloadUpdatePromotionLanguageContent }

export default AdminPromotionLanguageAPI
