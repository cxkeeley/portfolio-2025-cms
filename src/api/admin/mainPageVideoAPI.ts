import axios, { AxiosResponse } from 'axios'

import { RequestQuery, Response, ResponseSuccess } from '@models/apiBase'
import { ID } from '@models/base'
import { MainPageVideoModel } from '@models/mainPageVideo'

import { API_URL } from '@/constants/constant'

const ADMIN_MAIN_PAGE_VIDEO_URL = `${API_URL}/admin/main-page-videos`

type ResponseMainPageVideos = Response<{
  main_page_videos: Array<MainPageVideoModel>
}>

type ResponseMainPageVideo = Response<{
  main_page_video: MainPageVideoModel
}>

type ResponseImage = Response<{ path: string }>

type PayloadCreateMainPageVideo = {
  is_active: boolean
  thumnail_file_path: string
  title: string
  uri: string
}

type PayloadUpdateMainPageVideo = {
  is_active: boolean
  thumnail_file_path?: string
  title: string
  uri: string
}

type PayloadMoveMainPageVideo = {
  position: number
}

type QueryMainPageVideoFilter = {
  is_active?: boolean
}

interface IAdminMainPageVideosAPI {
  filter: (query: RequestQuery<QueryMainPageVideoFilter>) => Promise<AxiosResponse<ResponseMainPageVideos>>

  create: (payload: PayloadCreateMainPageVideo) => Promise<AxiosResponse<ResponseMainPageVideo>>

  update: (id: ID, payload: PayloadUpdateMainPageVideo) => Promise<AxiosResponse<ResponseMainPageVideo>>

  get: (id: ID) => Promise<AxiosResponse<ResponseMainPageVideo>>

  move: (id: ID, payload: PayloadMoveMainPageVideo) => Promise<AxiosResponse<ResponseMainPageVideo>>

  uploadImage: (file: File, onProgress?: (progress: ProgressEvent) => void) => Promise<AxiosResponse<ResponseImage>>

  delete: (id: ID) => Promise<AxiosResponse<ResponseSuccess>>
}

const AdminMainPageVideosAPI: IAdminMainPageVideosAPI = {
  filter: (query) => {
    return axios.post(`${ADMIN_MAIN_PAGE_VIDEO_URL}/filter`, query)
  },

  create: (payload) => {
    return axios.post(ADMIN_MAIN_PAGE_VIDEO_URL, payload)
  },

  update: (id, payload) => {
    return axios.put(`${ADMIN_MAIN_PAGE_VIDEO_URL}/${id}`, payload)
  },

  get: (id) => {
    return axios.get(`${ADMIN_MAIN_PAGE_VIDEO_URL}/${id}`)
  },

  move: (id, payload) => {
    return axios.patch(`${ADMIN_MAIN_PAGE_VIDEO_URL}/${id}/move`, payload)
  },

  uploadImage: (file, onProgress) => {
    const formData = new FormData()
    formData.append('file', file)

    return axios.post(`${ADMIN_MAIN_PAGE_VIDEO_URL}/upload-image`, formData, {
      onUploadProgress: onProgress,
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
  },

  delete: (id) => {
    return axios.delete(`${ADMIN_MAIN_PAGE_VIDEO_URL}/${id}`)
  },
}

export type {
  PayloadMoveMainPageVideo,
  PayloadCreateMainPageVideo,
  PayloadUpdateMainPageVideo,
  QueryMainPageVideoFilter,
}

export default AdminMainPageVideosAPI
