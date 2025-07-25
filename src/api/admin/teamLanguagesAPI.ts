import axios from 'axios'

import { Response } from '@models/apiBase'
import { ID } from '@models/base'
import TeamLanguageModel from '@models/teamLanguage'

import { API_URL } from '@/constants/constant'

type ResponseTeamLanguages = Response<{
  team_languages: Array<TeamLanguageModel>
}>

type ResponseTeamLanguage = Response<{
  team_language: TeamLanguageModel
}>

type PayloadCreateTeamLanguage = {
  team_id: ID
  language_id: ID
  quote: string
  quote_author: string | null
}

type PayloadUpdateTeamLanguage = {
  quote: string
  quote_author: string | null
}

type PayloadSetTeamLanguageContent = {
  content: string
}

interface IAdminTeamLanguagesAPI {
  create: (payload: PayloadCreateTeamLanguage) => Promise<ResponseTeamLanguages>

  update: (teamLanguageId: ID, payload: PayloadUpdateTeamLanguage) => Promise<ResponseTeamLanguages>

  delete: (teamLanguageId: ID) => Promise<ResponseTeamLanguages>

  setContent: (teamLanguageId: ID, payload: PayloadSetTeamLanguageContent) => Promise<ResponseTeamLanguage>
}

const ADMIN_TEAM_LANGUAGES_URL = `${API_URL}/admin/team-languages`

const AdminTeamLanguagesAPI: IAdminTeamLanguagesAPI = {
  create: (payload) => {
    return axios.post(ADMIN_TEAM_LANGUAGES_URL, payload)
  },

  update: (teamLanguageId, payload) => {
    return axios.put(`${ADMIN_TEAM_LANGUAGES_URL}/${teamLanguageId}`, payload)
  },

  delete: (teamLanguageId) => {
    return axios.delete(`${ADMIN_TEAM_LANGUAGES_URL}/${teamLanguageId}`)
  },

  setContent: (teamLanguageId, payload) => {
    return axios.patch(`${ADMIN_TEAM_LANGUAGES_URL}/${teamLanguageId}/content`, payload)
  },
}

export type { PayloadCreateTeamLanguage, PayloadSetTeamLanguageContent, PayloadUpdateTeamLanguage }

export default AdminTeamLanguagesAPI
