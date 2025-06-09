import { Suspense } from 'react'
import React from 'react'
import { Outlet } from 'react-router-dom'

import { PermissionsProvider } from '@modules/permissions/core/PermissionsProvider'
import { QueryStringProvider } from '@modules/query-string/core/QueryStringProvider'
import { SplashScreen } from '@modules/splash-screen/components/SplashScreen'

const App = () => {
  return (
    <React.Fragment>
      <Suspense fallback={<SplashScreen />}>
        <QueryStringProvider>
          <PermissionsProvider>
            <Outlet />
          </PermissionsProvider>
        </QueryStringProvider>
      </Suspense>
    </React.Fragment>
  )
}

export { App }
