import { FormattedMessage, useIntl } from 'react-intl'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'

import { PageTitle } from '@components/PageTitle'

import { RoutePermission } from '@modules/permissions/components/RoutePermission'

import { PagePermission } from '@/constants/pagePermission'
import { PageLink } from '@/interfaces/layout'
import TeamCreatePage from '@/pages/admin/team/TeamCreatePage'
import TeamDetailPage from '@/pages/admin/team/TeamDetailPage'
import TeamListPage from '@/pages/admin/team/TeamListPage'
import TeamUpdatePage from '@/pages/admin/team/TeamUpdatePage'

const breadcrumbs: Array<PageLink> = [
  {
    isActive: false,
    isSeparator: false,
    title: <FormattedMessage id="menu.default.teams" />,
    path: '/admin/articles',
  },
  {
    isActive: true,
    isSeparator: true,
    title: '',
    path: '',
  },
]

const TeamRoutes = () => {
  const intl = useIntl()

  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          index
          element={
            <RoutePermission allow={PagePermission.ADMIN_TEAM_LIST}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.team.list' })}
                breadcrumbs={breadcrumbs}
              />
              <TeamListPage />
            </RoutePermission>
          }
        />

        <Route
          path="/create"
          element={
            <RoutePermission allow={PagePermission.ADMIN_TEAM_CREATE}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.team.create' })}
                breadcrumbs={breadcrumbs}
              />
              <TeamCreatePage />
            </RoutePermission>
          }
        />

        <Route
          path="/edit/:teamId"
          element={
            <RoutePermission allow={PagePermission.ADMIN_TEAM_UPDATE}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.team.edit' })}
                breadcrumbs={breadcrumbs}
              />
              <TeamUpdatePage />
            </RoutePermission>
          }
        />

        <Route
          path="/:teamId"
          element={
            <RoutePermission allow={PagePermission.ADMIN_TEAM_DETAIL}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.team.detail' })}
                breadcrumbs={breadcrumbs}
              />
              <TeamDetailPage />
            </RoutePermission>
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              replace
              to="/admin/articles"
            />
          }
        />
      </Route>
    </Routes>
  )
}

export default TeamRoutes
