import { FormattedMessage, useIntl } from 'react-intl'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'

import { PageTitle } from '@components/PageTitle'

import { RoutePermission } from '@modules/permissions/components/RoutePermission'

import { PagePermission } from '@/constants/pagePermission'
import { PageLink } from '@/interfaces/layout'
import LocationLabelListPage from '@/pages/admin/location-label/LocationLabelListPage'
import LocationLabelCreatePage from '@/pages/admin/location-label/LocationLabelCreatePage'
import LocationLabelDetailPage from '@/pages/admin/location-label/LocationLabelDetailPage'

const breadcrumbs: Array<PageLink> = [
  {
    isActive: false,
    isSeparator: false,
    title: <FormattedMessage id="menu.default.location_label" />,
    path: '/admin/location-labels',
  },
  {
    isActive: true,
    isSeparator: true,
    title: '',
    path: '',
  },
]

const LocationLabelRoutes = () => {
  const intl = useIntl()

  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          index
          element={
            <RoutePermission allow={PagePermission.ADMIN_LOCATION_LABEL_LIST}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.location_label.list' })}
                breadcrumbs={breadcrumbs}
              />
              <LocationLabelListPage />
            </RoutePermission>
          }
        />

        <Route
          path="/create"
          element={
            <RoutePermission allow={PagePermission.ADMIN_LOCATION_LABEL_CREATE}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.location_label.create' })}
                breadcrumbs={breadcrumbs}
              />
              <LocationLabelCreatePage />
            </RoutePermission>
          }
        />

        <Route
          path="/:locationLabelId"
          element={
            <RoutePermission allow={PagePermission.ADMIN_LOCATION_LABEL_DETAIL}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.location_label.detail' })}
                breadcrumbs={breadcrumbs}
              />
              <LocationLabelDetailPage />
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

export default LocationLabelRoutes
