import { FormattedMessage, useIntl } from 'react-intl'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'

import { PageTitle } from '@components/PageTitle'

import { RoutePermission } from '@modules/permissions/components/RoutePermission'

import { PagePermission } from '@/constants/pagePermission'
import { PageLink } from '@/interfaces/layout'
import ProjectGroupCreatePage from '@/pages/admin/project-group/ProjectGroupCreatePage'
import ProjectGroupDetailPage from '@/pages/admin/project-group/ProjectGroupDetailPage'
import ProjectGroupListPage from '@/pages/admin/project-group/ProjectGroupListPage'

const breadcrumbs: Array<PageLink> = [
  {
    isActive: false,
    isSeparator: false,
    title: <FormattedMessage id="menu.default.project_group" />,
    path: '/admin/project-groups',
  },
  {
    isActive: true,
    isSeparator: true,
    title: '',
    path: '',
  },
]

const ProjectGroupRoutes = () => {
  const intl = useIntl()

  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          index
          element={
            <RoutePermission allow={PagePermission.ADMIN_PROJECT_GROUP_LIST}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.project_group.list' })}
                breadcrumbs={breadcrumbs}
              />
              <ProjectGroupListPage />
            </RoutePermission>
          }
        />

        <Route
          path="/create"
          element={
            <RoutePermission allow={PagePermission.ADMIN_PROJECT_GROUP_CREATE}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.project_group.create' })}
                breadcrumbs={breadcrumbs}
              />
              <ProjectGroupCreatePage />
            </RoutePermission>
          }
        />

        <Route
          path="/:projectGroupId"
          element={
            <RoutePermission allow={PagePermission.ADMIN_PROJECT_GROUP_DETAIL}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.project_group.detail' })}
                breadcrumbs={breadcrumbs}
              />
              <ProjectGroupDetailPage />
            </RoutePermission>
          }
        />

        <Route
          path="/*"
          element={
            <Navigate
              replace={true}
              to="/admin/project-groups"
            />
          }
        />
      </Route>
    </Routes>
  )
}

export default ProjectGroupRoutes
