/* eslint-disable jsx-a11y/anchor-is-valid */
import { useMutation } from '@tanstack/react-query'
import { FormattedMessage } from 'react-intl'

import { AuthAPI } from '@api/authAPI'

import { useAuth } from '@modules/auth/contexts/AuthContext'

import { useAlert } from '@/hooks'
import AxiosUtil from '@/utils/axiosUtil'

const LogoutButton = () => {
  const alert = useAlert()
  const { removeToken } = useAuth()

  const { mutate: logout, isLoading } = useMutation({
    mutationFn: () => AuthAPI.logout(),
    onSuccess: () => {
      removeToken()
    },
    onError: (err) => {
      if (AxiosUtil.isAxiosError(err) && err.response?.data.message) {
        alert.error({ text: err.response?.data.message })
      } else {
        alert.error({ text: String(err) })
      }
    },
  })

  return (
    <div className="menu-item px-5">
      <a
        onClick={() => !isLoading && logout()}
        className="menu-link px-5"
        data-kt-indicator={isLoading ? 'on' : 'off'}
      >
        <span className="indicator-label">
          <FormattedMessage id="vocabulary.signout" />
        </span>
        <span className="indicator-progress">
          <FormattedMessage id="vocabulary.loading" />
          ...
          <span className="spinner-border spinner-border-sm align-middle ms-2" />
        </span>
      </a>
    </div>
  )
}

export { LogoutButton }
