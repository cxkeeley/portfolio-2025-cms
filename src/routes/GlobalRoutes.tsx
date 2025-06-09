import { Navigate, Route, Routes } from 'react-router-dom'

import { MasterLayout } from '@/layouts/MasterLayout'
import { DashboardWrapper } from '@/pages/global/dashboard/DashboardPage'

const GlobalRoutes = () => {
  return (
    <Routes>
      {/* Redirect to Dashboard if no path */}
      <Route
        index
        element={<Navigate to="/dashboard" />}
      />

      <Route element={<MasterLayout />}>
        {/* Pages */}
        <Route
          path="dashboard"
          element={<DashboardWrapper />}
        />

        {/* Lazy Modules */}

        {/* Redirect to Dashboard after success login/registartion */}
        <Route
          path="/auth/*"
          element={<Navigate to="/dashboard" />}
        />
      </Route>

      {/* Page Not Found */}
      <Route
        path="*"
        element={<Navigate to="/error/404" />}
      />
    </Routes>
  )
}

export { GlobalRoutes }
