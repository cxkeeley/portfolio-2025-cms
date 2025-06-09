import { FormattedMessage, useIntl } from 'react-intl'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'

import { PageTitle } from '@components/PageTitle'

import { RoutePermission } from '@modules/permissions/components/RoutePermission'

import { PagePermission } from '@/constants/pagePermission'
import { PageLink } from '@/interfaces/layout'
import LocationServiceCreatePage from '@/pages/admin/location-service/LocationServiceCreatePage'
import LocationServiceListPage from '@/pages/admin/location-service/LocationServiceListPage'
import LocationServiceDetailPage from '@/pages/admin/location-service/LocationServiceDetailPage'

const breadcrumbs: Array<PageLink> = [
  {
    isActive: false,
    isSeparator: false,
    title: <FormattedMessage id="menu.default.location_services" />,
    path: '/admin/location-services',
  },
  {
    isActive: true,
    isSeparator: true,
    title: '',
    path: '',
  },
]

const LocationGroupRoutes = () => {
  const intl = useIntl()

  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          index
          element={
            <RoutePermission allow={PagePermission.ADMIN_LOCATION_SERVICE_LIST}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.location_service.list' })}
                breadcrumbs={breadcrumbs}
              />
              <LocationServiceListPage />
            </RoutePermission>
          }
        />

        <Route
          path="/create"
          element={
            <RoutePermission allow={PagePermission.ADMIN_LOCATION_SERVICE_CREATE}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.location_service.create' })}
                breadcrumbs={breadcrumbs}
              />
              <LocationServiceCreatePage />
            </RoutePermission>
          }
        />

        <Route
          path="/:locationServiceId"
          element={
            <RoutePermission allow={PagePermission.ADMIN_LOCATION_SERVICE_DETAIL}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.location_service.detail' })}
                breadcrumbs={breadcrumbs}
              />
              <LocationServiceDetailPage />
            </RoutePermission>
          }
        />

        <Route
          path="/*"
          element={
            <Navigate
              replace={true}
              to="/admin/location-services"
            />
          }
        />
      </Route>
    </Routes>
  )
}

export default LocationGroupRoutes
