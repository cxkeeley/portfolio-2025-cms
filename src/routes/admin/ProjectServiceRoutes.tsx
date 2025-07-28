import { FormattedMessage, useIntl } from 'react-intl'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'

import { PageTitle } from '@components/PageTitle'

import { RoutePermission } from '@modules/permissions/components/RoutePermission'

import { PagePermission } from '@/constants/pagePermission'
import { PageLink } from '@/interfaces/layout'
import ProjectServiceCreatePage from '@/pages/admin/project-service/ProjectServiceCreatePage'
import ProjectServiceDetailPage from '@/pages/admin/project-service/ProjectServiceDetailPage'
import ProjectServiceListPage from '@/pages/admin/project-service/ProjectServiceListPage'

const breadcrumbs: Array<PageLink> = [
  {
    isActive: false,
    isSeparator: false,
    title: <FormattedMessage id="menu.default.project_services" />,
    path: '/admin/project-services',
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
            <RoutePermission allow={PagePermission.ADMIN_PROJECT_SERVICE_LIST}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.project_service.list' })}
                breadcrumbs={breadcrumbs}
              />
              <ProjectServiceListPage />
            </RoutePermission>
          }
        />

        <Route
          path="/create"
          element={
            <RoutePermission allow={PagePermission.ADMIN_PROJECT_SERVICE_CREATE}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.project_service.create' })}
                breadcrumbs={breadcrumbs}
              />
              <ProjectServiceCreatePage />
            </RoutePermission>
          }
        />

        <Route
          path="/:projectServiceId"
          element={
            <RoutePermission allow={PagePermission.ADMIN_PROJECT_SERVICE_DETAIL}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.project_service.detail' })}
                breadcrumbs={breadcrumbs}
              />
              <ProjectServiceDetailPage />
            </RoutePermission>
          }
        />

        <Route
          path="/*"
          element={
            <Navigate
              replace={true}
              to="/admin/project-services"
            />
          }
        />
      </Route>
    </Routes>
  )
}

export default ProjectGroupRoutes
