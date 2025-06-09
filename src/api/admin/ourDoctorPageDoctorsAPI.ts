import axios, { AxiosResponse } from 'axios'

import { Response } from '@models/apiBase'
import { ID } from '@models/base'
import { OurDoctorPageDoctorModel } from '@models/ourdoctorPageDoctor'

import { API_URL } from '@/constants/constant'

const ADMIN_OUR_DOCTOR_PAGE_DOCTORS_URL = `${API_URL}/admin/our-doctor-page-doctors`

type ResponseOurDoctorPageDoctors = Response<{
  our_doctor_page_doctors: Array<OurDoctorPageDoctorModel>
}>

type ResponseOurDoctorPageDoctor = Response<{
  our_doctor_page_doctor: OurDoctorPageDoctorModel
}>

type PayloadCreateOurDoctorPageDoctor = {
  doctor_id: ID
}

type PayloadMoveOurDoctorPageDoctor = {
  position: number
}

interface IAdminOurDoctorPageDoctorsAPI {
  filter: () => Promise<AxiosResponse<ResponseOurDoctorPageDoctors>>

  create: (payload: PayloadCreateOurDoctorPageDoctor) => Promise<AxiosResponse<ResponseOurDoctorPageDoctor>>

  delete: (id: ID) => Promise<AxiosResponse<ResponseOurDoctorPageDoctor>>

  move: (id: ID, payload: PayloadMoveOurDoctorPageDoctor) => Promise<AxiosResponse<ResponseOurDoctorPageDoctor>>
}

const AdminOurDoctorPageDoctorsAPI: IAdminOurDoctorPageDoctorsAPI = {
  filter: () => {
    return axios.post(`${ADMIN_OUR_DOCTOR_PAGE_DOCTORS_URL}/filter`)
  },

  create: (payload) => {
    return axios.post(ADMIN_OUR_DOCTOR_PAGE_DOCTORS_URL, payload)
  },

  delete: (id) => {
    return axios.delete(`${ADMIN_OUR_DOCTOR_PAGE_DOCTORS_URL}/${id}`)
  },

  move: (id, payload) => {
    return axios.patch(`${ADMIN_OUR_DOCTOR_PAGE_DOCTORS_URL}/${id}/move`, payload)
  },
}

export type { PayloadCreateOurDoctorPageDoctor, PayloadMoveOurDoctorPageDoctor }

export default AdminOurDoctorPageDoctorsAPI
