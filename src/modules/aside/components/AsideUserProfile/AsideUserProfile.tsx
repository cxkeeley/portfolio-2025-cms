import { useAuth } from '@modules/auth/contexts/AuthContext'

const AsideUserProfile = () => {
  const { currentUser } = useAuth()

  if (!currentUser) {
    return null
  }

  return (
    <div className="d-flex flex-column justify-content-center px-8 border-bottom h-100px">
      <h1 className="mb-1">{currentUser.name}</h1>

      <div className="fs-6 text-muted fw-semibold">{currentUser.roles?.map((role) => role.title).join(', ')}</div>
    </div>
  )
}

export { AsideUserProfile }
