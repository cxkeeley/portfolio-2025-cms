import { FormattedMessage, useIntl } from 'react-intl'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'

import { PageTitle } from '@components/PageTitle'

import { RoutePermission } from '@modules/permissions/components/RoutePermission'

import { PagePermission } from '@/constants/pagePermission'
import { PageLink } from '@/interfaces/layout'
import ProjectLabelListPage from '@/pages/admin/project-label/ProjectLabelListPage'
import ProjectLabelCreatePage from '@/pages/admin/project-label/ProjectLabelCreatePage'
import ProjectLabelDetailPage from '@/pages/admin/project-label/ProjectLabelDetailPage'

const breadcrumbs: Array<PageLink> = [
  {
    isActive: false,
    isSeparator: false,
    title: <FormattedMessage id="menu.default.project_label" />,
    path: '/admin/project-labels',
  },
  {
    isActive: true,
    isSeparator: true,
    title: '',
    path: '',
  },
]

const ProjectLabelRoutes = () => {
  const intl = useIntl()

  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          index
          element={
            <RoutePermission allow={PagePermission.ADMIN_PROJECT_LABEL_LIST}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.project_label.list' })}
                breadcrumbs={breadcrumbs}
              />
              <ProjectLabelListPage />
            </RoutePermission>
          }
        />

        <Route
          path="/create"
          element={
            <RoutePermission allow={PagePermission.ADMIN_PROJECT_LABEL_CREATE}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.project_label.create' })}
                breadcrumbs={breadcrumbs}
              />
              <ProjectLabelCreatePage />
            </RoutePermission>
          }
        />

        <Route
          path="/:projectLabelId"
          element={
            <RoutePermission allow={PagePermission.ADMIN_PROJECT_LABEL_DETAIL}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.project_label.detail' })}
                breadcrumbs={breadcrumbs}
              />
              <ProjectLabelDetailPage />
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

export default ProjectLabelRoutes
