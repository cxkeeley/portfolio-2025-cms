import { FormattedMessage, useIntl } from 'react-intl'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'

import { PageTitle } from '@components/PageTitle'

import { RoutePermission } from '@modules/permissions/components/RoutePermission'

import { PagePermission } from '@/constants/pagePermission'
import { PageLink } from '@/interfaces/layout'
import LocationCreatePage from '@/pages/admin/location/LocationCreatePage'
import LocationDetailPage from '@/pages/admin/location/LocationDetailPage'
import LocationEditPage from '@/pages/admin/location/LocationEditPage'
import LocationImageDetailPage from '@/pages/admin/location/LocationImageDetailPage'
import LocationListPage from '@/pages/admin/location/LocationListPage'
import LocationReviewDetailPage from '@/pages/admin/location/LocationReviewDetailPage'

const breadcrumbs: Array<PageLink> = [
  {
    isActive: false,
    isSeparator: false,
    title: <FormattedMessage id="menu.default.location" />,
    path: '/admin/locations',
  },
  {
    isActive: true,
    isSeparator: true,
    title: '',
    path: '',
  },
]

const CategoryRoutes = () => {
  const intl = useIntl()

  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          index
          element={
            <RoutePermission allow={PagePermission.ADMIN_LOCATION_LIST}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.location.list' })}
                breadcrumbs={breadcrumbs}
              />
              <LocationListPage />
            </RoutePermission>
          }
        />

        <Route
          path="/create"
          element={
            <RoutePermission allow={PagePermission.ADMIN_LOCATION_CREATE}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.location.create' })}
                breadcrumbs={breadcrumbs}
              />
              <LocationCreatePage />
            </RoutePermission>
          }
        />

        <Route
          path="/:locationId"
          element={
            <RoutePermission allow={PagePermission.ADMIN_LOCATION_DETAIL}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.location.detail' })}
                breadcrumbs={breadcrumbs}
              />
              <LocationDetailPage />
            </RoutePermission>
          }
        />

        <Route
          path="/edit/:locationId"
          element={
            <RoutePermission allow={PagePermission.ADMIN_LOCATION_UPDATE}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.location.edit' })}
                breadcrumbs={breadcrumbs}
              />
              <LocationEditPage />
            </RoutePermission>
          }
        />

        <Route
          path="/:locationId/images/:locationImageId"
          element={
            <RoutePermission allow={PagePermission.ADMIN_LOCATION_IMAGE_DETAIL}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.location.image_detail' })}
                breadcrumbs={breadcrumbs}
              />
              <LocationImageDetailPage />
            </RoutePermission>
          }
        />

        <Route
          path="/:locationId/reviews/:locationReviewId"
          element={
            <RoutePermission allow={PagePermission.ADMIN_LOCATION_REVIEW_DETAIL}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.location.review_detail' })}
                breadcrumbs={breadcrumbs}
              />
              <LocationReviewDetailPage />
            </RoutePermission>
          }
        />

        <Route
          path="/*"
          element={
            <Navigate
              replace={true}
              to="/admin/locations"
            />
          }
        />
      </Route>
    </Routes>
  )
}

export default CategoryRoutes
