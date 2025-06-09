import { AuthToken } from '@models/auth'

interface IAuthUtil {
  getAuth: () => AuthToken | null

  setAuth: (auth: AuthToken) => void

  removeAuth: () => void
}

const AUTH_LOCAL_STORAGE_KEY = 'gws-auth-token'

const AuthUtil: IAuthUtil = {
  getAuth: () => {
    try {
      if (!window.localStorage) {
        return null
      }

      const stringAuth = window.localStorage.getItem(AUTH_LOCAL_STORAGE_KEY)
      if (!stringAuth) {
        return null
      }

      const auth = JSON.parse(stringAuth) as AuthToken
      if (auth) {
        // You can easily check auth_token expiration also
        return auth
      }

      return null
    } catch (error) {
      console.error('AUTH LOCAL STORAGE PARSE ERROR', error)
      return null
    }
  },

  setAuth: (auth) => {
    try {
      if (!window.localStorage) {
        throw new Error('cannot find localStorage object')
      }
      const lsValue = JSON.stringify(auth)
      window.localStorage.setItem(AUTH_LOCAL_STORAGE_KEY, lsValue)
    } catch (error) {
      console.error('AUTH LOCAL STORAGE SAVE ERROR', error)
    }
  },

  removeAuth: () => {
    try {
      if (!window.localStorage) {
        throw new Error('Cannot find localStorage object')
      }
      localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY)
    } catch (error) {
      console.error('AUTH LOCAL STORAGE REMOVE ERROR', error)
    }
  },
}

export default AuthUtil
