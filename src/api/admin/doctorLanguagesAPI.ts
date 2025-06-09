import axios from 'axios'

import { Response } from '@models/apiBase'
import { ID } from '@models/base'
import DoctorLanguageModel from '@models/doctorLanguage'

import { API_URL } from '@/constants/constant'

type ResponseDoctorLanguages = Response<{
  doctor_languages: Array<DoctorLanguageModel>
}>

type ResponseDoctorLanguage = Response<{
  doctor_language: DoctorLanguageModel
}>

type PayloadCreateDoctorLanguage = {
  doctor_id: ID
  language_id: ID
  quote: string
  quote_author: string | null
}

type PayloadUpdateDoctorLanguage = {
  quote: string
  quote_author: string | null
}

type PayloadSetDoctorLanguageContent = {
  content: string
}

interface IAdminDoctorLanguagesAPI {
  create: (payload: PayloadCreateDoctorLanguage) => Promise<ResponseDoctorLanguages>

  update: (doctorLanguageId: ID, payload: PayloadUpdateDoctorLanguage) => Promise<ResponseDoctorLanguages>

  delete: (doctorLanguageId: ID) => Promise<ResponseDoctorLanguages>

  setContent: (doctorLanguageId: ID, payload: PayloadSetDoctorLanguageContent) => Promise<ResponseDoctorLanguage>
}

const ADMIN_DOCTOR_LANGUAGES_URL = `${API_URL}/admin/doctor-languages`

const AdminDoctorLanguagesAPI: IAdminDoctorLanguagesAPI = {
  create: (payload) => {
    return axios.post(ADMIN_DOCTOR_LANGUAGES_URL, payload)
  },

  update: (doctorLanguageId, payload) => {
    return axios.put(`${ADMIN_DOCTOR_LANGUAGES_URL}/${doctorLanguageId}`, payload)
  },

  delete: (doctorLanguageId) => {
    return axios.delete(`${ADMIN_DOCTOR_LANGUAGES_URL}/${doctorLanguageId}`)
  },

  setContent: (doctorLanguageId, payload) => {
    return axios.patch(`${ADMIN_DOCTOR_LANGUAGES_URL}/${doctorLanguageId}/content`, payload)
  },
}

export type { PayloadCreateDoctorLanguage, PayloadSetDoctorLanguageContent, PayloadUpdateDoctorLanguage }

export default AdminDoctorLanguagesAPI
