import { Navigate, Outlet, Route, Routes } from 'react-router-dom'

import Error404Page from '@/pages/error/Error404Page'
import Error500Page from '@/pages/error/Error500Page'

const ErrorsLayout = () => {
  return <Outlet />
}

const ErrorRoutes = () => (
  <Routes>
    <Route element={<ErrorsLayout />}>
      <Route
        index
        element={
          <Navigate
            replace
            to="/error/404"
          />
        }
      />

      <Route
        path="404"
        element={<Error404Page />}
      />

      <Route
        path="500"
        element={<Error500Page />}
      />
    </Route>
  </Routes>
)

export default ErrorRoutes
