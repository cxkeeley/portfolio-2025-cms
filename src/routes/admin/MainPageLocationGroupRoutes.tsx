import { FormattedMessage, useIntl } from 'react-intl'

import { PageLink } from '@/interfaces/layout'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { RoutePermission } from '@modules/permissions/components/RoutePermission'
import { PagePermission } from '@/constants/pagePermission'
import { PageTitle } from '@components/PageTitle'
import MainPageLocationGroupListPage from '@/pages/admin/main-page-location-group/MainPageLocationGroupListPage'

const breadcrumbs: Array<PageLink> = [
  {
    isActive: false,
    isSeparator: false,
    title: <FormattedMessage id="menu.default.main_page" />,
    path: '/admin/main-page-location-groups',
  },
  {
    isActive: true,
    isSeparator: true,
    title: '',
    path: '',
  },
]

const MainPageLocationGroupRoutes = () => {
  const intl = useIntl()

  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          index
          element={
            <RoutePermission allow={PagePermission.ADMIN_MAIN_PAGE_LOCATION_GROUP_LIST}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.main_page_location_group.list' })}
                breadcrumbs={breadcrumbs}
              />
              <MainPageLocationGroupListPage />
            </RoutePermission>
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              replace
              to="/admin/main-page-location-groups"
            />
          }
        />
      </Route>
    </Routes>
  )
}

export default MainPageLocationGroupRoutes
