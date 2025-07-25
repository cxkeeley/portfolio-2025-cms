import axios, { AxiosResponse } from 'axios'

import { Response } from '@models/apiBase'
import { ID } from '@models/base'
import { MainPageTeamModel } from '@models/mainPageTeam'

import { API_URL } from '@/constants/constant'

const ADMIN_MAIN_PAGE_TEAMS_URL = `${API_URL}/admin/main-page-teams`

type ResponseMainPageTeams = Response<{
  main_page_teams: Array<MainPageTeamModel>
}>

type ResponseMainPageTeam = Response<{
  main_page_team: MainPageTeamModel
}>

type PayloadCreateMainPageTeam = {
  team_id: ID
}

type PayloadMoveMainPageTeam = {
  position: number
}

interface IAdminMainPageTeamsAPI {
  filter: () => Promise<AxiosResponse<ResponseMainPageTeams>>

  create: (payload: PayloadCreateMainPageTeam) => Promise<AxiosResponse<ResponseMainPageTeam>>

  delete: (id: ID) => Promise<AxiosResponse<ResponseMainPageTeam>>

  move: (id: ID, payload: PayloadMoveMainPageTeam) => Promise<AxiosResponse<ResponseMainPageTeam>>
}

const AdminMainPageTeamsAPI: IAdminMainPageTeamsAPI = {
  filter: () => {
    return axios.post(`${ADMIN_MAIN_PAGE_TEAMS_URL}/filter`)
  },

  create: (payload) => {
    return axios.post(ADMIN_MAIN_PAGE_TEAMS_URL, payload)
  },

  delete: (id) => {
    return axios.delete(`${ADMIN_MAIN_PAGE_TEAMS_URL}/${id}`)
  },

  move: (id, payload) => {
    return axios.patch(`${ADMIN_MAIN_PAGE_TEAMS_URL}/${id}/move`, payload)
  },
}

export type { PayloadCreateMainPageTeam, PayloadMoveMainPageTeam }

export default AdminMainPageTeamsAPI
