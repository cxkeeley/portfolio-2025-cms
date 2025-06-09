import axios, { AxiosResponse } from 'axios'

import { Response, ResponseSuccess } from '@models/apiBase'
import { ID } from '@models/base'

import { API_URL } from '@/constants/constant'
import { BannerModel } from '@/models/banner'

type ResponseBanners = Response<{ banners: Array<BannerModel> }>

type ResponseBanner = Response<{ banner: BannerModel }>

type ResponseImage = Response<{ path: string }>

type PayloadAdminCreateBanner = {
  image_file_path: string
  url: string | null
}

type PayloadAdminUpdateBanner = {
  image_file_path: string | null
  url: string | null
}

type PayloadAdminMoveBanner = {
  position: number
}

interface IAdminBannersAPI {
  filter: () => Promise<AxiosResponse<ResponseBanners>>

  create: (payload: PayloadAdminCreateBanner) => Promise<AxiosResponse<ResponseBanner>>

  get: (bannerId: ID) => Promise<AxiosResponse<ResponseBanner>>

  update: (bannerId: ID, payload: PayloadAdminUpdateBanner) => Promise<AxiosResponse<ResponseBanner>>

  delete: (bannerId: ID) => Promise<AxiosResponse<ResponseSuccess>>

  move: (doctorId: ID, payload: PayloadAdminMoveBanner) => Promise<AxiosResponse<ResponseSuccess>>

  uploadImage: (file: File, onProgress?: (progress: ProgressEvent) => void) => Promise<AxiosResponse<ResponseImage>>
}

const ADMIN_BANNERS_URL = `${API_URL}/admin/banners`

const AdminBannersAPI: IAdminBannersAPI = {
  filter: () => {
    return axios.post(`${ADMIN_BANNERS_URL}/filter`)
  },

  create: (payload) => {
    return axios.post(ADMIN_BANNERS_URL, payload)
  },

  get: (bannerId) => {
    return axios.get(`${ADMIN_BANNERS_URL}/${bannerId}`)
  },

  update: (bannerId, payload) => {
    return axios.put(`${ADMIN_BANNERS_URL}/${bannerId}`, payload)
  },

  delete: (bannerId) => {
    return axios.delete(`${ADMIN_BANNERS_URL}/${bannerId}`)
  },

  move: (bannerId, payload) => {
    return axios.patch(`${ADMIN_BANNERS_URL}/${bannerId}/move`, payload)
  },

  uploadImage: (file, onProgress) => {
    const formData = new FormData()
    formData.append('file', file)

    return axios.post(`${ADMIN_BANNERS_URL}/upload-image`, formData, {
      onUploadProgress: onProgress,
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
  },
}

export type { ResponseBanners, PayloadAdminCreateBanner, PayloadAdminMoveBanner, PayloadAdminUpdateBanner }

export default AdminBannersAPI
