import axios, { AxiosResponse } from 'axios'

import { RequestQuery, Response, WithFilter } from '@models/apiBase'
import { ID } from '@models/base'
import { ProjectServiceModel } from '@models/projectService'

import { API_URL } from '@/constants/constant'

type ResponseProjectServicesWithFilter = Response<WithFilter<ProjectServiceModel[]>>

type PayloadAdminProjectServiceGetOptionsForProjectForm = RequestQuery<{
  project_id: ID
}>

const ADMIN_PROJECT_SERVICES_URL = `${API_URL}/admin/project-services`

const AdminProjectServicesAPI = {
  getOptionsForProjectForm: async (
    payload: PayloadAdminProjectServiceGetOptionsForProjectForm
  ): Promise<AxiosResponse<ResponseProjectServicesWithFilter>> => {
    return axios.post(`${ADMIN_PROJECT_SERVICES_URL}/options/project-form`, payload)
  },
}

export type { PayloadAdminProjectServiceGetOptionsForProjectForm }

export default AdminProjectServicesAPI
