import { KTSVG } from '@components/KTSVG'

import { useAuth } from '@modules/auth/contexts/AuthContext'

const LoggedUserProfile = () => {
  const { currentUser } = useAuth()

  return (
    <div className="menu-item px-3">
      <div className="menu-content d-flex align-items-center px-3">
        <div className="me-5">
          <KTSVG
            path="/media/avatars/blank.svg"
            svgClassName="h-45px w-45px"
          />
        </div>

        <div className="d-flex flex-column text-truncate">
          <div className="fw-bold d-flex align-items-center fs-5">{currentUser?.name}</div>
          <div className="fw-medium text-muted text-hover-primary fs-7">{currentUser?.email}</div>
        </div>
      </div>
    </div>
  )
}

export { LoggedUserProfile }
