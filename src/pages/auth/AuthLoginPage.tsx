import { FC, useCallback, useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useLocation } from 'react-router-dom'

import { AuthAPI } from '@api/authAPI'

import DevelopmentLoginCard from '@modules/auth/components/DevelopmentLoginCard/DevelopmentLoginCard'
import { useAuth } from '@modules/auth/contexts/AuthContext'

import AxiosUtil from '@/utils/axiosUtil'

import { LocationStateGoogleAuth } from './AuthGoogleCallbackPage'

const GOOGLE_OAUTH_CLIENT_ID = process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID
const GOOGLE_OAUTH_REDIRECT_URI = process.env.REACT_APP_GOOGLE_OAUTH_REDIRECT_URI
const IS_DEVELOPMENT_LOGIN = process.env.REACT_APP_ENABLE_DEVELOPMENT_LOGIN === 'true'

type Props = {}

export const AuthLoginPage: FC<Props> = () => {
  const intl = useIntl()
  const [error, setError] = useState<string>()
  const { setToken, removeToken, isLoading } = useAuth()
  const location = useLocation()

  const getAccessToken = useCallback(
    async (code: string) => {
      try {
        const response = await AuthAPI.loginGoogle({ code })
        if (response.data) {
          setToken(response.data)
        } else {
          removeToken()
        }
      } catch (err) {
        removeToken()

        if (AxiosUtil.isAxiosError(err)) {
          setError(err.response?.data.message || err.message)
        } else {
          setError('The login detail is incorrect')
        }
      }
    },
    [removeToken, setToken]
  )

  const redirectToGoogleAuth = () => {
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_OAUTH_CLIENT_ID}&redirect_uri=${GOOGLE_OAUTH_REDIRECT_URI}&response_type=code&scope=openid%20email`
  }

  useEffect(() => {
    const state = location.state as LocationStateGoogleAuth
    if (state?.code) {
      getAccessToken(state.code)
    }
  }, [location.state, getAccessToken])

  return (
    <>
      {/* begin::Alert */}
      {error && (
        <div className="mb-lg-10 alert alert-danger d-flex align-items-center">
          <i className="fa-solid fa-exclamation-circle text-danger fs-3 me-3" />
          <span>{error}</span>
        </div>
      )}
      {/* begin::Alert */}

      {/* begin::Action */}
      <div className="text-center">
        {/* begin::Google link */}
        <button
          type="button"
          onClick={redirectToGoogleAuth}
          className="btn btn-outline btn-outline-primary btn-lg border-primary w-100"
          disabled={isLoading}
        >
          {isLoading ? (
            <span
              className="indicator-progress ml-2"
              style={{ display: 'block' }}
            >
              <FormattedMessage id="vocabulary.loading" />
              ...
              <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
            </span>
          ) : (
            <>{intl.formatMessage({ id: 'auth.button.google_login' })}</>
          )}
        </button>
        {/* end::Google link */}
      </div>

      {IS_DEVELOPMENT_LOGIN && (
        <div className="mt-15">
          <DevelopmentLoginCard />
        </div>
      )}
      {/* end::Action */}
    </>
  )
}
