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

type PayloadGetOptionsForTeamLanguageForm = RequestQuery<{
  team_id: ID
}>

type PayloadGetOptionsForPromotionLanguageForm = RequestQuery<{
  promotion_id: ID
}>

type PayloadAdminLanguageGetOptionsForProjectGroupLanguageForm = RequestQuery<{
  project_group_id: ID
}>

type PayloadAdminLanguageGetOptionsForProjectLabelLanguageForm = RequestQuery<{
  project_label_id: ID
}>

type PayloadAdminLanguageGetOptionsForProjectLanguageForm = RequestQuery<{
  project_id: ID
}>

type PayloadAdminLanguageGetOptionsForProjectImageLanguageForm = RequestQuery<{
  project_image_id: ID
}>

type PayloadGetOptionsForArticleLanguageForm = RequestQuery<{ article_id: ID }>

type PayloadGetOptionsForProjectServiceLanguageForm = RequestQuery<{ project_service_id: ID }>

type IAdminLanguagesAPI = {
  getOptionsForCategoryLanguageForm: (
    query: PayloadGetOptionsForCategoryLanguageForm
  ) => Promise<AxiosResponse<ResponseLanguages>>

  getOptionsForArticleLanguageForm: (
    payload: PayloadGetOptionsForArticleLanguageForm
  ) => Promise<AxiosResponse<ResponseLanguages>>

  getOptionsForTeamLanguageForm: (
    payload: PayloadGetOptionsForTeamLanguageForm
  ) => Promise<AxiosResponse<ResponseLanguages>>

  getOptionsForPromotionLanguageForm: (
    payload: PayloadGetOptionsForPromotionLanguageForm
  ) => Promise<AxiosResponse<ResponseLanguages>>

  getOptionsForProjectGroupLanguageForm: (
    query: PayloadAdminLanguageGetOptionsForProjectGroupLanguageForm
  ) => Promise<AxiosResponse<ResponseLanguages>>

  getOptionsForProjectLabelLanguageForm: (
    payload: PayloadAdminLanguageGetOptionsForProjectLabelLanguageForm
  ) => Promise<AxiosResponse<ResponseLanguages>>

  getOptionsForProjectLanguageForm: (
    query: PayloadAdminLanguageGetOptionsForProjectLanguageForm
  ) => Promise<AxiosResponse<ResponseLanguages>>

  getOptionsForProjectImageLanguageForm: (
    query: PayloadAdminLanguageGetOptionsForProjectImageLanguageForm
  ) => Promise<AxiosResponse<ResponseLanguages>>

  getOptionsForProjectServiceLanguageForm: (
    payload: PayloadGetOptionsForProjectServiceLanguageForm
  ) => Promise<AxiosResponse<ResponseLanguages>>
}

const AdminLanguagesAPI: IAdminLanguagesAPI = {
  getOptionsForCategoryLanguageForm: async (query) => {
    return axios.post(`${ADMIN_LANGUAGES_API}/options/category-language-form`, query)
  },

  getOptionsForArticleLanguageForm: (payload) => {
    return axios.post(`${ADMIN_LANGUAGES_API}/options/article-language-form`, payload)
  },

  getOptionsForTeamLanguageForm: (payload) => {
    return axios.post(`${ADMIN_LANGUAGES_API}/options/team-language-form`, payload)
  },

  getOptionsForPromotionLanguageForm: (payload) => {
    return axios.post(`${ADMIN_LANGUAGES_API}/options/promotion-language-form`, payload)
  },

  getOptionsForProjectGroupLanguageForm: (payload) => {
    return axios.post(`${ADMIN_LANGUAGES_API}/options/project-group-language-form`, payload)
  },

  getOptionsForProjectLabelLanguageForm: (payload) => {
    return axios.post(`${ADMIN_LANGUAGES_API}/options/project-label-language-form`, payload)
  },

  getOptionsForProjectLanguageForm: (payload) => {
    return axios.post(`${ADMIN_LANGUAGES_API}/options/project-language-form`, payload)
  },

  getOptionsForProjectImageLanguageForm: (payload) => {
    return axios.post(`${ADMIN_LANGUAGES_API}/options/project-image-language-form`, payload)
  },

  getOptionsForProjectServiceLanguageForm: (payload) => {
    return axios.post(`${ADMIN_LANGUAGES_API}/options/project-service-language-form`, payload)
  },
}

export type {
  PayloadGetOptionsForCategoryLanguageForm,
  PayloadGetOptionsForArticleLanguageForm,
  PayloadAdminLanguageGetOptionsForProjectGroupLanguageForm,
  PayloadAdminLanguageGetOptionsForProjectLanguageForm,
  PayloadGetOptionsForTeamLanguageForm,
  PayloadAdminLanguageGetOptionsForProjectImageLanguageForm,
  ResponseLanguages,
}

export default AdminLanguagesAPI
