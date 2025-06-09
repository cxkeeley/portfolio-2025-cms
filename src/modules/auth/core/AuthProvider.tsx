import { useQuery } from '@tanstack/react-query'
import React from 'react'

import { AdminUsersAPI } from '@api/admin/usersAPI'

import { AuthToken } from '@models/auth'

import { SplashScreen } from '@modules/splash-screen/components/SplashScreen'

import { QUERIES } from '@/constants/queries'
import dayjs from '@/libs/dayjs'
import StorageUtil, { StorageKeyEnum } from '@/utils/StorageUtil'

import { AuthContext } from '../contexts/AuthContext'

const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [token, setTokenState] = React.useState<AuthToken | null>(StorageUtil.get(StorageKeyEnum.AUTH_TOKEN))

  const {
    refetch,
    data: currentUser,
    isLoading,
    isFetching,
  } = useQuery({
    retry: 0,
    cacheTime: 0,
    enabled: !!token,
    queryKey: [QUERIES.USER_ME, { token: token?.access_token }],
    queryFn: () => AdminUsersAPI.getMe().then((r) => r.data?.me),
    select: (response) => (token ? response : undefined),
    onError: () => removeToken(),
  })

  const setToken = React.useCallback((newToken: AuthToken) => {
    StorageUtil.set(StorageKeyEnum.AUTH_TOKEN, newToken)
    setTokenState(newToken)
  }, [])

  const removeToken = React.useCallback(async () => {
    StorageUtil.reset()
    window.location.reload()
  }, [])

  React.useEffect(() => {
    if (currentUser?.preferred_timezone) {
      dayjs.setDefault(currentUser.preferred_timezone)
    }
  }, [currentUser?.preferred_timezone])

  if (isLoading && isFetching) {
    return <SplashScreen />
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        currentUser,
        isLoading: isLoading && isFetching,
        removeToken,
        refetchAuth: refetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthProvider }
