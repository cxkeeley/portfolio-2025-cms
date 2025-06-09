/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/app/modules/Auth/pages/AuthPage`, `src/app/BasePage`).
 */
import { FC } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { useAuth } from '@modules/auth/contexts/AuthContext'

import { App } from '../App'
import { AdminRoutes } from './AdminRoutes'
import { AuthRoutes } from './AuthRoutes'
import ErrorRoutes from './ErrorRoutes'
import { GlobalRoutes } from './GlobalRoutes'

/**
 * Base URL of the website.
 *
 * @see https://facebook.github.io/create-react-app/docs/using-the-public-folder
 */
const { PUBLIC_URL } = process.env

const AppRoutes: FC = () => {
  const { currentUser } = useAuth()

  return (
    <BrowserRouter basename={PUBLIC_URL}>
      <Routes>
        <Route element={<App />}>
          {currentUser ? (
            <>
              <Route
                path="admin/*"
                element={<AdminRoutes />}
              />
              <Route
                path="auth/*"
                element={<Navigate to="/" />}
              />
              <Route
                path="*"
                element={<GlobalRoutes />}
              />
            </>
          ) : (
            <>
              <Route
                path="auth/*"
                element={<AuthRoutes />}
              />
              <Route
                path="*"
                element={<Navigate to="/auth" />}
              />
            </>
          )}

          <Route
            path="error/*"
            element={<ErrorRoutes />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export { AppRoutes }
