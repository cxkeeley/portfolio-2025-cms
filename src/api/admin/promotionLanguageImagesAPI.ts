import { API_URL } from '@/constants/constant'
import { Response } from '@/models/apiBase'
import { ID } from '@/models/base'
import { PromotionLanguageImageModel } from '@/models/promotionLanguageImage'
import axios, { AxiosResponse } from 'axios'

type ResponsePromotionLanguageImage = Response<{
  promotion_language_image: PromotionLanguageImageModel
}>

type PayloadUploadImagePromotionLanguageImage = {
  file: File
  promotion_language_id: ID
}

interface IAdminPromotionLanguageImagesAPI {
  uploadImage: (
    payload: PayloadUploadImagePromotionLanguageImage
  ) => Promise<AxiosResponse<ResponsePromotionLanguageImage>>
}

const ADMIN_PROMOTION_LANGUAGE_IMAGES_API_URL = `${API_URL}/admin/promotion-language-images`

const AdminPromotionLanguageImagesAPI: IAdminPromotionLanguageImagesAPI = {
  uploadImage: (payload) => {
    const formData = new FormData()
    formData.append('file', payload.file)
    formData.append('promotion_language_id', payload.promotion_language_id)

    return axios.post(`${ADMIN_PROMOTION_LANGUAGE_IMAGES_API_URL}/upload-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}

export type { PayloadUploadImagePromotionLanguageImage }

export default AdminPromotionLanguageImagesAPI
