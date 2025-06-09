import { FC } from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'

import { useTheme } from '@modules/theme/contexts/ThemeContext'

const Error404Page: FC = () => {
  const intl = useIntl()
  const { mode } = useTheme()

  const illustration = (): string => {
    if (mode === 'dark') {
      return '/media/illustrations/404.png'
    }
    return '/media/illustrations/404-dark.png'
  }

  return (
    <div className="d-flex flex-column flex-root">
      <div className="d-flex flex-column flex-center flex-column-fluid p-10">
        {/* begin::Illustration */}
        <img
          src={illustration()}
          alt=""
          className="mw-100 mb-10 h-lg-450px"
        />
        {/* end::Illustration */}
        {/* begin::Message */}
        <h1
          className="fw-medium mb-10"
          style={{ color: '#A3A3C7' }}
        >
          {intl.formatMessage({ id: '404.message' })}
        </h1>
        {/* end::Message */}
        {/* begin::Link */}
        <Link
          to="/"
          className="btn btn-primary"
        >
          {intl.formatMessage({ id: '404.return' })}
        </Link>
        {/* end::Link */}
      </div>
    </div>
  )
}

export default Error404Page
