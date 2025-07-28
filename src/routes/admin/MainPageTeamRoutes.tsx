import { FormattedMessage, useIntl } from 'react-intl'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'

import { PageTitle } from '@components/PageTitle'

import { RoutePermission } from '@modules/permissions/components/RoutePermission'

import { PagePermission } from '@/constants/pagePermission'
import { PageLink } from '@/interfaces/layout'
import MainPageTeamListPage from '@/pages/admin/main-page-team/MainPageTeamListPage'

const breadcrumbs: Array<PageLink> = [
  {
    isActive: false,
    isSeparator: false,
    title: <FormattedMessage id="menu.default.main_page" />,
    path: '/admin/main-page-teams',
  },
  {
    isActive: true,
    isSeparator: true,
    title: '',
    path: '',
  },
]

const MainPageTeamRoutes = () => {
  const intl = useIntl()

  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          index
          element={
            <RoutePermission allow={PagePermission.ADMIN_MAIN_PAGE_TEAM_LIST}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.main_page_team.list' })}
                breadcrumbs={breadcrumbs}
              />
              <MainPageTeamListPage />
            </RoutePermission>
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              replace
              to="/admin/main-page-teams"
            />
          }
        />
      </Route>
    </Routes>
  )
}

export default MainPageTeamRoutes
