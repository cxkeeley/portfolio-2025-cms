import { FormattedMessage, useIntl } from 'react-intl'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'

import { PageTitle } from '@components/PageTitle'

import { RoutePermission } from '@modules/permissions/components/RoutePermission'

import { PagePermission } from '@/constants/pagePermission'
import { PageLink } from '@/interfaces/layout'
import ProjectCreatePage from '@/pages/admin/project/ProjectCreatePage'
import ProjectDetailPage from '@/pages/admin/project/ProjectDetailPage'
import ProjectEditPage from '@/pages/admin/project/ProjectEditPage'
import ProjectImageDetailPage from '@/pages/admin/project/ProjectImageDetailPage'
import ProjectListPage from '@/pages/admin/project/ProjectListPage'
import ProjectReviewDetailPage from '@/pages/admin/project/ProjectReviewDetailPage'

const breadcrumbs: Array<PageLink> = [
  {
    isActive: false,
    isSeparator: false,
    title: <FormattedMessage id="menu.default.project" />,
    path: '/admin/projects',
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
            <RoutePermission allow={PagePermission.ADMIN_PROJECT_LIST}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.project.list' })}
                breadcrumbs={breadcrumbs}
              />
              <ProjectListPage />
            </RoutePermission>
          }
        />

        <Route
          path="/create"
          element={
            <RoutePermission allow={PagePermission.ADMIN_PROJECT_CREATE}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.project.create' })}
                breadcrumbs={breadcrumbs}
              />
              <ProjectCreatePage />
            </RoutePermission>
          }
        />

        <Route
          path="/:projectId"
          element={
            <RoutePermission allow={PagePermission.ADMIN_PROJECT_DETAIL}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.project.detail' })}
                breadcrumbs={breadcrumbs}
              />
              <ProjectDetailPage />
            </RoutePermission>
          }
        />

        <Route
          path="/edit/:projectId"
          element={
            <RoutePermission allow={PagePermission.ADMIN_PROJECT_UPDATE}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.project.edit' })}
                breadcrumbs={breadcrumbs}
              />
              <ProjectEditPage />
            </RoutePermission>
          }
        />

        <Route
          path="/:projectId/images/:projectImageId"
          element={
            <RoutePermission allow={PagePermission.ADMIN_PROJECT_IMAGE_DETAIL}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.project.image_detail' })}
                breadcrumbs={breadcrumbs}
              />
              <ProjectImageDetailPage />
            </RoutePermission>
          }
        />

        <Route
          path="/:projectId/reviews/:projectReviewId"
          element={
            <RoutePermission allow={PagePermission.ADMIN_PROJECT_REVIEW_DETAIL}>
              <PageTitle
                title={intl.formatMessage({ id: 'page.project.review_detail' })}
                breadcrumbs={breadcrumbs}
              />
              <ProjectReviewDetailPage />
            </RoutePermission>
          }
        />

        <Route
          path="/*"
          element={
            <Navigate
              replace={true}
              to="/admin/projects"
            />
          }
        />
      </Route>
    </Routes>
  )
}

export default CategoryRoutes
