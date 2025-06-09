import { API_URL } from '@/constants/constant'
import { RequestQuery, Response, ResponseSuccess } from '@/models/apiBase'
import { ID } from '@/models/base'
import { PromotionModel, PromotionStatusEnum } from '@/models/promotion'
import axios, { AxiosResponse } from 'axios'

type ResponsePromotions = Response<{
  promotions: Array<PromotionModel>
}>

type ResponsePromotion = Response<{
  promotion: PromotionModel
}>

type ResponseImage = Response<{ path: string }>

type PayloadFilterPromotions = Pick<
  RequestQuery<{
    status: PromotionStatusEnum
  }>,
  'phrase' | 'status'
>

type PayloadMovePromotion = {
  position: number
}

type PayloadCreatePromotion = {
  default_title: string
  image_file_path: string
  default_lead: string | null
  default_reference: string | null
  whatsapp_text: string | null
}

type PayloadUpdatePromotion = {
  image_file_path: string
  whatsapp_text: string | null
}

interface IAdminPromotionsAPI {
  filter: (payload: PayloadFilterPromotions) => Promise<AxiosResponse<ResponsePromotions>>

  move: (id: ID, payload: PayloadMovePromotion) => Promise<AxiosResponse<ResponsePromotion>>

  delete: (id: ID) => Promise<AxiosResponse<ResponseSuccess>>

  create: (payload: PayloadCreatePromotion) => Promise<AxiosResponse<ResponsePromotion>>

  update: (id: ID, payload: PayloadUpdatePromotion) => Promise<AxiosResponse<ResponsePromotion>>

  get: (id: ID) => Promise<AxiosResponse<ResponsePromotion>>

  uploadImage: (
    file: File,
    onUploadProgress?: (ProgressEvent: ProgressEvent) => void,
    controller?: AbortController
  ) => Promise<AxiosResponse<ResponseImage>>

  publish: (id: ID) => Promise<AxiosResponse<ResponsePromotion>>

  unpublish: (id: ID) => Promise<AxiosResponse<ResponsePromotion>>
}

const ADMIN_PROMOTIONS_API_URL = `${API_URL}/admin/promotions`

const AdminPromotionsAPI: IAdminPromotionsAPI = {
  filter: (payload) => {
    return axios.post(`${ADMIN_PROMOTIONS_API_URL}/filter`, payload)
  },

  move: (id, payload) => {
    return axios.patch(`${ADMIN_PROMOTIONS_API_URL}/${id}/move`, payload)
  },

  delete: (id) => {
    return axios.delete(`${ADMIN_PROMOTIONS_API_URL}/${id}`)
  },

  create: (payload) => {
    return axios.post(ADMIN_PROMOTIONS_API_URL, payload)
  },

  update: (id, payload) => {
    return axios.put(`${ADMIN_PROMOTIONS_API_URL}/${id}`, payload)
  },

  get: (id) => {
    return axios.get(`${ADMIN_PROMOTIONS_API_URL}/${id}`)
  },

  uploadImage: (file, onUploadProgress, controller) => {
    const formData = new FormData()
    formData.append('file', file)

    return axios.post(`${ADMIN_PROMOTIONS_API_URL}/upload-image`, formData, {
      onUploadProgress,
      signal: controller?.signal,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  publish: (id) => {
    return axios.patch(`${ADMIN_PROMOTIONS_API_URL}/${id}/publish`)
  },

  unpublish: (id) => {
    return axios.patch(`${ADMIN_PROMOTIONS_API_URL}/${id}/unpublish`)
  },
}

export type { ResponsePromotions, PayloadCreatePromotion, ResponsePromotion, PayloadUpdatePromotion }

export default AdminPromotionsAPI
