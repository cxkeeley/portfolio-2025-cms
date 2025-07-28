import { FormattedMessage, useIntl } from 'react-intl'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'

import { PageTitle } from '@components/PageTitle'

import { RoutePermission } from '@modules/permissions/components/RoutePermission'

import { PagePermission } from '@/constants/pagePermission'
import { PageLink } from '@/interfaces/layout'
import OurTeamPageTeamListPage from '@/pages/admin/our-team-page-team/OurTeamPageTeamListPage'

const breadcrumbs: Array<PageLink> = [
  {
    isActive: false,
    isSeparator: false,
    title: <FormattedMessage id="menu.default.our_team_page" />,
    path: '/admin/main-page-teams',
  },
  {
    isActive: true,
    isSeparator: true,
    title: '',
    path: '',
  },
]

const OurTeamPageTeamRoutes = () => {
  const intl = useIntl()

  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          index
          element={
            <RoutePermission allow={PagePermission.ADMIN_OUR_TEAM_PAGE_TEAM_LIST}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.our_team_page_team.list' })}
                breadcrumbs={breadcrumbs}
              />
              <OurTeamPageTeamListPage />
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

export default OurTeamPageTeamRoutes
