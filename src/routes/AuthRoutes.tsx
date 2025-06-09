import { FC } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { AuthLayout } from '@/layouts/AuthLayout'
import { AuthGoogleCallbackPage } from '@/pages/auth/AuthGoogleCallbackPage'
import { AuthLoginPage } from '@/pages/auth/AuthLoginPage'

type Props = {}

const AuthRoutes: FC<Props> = () => {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route
          index
          element={
            <Navigate
              replace={true}
              to="/auth/login"
            />
          }
        />

        <Route
          path="login"
          element={<AuthLoginPage />}
        />

        <Route
          path="google-callbacks"
          element={<AuthGoogleCallbackPage />}
        />

        <Route
          path="*"
          element={
            <Navigate
              replace
              to="/auth"
            />
          }
        />
      </Route>
    </Routes>
  )
}

export { AuthRoutes }
