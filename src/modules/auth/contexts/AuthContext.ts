import { createContext, useContext } from 'react'

import { AuthToken } from '@models/auth'
import { UserMeModel } from '@models/user'

import AuthUtil from '@/utils/authUtil'

type AuthContextProps = {
  token: AuthToken | null
  setToken: (token: AuthToken) => void
  currentUser: UserMeModel | undefined
  isLoading: boolean
  refetchAuth: () => void
  removeToken: () => void
}

const AuthContext = createContext<AuthContextProps>({
  token: AuthUtil.getAuth(),
  setToken: () => null,
  currentUser: undefined,
  isLoading: false,
  refetchAuth: () => null,
  removeToken: () => null,
})

const useAuth = () => useContext(AuthContext)

export { AuthContext, useAuth }
