import { matchRoutes, useLocation } from 'react-router-dom'

const routes = [{ path: '/queue/overview/:id' }]

const useCurrentPath = () => {
  const location = useLocation()
  const matches = matchRoutes(routes, location)

  if (matches) {
    const route = matches[0].route
    return {
      path: route.path,
    }
  }

  return {
    path: '',
  }
}

export { useCurrentPath }
