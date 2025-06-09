import axios, { AxiosResponse } from 'axios'

import { RequestQuery, Response, WithFilter } from '@models/apiBase'
import { ID } from '@models/base'
import LanguageModel from '@models/language'

import { API_URL } from '@/constants/constant'

const ADMIN_LANGUAGES_API = `${API_URL}/admin/languages`

type ResponseLanguages = Response<WithFilter<LanguageModel[]>>

type PayloadGetOptionsForCategoryLanguageForm = RequestQuery<{
  category_id: ID
}>

type PayloadGetOptionsForDoctorLanguageForm = RequestQuery<{
  doctor_id: ID
}>

type PayloadGetOptionsForPromotionLanguageForm = RequestQuery<{
  promotion_id: ID
}>

type PayloadAdminLanguageGetOptionsForLocationGroupLanguageForm = RequestQuery<{
  location_group_id: ID
}>

type PayloadAdminLanguageGetOptionsForLocationLabelLanguageForm = RequestQuery<{
  location_label_id: ID
}>

type PayloadAdminLanguageGetOptionsForLocationLanguageForm = RequestQuery<{
  location_id: ID
}>

type PayloadAdminLanguageGetOptionsForLocationImageLanguageForm = RequestQuery<{
  location_image_id: ID
}>

type PayloadGetOptionsForArticleLanguageForm = RequestQuery<{ article_id: ID }>

type PayloadGetOptionsForLocationServiceLanguageForm = RequestQuery<{ location_service_id: ID }>

type IAdminLanguagesAPI = {
  getOptionsForCategoryLanguageForm: (
    query: PayloadGetOptionsForCategoryLanguageForm
  ) => Promise<AxiosResponse<ResponseLanguages>>

  getOptionsForArticleLanguageForm: (
    payload: PayloadGetOptionsForArticleLanguageForm
  ) => Promise<AxiosResponse<ResponseLanguages>>

  getOptionsForDoctorLanguageForm: (
    payload: PayloadGetOptionsForDoctorLanguageForm
  ) => Promise<AxiosResponse<ResponseLanguages>>

  getOptionsForPromotionLanguageForm: (
    payload: PayloadGetOptionsForPromotionLanguageForm
  ) => Promise<AxiosResponse<ResponseLanguages>>

  getOptionsForLocationGroupLanguageForm: (
    query: PayloadAdminLanguageGetOptionsForLocationGroupLanguageForm
  ) => Promise<AxiosResponse<ResponseLanguages>>

  getOptionsForLocationLabelLanguageForm: (
    payload: PayloadAdminLanguageGetOptionsForLocationLabelLanguageForm
  ) => Promise<AxiosResponse<ResponseLanguages>>

  getOptionsForLocationLanguageForm: (
    query: PayloadAdminLanguageGetOptionsForLocationLanguageForm
  ) => Promise<AxiosResponse<ResponseLanguages>>

  getOptionsForLocationImageLanguageForm: (
    query: PayloadAdminLanguageGetOptionsForLocationImageLanguageForm
  ) => Promise<AxiosResponse<ResponseLanguages>>

  getOptionsForLocationServiceLanguageForm: (
    payload: PayloadGetOptionsForLocationServiceLanguageForm
  ) => Promise<AxiosResponse<ResponseLanguages>>
}

const AdminLanguagesAPI: IAdminLanguagesAPI = {
  getOptionsForCategoryLanguageForm: async (query) => {
    return axios.post(`${ADMIN_LANGUAGES_API}/options/category-language-form`, query)
  },

  getOptionsForArticleLanguageForm: (payload) => {
    return axios.post(`${ADMIN_LANGUAGES_API}/options/article-language-form`, payload)
  },

  getOptionsForDoctorLanguageForm: (payload) => {
    return axios.post(`${ADMIN_LANGUAGES_API}/options/doctor-language-form`, payload)
  },

  getOptionsForPromotionLanguageForm: (payload) => {
    return axios.post(`${ADMIN_LANGUAGES_API}/options/promotion-language-form`, payload)
  },

  getOptionsForLocationGroupLanguageForm: (payload) => {
    return axios.post(`${ADMIN_LANGUAGES_API}/options/location-group-language-form`, payload)
  },

  getOptionsForLocationLabelLanguageForm: (payload) => {
    return axios.post(`${ADMIN_LANGUAGES_API}/options/location-label-language-form`, payload)
  },

  getOptionsForLocationLanguageForm: (payload) => {
    return axios.post(`${ADMIN_LANGUAGES_API}/options/location-language-form`, payload)
  },

  getOptionsForLocationImageLanguageForm: (payload) => {
    return axios.post(`${ADMIN_LANGUAGES_API}/options/location-image-language-form`, payload)
  },

  getOptionsForLocationServiceLanguageForm: (payload) => {
    return axios.post(`${ADMIN_LANGUAGES_API}/options/location-service-language-form`, payload)
  },
}

export type {
  PayloadGetOptionsForCategoryLanguageForm,
  PayloadGetOptionsForArticleLanguageForm,
  PayloadAdminLanguageGetOptionsForLocationGroupLanguageForm,
  PayloadAdminLanguageGetOptionsForLocationLanguageForm,
  PayloadGetOptionsForDoctorLanguageForm,
  PayloadAdminLanguageGetOptionsForLocationImageLanguageForm,
  ResponseLanguages,
}

export default AdminLanguagesAPI
