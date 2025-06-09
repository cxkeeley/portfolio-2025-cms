import axios, { AxiosResponse } from 'axios'

import { RequestQuery, Response, WithFilter } from '@models/apiBase'
import { ID } from '@models/base'

import { API_URL } from '@/constants/constant'
import { LocationServiceModel } from '@models/locationService'

type ResponseLocationServicesWithFilter = Response<WithFilter<LocationServiceModel[]>>

type PayloadAdminLocationServiceGetOptionsForLocationForm = RequestQuery<{
  location_id: ID
}>

const ADMIN_LOCATION_SERVICES_URL = `${API_URL}/admin/location-services`

const AdminLocationServicesAPI = {
  getOptionsForLocationForm: async (
    payload: PayloadAdminLocationServiceGetOptionsForLocationForm
  ): Promise<AxiosResponse<ResponseLocationServicesWithFilter>> => {
    return axios.post(`${ADMIN_LOCATION_SERVICES_URL}/options/location-form`, payload)
  },
}

export type { PayloadAdminLocationServiceGetOptionsForLocationForm }

export default AdminLocationServicesAPI
