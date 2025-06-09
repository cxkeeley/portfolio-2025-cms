import { FormattedMessage, useIntl } from 'react-intl'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'

import { PageTitle } from '@components/PageTitle'

import { RoutePermission } from '@modules/permissions/components/RoutePermission'

import { PagePermission } from '@/constants/pagePermission'
import { PageLink } from '@/interfaces/layout'
import LocationGroupCreatePage from '@/pages/admin/location-group/LocationGroupCreatePage'
import LocationGroupDetailPage from '@/pages/admin/location-group/LocationGroupDetailPage'
import LocationGroupListPage from '@/pages/admin/location-group/LocationGroupListPage'

const breadcrumbs: Array<PageLink> = [
  {
    isActive: false,
    isSeparator: false,
    title: <FormattedMessage id="menu.default.location_group" />,
    path: '/admin/location-groups',
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
            <RoutePermission allow={PagePermission.ADMIN_LOCATION_GROUP_LIST}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.location_group.list' })}
                breadcrumbs={breadcrumbs}
              />
              <LocationGroupListPage />
            </RoutePermission>
          }
        />

        <Route
          path="/create"
          element={
            <RoutePermission allow={PagePermission.ADMIN_LOCATION_GROUP_CREATE}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.location_group.create' })}
                breadcrumbs={breadcrumbs}
              />
              <LocationGroupCreatePage />
            </RoutePermission>
          }
        />

        <Route
          path="/:locationGroupId"
          element={
            <RoutePermission allow={PagePermission.ADMIN_LOCATION_GROUP_DETAIL}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.location_group.detail' })}
                breadcrumbs={breadcrumbs}
              />
              <LocationGroupDetailPage />
            </RoutePermission>
          }
        />

        <Route
          path="/*"
          element={
            <Navigate
              replace={true}
              to="/admin/location-groups"
            />
          }
        />
      </Route>
    </Routes>
  )
}

export default LocationGroupRoutes
