import { AxiosInstance, AxiosRequestConfig } from 'axios'

import StorageUtil, { StorageKeyEnum } from '@/utils/StorageUtil'
import AuthUtil from '@/utils/authUtil'
import TypeUtil from '@/utils/typeUtil'

type SearchParams = {
  active_clinic_id?: string
  active_view_mode?: string
}

export const setupAxios = (axios: AxiosInstance) => {
  axios.defaults.headers.common.Accept = 'application/json'
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        AuthUtil.removeAuth()

        // redirect to login page
        if (window.location.pathname !== '/auth/login') {
          window.location.reload()
        }
      }
      throw error
    }
  )
  axios.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      if (!config.headers) {
        config.headers = {}
      }

      // set Authorization
      const auth = AuthUtil.getAuth()
      if (auth && auth.access_token) {
        config.headers.Authorization = `${auth.token_type} ${auth.access_token}`
      }

      // Set Language
      const language = StorageUtil.get(StorageKeyEnum.I18N_CONFIG)
      if (language && TypeUtil.isString(language)) {
        config.headers['Accept-Language'] = language
      }

      const params: SearchParams = {}

      // Set Active Clinic
      const activeClinicId = StorageUtil.get(StorageKeyEnum.ACTIVE_CLINIC_ID)
      if (activeClinicId && TypeUtil.isString(activeClinicId)) {
        params.active_clinic_id = activeClinicId
      }

      // Set Active View Mode of User
      const activeViewMode = StorageUtil.get(StorageKeyEnum.ACTIVE_VIEW_MODE)
      if (activeViewMode && TypeUtil.isString(activeViewMode)) {
        params.active_view_mode = activeViewMode
      }

      if (config.method === 'GET' || config.method === 'get') {
        config.params = { ...config.params, ...params }
      } else {
        if (config.data instanceof FormData) {
          Object.entries(params).forEach(([key, value]) => {
            if (key && value) {
              config.data.append(key, value)
            }
          })
        } else {
          config.data = { ...config.data, ...params }
        }
      }

      return config
    },
    (err: Error) => Promise.reject(err)
  )
}
