import axios, { AxiosResponse } from 'axios'

import { RequestQuery, Response, ResponseSuccess, WithFilter } from '@models/apiBase'
import { ID } from '@models/base'
import { LocationModel } from '@models/location'
import { LocationHasServiceModel } from '@models/locationHasService'

import { API_URL } from '@/constants/constant'

type ResponseLocationsWithFilter = Response<WithFilter<Array<LocationModel>>>
type ResponseLocation = Response<{ location: LocationModel }>
type ResponseLocationHasServices = Response<{ services: LocationHasServiceModel[] }>

type PayloadAdminLocationFilter = RequestQuery<{
  location_group_id: ID
}>

type PayloadAdminLocationGetOptionsForDoctorForm = RequestQuery

type PayloadAdminLocationCreate = {
  default_address: string
  default_description: string
  default_name: string
  default_short_name: string
  is_coming_soon: boolean
  latitude: number | null
  location_group_id: ID
  location_label_id: ID | null
  longitude: number | null
  phone_number: string
}

type PayloadAdminLocationUpdate = {
  is_coming_soon: boolean
  latitude: number | null
  location_group_id: ID
  longitude: number | null
  phone_number: string
}

type PayloadAdminLocationCreateService = {
  location_service_id: ID
}

type PayloadAdminLocationMoveService = {
  position: number
}

const ADMIN_LOCATIONS_URL = `${API_URL}/admin/locations`

const AdminLocationsAPI = {
  filter: async (query: PayloadAdminLocationFilter): Promise<AxiosResponse<ResponseLocationsWithFilter>> => {
    return axios.post(`${ADMIN_LOCATIONS_URL}/filter`, query)
  },

  get: async (locationId: ID): Promise<AxiosResponse<ResponseLocation>> => {
    return axios.get(`${ADMIN_LOCATIONS_URL}/${locationId}`)
  },

  create: async (payload: PayloadAdminLocationCreate): Promise<AxiosResponse<ResponseLocation>> => {
    return axios.post(ADMIN_LOCATIONS_URL, payload)
  },

  update: async (locationId: ID, payload: PayloadAdminLocationUpdate): Promise<AxiosResponse<ResponseLocation>> => {
    return axios.put(`${ADMIN_LOCATIONS_URL}/${locationId}`, payload)
  },

  delete: async (locationId: ID): Promise<AxiosResponse<ResponseSuccess>> => {
    return axios.delete(`${ADMIN_LOCATIONS_URL}/${locationId}`)
  },

  getOptionsForDoctorForm: async (
    payload: PayloadAdminLocationGetOptionsForDoctorForm
  ): Promise<AxiosResponse<ResponseLocationsWithFilter>> => {
    return axios.post(`${ADMIN_LOCATIONS_URL}/options/doctor-form`, payload)
  },

  createService: async (
    locationId: ID,
    payload: PayloadAdminLocationCreateService
  ): Promise<AxiosResponse<ResponseSuccess>> => {
    return axios.post(`${ADMIN_LOCATIONS_URL}/${locationId}/services`, payload)
  },

  fetchServices: async (locationId: ID): Promise<AxiosResponse<ResponseLocationHasServices>> => {
    return axios.post(`${ADMIN_LOCATIONS_URL}/${locationId}/services/filter`)
  },

  moveService: async (
    locationId: ID,
    serviceId: ID,
    payload: PayloadAdminLocationMoveService
  ): Promise<AxiosResponse<ResponseLocationHasServices>> => {
    return axios.patch(`${ADMIN_LOCATIONS_URL}/${locationId}/services/${serviceId}/move`, payload)
  },

  deleteService: async (locationId: ID, serviceId: ID): Promise<AxiosResponse<ResponseSuccess>> => {
    return axios.delete(`${ADMIN_LOCATIONS_URL}/${locationId}/services/${serviceId}`)
  },
}

export type {
  PayloadAdminLocationCreate,
  PayloadAdminLocationUpdate,
  PayloadAdminLocationFilter,
  PayloadAdminLocationGetOptionsForDoctorForm,
  PayloadAdminLocationCreateService,
}

export default AdminLocationsAPI
