import axios, { AxiosResponse } from 'axios'

import { Response } from '@models/apiBase'
import { ID } from '@models/base'
import { MainPageProjectGroupModel } from '@models/mainPageProjectGroup'

import { API_URL } from '@/constants/constant'

const ADMIN_MAIN_PAGE_PROJECT_GROUPS_URL = `${API_URL}/admin/main-page-project-groups`

type ResponseMainPageProjectGroup = Response<{
  main_page_project_group: MainPageProjectGroupModel
}>

type ResponseMainPageProjectGroups = Response<{
  main_page_project_groups: Array<MainPageProjectGroupModel>
}>

type PayloadCreateMainPageProjectGroup = {
  project_group_id: ID
}

type PayloadMoveMainPageProjectGroup = {
  position: number
}

interface IAdminMainPageProjectGroupsAPI {
  filter: () => Promise<AxiosResponse<ResponseMainPageProjectGroups>>

  create: (payload: PayloadCreateMainPageProjectGroup) => Promise<AxiosResponse<ResponseMainPageProjectGroup>>

  delete: (id: ID) => Promise<AxiosResponse<ResponseMainPageProjectGroup>>

  move: (id: ID, payload: PayloadMoveMainPageProjectGroup) => Promise<AxiosResponse<ResponseMainPageProjectGroup>>
}

const AdminMainPageProjectGroupsAPI: IAdminMainPageProjectGroupsAPI = {
  filter: () => {
    return axios.post(`${ADMIN_MAIN_PAGE_PROJECT_GROUPS_URL}/filter`)
  },

  create: (payload: PayloadCreateMainPageProjectGroup) => {
    return axios.post(ADMIN_MAIN_PAGE_PROJECT_GROUPS_URL, payload)
  },

  delete: (id: ID) => {
    return axios.delete(`${ADMIN_MAIN_PAGE_PROJECT_GROUPS_URL}/${id}`)
  },

  move: (id: ID, payload: PayloadMoveMainPageProjectGroup) => {
    return axios.patch(`${ADMIN_MAIN_PAGE_PROJECT_GROUPS_URL}/${id}/move`, payload)
  },
}

export type { PayloadCreateMainPageProjectGroup, PayloadMoveMainPageProjectGroup }

export default AdminMainPageProjectGroupsAPI
