import axios, { AxiosResponse } from 'axios'

import { Response } from '@models/apiBase'
import { ID } from '@models/base'
import { MainPageLocationGroupModel } from '@models/mainPageLocationGroup'

import { API_URL } from '@/constants/constant'

const ADMIN_MAIN_PAGE_LOCATION_GROUPS_URL = `${API_URL}/admin/main-page-location-groups`

type ResponseMainPageLocationGroup = Response<{
  main_page_location_group: MainPageLocationGroupModel
}>

type ResponseMainPageLocationGroups = Response<{
  main_page_location_groups: Array<MainPageLocationGroupModel>
}>

type PayloadCreateMainPageLocationGroup = {
  location_group_id: ID
}

type PayloadMoveMainPageLocationGroup = {
  position: number
}

interface IAdminMainPageLocationGroupsAPI {
  filter: () => Promise<AxiosResponse<ResponseMainPageLocationGroups>>

  create: (payload: PayloadCreateMainPageLocationGroup) => Promise<AxiosResponse<ResponseMainPageLocationGroup>>

  delete: (id: ID) => Promise<AxiosResponse<ResponseMainPageLocationGroup>>

  move: (id: ID, payload: PayloadMoveMainPageLocationGroup) => Promise<AxiosResponse<ResponseMainPageLocationGroup>>
}

const AdminMainPageLocationGroupsAPI: IAdminMainPageLocationGroupsAPI = {
  filter: () => {
    return axios.post(`${ADMIN_MAIN_PAGE_LOCATION_GROUPS_URL}/filter`)
  },

  create: (payload: PayloadCreateMainPageLocationGroup) => {
    return axios.post(ADMIN_MAIN_PAGE_LOCATION_GROUPS_URL, payload)
  },

  delete: (id: ID) => {
    return axios.delete(`${ADMIN_MAIN_PAGE_LOCATION_GROUPS_URL}/${id}`)
  },

  move: (id: ID, payload: PayloadMoveMainPageLocationGroup) => {
    return axios.patch(`${ADMIN_MAIN_PAGE_LOCATION_GROUPS_URL}/${id}/move`, payload)
  },
}

export type { PayloadCreateMainPageLocationGroup, PayloadMoveMainPageLocationGroup }

export default AdminMainPageLocationGroupsAPI
