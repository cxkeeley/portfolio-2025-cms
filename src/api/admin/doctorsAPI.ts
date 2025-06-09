import axios, { AxiosResponse } from 'axios'

import { RequestQuery, Response, ResponseSuccess, WithFilter } from '@models/apiBase'
import { ID } from '@models/base'
import DoctorModel from '@models/doctor'

import { API_URL } from '@/constants/constant'

type ResponseDoctors = Response<WithFilter<Array<DoctorModel>>>

type ResponseDoctor = Response<{ doctor: DoctorModel }>

type ResponseImage = Response<{ path: string }>

type PayloadFilterDoctors = RequestQuery

type PayloadCreateDoctor = {
  degree: string | null
  image_file_path: string
  is_active: boolean | null
  job_title: string
  large_thumbnail_file_path: string
  location_id: ID
  name: string
  start_practice_month: number
  start_practice_year: number
  thumbnail_file_path: string
}

type PayloadUpdateDoctor = {
  degree: string | null
  is_active: boolean | null
  job_title: string
  location_id: ID
  start_practice_month: number
  start_practice_year: number
  name: string
}

type PayloadSetImageFile = {
  file_path: string
}

type PayloadSetLargeThumbnailFile = {
  file_path: string
}

type PayloadSetThumbnailFile = {
  file_path: string
}

interface IAdminDoctorsAPI {
  filter: (payload: PayloadFilterDoctors) => Promise<AxiosResponse<ResponseDoctors>>

  create: (payload: PayloadCreateDoctor) => Promise<AxiosResponse<ResponseDoctor>>

  uploadImage: (file: File, onProgress?: (progress: ProgressEvent) => void) => Promise<AxiosResponse<ResponseImage>>

  get: (doctorId: ID) => Promise<AxiosResponse<ResponseDoctor>>

  update: (doctorId: ID, payload: PayloadUpdateDoctor) => Promise<AxiosResponse<ResponseDoctor>>

  delete: (doctorId: ID) => Promise<AxiosResponse<ResponseSuccess>>

  setImageFile: (doctorId: ID, payload: PayloadSetImageFile) => Promise<AxiosResponse<ResponseDoctor>>

  setLargeThumbnailFile: (doctorId: ID, payload: PayloadSetLargeThumbnailFile) => Promise<AxiosResponse<ResponseDoctor>>

  setThumbnailFile: (doctorId: ID, payload: PayloadSetThumbnailFile) => Promise<AxiosResponse<ResponseDoctor>>

  getOptionsForMainPageDoctorForm: (query: RequestQuery) => Promise<AxiosResponse<ResponseDoctors>>

  getOptionsForOurDoctorPageDoctorForm: (query: RequestQuery) => Promise<AxiosResponse<ResponseDoctors>>
}

const ADMIN_DOCTORS_URL = `${API_URL}/admin/doctors`

const AdminDoctorsAPI: IAdminDoctorsAPI = {
  filter: (payload) => {
    return axios.post(`${ADMIN_DOCTORS_URL}/filter`, payload)
  },

  create: (payload) => {
    return axios.post(`${ADMIN_DOCTORS_URL}`, payload)
  },

  uploadImage: (file, onProgress) => {
    const formData = new FormData()
    formData.append('file', file)

    return axios.post(`${ADMIN_DOCTORS_URL}/upload-image`, formData, {
      onUploadProgress: onProgress,
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
  },

  get: (doctorId) => {
    return axios.get(`${ADMIN_DOCTORS_URL}/${doctorId}`)
  },

  update: (doctorId, payload) => {
    return axios.put(`${ADMIN_DOCTORS_URL}/${doctorId}`, payload)
  },

  delete: (doctorId) => {
    return axios.delete(`${ADMIN_DOCTORS_URL}/${doctorId}`)
  },

  setImageFile: (doctorId, payload) => {
    return axios.patch(`${ADMIN_DOCTORS_URL}/${doctorId}/image-file`, payload)
  },

  setLargeThumbnailFile: (doctorId, payload) => {
    return axios.patch(`${ADMIN_DOCTORS_URL}/${doctorId}/large-thumbnail-file`, payload)
  },

  setThumbnailFile: (doctorId, payload) => {
    return axios.patch(`${ADMIN_DOCTORS_URL}/${doctorId}/thumbnail-file`, payload)
  },

  getOptionsForMainPageDoctorForm: (query) => {
    return axios.post(`${ADMIN_DOCTORS_URL}/options/main-page-doctor-form`, query)
  },

  getOptionsForOurDoctorPageDoctorForm: (query) => {
    return axios.post(`${ADMIN_DOCTORS_URL}/options/our-doctor-page-doctor-form`, query)
  },
}

export type {
  PayloadCreateDoctor,
  PayloadFilterDoctors,
  PayloadSetImageFile,
  PayloadSetLargeThumbnailFile,
  PayloadSetThumbnailFile,
  PayloadUpdateDoctor,
  ResponseDoctor,
}

export default AdminDoctorsAPI
