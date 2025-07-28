import axios, { AxiosResponse } from 'axios'

import { RequestQuery, Response, ResponseSuccess, WithFilter } from '@models/apiBase'
import { ID } from '@models/base'
import { ProjectModel } from '@models/project'
import { ProjectHasServiceModel } from '@models/projectHasService'

import { API_URL } from '@/constants/constant'

type ResponseProjectsWithFilter = Response<WithFilter<Array<ProjectModel>>>
type ResponseProject = Response<{ project: ProjectModel }>
type ResponseProjectHasServices = Response<{ services: ProjectHasServiceModel[] }>

type PayloadAdminProjectFilter = RequestQuery<{
  project_group_id: ID
}>

type PayloadAdminProjectGetOptionsForTeamForm = RequestQuery

type PayloadAdminProjectCreate = {
  default_address: string
  default_description: string
  default_name: string
  default_short_name: string
  is_coming_soon: boolean
  latitude: number | null
  project_group_id: ID
  project_label_id: ID | null
  longitude: number | null
  phone_number: string
}

type PayloadAdminProjectUpdate = {
  is_coming_soon: boolean
  latitude: number | null
  project_group_id: ID
  longitude: number | null
  phone_number: string
}

type PayloadAdminProjectCreateService = {
  project_service_id: ID
}

type PayloadAdminProjectMoveService = {
  position: number
}

const ADMIN_PROJECTS_URL = `${API_URL}/admin/projects`

const AdminProjectsAPI = {
  filter: async (query: PayloadAdminProjectFilter): Promise<AxiosResponse<ResponseProjectsWithFilter>> => {
    return axios.post(`${ADMIN_PROJECTS_URL}/filter`, query)
  },

  get: async (projectId: ID): Promise<AxiosResponse<ResponseProject>> => {
    return axios.get(`${ADMIN_PROJECTS_URL}/${projectId}`)
  },

  create: async (payload: PayloadAdminProjectCreate): Promise<AxiosResponse<ResponseProject>> => {
    return axios.post(ADMIN_PROJECTS_URL, payload)
  },

  update: async (projectId: ID, payload: PayloadAdminProjectUpdate): Promise<AxiosResponse<ResponseProject>> => {
    return axios.put(`${ADMIN_PROJECTS_URL}/${projectId}`, payload)
  },

  delete: async (projectId: ID): Promise<AxiosResponse<ResponseSuccess>> => {
    return axios.delete(`${ADMIN_PROJECTS_URL}/${projectId}`)
  },

  getOptionsForTeamForm: async (
    payload: PayloadAdminProjectGetOptionsForTeamForm
  ): Promise<AxiosResponse<ResponseProjectsWithFilter>> => {
    return axios.post(`${ADMIN_PROJECTS_URL}/options/team-form`, payload)
  },

  createService: async (
    projectId: ID,
    payload: PayloadAdminProjectCreateService
  ): Promise<AxiosResponse<ResponseSuccess>> => {
    return axios.post(`${ADMIN_PROJECTS_URL}/${projectId}/services`, payload)
  },

  fetchServices: async (projectId: ID): Promise<AxiosResponse<ResponseProjectHasServices>> => {
    return axios.post(`${ADMIN_PROJECTS_URL}/${projectId}/services/filter`)
  },

  moveService: async (
    projectId: ID,
    serviceId: ID,
    payload: PayloadAdminProjectMoveService
  ): Promise<AxiosResponse<ResponseProjectHasServices>> => {
    return axios.patch(`${ADMIN_PROJECTS_URL}/${projectId}/services/${serviceId}/move`, payload)
  },

  deleteService: async (projectId: ID, serviceId: ID): Promise<AxiosResponse<ResponseSuccess>> => {
    return axios.delete(`${ADMIN_PROJECTS_URL}/${projectId}/services/${serviceId}`)
  },
}

export type {
  PayloadAdminProjectCreate,
  PayloadAdminProjectUpdate,
  PayloadAdminProjectFilter,
  PayloadAdminProjectGetOptionsForTeamForm,
  PayloadAdminProjectCreateService,
}

export default AdminProjectsAPI
