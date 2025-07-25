import axios, { AxiosResponse } from 'axios'

import { Response } from '@models/apiBase'
import { ID } from '@models/base'
import { OurTeamPageTeamModel } from '@models/ourteamPageTeam'

import { API_URL } from '@/constants/constant'

const ADMIN_OUR_TEAM_PAGE_TEAMS_URL = `${API_URL}/admin/our-team-page-teams`

type ResponseOurTeamPageTeams = Response<{
  our_team_page_teams: Array<OurTeamPageTeamModel>
}>

type ResponseOurTeamPageTeam = Response<{
  our_team_page_team: OurTeamPageTeamModel
}>

type PayloadCreateOurTeamPageTeam = {
  team_id: ID
}

type PayloadMoveOurTeamPageTeam = {
  position: number
}

interface IAdminOurTeamPageTeamsAPI {
  filter: () => Promise<AxiosResponse<ResponseOurTeamPageTeams>>

  create: (payload: PayloadCreateOurTeamPageTeam) => Promise<AxiosResponse<ResponseOurTeamPageTeam>>

  delete: (id: ID) => Promise<AxiosResponse<ResponseOurTeamPageTeam>>

  move: (id: ID, payload: PayloadMoveOurTeamPageTeam) => Promise<AxiosResponse<ResponseOurTeamPageTeam>>
}

const AdminOurTeamPageTeamsAPI: IAdminOurTeamPageTeamsAPI = {
  filter: () => {
    return axios.post(`${ADMIN_OUR_TEAM_PAGE_TEAMS_URL}/filter`)
  },

  create: (payload) => {
    return axios.post(ADMIN_OUR_TEAM_PAGE_TEAMS_URL, payload)
  },

  delete: (id) => {
    return axios.delete(`${ADMIN_OUR_TEAM_PAGE_TEAMS_URL}/${id}`)
  },

  move: (id, payload) => {
    return axios.patch(`${ADMIN_OUR_TEAM_PAGE_TEAMS_URL}/${id}/move`, payload)
  },
}

export type { PayloadCreateOurTeamPageTeam, PayloadMoveOurTeamPageTeam }

export default AdminOurTeamPageTeamsAPI
