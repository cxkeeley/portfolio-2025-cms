import axios, { AxiosResponse } from 'axios'

import { RequestQuery, Response, ResponseSuccess, WithFilter } from '@models/apiBase'
import { ID } from '@models/base'
import TeamModel from '@models/team'

import { API_URL } from '@/constants/constant'

type ResponseTeams = Response<WithFilter<Array<TeamModel>>>

type ResponseTeam = Response<{ team: TeamModel }>

type ResponseImage = Response<{ path: string }>

type PayloadFilterTeams = RequestQuery

type PayloadCreateTeam = {
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

type PayloadUpdateTeam = {
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

interface IAdminTeamsAPI {
  filter: (payload: PayloadFilterTeams) => Promise<AxiosResponse<ResponseTeams>>

  create: (payload: PayloadCreateTeam) => Promise<AxiosResponse<ResponseTeam>>

  uploadImage: (file: File, onProgress?: (progress: ProgressEvent) => void) => Promise<AxiosResponse<ResponseImage>>

  get: (teamId: ID) => Promise<AxiosResponse<ResponseTeam>>

  update: (teamId: ID, payload: PayloadUpdateTeam) => Promise<AxiosResponse<ResponseTeam>>

  delete: (teamId: ID) => Promise<AxiosResponse<ResponseSuccess>>

  setImageFile: (teamId: ID, payload: PayloadSetImageFile) => Promise<AxiosResponse<ResponseTeam>>

  setLargeThumbnailFile: (teamId: ID, payload: PayloadSetLargeThumbnailFile) => Promise<AxiosResponse<ResponseTeam>>

  setThumbnailFile: (teamId: ID, payload: PayloadSetThumbnailFile) => Promise<AxiosResponse<ResponseTeam>>

  getOptionsForMainPageTeamForm: (query: RequestQuery) => Promise<AxiosResponse<ResponseTeams>>

  getOptionsForOurTeamPageTeamForm: (query: RequestQuery) => Promise<AxiosResponse<ResponseTeams>>
}

const ADMIN_TEAMS_URL = `${API_URL}/admin/teams`

const AdminTeamsAPI: IAdminTeamsAPI = {
  filter: (payload) => {
    return axios.post(`${ADMIN_TEAMS_URL}/filter`, payload)
  },

  create: (payload) => {
    return axios.post(`${ADMIN_TEAMS_URL}`, payload)
  },

  uploadImage: (file, onProgress) => {
    const formData = new FormData()
    formData.append('file', file)

    return axios.post(`${ADMIN_TEAMS_URL}/upload-image`, formData, {
      onUploadProgress: onProgress,
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
  },

  get: (teamId) => {
    return axios.get(`${ADMIN_TEAMS_URL}/${teamId}`)
  },

  update: (teamId, payload) => {
    return axios.put(`${ADMIN_TEAMS_URL}/${teamId}`, payload)
  },

  delete: (teamId) => {
    return axios.delete(`${ADMIN_TEAMS_URL}/${teamId}`)
  },

  setImageFile: (teamId, payload) => {
    return axios.patch(`${ADMIN_TEAMS_URL}/${teamId}/image-file`, payload)
  },

  setLargeThumbnailFile: (teamId, payload) => {
    return axios.patch(`${ADMIN_TEAMS_URL}/${teamId}/large-thumbnail-file`, payload)
  },

  setThumbnailFile: (teamId, payload) => {
    return axios.patch(`${ADMIN_TEAMS_URL}/${teamId}/thumbnail-file`, payload)
  },

  getOptionsForMainPageTeamForm: (query) => {
    return axios.post(`${ADMIN_TEAMS_URL}/options/main-page-team-form`, query)
  },

  getOptionsForOurTeamPageTeamForm: (query) => {
    return axios.post(`${ADMIN_TEAMS_URL}/options/our-team-page-team-form`, query)
  },
}

export type {
  PayloadCreateTeam,
  PayloadFilterTeams,
  PayloadSetImageFile,
  PayloadSetLargeThumbnailFile,
  PayloadSetThumbnailFile,
  PayloadUpdateTeam,
  ResponseTeam,
}

export default AdminTeamsAPI
