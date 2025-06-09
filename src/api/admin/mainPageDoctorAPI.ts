import axios, { AxiosResponse } from 'axios'

import { Response } from '@models/apiBase'
import { ID } from '@models/base'
import { MainPageDoctorModel } from '@models/mainPageDoctor'

import { API_URL } from '@/constants/constant'

const ADMIN_MAIN_PAGE_DOCTORS_URL = `${API_URL}/admin/main-page-doctors`

type ResponseMainPageDoctors = Response<{
  main_page_doctors: Array<MainPageDoctorModel>
}>

type ResponseMainPageDoctor = Response<{
  main_page_doctor: MainPageDoctorModel
}>

type PayloadCreateMainPageDoctor = {
  doctor_id: ID
}

type PayloadMoveMainPageDoctor = {
  position: number
}

interface IAdminMainPageDoctorsAPI {
  filter: () => Promise<AxiosResponse<ResponseMainPageDoctors>>

  create: (payload: PayloadCreateMainPageDoctor) => Promise<AxiosResponse<ResponseMainPageDoctor>>

  delete: (id: ID) => Promise<AxiosResponse<ResponseMainPageDoctor>>

  move: (id: ID, payload: PayloadMoveMainPageDoctor) => Promise<AxiosResponse<ResponseMainPageDoctor>>
}

const AdminMainPageDoctorsAPI: IAdminMainPageDoctorsAPI = {
  filter: () => {
    return axios.post(`${ADMIN_MAIN_PAGE_DOCTORS_URL}/filter`)
  },

  create: (payload) => {
    return axios.post(ADMIN_MAIN_PAGE_DOCTORS_URL, payload)
  },

  delete: (id) => {
    return axios.delete(`${ADMIN_MAIN_PAGE_DOCTORS_URL}/${id}`)
  },

  move: (id, payload) => {
    return axios.patch(`${ADMIN_MAIN_PAGE_DOCTORS_URL}/${id}/move`, payload)
  },
}

export type { PayloadCreateMainPageDoctor, PayloadMoveMainPageDoctor }

export default AdminMainPageDoctorsAPI
