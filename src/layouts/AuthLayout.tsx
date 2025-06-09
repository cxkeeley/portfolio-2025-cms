import { FC } from 'react'
import { useIntl } from 'react-intl'
import { Outlet } from 'react-router-dom'

import { KTSVG } from '@components/KTSVG'

import PathUtil from '@/utils/pathUtil'

type Props = {}

const AuthLayout: FC<Props> = () => {
  const intl = useIntl()
  const circlePattern = PathUtil.toAbsoluteURL('/media/illustrations/circle-pattern.png')

  return (
    <div
      className="d-flex flex-column flex-column-fluid position-x-center"
      style={{
        backgroundImage: `url('${circlePattern}'), url('${circlePattern}')`,
        backgroundPosition: 'top -400px center, bottom -440px center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* begin::Content */}
      <div className="d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20 ">
        <div className="w-350px">
          {/* begin::Welcome */}
          <div className="fs-1">{intl.formatMessage({ id: 'auth.card.welcome_title' })}</div>
          {/* end::Welcome */}

          {/* begin::Logo */}
          <div className="mt-13 mb-20">
            <KTSVG
              svgClassName="w-100 h-auto"
              path="/media/logos/logo-horizontal.svg"
            />
          </div>
          {/* end::Logo */}

          {/* begin::Wrapper */}
          <div>
            <Outlet />
          </div>
          {/* end::Wrapper */}
        </div>
      </div>
      {/* end::Content */}
    </div>
  )
}

export { AuthLayout }
