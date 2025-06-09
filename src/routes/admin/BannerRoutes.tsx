import { FormattedMessage, useIntl } from 'react-intl'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'

import { PageTitle } from '@components/PageTitle'

import { RoutePermission } from '@modules/permissions/components/RoutePermission'

import { PagePermission } from '@/constants/pagePermission'
import { PageLink } from '@/interfaces/layout'
import BannerListPage from '@/pages/admin/banner/BannerListPage'
import BannerCreatePage from '@/pages/admin/banner/BannerCreatePage'
import BannerEditPage from '@/pages/admin/banner/BannerEditPage'

const breadcrumbs: Array<PageLink> = [
  {
    isActive: false,
    isSeparator: false,
    title: <FormattedMessage id="menu.default.banners" />,
    path: '/admin/banners',
  },
  {
    isActive: true,
    isSeparator: true,
    title: '',
    path: '',
  },
]

const BannerRoutes = () => {
  const intl = useIntl()

  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          index
          element={
            <RoutePermission allow={PagePermission.ADMIN_BANNER_LIST}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.banner.list' })}
                breadcrumbs={breadcrumbs}
              />
              <BannerListPage />
            </RoutePermission>
          }
        />

        <Route
          path="/create"
          element={
            <RoutePermission allow={PagePermission.ADMIN_BANNER_CREATE}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.banner.create' })}
                breadcrumbs={breadcrumbs}
              />
              <BannerCreatePage />
            </RoutePermission>
          }
        />

        <Route
          path="/edit/:bannerId"
          element={
            <RoutePermission allow={PagePermission.ADMIN_BANNER_UPDATE}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.banner.edit' })}
                breadcrumbs={breadcrumbs}
              />
              <BannerEditPage />
            </RoutePermission>
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              replace
              to="/admin/banners"
            />
          }
        />
      </Route>
    </Routes>
  )
}

export default BannerRoutes
