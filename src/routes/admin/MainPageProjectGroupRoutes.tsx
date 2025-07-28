import { FormattedMessage, useIntl } from 'react-intl'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'

import { PageTitle } from '@components/PageTitle'

import { RoutePermission } from '@modules/permissions/components/RoutePermission'

import { PagePermission } from '@/constants/pagePermission'
import { PageLink } from '@/interfaces/layout'
import MainPageProjectGroupListPage from '@/pages/admin/main-page-project-group/MainPageProjectGroupListPage'

const breadcrumbs: Array<PageLink> = [
  {
    isActive: false,
    isSeparator: false,
    title: <FormattedMessage id="menu.default.main_page" />,
    path: '/admin/main-page-project-groups',
  },
  {
    isActive: true,
    isSeparator: true,
    title: '',
    path: '',
  },
]

const MainPageProjectGroupRoutes = () => {
  const intl = useIntl()

  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          index
          element={
            <RoutePermission allow={PagePermission.ADMIN_MAIN_PAGE_PROJECT_GROUP_LIST}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.main_page_project_group.list' })}
                breadcrumbs={breadcrumbs}
              />
              <MainPageProjectGroupListPage />
            </RoutePermission>
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              replace
              to="/admin/main-page-project-groups"
            />
          }
        />
      </Route>
    </Routes>
  )
}

export default MainPageProjectGroupRoutes
